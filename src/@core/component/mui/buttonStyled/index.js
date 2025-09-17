import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "fitContent",
    textAlign: "center",
  },
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 4,
  textTransform: "capitalize",
}));

export default ButtonStyled;
