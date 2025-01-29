import { aliases } from './aliases.mjs';
import local from 'eslint-plugin-local';
import config from 'turmag-eslint-config';

export default [
    { plugins: { local } },

    ...config,

    {
        rules: {
            'special-rules/add-vue-extension': ['error', { aliases }],
            'special-rules/use-shortest-alias': ['error', { aliases }],
            'special-rules/import-right-order': 'off',
        },
    },
];
