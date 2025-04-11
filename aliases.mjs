import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const aliases = {
    '@': path.resolve(__dirname, './src'),
    '@header': path.resolve(__dirname, './src/components/header'),
    '@main': path.resolve(__dirname, './src/components/main'),
};
