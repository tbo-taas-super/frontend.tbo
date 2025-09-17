import { styled } from "@mui/material/styles";

const StyledImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxWidth: theme.breakpoints.down("sm") ? "300px" : "600px",
  objectFit: "contain",
  borderRadius: theme.shape.borderRadius,
}));

export default StyledImage;
