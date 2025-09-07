/** @type {import("prettier").Config} */
export default {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',

  // Vue specific
  vueIndentScriptAndStyle: false,

  // Language specific overrides
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue',
      },
    },
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.js',
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: ['*.scss', '*.css'],
      options: {
        parser: 'scss',
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
      },
    },
  ],

  // Plugin specific
  plugins: [],

  // File specific ignores
  ignorePath: '.prettierignore',
}
