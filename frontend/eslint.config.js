import next from 'eslint-config-next'

export default [
  ...next,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'public/**',
      'eslint.config.js',
      'postcss.config.mjs',
      'tailwind.config.js',
      'tailwind.config.js',
    ],
  },
]
