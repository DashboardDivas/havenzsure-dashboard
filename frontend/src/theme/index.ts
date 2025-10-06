// src/theme/index.ts
import { createTheme, ThemeOptions } from "@mui/material/styles";
import {
  lightPalette,
  darkPalette,
  corporatePalette,
  darkVibrantPalette,
  minimalGrayPalette,
  darkSleekPalette,
} from "./colorSchemes";
import typography from "./typography";
import { spacing } from "./spacing";

export type ThemeMode =
  | "light"
  | "dark"
  | "corporate"
  | "darkVibrant"
  | "minimalGray"
  | "darkSleek";

export default function getTheme(mode: ThemeMode) {
  let palette;

  switch (mode) {
    case "dark":
      palette = darkPalette;
      break;
    case "corporate":
      palette = corporatePalette;
      break;
    case "darkVibrant":
      palette = darkVibrantPalette;
      break;
    case "minimalGray":
      palette = minimalGrayPalette;
      break;
    case "darkSleek":
      palette = darkSleekPalette;
      break;
    default:
      palette = lightPalette;
  }

  const options: ThemeOptions = {
    palette,
    typography,
    spacing,
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
    },
  };

  return createTheme(options);
}
