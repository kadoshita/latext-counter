#!/usr/bin/env node

import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import child_process from 'child_process';
import { promisify } from 'util';
import path from 'path';
import commandExists from 'command-exists';
import commander from 'commander';
import open from 'open';
const packageJson = require('./package.json');
commander.name(packageJson.name);
commander.version(packageJson.version);
commander.description('A command line tool for counting the number of characters in LaTex files.\nThis application requires texcount command.');
commander.option('-p, --port [port]', 'port', '3000');
commander.option('-f --file <path>', 'LaTex file path', './main.tex');
const { argv } = process;
commander.parse(argv);

const options = commander.opts();
const port: number = parseInt(options.port, 10) || 3000;
const latexFilePath: string = options.file;

commandExists('texcount', (error, exists) => {
    if (!exists) {
        console.error('texcount command not found.');
        process.exit(1);
    }
});

const execAsync = promisify(child_process.exec);

const server = fastify({
    logger: process.env.NODE_ENV === 'development'
});
server.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
});

server.get('/api/count', async (request, reply) => {
    const { stdout: result } = await execAsync(`texcount -char -japanese ${latexFilePath}`);
    const matchResult = result.match(/Letters in text: (\d+)/) || [];
    const textCount: number = parseInt(matchResult[1], 10);
    return reply.code(200).send(textCount);
});

server.listen(port, '127.0.0.1', (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    open(address);
});