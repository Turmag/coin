import local from 'eslint-plugin-local';
import tseslint from 'typescript-eslint';
import config from 'turmag-eslint-config';

export default tseslint.config(
    { plugins: { local } },

    ...config,

    {
        rules: {
            'local/prefer-true-attribute-shorthand': ['error', 'always'],
            'local/add-vue-extension': 'error',
            'local/use-shortest-alias': 'error',
            'local/import-entities-by-column-or-line': ['error', { minProperties: 3 }],
            'local/import-right-order': 'off',
        },
    },
);
