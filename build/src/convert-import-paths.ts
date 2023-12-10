import path from "path";
import fs from "fs";


const directoryPath = '../dist/ci/'; // Replace with your CI directory path

// Regular expression to match the import paths
const importRegex = /import\s+({[^}]*})\s+from\s+['"]\/mod-(.*?)\/src\/(.*?)['"];/g;

// Get all the files in the directory
const files = fs.readdirSync(directoryPath);

files.forEach(file => {
  const filePath = path.join(directoryPath, file);

  // Only process .js files
  if (path.extname(filePath) === '.js') {
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Replace the import paths
    fileContent = fileContent.replace(importRegex, 'import $1 from "/$2/$3";');

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent, 'utf8');
  }
});