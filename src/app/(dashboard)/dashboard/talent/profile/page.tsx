"use client";
import { Box, Typography } from "@mui/material";
import { profileTabs } from "./data";
import { useState } from "react";
import MyProfileTab from "./tabs/my-profile";
import MyResumeTab from "./tabs/my-resume";
import MyVideoTab from "./tabs/my-video";
import MyportTab from "./tabs/my-portfolio";
import PasswordManagementTab from "./tabs/password-management";
import NotificationsTab from "./tabs/notifications";
import AllProfile from "./tabs/all-profile";

export default function TalentProfilePage() {
  const [activeTab, setActiveTab] = useState(0);

  const hoverTabStyle = {
    backgroundColor: "#F5F0F0",
    color: "#E61C31",
  };

  return (
    <main>
      <Box>
        {/* Tabs */}
        <Box sx={{ display: "flex", backgroundColor: "#FFFFFF", mb: "20px", width: "fit-content" }}>
          {profileTabs.map((tab, index) => (
            <Box
              key={index}
              onClick={() => setActiveTab(index)}
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
                ...(activeTab === index && hoverTabStyle),
              }}
            >
              {tab.icon}
              <Typography sx={{ fontSize: "14px", ml: "5px" }}>{tab.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tab Content */}
      <section>
        <Box sx={{ backgroundColor: "#FFFFFF", padding: "20px", width: "100%" }}>
          {activeTab === 0 && <MyProfileTab />}
          {activeTab === 1 && <MyVideoTab />}
          {activeTab === 2 && <MyResumeTab />}
          {activeTab === 3 && <MyportTab />}
          {activeTab === 4 && <AllProfile />}
          {activeTab === 5 && <PasswordManagementTab />}
          {/* {activeTab === 6 && <NotificationsTab />} */}
        </Box>
      </section>
    </main>
  );
}
