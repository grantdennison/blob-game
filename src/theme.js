// theme.js

import { extendTheme } from "@chakra-ui/react";
//import the css file from the fonts folder
// import './theme.css';
// import { theme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // Set to 'light' or 'dark' as needed
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
        bg: props.colorMode === "dark" ? "gray.500" : "white",
      },
    }),
  },

  fonts: {},
  breakpoints: {
    // sm: '320px',
    // md: '768px',
    // lg: '960px',
    // xl: '1200px',
    // '2xl': '1981px', // You might add this for 4K resolution screens
  },
});

export default theme;
