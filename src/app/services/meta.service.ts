import { Injectable } from '@angular/core';

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
  private currentVersion = 'v.local';
  private versionMismatch = false;
  private newVersion = '';

  private changelogCurrent = '';
  private changelogAll = '';

  private versionInfo = {
    dirty: false,
    raw: 'v.local',
    hash: 'v.local',
    distance: -1,
    tag: 'v.local',
    semver: '',
    suffix: '',
    semverString: '',
  };

  public get versionString() {
    return this.currentVersion;
  }

  public get hasVersionMismatch() {
    return this.versionMismatch;
  }

  public get latestLiveVersion() {
    return this.newVersion;
  }

  public get hasChangelogs() {
    return !!this.changelogCurrent && !!this.changelogAll;
  }

  public get changelogAllText() {
    return this.changelogAll;
  }

  async init() {
    try {
      const response = await fetch('version.json');
      const versionInfo = await response.json();
      this.versionInfo = versionInfo;

      this.currentVersion = this.versionInfoToSemver(versionInfo);
    } catch (e) {
      console.error('Failed to load version info', e);
    }

    /*
    try {
      const changelog = await fetch('assets/CHANGELOG.md');
      const changelogData = await changelog.text();
      this.changelogAll = await marked(changelogData);
    } catch {
      console.error('Could not load changelog (all) - probably on local.');
    }

    try {
      const changelog = await fetch('assets/CHANGELOG-current.md');
      const changelogData = await changelog.text();
      this.changelogCurrent = await marked(changelogData);
    } catch {
      console.error('Could not load changelog (current) - probably on local.');
    }
    */

    this.checkVersionAgainstLiveVersion();
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

      if (this.versionInfo.hash !== liveVersionData.hash) {
        this.versionMismatch = true;
        this.newVersion = this.versionInfoToSemver(liveVersionData);
      }
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

  /*
  public showChangelogs() {
    if (!this.hasChangelogs) {
      return;
    }
  }
  */
}
