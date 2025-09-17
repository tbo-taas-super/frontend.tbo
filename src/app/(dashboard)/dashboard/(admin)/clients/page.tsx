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
import { ClientJobTabs } from "./Tabs/data";
import ClientsTable from "./Tabs/client/ClientsTable";
// import Jobs from "./Tabs/jobs/JobsTable";
// import Clients from "./Tabs/client/ClientList";

export default function ClientProfilePage() {
  const [interview, setNewInterview] = useState<boolean>(false);
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
          {ClientJobTabs.map((tab, index) => (
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
       
      </Box>

      <section>
        <Box
          sx={{ backgroundColor: "#FFFFFF", padding: "20px", width: "100%" }}
        >
          {/* {activeTab == 0 && <Clients />}
          {activeTab == 1 && <Jobs />} */}
          {activeTab == 0 && <ClientsTable />}
        </Box>
      </section>
    </Box>
  );
}
