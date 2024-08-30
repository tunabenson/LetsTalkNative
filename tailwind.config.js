/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./App.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./contexts/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primarycolor: {
         1:'#1E1D1D',
         2:'#2E6171',
         3:'#788BFF',
         4:'#5271FF'
        },
        navajowhite:{
          100:'#FFE0B5'
        },
        cyan:{
          100:'#4DFFF3'
        },
        blackraisin:{
          100:'#1D1E2C'
        },
        springGreen:{
          100:'#307351'
        }
      },
      // fontFamily:{
      //   amiri:['Amiri']
      // },
    },
  },
  plugins: [],
}

