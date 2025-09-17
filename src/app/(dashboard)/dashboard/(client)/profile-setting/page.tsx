"use client";
// * React Imports
import { useState } from "react";

// * React Imports
import Icon from "@/@core/component/icon";

// * MUI Imports
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";

// * Tab Components Imports
import { profileTabs } from "./Tabs/data";
import Profile from "./Tabs/user-profile/Profile";
import Password from "./Tabs/password/Password";
import Notification from "./Tabs/notification/Notification";

export default function ClientProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  const hoverTabStyle = {
    backgroundColor: "#F5F0F0",
    color: "#E61C31",
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          minWidth: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#FFFFFF",
            mb: "20px",
            width: "fit-content",
          }}
        >
          {profileTabs.map((tab, index) => (
            <Box
              onClick={() => setActiveTab(index)}
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#98A2B3",
                border: "1px solid #EEEEEE",
                px: "10px",
                py: "5px",
                cursor: "pointer",
                "&:hover": hoverTabStyle,
                ...(activeTab == index && hoverTabStyle),
              }}
            >
              {tab.icon}

              {smallScreen && (
                <Typography sx={{ fontSize: "14px", ml: "5px" }}>
                  {tab.name}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        {/* {activeTab === 0 && (
          <Button
            size="small"
            sx={{
              px: { md: 4 },
              textTransform: "capitalize",
              color: "#910917",
              border: "1px solid #910917",

              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Icon icon="solar:pen-2-linear" />
            Edit Profile
          </Button>
        )} */}
      </Box>

      <section>
        <Box
          sx={{ backgroundColor: "#FFFFFF", padding: "20px", width: "100%" }}
        >
          {activeTab == 0 && <Profile />}
          {/* {activeTab == 1 && <ReProfile />} */}
          {activeTab == 1 && <Password />}
          {activeTab == 2 && <Notification />}
        </Box>
      </section>
    </Box>
  );
}
