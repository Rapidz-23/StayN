import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#146C60", dark: "#0E4F46", contrastText: "#FFFFFF" },
    secondary: { main: "#FFB347", contrastText: "#232323" },
    error: { main: "#B23A1B" },
    background: { default: "#FFF8F0", paper: "#FFFFFF" },
    text: { primary: "#232323", secondary: "#6B6B6B" },
    divider: "#EADFD2",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 16,
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 40, lineHeight: "48px" },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 28, lineHeight: "36px" },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 20, lineHeight: "28px" },
    body1: { fontSize: 16, lineHeight: "24px" },
    body2: { fontSize: 14, lineHeight: "20px" },
    button: { fontSize: 15, lineHeight: "20px", fontWeight: 500, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { height: 44, padding: "0 20px", borderRadius: 8 } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #EADFD2",
          boxShadow: "0 2px 8px rgba(35, 35, 35, 0.08)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, "& fieldset": { borderColor: "#EADFD2" } },
      },
    },
  },
});

export default theme;
