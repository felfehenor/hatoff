/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = require('fs-extra');
const yaml = require('js-yaml');
const rec = require('recursive-readdir');

const _ = require('lodash');
const path = require('path');

const allUsedFiles: string[] = [];

const validate = async () => {
  const bodies = Array(7)
    .fill(0)
    .map((_, i) => `body${i}`);

  const validateEars = () => {
    const ear = yaml.load(fs.readFileSync(`gamedata/art/ear.yml`));
    Object.keys(ear).forEach((folder) => {
      ear[folder].pieces.forEach((piece: any) => {
        bodies.forEach((body) => {
          const path = `public/hero/ear/${body}_ear_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateEyes = () => {
    const eye = yaml.load(fs.readFileSync(`gamedata/art/eye.yml`));

    Object.keys(eye).forEach((folder) => {
      Object.keys(eye[folder]).forEach((mood: any) => {
        eye[folder][mood].pieces.forEach((piece: any) => {
          bodies.forEach((body) => {
            const path = `public/hero/eye/${body}_eye_${folder}/${mood}/${piece.name}.png`;
            allUsedFiles.push(path);
          });
        });
      });
    });
  };

  const validateFacialHairs = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/facialhair.yml`));

    Object.keys(data).forEach((folder) => {
      data[folder].pieces.forEach((piece: any) => {
        bodies.forEach((body) => {
          if (!['body5', 'body6', 'body7'].includes(body)) return;

          const path = `public/hero/facialhair/${body}_facialhair_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateHairs = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/hair.yml`));

    Object.keys(data).forEach((folder) => {
      bodies.forEach((body) => {
        const exclusions = data[folder].noBody ?? [];
        if (exclusions.some((idx: number) => `body${idx}` === body)) return;

        data[folder].pieces.forEach((piece: any) => {
          const path = `public/hero/hair/${body}_hair_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateHorns = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/horn.yml`));

    Object.keys(data).forEach((folder) => {
      bodies.forEach((body) => {
        const exclusions = data[folder].noBody ?? [];
        if (exclusions.some((idx: number) => `body${idx}` === body)) return;

        data[folder].pieces.forEach((piece: any) => {
          const path = `public/hero/horn/${body}_horn_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateMakeup = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/makeup.yml`));

    Object.keys(data).forEach((folder) => {
      bodies.forEach((body) => {
        const exclusions = data[folder].noBody ?? [];
        if (exclusions.some((idx: number) => `body${idx}` === body)) return;

        data[folder].pieces.forEach((piece: any) => {
          const path = `public/hero/makeup/${body}_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateMasks = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/mask.yml`));

    Object.keys(data).forEach((folder) => {
      bodies.forEach((body) => {
        const exclusions = data[folder].noBody ?? [];
        if (exclusions.some((idx: number) => `body${idx}` === body)) return;

        data[folder].pieces.forEach((piece: any) => {
          const path = `public/hero/mask/${body}_mask_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateOutfits = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/outfit.yml`));

    Object.keys(data).forEach((folder) => {
      bodies.forEach((body) => {
        const exclusions = data[folder].noBody ?? [];
        if (exclusions.some((idx: number) => `body${idx}` === body)) return;

        data[folder].pieces.forEach((piece: any) => {
          const path = `public/hero/outfit/${body}_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  const validateWings = () => {
    const data = yaml.load(fs.readFileSync(`gamedata/art/wing.yml`));

    Object.keys(data).forEach((folder) => {
      bodies.forEach((body) => {
        const exclusions = data[folder].noBody ?? [];
        if (exclusions.some((idx: number) => `body${idx}` === body)) return;

        data[folder].pieces.forEach((piece: any) => {
          const path = `public/hero/wing/${body}_wing_${folder}/${piece.name}.png`;
          allUsedFiles.push(path);
        });
      });
    });
  };

  validateEars();
  validateEyes();
  validateFacialHairs();
  validateHairs();
  validateHorns();
  validateMakeup();
  validateMasks();
  validateOutfits();
  validateWings();

  const allFiles = await rec('./public/hero');

  const finalAllFiles = allFiles
    .map((p: string) => path.normalize(p))
    .filter((p: string) => !p.includes('head.png') && !p.includes('body.png'))
    .sort();

  const finalUsedFiles = allUsedFiles.map((p: string) => path.normalize(p));

  const unused = _.difference(finalAllFiles, finalUsedFiles);
  unused.forEach((file: string) => fs.rmSync(file));
};

validate();
