import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { colord } from 'colord';
import { sortBy } from 'lodash';
import { PRNG } from 'seedrandom';

import { allArt, seededrng } from '../../helpers';
import { HeroMood } from '../../interfaces';

type ColorDataTuple = [number, number, number];

const defaultDrawingFlags = () => ({
  earring: false,
  hairtie: false,
  hair: false,
  facialhair: false,
  horn: false,
  makeup: false,
  mask: false,
  outfit: false,
  wings: false,
});

@Component({
  selector: 'app-hero-art',
  standalone: true,
  imports: [],
  templateUrl: './hero-art.component.html',
  styleUrl: './hero-art.component.scss',
})
export class HeroArtComponent {
  public id = input.required<string>();
  public mood = input<HeroMood>('neutral');
  public size = input<number>(64);

  private bodyNum = signal<number>(0);

  private rng!: PRNG;
  public bodyString = computed(() => `body${this.bodyNum()}`);

  public canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  public context = computed(() =>
    this.canvas()?.nativeElement?.getContext('2d'),
  );

  private rngNum(num: number): number {
    return Math.floor(this.rng() * num);
  }

  private rngNumBetween(min: number, max: number): number {
    return Math.floor(this.rng() * max) + min;
  }

  private rngPercent(ltePercent: number): boolean {
    return this.rngNum(100) < ltePercent;
  }

  private rngChoose<T>(choices: T[]): T {
    const choice = this.rngNum(choices.length);
    return choices[choice];
  }

  private allPiecesToDraw: Array<{
    url: string;
    layer: number;
    imgManipulation: ColorDataTuple;
  }> = [];

  private drawingFlags = defaultDrawingFlags();

  constructor() {
    effect(
      () => {
        this.id();

        this.drawCharacter();
      },
      { allowSignalWrites: true },
    );
  }

  private queuePieceToDraw(
    url: string,
    layer: number,
    imgManipulation: ColorDataTuple,
  ) {
    this.allPiecesToDraw.push({ url, layer, imgManipulation });
  }

  private getHSLRotation(): ColorDataTuple {
    return [
      this.rngNum(360),
      this.rngNumBetween(0, 30),
      this.rngNumBetween(-20, 40),
    ];
  }

  private transformRGBTupleByHSLValues(
    rgbData: ColorDataTuple,
    mod: ColorDataTuple,
  ): ColorDataTuple {
    const hsl = colord({ r: rgbData[0], g: rgbData[1], b: rgbData[2] }).toHsl();

    const converted = colord({
      h: hsl.h + mod[0],
      s: hsl.s + mod[1],
      l: hsl.l + mod[2],
    });

    const res = converted.toRgb();

    return [res.r, res.g, res.b];
  }

  private async applyImageToCanvas(image: string, imgRotation: ColorDataTuple) {
    const imageSize = this.size();

    return new Promise<void>((res) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.height = imageSize;
        canvas.width = imageSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, imageSize, imageSize);

        const imageData = ctx?.getImageData(0, 0, imageSize, imageSize);
        const imageDataBits = imageData?.data ?? [];

        for (let i = 0; i < imageDataBits.length; i += 4) {
          // if (imageDataBits[i + 3] === 0) return;

          const rgb = [
            imageDataBits[i + 0],
            imageDataBits[i + 1],
            imageDataBits[i + 2],
          ] as ColorDataTuple;

          const newRGB = this.transformRGBTupleByHSLValues(rgb, imgRotation);

          imageDataBits[i + 0] = newRGB[0];
          imageDataBits[i + 1] = newRGB[1];
          imageDataBits[i + 2] = newRGB[2];
        }

        ctx?.putImageData(imageData!, 0, 0);

        this.context()?.drawImage(canvas, 0, 0, imageSize, imageSize);
        res();
      };

      img.src = image;
    });
  }

  private pickFlags() {
    this.drawingFlags.facialhair = this.rngPercent(50);
    this.drawingFlags.hair = this.rngPercent(80);
    this.drawingFlags.hairtie = this.rngPercent(50);
    this.drawingFlags.earring = this.rngPercent(30);
    this.drawingFlags.horn = this.rngPercent(5);
    this.drawingFlags.makeup = this.rngPercent(10);
    this.drawingFlags.mask = this.rngPercent(10);
    this.drawingFlags.outfit = this.rngPercent(95);
    this.drawingFlags.wings = this.rngPercent(1);
  }

  private async drawCharacter() {
    // reset the base
    this.allPiecesToDraw = [];
    this.drawingFlags = defaultDrawingFlags();
    this.context()?.clearRect(0, 0, this.size(), this.size());

    // start drawing the character
    this.rng = seededrng(this.id());
    this.pickFlags();

    this.bodyNum.set(this.rngNum(7));
    this.drawBase();
    this.drawEyes();
    this.drawEars();
    this.drawHair();
    this.drawFacialHair();
    this.drawHorn();
    this.drawMakeup();
    this.drawMask();
    this.drawOutfit();
    this.drawWings();

    await this.render();
  }

  private drawBase() {
    this.queuePieceToDraw(
      `hero/body/${this.bodyString()}/body.png`,
      10,
      [0, 0, 0],
    );
    this.queuePieceToDraw(
      `hero/body/${this.bodyString()}/head.png`,
      50,
      [0, 0, 0],
    );
  }

  private drawEyes() {
    const optionsHash = allArt().eye;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const moodPieces = optionsHash[chosenOption][this.mood()];

    for (const piece of moodPieces.pieces) {
      this.queuePieceToDraw(
        `hero/eye/${this.bodyString()}_${chosenOption}/${this.mood()}/${
          piece.name
        }.png`,
        piece.layer ?? 60,
        [0, 0, 0],
      );
    }
  }

  private drawEars() {
    const optionsHash = allArt().ear;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/ear/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 60,
        color,
      );
    }
  }

  private drawHair() {
    if (!this.drawingFlags.hair) return;

    const optionsHash = allArt().hair;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/hair/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 70,
        color,
      );
    }
  }

  private drawFacialHair() {
    if (this.bodyNum() < 5) return;
    if (!this.drawingFlags.facialhair) return;

    const optionsHash = allArt().facialhair;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/facialhair/${this.bodyString()}_facialhair_${chosenOption}/${
          piece.name
        }.png`,
        piece.layer ?? 55,
        color,
      );
    }
  }

  private drawHorn() {
    if (!this.drawingFlags.horn) return;

    const optionsHash = allArt().horn;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/horn/${this.bodyString()}_horn_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 55,
        color,
      );
    }
  }

  private drawMakeup() {
    if (!this.drawingFlags.makeup) return;

    const optionsHash = allArt().makeup;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/makeup/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 55,
        color,
      );
    }
  }

  private drawMask() {
    if (!this.drawingFlags.mask) return;

    const optionsHash = allArt().mask;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/mask/${this.bodyString()}_mask_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 57,
        color,
      );
    }
  }

  private drawOutfit() {
    if (!this.drawingFlags.outfit) return;

    const optionsHash = allArt().outfit;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/outfit/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 15,
        color,
      );
    }
  }

  private drawWings() {
    if (!this.drawingFlags.wings) return;

    const optionsHash = allArt().wing;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);
    const color = this.getHSLRotation();

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/wing/${this.bodyString()}_wing_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 1,
        color,
      );
    }
  }

  private async render() {
    const filteredPieces = this.allPiecesToDraw.filter((f) => {
      if (f.url.includes('hairtie') && !this.drawingFlags.hairtie) return false;
      if (f.url.includes('earring') && !this.drawingFlags.earring) return false;

      return true;
    });

    const sortedPieces = sortBy(filteredPieces, (p) => p.layer);

    for (const piece of sortedPieces) {
      await this.applyImageToCanvas(piece.url, piece.imgManipulation);
    }
  }
}
