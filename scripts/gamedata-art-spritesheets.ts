/* eslint-disable @typescript-eslint/no-explicit-any */
const rec = require('recursive-readdir');
const fs = require('fs-extra');
const spritesmith = require('spritesmith');

const spritesheetsToBuild = [
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

fs.ensureDirSync('public/spritesheets');

const build = async () => {
  for (const sheet of spritesheetsToBuild) {
    const files = await rec(`./gameassets/hero/${sheet}`);

    spritesmith.run({ src: files }, (e: any, res: any) => {
      fs.writeJsonSync(`public/spritesheets/${sheet}.json`, res.coordinates);
      fs.writeFileSync(`public/spritesheets/${sheet}.png`, res.image);
    });
  }
};

build();
