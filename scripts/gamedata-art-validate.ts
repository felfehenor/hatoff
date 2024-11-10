/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = require('fs-extra');
const yaml = require('js-yaml');

const validate = () => {
  const bodies = Array(7)
    .fill(0)
    .map((_, i) => `body${i}`);

  bodies.forEach((body) => {
    if (fs.existsSync(`gameassets/hero/body/${body}`)) return;

    console.error(`Body folder ${body} does not exist.`);
    process.exit(1);
  });

  const validateEars = () => {
    const ear = yaml.load(fs.readFileSync(`gamedata/art/ear.yml`));
    Object.keys(ear).forEach((folder) => {
      ear[folder].pieces.forEach((piece: any) => {
        bodies.forEach((body) => {
          const path = `gameassets/hero/ear/${body}_ear_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Ear file "${path}" does not exist.`);
          process.exit(1);
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
            const path = `gameassets/hero/eye/${body}_eye_${folder}/${mood}/${piece.name}.png`;
            if (fs.existsSync(path)) return;

            console.error(`Eye file "${path}" does not exist.`);
            process.exit(1);
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

          const path = `gameassets/hero/facialhair/${body}_facialhair_${folder}/${piece.name}.png`;

          if (fs.existsSync(path)) return;

          console.error(`Facial hair file "${path}" does not exist.`);
          process.exit(1);
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
          const path = `gameassets/hero/hair/${body}_hair_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Hair file "${path}" does not exist.`);
          process.exit(1);
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
          const path = `gameassets/hero/horn/${body}_horn_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Horn file "${path}" does not exist.`);
          process.exit(1);
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
          const path = `gameassets/hero/makeup/${body}_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Makeup file "${path}" does not exist.`);
          process.exit(1);
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
          const path = `gameassets/hero/mask/${body}_mask_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Mask file "${path}" does not exist.`);
          process.exit(1);
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
          const path = `gameassets/hero/outfit/${body}_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Outfit file "${path}" does not exist.`);
          process.exit(1);
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
          const path = `gameassets/hero/wing/${body}_wing_${folder}/${piece.name}.png`;
          if (fs.existsSync(path)) return;

          console.error(`Wing file "${path}" does not exist.`);
          process.exit(1);
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
};

validate();
