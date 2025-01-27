import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const program = new Command();

async function loadCommands(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) await loadCommands(filePath);
        else if (file.endsWith('.ts') && file !== 'Command.ts') {
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
}).catch(err => {
    console.error('Falha ao carregar os comandos:', err);
});