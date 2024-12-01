import local from 'eslint-plugin-local';
import config from 'turmag-eslint-config';
import specialRules from 'eslint-plugin-turmag-special-rules';
import { aliases } from './aliases.mjs';

export default [
    {
        plugins: {
            'special-rules': specialRules,
            local,
        },
    },

    ...config,

    {
        rules: {
            'special-rules/prefer-true-attribute-shorthand': 'error',
            'special-rules/add-vue-extension': ['error', { aliases }],
            'special-rules/use-shortest-alias': ['error', { aliases }],
            'special-rules/import-entities-by-column-or-line': ['error', { minProperties: 3 }],
            'special-rules/import-right-order': 'off',
        },
    },
];
