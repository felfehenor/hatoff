import { computed, Injectable, signal } from '@angular/core';
import { marked } from 'marked';
import { timer } from 'rxjs';
import { environment } from '../../environments/environment';

interface VersionInfo {
  dirty: boolean;
  raw: string;
  hash: string;
  distance: number;
  tag: string;
  semver: string;
  suffix: string;
  semverString: string;
}

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private versionInfo = signal<VersionInfo>({
    dirty: false,
    raw: 'v.local',
    hash: 'v.local',
    distance: -1,
    tag: 'v.local',
    semver: '',
    suffix: '',
    semverString: '',
  });

  private liveVersionInfo = signal<VersionInfo | undefined>(undefined);

  public versionString = computed(() => {
    return this.versionInfoToSemver(this.versionInfo());
  });

  public liveVersionString = computed(() => {
    const live = this.liveVersionInfo();
    if (!live) return '';

    return this.versionInfoToSemver(live);
  });

  public versionMismatch = computed(
    () =>
      environment.production &&
      this.liveVersionString() &&
      this.versionString() !== this.liveVersionString(),
  );

  public changelogCurrent = signal<string>('');
  public changelogAll = signal<string>('');

  public hasChangelogs = computed(
    () => this.changelogAll() && this.changelogCurrent(),
  );

  async init() {
    try {
      const response = await fetch('version.json');
      const versionInfo = await response.json();
      this.versionInfo.set(versionInfo);
    } catch (e) {
      console.error('Failed to load version info', e);
    }

    try {
      const changelog = await fetch('CHANGELOG.md');
      const changelogData = await changelog.text();
      this.changelogAll.set(await marked(changelogData));
    } catch {
      console.error('Could not load changelog (all) - probably on local.');
    }

    try {
      const changelog = await fetch('CHANGELOG-current.md');
      const changelogData = await changelog.text();
      this.changelogCurrent.set(await marked(changelogData));
    } catch {
      console.error('Could not load changelog (current) - probably on local.');
    }

    timer(15 * 60 * 1000).subscribe(() => {
      this.checkVersionAgainstLiveVersion();
    });
  }

  private async checkVersionAgainstLiveVersion() {
    /*
    if (!isInElectron()) {
      return;
    }
    */

    try {
      const liveVersionFile = await fetch(
        'https://heroes.felfhenor.com/version.json',
      );
      const liveVersionData = await liveVersionFile.json();
      this.liveVersionInfo.set(liveVersionData);
    } catch {
      console.error(
        'Could not load live version data. Probably not a big deal.',
      );
    }
  }

  private versionInfoToSemver(versionInfo: VersionInfo) {
    if (versionInfo.distance >= 0 && versionInfo.tag) {
      return `${versionInfo.tag} (${versionInfo.raw})`;
    }

    return (
      versionInfo.tag ||
      versionInfo.semverString ||
      versionInfo.raw ||
      versionInfo.hash
    );
  }

  public update() {
    window.location.reload();
  }

  /*
  public showChangelogs() {
    if (!this.hasChangelogs) {
      return;
    }
  }
  */
}
