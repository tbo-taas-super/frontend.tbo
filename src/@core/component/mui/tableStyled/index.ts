import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TableRowStyled = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const TableCellStyled = styled(TableCell)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.dark,
  fontWeight: "semibold",
}));
