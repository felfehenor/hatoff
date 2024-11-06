import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  allContentById,
  allIdsByName,
  setAllContentById,
  setAllIdsByName,
} from '../helpers';
import { Content, ContentType } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private http = inject(HttpClient);

  public hasLoaded = signal<boolean>(false);

  async init() {
    forkJoin({
      damagetype: this.http.get('./json/damagetype.json'),
      archetype: this.http.get('./json/archetype.json'),
      resource: this.http.get('./json/resource.json'),
      task: this.http.get('./json/task.json'),
      research: this.http.get('./json/research.json'),
    }).subscribe((assets) => {
      this.unfurlAssets(assets as unknown as Record<string, Content[]>);

      console.log('[Content] Content loaded.');
      this.hasLoaded.set(true);
    });
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
}
