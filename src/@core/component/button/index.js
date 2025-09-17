import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));
