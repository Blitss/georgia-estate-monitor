module.exports = {
  extends: '@ythub',
  parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
  rules: {
    'arca/no-default-export': 'off',
    'arca/newline-after-import-section': 'off',
    'arca/import-ordering': 'off',
    'promise/param-names': 'off',
    'no-restricted-globals': 'off',
  },
}
