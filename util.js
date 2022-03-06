let { gunzip } = require('zlib');
const { promisify } = require('util');

gunzip = promisify(gunzip);

async function parseBlockMap(data) {
  const unpacked = await gunzip(data);
  const json = JSON.parse(unpacked.toString());

  const [file] = json.files;

  const blocks = [];
  for (const [i, checksum] of file.checksums.entries()) {
    const size = file.sizes[i];

    blocks.push({
      size,
      checksum,
    });
  }

  return blocks;
}
exports.parseBlockMap = parseBlockMap;

function computeDiff(
  oldMap,
  newMap,
) {
  const oldChecksums = new Map();
  for (const oldBlock of oldMap) {
    let list = oldChecksums.get(oldBlock.checksum);
    if (!list) {
      list = [];
      oldChecksums.set(oldBlock.checksum, list);
    }

    list.push(oldBlock);
  }

  let downloadSize = 0;

  for (const newBlock of newMap) {
    const oldBlocks = oldChecksums.get(newBlock.checksum);
    if (oldBlocks) {
      const oldBlock = oldBlocks.shift();
      if (oldBlocks.length === 0) {
        oldChecksums.delete(newBlock.checksum);
      }
      continue;
    }

    downloadSize += newBlock.size;
  }

  return downloadSize;
}
exports.computeDiff = computeDiff;
