module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        thorange: '#FD841F',
        thorangelight:'#FF9C4A',
        thlight:'#FFB374'
      },
    },

  },
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.{js,jsx,ts,tsx}'],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    }),
  ],
}

