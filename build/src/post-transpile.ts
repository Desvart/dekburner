import * as fs from 'fs';
import path from "path";

function getModuleName(): string {
  const directory: string = process.argv[2];
  if (!directory) {
    console.log('Please provide a directory to clean up.');
    process.exit(1);
  }
  return directory;
}

function deleteNonJsFiles(directory: string): void {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      let fullPath: string = path.join(directory, file);

      fs.stat(fullPath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          deleteNonJsFiles(fullPath);
        } else if (path.extname(fullPath) !== '.js') {
          fs.unlink(fullPath, err => {
            if (err) throw err;
            console.log(`Deleted: ${fullPath}`);
          });
        }
      });
    }
  });
}

function fixImportPaths(directory: string): void {
  const directoryPath: string = `${directory}`;
  console.log(`directoryPath: ${directoryPath}`);

  // Regular expression to match the import paths
  const importRegex: RegExp = /import\s+({[^}]*})\s+from\s+['"]\/mod-(.*?)\/src\/(.*?)['"];/g;

  // Get all the files in the directory
  const items: string[] = fs.readdirSync(directoryPath);
  console.log(`Files: ${items}`);

  items.forEach(item => {
    const itemPath: string = path.join(directoryPath, item);

    // If it's a directory, process it recursively
    if (fs.statSync(itemPath).isDirectory()) {
      fixImportPaths(itemPath);
    }

    // Only process .js files
    if (path.extname(itemPath) === '.js') {
      let fileContent: string = fs.readFileSync(itemPath, 'utf8');

      // Replace the import paths
      fileContent = fileContent.replace(importRegex, 'import $1 from "/$2/$3";');

      // Write the updated content back to the file
      fs.writeFileSync(itemPath, fileContent, 'utf8');
    }
  });
}

function removeNSImports(directory: string): void {

}


const directory: string = getModuleName();
deleteNonJsFiles(directory);
fixImportPaths(directory);
removeNSImports(directory);
