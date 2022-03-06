const { readFile } = require('fs/promises');
let { execFile } = require('child_process');
const path = require('path');
const { parseBlockMap, computeDiff } = require('./util');

const VERSIONS = require('./versions');
const DOWNLOADS = path.join(__dirname, 'downloads');
const FILES = VERSIONS.map(version => path.join(DOWNLOADS, `${version}.zip`));

async function main() {
  // Read all blockmaps
  const theirs = [];
  const ours = [];
  for (const file of FILES) {
    theirs.push(await readFile(`${file}.blockmap1`));
    ours.push(await readFile(`${file}.blockmap2`));
  }

  let improvement = 0;
  for (let i = 1; i < theirs.length; i++) {
    const us = computeDiff(
      await parseBlockMap(ours[i - 1]),
      await parseBlockMap(ours[i])
    );
    const them = computeDiff(
      await parseBlockMap(theirs[i - 1]),
      await parseBlockMap(theirs[i])
  );

    improvement += them - us + theirs[i].length - ours[i].length;
  }

  console.log(improvement / (theirs.length - 1));
}

main();
