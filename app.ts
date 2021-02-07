import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import child_process from 'child_process';
import { promisify } from 'util';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const execAsync = promisify(child_process.exec);

const PORT = process.env.PORT || 3000;
const LATEX_FILE_PATH = process.env.LATEX_FILE_PATH || './main.tex';

const server = fastify({
    logger: process.env.NODE_ENV === 'development'
});
server.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
});

server.get('/api/count', async (request, reply) => {
    const { stdout: result } = await execAsync(`texcount -char -japanese ${LATEX_FILE_PATH}`);
    const matchResult = result.match(/Letters in text: (\d+)/) || [];
    const textCount: number = parseInt(matchResult[1], 10);
    return reply.code(200).send(textCount);
});

server.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
})