import * as React from "react";

// * Icon Imports
import Icon from "@/@core/component/icon";

// * MUI Imports
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const nextIcon = <Icon icon="mdi:chevron-right" />;
const prevIcon = <Icon icon="mdi:chevron-left" />;

export default function TablePagination() {
  return (
    <Stack spacing={2}>
      <Pagination
        count={10}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </Stack>
  );
}
