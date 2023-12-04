import fs from 'fs';
import path from 'path';

function copyFolder(srcDir, destDir, relativePath = '') {
  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(dirent => {
    const srcPath = path.join(srcDir, dirent.name);
    const destPath = path.join(destDir, relativePath, dirent.name);

    if (dirent.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFolder(srcPath, destDir, path.join(relativePath, dirent.name));
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

const outDir = '../dist/ctlq/';
copyFolder('./out/', outDir);

