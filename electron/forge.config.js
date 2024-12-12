const path = require('path');
const fs = require('fs');

module.exports = {
  packagerConfig: {
    executableName: 'hatoff',
    appBundleId: 'com.felfhenor.hatoff',
    appCopyright: 'HATOFF Team',
    appCategoryType: 'public.app-category.games',
    icon: './icons/icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        icon: './icons/icon.ico',
        setupIcon: './icons/icon.ico',
        setupExe: 'HATOFF.exe',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './icons/icon.icns',
        setupIcon: './icons/icon.icns',
      },
    },
  ],
  hooks: {
    postMake: (config, makeResults) => {
      return makeResults;
    },
  },
};
