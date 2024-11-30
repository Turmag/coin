import local from 'eslint-plugin-local';
import config from 'turmag-eslint-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aliases = {
    '@main': path.resolve(__dirname, './src/components/main'),
    '@header': path.resolve(__dirname, './src/components/header'),
    '@': path.resolve(__dirname, './src'),
};

export default [
    { plugins: { local } },

    ...config,

    {
        rules: {
            'local/prefer-true-attribute-shorthand': ['error', 'always'],
            'local/add-vue-extension': ['error', { aliases }],
            'local/use-shortest-alias': ['error', { aliases }],
            'local/import-entities-by-column-or-line': ['error', { minProperties: 3 }],
            'local/import-right-order': 'off',
        },
    },
];
