import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { sortBy } from 'lodash';
import { PRNG } from 'seedrandom';
import { allArt, seededrng } from '../../helpers';
import { HeroMood } from '../../interfaces';

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

  private rngPercent(ltePercent: number): boolean {
    return this.rngNum(100) < ltePercent;
  }

  private rngChoose<T>(choices: T[]): T {
    const choice = this.rngNum(choices.length);
    return choices[choice];
  }

  private allPiecesToDraw: Array<{ url: string; layer: number }> = [];

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

  private queuePieceToDraw(url: string, layer: number) {
    this.allPiecesToDraw.push({ url, layer });
  }

  private async applyImageToCanvas(image: string) {
    return new Promise<void>((res) => {
      const img = new Image();
      img.onload = () => {
        this.context()?.drawImage(img, 0, 0, this.size(), this.size());
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
    this.queuePieceToDraw(`hero/body/${this.bodyString()}/body.png`, 10);
    this.queuePieceToDraw(`hero/body/${this.bodyString()}/head.png`, 50);
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
      );
    }
  }

  private drawEars() {
    const optionsHash = allArt().ear;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/ear/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 60,
      );
    }
  }

  private drawHair() {
    if (!this.drawingFlags.hair) return;

    const optionsHash = allArt().hair;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/hair/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 70,
      );
    }
  }

  private drawFacialHair() {
    if (this.bodyNum() < 5) return;
    if (!this.drawingFlags.facialhair) return;

    const optionsHash = allArt().facialhair;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/facialhair/${this.bodyString()}_facialhair_${chosenOption}/${
          piece.name
        }.png`,
        piece.layer ?? 55,
      );
    }
  }

  private drawHorn() {
    if (!this.drawingFlags.horn) return;

    const optionsHash = allArt().horn;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/horn/${this.bodyString()}_horn_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 55,
      );
    }
  }

  private drawMakeup() {
    if (!this.drawingFlags.makeup) return;

    const optionsHash = allArt().makeup;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/makeup/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 55,
      );
    }
  }

  private drawMask() {
    if (!this.drawingFlags.mask) return;

    const optionsHash = allArt().mask;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/mask/${this.bodyString()}_mask_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 57,
      );
    }
  }

  private drawOutfit() {
    if (!this.drawingFlags.outfit) return;

    const optionsHash = allArt().outfit;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/outfit/${this.bodyString()}_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 15,
      );
    }
  }

  private drawWings() {
    if (!this.drawingFlags.wings) return;

    const optionsHash = allArt().wing;
    const allOptions = Object.keys(optionsHash);
    const chosenOption = this.rngChoose(allOptions);

    for (const piece of optionsHash[chosenOption].pieces) {
      this.queuePieceToDraw(
        `hero/wing/${this.bodyString()}_wing_${chosenOption}/${piece.name}.png`,
        piece.layer ?? 1,
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
      await this.applyImageToCanvas(piece.url);
    }
  }
}
