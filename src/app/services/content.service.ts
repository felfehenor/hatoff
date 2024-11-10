import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  allContentById,
  allIdsByName,
  setAllContentById,
  setAllIdsByName,
  setArt,
} from '../helpers';
import { Content, ContentType, HeroArt } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private http = inject(HttpClient);

  public hasLoaded = computed(
    () =>
      this.hasLoadedArt() && this.hasLoadedData() && this.hasLoadedAtlases(),
  );

  private hasLoadedAtlases = signal<boolean>(false);
  private hasLoadedData = signal<boolean>(false);

  private artSignals: Array<WritableSignal<boolean>> = [];
  private hasLoadedArt = computed(() => this.artSignals.every((s) => s()));

  public artImages = signal<Record<string, CanvasRenderingContext2D>>({});
  public artAtlases = signal<
    Record<
      string,
      Record<string, { x: number; y: number; width: number; height: number }>
    >
  >({});

  async init() {
    this.loadJSON();
    this.loadArt();
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

    const artImageHash: Record<string, CanvasRenderingContext2D> = {};

    spritesheetsToLoad.forEach((sheet, idx) => {
      const img = new Image();
      img.src = `spritesheets/${sheet}.png`;
      this.artSignals[idx].set(false);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.height = img.height;
        canvas.width = img.width;

        const ctx = canvas.getContext('2d', {
          willReadFrequently: true,
        });
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        artImageHash[sheet] = ctx as CanvasRenderingContext2D;

        this.artImages.set(artImageHash);
        this.artSignals[idx].set(true);
      };
    });
  }

  private loadJSON() {
    forkJoin({
      damagetype: this.http.get('./json/damagetype.json'),
      archetype: this.http.get('./json/archetype.json'),
      resource: this.http.get('./json/resource.json'),
      task: this.http.get('./json/task.json'),
      research: this.http.get('./json/research.json'),
      art: this.http.get('./json/art.json'),
    }).subscribe((assets) => {
      this.unfurlAssets(assets as unknown as Record<string, Content[]>);

      console.log('[Content] Content loaded.');
      this.hasLoadedData.set(true);
    });
  }

  private unfurlAssets(assets: Record<string, Content[]>) {
    const allIdsByNameAssets: Record<string, string> = allIdsByName();
    const allEntriesByIdAssets: Record<string, Content> = allContentById();

    Object.keys(assets).forEach((subtype) => {
      if (subtype === 'art') {
        setArt(assets[subtype] as unknown as HeroArt);
        return;
      }

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
}
