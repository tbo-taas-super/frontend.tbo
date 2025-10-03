import { styled } from "@mui/material/styles";

const StyledImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxWidth: theme.breakpoints.down("sm") ? "100px" : "500px",
  objectFit: "contain",
  borderRadius: theme.shape.borderRadius,
}));

export default StyledImage;
