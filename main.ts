// SODA GEYSER — deterministic entry copier for ai-excited-01 (w10).
//
// What this program does, in plain terms:
//   1. It locates entry.png sitting right next to this file.
//   2. It copies those exact bytes to the requested output path
//      (or to out.png beside this file when no path is given).
//   3. It reports the output size, both SHA-256 digests, and
//      whether the copy is a byte-perfect match of the source.
//
// The copy is a raw byte transfer — no re-encoding, no metadata
// rewriting — so repeated runs always produce identical output.

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

function sha256Hex(bytes: Buffer): string {
  const hasher = createHash("sha256");
  hasher.update(bytes);
  return hasher.digest("hex");
}

function main(): void {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = resolve(scriptDir, "entry.png");

  const requested = process.argv[2];
  const outputPath = requested
    ? resolve(requested)
    : resolve(scriptDir, "out.png");

  const sourceBytes = readFileSync(sourcePath);
  writeFileSync(outputPath, sourceBytes);

  const writtenBytes = readFileSync(outputPath);
  const info = statSync(outputPath);

  const sourceDigest = sha256Hex(sourceBytes);
  const outputDigest = sha256Hex(writtenBytes);
  const identical = sourceDigest === outputDigest;

  console.log(`source: ${basename(sourcePath)}`);
  console.log(`output: ${outputPath}`);
  console.log(`output_bytes: ${info.size}`);
  console.log(`sha256_output: ${outputDigest}`);
  console.log(`sha256_source: ${sourceDigest}`);
  console.log(`match: ${identical ? "yes" : "no"}`);
}

main();
