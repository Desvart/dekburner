import fs from 'fs';
import path from 'path';

// Function to get all .js files in a directory recursively
function getJsFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = getJsFiles(path.join(dir, file), fileList);
    } else if (path.extname(file) === '.js') {
      fileList.push(path.join(dir, file));
    }
  });

  return fileList;
}

// Function to copy a file from src to dest
function copyFile(src: string, dest: string) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

// Get all modules directories
const pathToRoot = '../../'
const modules = fs.readdirSync(pathToRoot).filter((dir) => fs.statSync(path.join(pathToRoot,dir)).isDirectory() && dir.startsWith('mod-'));

// For each module, get all .js files in the out directory
modules.forEach((module) => {
  const outDir = path.join(pathToRoot, module, 'out');
  if (fs.existsSync(outDir)) {
    const jsFiles = getJsFiles(outDir);

    // Copy each file to the dist/ci directory, preserving the directory structure
    jsFiles.forEach((file) => {
      const relativePath = path.relative(outDir, file);
      const dest = path.join(pathToRoot, 'dist', 'ci', module.replace('mod-', ''), relativePath);
      copyFile(file, dest);
    });
  }
});