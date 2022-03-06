const { createWriteStream } = require('fs');
const { mkdir } = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');
const got = require('got');
const { appBuilderPath } = require('app-builder-bin');
let { execFile } = require('child_process');
const { promisify } = require('util');

execFile = promisify(execFile);

const betterBlockMap =
  path.join(__dirname, 'node_modules', '.bin', 'better-blockmap');

const VERSIONS = require('./versions');
const DOWNLOADS = path.join(__dirname, 'downloads');

const BASE_URL =
  'http://updates.signal.org/desktop/signal-desktop-beta-mac-x64-';

async function main() {
  await mkdir(DOWNLOADS, { recursive: true });
  for (const version of VERSIONS) {
    console.log('Downloading', version);

    await pipeline(
      got.stream(`${BASE_URL}${version}.zip`),
      createWriteStream(path.join(DOWNLOADS, `${version}.zip`)),
    );
  }

  // Create blockmaps
  for (const version of VERSIONS) {
    const file = path.join(DOWNLOADS, `${version}.zip`);
    console.log('Creating blockmap for', version);

    await Promise.all([
      execFile(appBuilderPath, [
        'blockmap', '-i', file, '-o', `${file}.blockmap1`
      ]),
      execFile(betterBlockMap, ['-z', '-i', file, '-o', `${file}.blockmap2`]),
    ]);
  }
}

main();
