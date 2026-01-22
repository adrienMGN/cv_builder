const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': 'warn',
        },
    },
];
