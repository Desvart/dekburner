import * as fs from "fs";
import path from 'path';

function deleteNonJsFiles(directory: string) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      let fullPath = path.join(directory, file);

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

const directory: string = process.argv[2];
if (!directory) {
  console.log('Please provide a directory to clean up.');
  process.exit(1);
}

deleteNonJsFiles(directory);