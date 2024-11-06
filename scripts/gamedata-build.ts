/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

const { isArray } = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

fs.ensureDirSync('./public/json');

const allData: Record<string, any[]> = {};
const trackedIds: Record<string, boolean> = {};
const idToName: Record<string, string> = {};

// preload
const processFiles = () => {
  fs.readdirSync('gamedata').forEach((folder: string) => {
    fs.readdirSync(`gamedata/${folder}`).forEach((file: string) => {
      try {
        const filename = path.basename(file, '.yml');
        const doc = yaml.load(
          fs.readFileSync(`gamedata/${folder}/${filename}.yml`),
        );

        allData[folder] ??= [];
        allData[folder].push(...doc);

        doc.forEach((entry: any) => {
          if (!entry.name) {
            console.error(`Entry "${entry.id}" has no name.`);
            return;
          }

          if (idToName[entry.name]) {
            console.error(
              `Name "${entry.name}" already exists somewhere in the content.`,
            );
            process.exit(1);
          }

          if (trackedIds[entry.id]) {
            console.error(
              `Id "${entry.id}" already exists somewhere in the content.`,
            );
            process.exit(1);
          }

          trackedIds[entry.id] = true;
          idToName[entry.name] = entry.id;
        });

        console.log(`Loaded ${folder}/${file} - ${doc.length} entries...`);
      } catch (e) {
        console.error(e);
      }
    });
  });
};

const rewriteDataIds = () => {
  const allIds = Object.keys(allData);

  const getIdForName = (name: string) => {
    const res = idToName[name];
    if (!res) {
      console.error(`Name ${name} has no corresponding id.`);
      process.exit(1);
    }

    return res;
  };

  // magically transform any key that requests an id to that id
  const iterateObject = (entry: any) => {
    Object.keys(entry).forEach((entryKey) => {
      // no match, skip
      if (!allIds.some((id) => entryKey.toLowerCase().includes(id))) {
        // check deeper, if it's an array we want to check our sub objects
        if (isArray(entry[entryKey])) {
          entry[entryKey].forEach((subObj: any) => {
            iterateObject(subObj);
          });
        }

        return;
      }

      if (!entryKey.toLowerCase().includes('id')) return;

      // match
      // our match key is an array of strings, so we rewrite them all to be ids
      if (isArray(entry[entryKey])) {
        entry[entryKey] = entry[entryKey].map((i: string) => getIdForName(i));
      }

      // our match key is a simple string, so we rewrite it to be an id
      else {
        entry[entryKey] = getIdForName(entry[entryKey]);
      }
    });
  };

  allIds.forEach((key) => {
    Object.values(allData[key]).forEach((entry) => {
      iterateObject(entry);
    });
  });

  // write
  allIds.forEach((key) => {
    fs.writeJsonSync(`./public/json/${key}.json`, allData[key]);
  });
};

processFiles();
rewriteDataIds();
