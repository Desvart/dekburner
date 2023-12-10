import fs from 'fs';
import path from 'path';

/**
 * This script addresses a complication arising from using the rootDirs option in tsconfig.json, which specifies multiple
 * root directories for a TypeScript project. While this aids in importing files across modules, it leads to a complex
 * directory structure in the output. The transpiler creates separate folders for each module. This script, run post-transpilation,
 * simplifies the output by merging these into a single root directory, maintaining the original folder structure of the
 * source code, and removing unnecessary sub-folders.
 */

function moveFolder(srcDir, destDir, relativePath = '') {
  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(dirent => {
    const srcPath = path.join(srcDir, dirent.name);
    const destPath = path.join(destDir, relativePath, dirent.name);

    if (dirent.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      moveFolder(srcPath, destDir, path.join(relativePath, dirent.name));
    } else {
      fs.renameSync(srcPath, destPath);
    }
  });
}

function deleteFolder(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function deleteMatchingFiles(dir, pattern) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      deleteMatchingFiles(fullPath, pattern); // Recursive call for directories
    } else {
      if (pattern.test(dirent.name)) {
        fs.unlinkSync(fullPath); // Delete the file if it matches the pattern
        console.log(`Deleted: ${fullPath}`);
      }
    }
  });
}

function deleteAllDTOInterfaces(rootDir) {
  deleteMatchingFiles(rootDir, /^I.*DTO\.js$/);
}

const outDir = './out/contract/';
moveFolder('./out/contract/glob-resources/', outDir);
deleteFolder('./out/contract/glob-resources/');
moveFolder('./out/contract/mod-contracts/src/', outDir);
deleteFolder('./out/contract/mod-contracts/');
deleteAllDTOInterfaces(outDir);

