import { execSync } from 'child_process';
import chokidar from 'chokidar';

const runCommand = (command: string) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(error);
  }
};

const startWatch = async () => {
  chokidar.watch('gamedata').on('change', (name) => {
    console.info(`[helpers] ${name} changed. Rebuilding gamedata...`);

    runCommand('npm run gamedata:build');
    console.info('[helpers] Rebuilt.');
  });
};

startWatch();
