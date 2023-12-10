import path from 'path';
import fse from 'fs-extra';

const __dirname = './';


const filterJsFiles =(src: string, dest: string) => {
  return src.includes('.js') || fse.statSync(src).isDirectory();
}

function determineModuleName() {
  const packageJson = fse.readJsonSync(path.join(__dirname, '/package.json'));
  return packageJson.name;
}

async function copyJsFiles() {
    const sourceDir = path.join(__dirname, '/out');
    const moduleName = determineModuleName();
    const targetDir = path.join(__dirname, '../dist/ci/', moduleName);

    fse.copy(sourceDir, targetDir, {overwrite: true, filter: filterJsFiles})
      .then(() => console.log('success!')).catch(err => console.error(err));
}

copyJsFiles().catch(console.error);