module.exports = {
  purge: {
    content: [
      './src/**/*.js',
      './src/**/*.11ty.js',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: ["tailwindcss"],
}
