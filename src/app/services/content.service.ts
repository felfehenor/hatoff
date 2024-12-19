import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { sortBy } from 'lodash';
import { forkJoin } from 'rxjs';
import {
  allContentById,
  allIdsByName,
  getEntriesByType,
  setAllContentById,
  setAllIdsByName,
  setArt,
  setSpecialHeroes,
} from '../helpers';
import {
  Content,
  ContentType,
  GameDamageType,
  HeroArt,
  SpecialGameHero,
} from '../interfaces';
import { MetaService } from './meta.service';

interface SharedCanvas {
  canvas: HTMLCanvasElement;
  offscreen: OffscreenCanvas;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private metaService = inject(MetaService);
  private http = inject(HttpClient);

  public hasLoaded = computed(
    () =>
      this.hasLoadedArt() && this.hasLoadedData() && this.hasLoadedAtlases(),
  );

  private hasLoadedAtlases = signal<boolean>(false);
  private hasLoadedData = signal<boolean>(false);

  private artSignals: Array<WritableSignal<boolean>> = [];
  private hasLoadedArt = computed(() => this.artSignals.every((s) => s()));

  public artImages = signal<Record<string, SharedCanvas>>({});
  public artAtlases = signal<
    Record<
      string,
      Record<string, { x: number; y: number; width: number; height: number }>
    >
  >({});

  private worker!: Worker;
  private workerCallbacks: Record<
    string,
    { numPieces: number; curPieces: number; callback: () => void }
  > = {};

  async init() {
    this.loadJSON();
    this.loadArt();
    this.initWorker();
  }

  private initWorker() {
    const worker = new Worker('atlascanvas.js');
    this.worker = worker;

    this.worker.addEventListener('message', (event) => {
      if (event.data.action === 'piece') {
        const { id } = event.data;
        if (!this.workerCallbacks[id]) return;

        this.workerCallbacks[id].curPieces++;

        if (
          this.workerCallbacks[id].curPieces >=
          this.workerCallbacks[id].numPieces
        ) {
          this.workerCallbacks[id].callback();
          delete this.workerCallbacks[id];
        }
      }
    });
  }

  public registerComponentIdForLoading(
    id: string,
    numPieces: number,
    callback: () => void,
  ) {
    this.workerCallbacks[id] = { numPieces, curPieces: 0, callback };
  }

  private loadArt() {
    const spritesheetsToLoad = [
      'body',
      'ear',
      'eye',
      'facialhair',
      'hair',
      'horn',
      'makeup',
      'mask',
      'outfit',
      'wing',
    ];

    forkJoin(
      spritesheetsToLoad.map((s) => this.http.get(`./spritesheets/${s}.json`)),
    ).subscribe((allAtlases) => {
      const atlasesByName = spritesheetsToLoad.reduce(
        (prev, cur, idx) => ({
          ...prev,
          [cur]: allAtlases[idx],
        }),
        {},
      );

      this.artAtlases.set(atlasesByName);
      this.hasLoadedAtlases.set(true);
    });

    this.artSignals = spritesheetsToLoad.map(() => signal<boolean>(false));

    const artImageHash: Record<string, SharedCanvas> = {};

    spritesheetsToLoad.forEach((sheet, idx) => {
      const img = new Image();
      img.src = `spritesheets/${sheet}.png`;
      this.artSignals[idx].set(false);
      img.onload = async () => {
        // create an image for the canvas
        const bitmap = await createImageBitmap(img);

        // get a proper offscreen renderer
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const offscreen = canvas.transferControlToOffscreen();

        // start rendering the atlas offscreen
        this.sendWorkerMessage(
          'initatlas',
          { key: sheet, canvas: offscreen, image: bitmap },
          [offscreen, bitmap],
        );

        artImageHash[sheet] = { canvas, offscreen };

        this.artImages.set(artImageHash);
        this.artSignals[idx].set(true);
      };
    });
  }

  private toJSONURL(key: string): string {
    return `./json/${key}.json?v=${this.metaService.versionString()}`;
  }

  private loadJSON() {
    forkJoin({
      damagetype: this.http.get(this.toJSONURL('damagetype')),
      archetype: this.http.get(this.toJSONURL('archetype')),
      resource: this.http.get(this.toJSONURL('resource')),
      task: this.http.get(this.toJSONURL('task')),
      research: this.http.get(this.toJSONURL('research')),
      upgrade: this.http.get(this.toJSONURL('upgrade')),
      item: this.http.get(this.toJSONURL('item')),
      loot: this.http.get(this.toJSONURL('loot')),
      monster: this.http.get(this.toJSONURL('monster')),
      dungeon: this.http.get(this.toJSONURL('dungeon')),
      attribute: this.http.get(this.toJSONURL('attribute')),
      skill: this.http.get(this.toJSONURL('skill')),
      buff: this.http.get(this.toJSONURL('buff')),
      art: this.http.get(this.toJSONURL('art')),
      custom: this.http.get(this.toJSONURL('custom')),
    }).subscribe((assets) => {
      const { art, custom: customHeroes, ...contentAssets } = assets;
      setArt(art as unknown as HeroArt);
      setSpecialHeroes(customHeroes as SpecialGameHero[]);

      this.unfurlAssets(contentAssets as unknown as Record<string, Content[]>);

      this.postprocessContent();

      console.log('[Content] Content loaded.');
      this.hasLoadedData.set(true);
    });

    forkJoin({});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sendWorkerMessage(action: string, data: any, transfer: any[]) {
    this.worker.postMessage({ action, ...data }, transfer);
  }

  private unfurlAssets(assets: Record<string, Content[]>) {
    const allIdsByNameAssets: Record<string, string> = allIdsByName();
    const allEntriesByIdAssets: Record<string, Content> = allContentById();

    Object.keys(assets).forEach((subtype) => {
      Object.values(assets[subtype]).forEach((entry) => {
        entry.__type = subtype as ContentType;

        if (allIdsByNameAssets[entry.name]) {
          console.warn(
            `[Content] "${entry.name}/${entry.id}" is a duplicate name to "${
              allIdsByNameAssets[entry.name]
            }". Skipping...`,
          );
          return;
        }

        if (allEntriesByIdAssets[entry.id]) {
          const dupe = allEntriesByIdAssets[entry.id];
          console.warn(
            `[Content] "${entry.name}/${entry.id}" is a duplicate id to "${dupe.name}/${dupe.id}". Skipping...`,
          );
          return;
        }

        allIdsByNameAssets[entry.name] = entry.id;
        allEntriesByIdAssets[entry.id] = entry;
      });
    });

    setAllIdsByName(allIdsByNameAssets);
    setAllContentById(allEntriesByIdAssets);
  }

  private postprocessContent() {
    const allDamageTypes = getEntriesByType<GameDamageType>('damagetype');
    const wilds = allDamageTypes.filter((f) => f.isAny);

    wilds.forEach((wild) => {
      wild.subTypes = sortBy(allDamageTypes, (dt) => dt.name)
        .filter((f) => !f.isAny)
        .map((dt) => ({ damageTypeId: dt.id, percent: 100 }));
    });
  }
}
