import local from 'eslint-plugin-local';
import config from 'turmag-eslint-config';
import specialRules from 'eslint-plugin-turmag-special-rules';
import { aliases } from './aliases.mjs';

export default [
    {
        plugins: {
            specialRules,
            local,
        },
    },

    ...config,

    {
        rules: {
            'specialRules/prefer-true-attribute-shorthand': 'error',
            'local/add-vue-extension': ['error', { aliases }],
            'local/use-shortest-alias': ['error', { aliases }],
            'local/import-entities-by-column-or-line': ['error', { minProperties: 3 }],
            'local/import-right-order': 'off',
        },
    },
];
