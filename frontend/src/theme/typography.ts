// src/theme/typography.ts
import { TypographyOptions } from "@mui/material/styles/createTypography";

const typography: TypographyOptions = {
  fontFamily: "'Inter', 'Roboto', sans-serif",
  h1: { fontSize: "2.25rem", fontWeight: 700 },
  h2: { fontSize: "1.75rem", fontWeight: 600 },
  h3: { fontSize: "1.5rem", fontWeight: 600 },
  body1: { fontSize: "1rem", lineHeight: 1.6 },
  body2: { fontSize: "0.875rem", lineHeight: 1.6 },
  button: { fontWeight: 600 },
};

export default typography;
