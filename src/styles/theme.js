import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#e6f4f2",
      100: "#c2e2dd",
      200: "#9dd1c8",
      300: "#79bfb3",
      400: "#2fa293", // primary color (matches "Order Ride" button in image)
      500: "#248277", // hover state
      600: "#1a6158",
      700: "#10413a",
      800: "#08231e",
      900: "#02100c",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "xl",
      },
      variants: {
        solid: {
          bg: "brand.400",
          color: "white",
          _hover: {
            bg: "brand.500",
          },
        },
        outline: {
          borderColor: "brand.400",
          color: "brand.400",
          _hover: {
            bg: "brand.50",
          },
        },
      },
    },
  },
});

export default customTheme;
