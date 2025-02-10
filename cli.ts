import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const exlcude = [
    'Command.ts',
    'Decorators'
]

const program = new Command();

async function loadCommands(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (exlcude.includes(file)) continue

        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) await loadCommands(filePath);
        else if (file.endsWith('.ts')) {
            try {
                const fileURL = pathToFileURL(filePath);
                const { default: CommandClass } = await import(fileURL.href);
                const commandInstance = new CommandClass();
                program.addCommand(commandInstance);

            } catch (error) {
                console.error(`Erro ao carregar o comando "${filePath}":`, error);
            }
        }
    }
}

loadCommands(path.resolve('src/commands')).then(() => {
    program
        .name('CLI')
        .description('Project CLI')
        .version('0.0.0');

    program.parse(process.argv);
}).catch((err: Error) => {
    Log.out('#[danger]Command execution error:')
    Log.out(`#[danger]${err.name}: #[default]${err.message}`)
});