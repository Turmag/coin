import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const aliases = {
    '@main': path.resolve(__dirname, './src/components/main'),
    '@header': path.resolve(__dirname, './src/components/header'),
    '@': path.resolve(__dirname, './src'),
};
