import { extendTheme } from "@chakra-ui/react";
import ShadeGenerator from "shade-generator";

function createColorShades(inputColor: string) {
  const shadesMap = ShadeGenerator.hue(inputColor).shadesMap("hex");
  return {
    50: shadesMap[10],
    100: shadesMap[20],
    200: shadesMap[40],
    300: shadesMap[60],
    400: shadesMap[80],
    500: shadesMap[100],
    600: shadesMap[200],
    700: shadesMap[300],
    800: shadesMap[400],
    900: shadesMap[500],
  };
}

const primaryColors = createColorShades("#AB05F2");

const theme = extendTheme({
  colors: {
    primary: primaryColors,
    bgGray: "#A9A9A91A",
    cryptopunksBg: "#638596",
  },
  components: {
    Text: {
      baseStyle: {
        wordBreak: "break-word",
      },
    },
  },
  styles: {
    global: {
      "@supports (-webkit-touch-callout: default)": {
        "select, textarea, input": {
          fontSize: "1rem !important",
        },
      },
    },
  },
});

export default theme;

// Theme utils
export function pxToRem(px: number) {
  return `${px / 16}rem`;
}
