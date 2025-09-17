// * React Imports
import React from "react";

// * Utility Imports
import { getInitials } from "@/@core/utils/getIntials";

// * MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import CustomAvatar from "@/@core/component/mui/avatar";

interface ImageProps {
  name: string;
  avatarColor?: string;
  avatar?: string | undefined;
  sx?: object;
}

// ** renders client column
const renderClient = (row: ImageProps) => {
  const initials = `${row?.name}`;

  if (row.avatar && row.avatar.length) {
    return (
      <CustomAvatar
        src={row.avatar}
        sx={{ mr: 2.5, width: 50, height: 50 }}
        skin="light"
      />
    );
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={row.avatarColor || "primary"}
        sx={{
          mr: 2.5,
          width: 100,
          height: 100,
          fontWeight: 500,
          fontSize: (24 / 100) * 100,
        }}
      >
        {getInitials(row.name || "John Doe")}
      </CustomAvatar>
    );
  }
};

const Profile = ({ user }: { user: ImageProps }) => {
  return (
    <main>
      <Box sx={{ width: "fit-content" }}>
        <Box
          sx={{
            border: "1px dashed #D0D5DD",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "16px",
            padding: "20px",
            minWidth: "200px",
          }}
        >
          <Box>{renderClient(user)}</Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              mt: "10px",
            }}
          >
            <DeleteOutlineOutlined />
            <Box>
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: "capitalize" }}
              >
                Change
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </main>
  );
};

export default Profile;
