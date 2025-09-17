import { styled } from "@mui/material/styles";

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[2],
  transform: "translate(-20px, 10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
}));
