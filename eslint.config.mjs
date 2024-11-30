import local from 'eslint-plugin-local';
import config from 'turmag-eslint-config';
import { aliases } from './aliases.mjs';

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
