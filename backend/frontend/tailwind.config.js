/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ateneo: {
          'blue-main': '#2F3590',
          'blue-2': '#1611B1',
          'blue-dark': '#040354',
          'yellow-main': '#FDF036',
          'yellow-2': '#FFDB58',
          'yellow-3': '#FCCA27',
          green: '#19A554',
          cyan: '#1EAEEC',
          red: '#E9222E',
        },
      },
      fontFamily: {
        // Primary headings & titles (h1, h2, card titles, tab headers)
        trajan: ['"Trajan Pro"', 'serif'],
        // Alternative / secondary display headings
        maharlika: ['Maharlika', 'serif'],
        // Body, labels, subtext
        garamond: ['"EB Garamond"', 'Garamond', 'Baskerville', 'serif'],
      },
    },
  },
  plugins: [],
}
