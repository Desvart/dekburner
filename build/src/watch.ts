import * as fs from 'node:fs';
import * as path from 'node:path';
import syncDirectory from 'sync-directory';
import fg from 'fast-glob';
import * as chokidar from 'chokidar';

const fileSyncJson = require('../filesync.json');
const dist: string = fileSyncJson['scriptsFolder'];
const src: string = 'src';
const allowedFiletypes: string[] = fileSyncJson['allowedFiletypes'];

class FileSynchronizer {
    /** Format dist path for printing */
    private normalize(p: string): string {
        return p.replace(/\\/g, '/');
    }

    /**
     * Sync static files.
     * Include init and watch phase.
     */
    public async syncStatic(): Promise<void> {
        await syncDirectory.async(path.resolve(src), path.resolve(dist), {
            exclude: (file) => {
                const { ext } = path.parse(file);
                return ext && !allowedFiletypes.includes(ext);
            },
            async afterEachSync(event) {
                // log file action
                let eventType;
                if (event.eventType === 'add' || event.eventType === 'init:copy') {
                    eventType = 'changed';
                } else if (event.eventType === 'unlink') {
                    eventType = 'deleted';
                }
                if (eventType) {
                    let relative = event.relativePath;
                    if (relative[0] === '\\') {
                        relative = relative.substring(1);
                    }
                    console.log(`${this.normalize(relative)} ${eventType}`);
                }
            },
            watch: true,
            deleteOrphaned: true,
        });
    }

    /**
     * Sync ts script files.
     * Init phase only.
     */
    private async initTypeScript(): Promise<void> {
        const distFiles = await fg(`${dist}/**/*.js`);
        for (const distFile of distFiles) {
            // search existing *.js file in dist
            const relative = path.relative(dist, distFile);
            const srcFile = path.resolve(src, relative);
            // if srcFile does not exist, delete distFile
            if (
                !fs.existsSync(srcFile) &&
                !fs.existsSync(srcFile.replace(/\.js$/, '.ts'))
            ) {
                await fs.promises.unlink(distFile);
                console.log(`${this.normalize(relative)} deleted`);
            }
        }
    }

    /**
     * Sync ts script files.
     * Watch phase only.
     */
    private async watchTypeScript(): Promise<void> {
        chokidar.watch(`${src}/**/*.ts`).on('unlink', async (p) => {
            // called on *.ts file get deleted
            const relative = path.relative(src, p).replace(/\.ts$/, '.js');
            const distFile = path.resolve(dist, relative);
            // if distFile exists, delete it
            if (fs.existsSync(distFile)) {
                await fs.promises.unlink(distFile);
                console.log(`${this.normalize(relative)} deleted`);
            }
        });
    }

    /**
     * Sync ts script files.
     * Include init and watch phase.
     */
    public async syncTypeScript(): Promise<void> {
        await this.initTypeScript();
        await this.watchTypeScript();
    }
}

const synchronizer = new FileSynchronizer();
console.log('Start watching static and ts files...');
synchronizer.syncStatic();
synchronizer.syncTypeScript();
