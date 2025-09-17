import { ExitToApp, Logout, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Divider, Popover, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clientNavItemsData } from "../data/items/client";
import { talentNavItemsData } from "../data/items/talent";
import { adminNavItemsData } from "../data/items/admin";
import { useState } from "react";

const SmallNav: React.FC<{
  setOpenNavBar: (arg: boolean) => void;
  openNavBar: boolean;
  setOpenLogoutModal: () => void;
}> = ({ setOpenNavBar, openNavBar, setOpenLogoutModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navItemsData =
    session?.user.accountType == "CLIENT"
      ? clientNavItemsData
      : session?.user.accountType == "ADMIN"
      ? adminNavItemsData
      : talentNavItemsData;

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        ...(openNavBar
          ? { display: { xs: "flex", md: "none" } }
          : { display: { xs: "none", md: "none" } }),
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        height: "100vh",
        zIndex: 1200,
      }}
    >
      <Box
        onClick={() => setOpenNavBar(true)}
        sx={{
          position: "relative",
          width: "250px",
          backgroundColor: "#730E19",
          height: "100vh",
          zIndex: 1002,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "-10px",
            pt: "20px",
            backgroundColor: "#FFFFFF",
            pb: "10px",
          }}
        >
          <Link href="/">
            <Image
              src={"/TBO.svg"}
              width={203.4}
              height={46.8}
              alt={"TBO logo"}
            />
          </Link>
        </Box>
        <Box
          sx={{
            ml: "30px",
            pt: "50px",
          }}
        >
          {navItemsData.map((item, index) => (
            <Box
              onClick={() => router.push(item.path)}
              key={index}
              sx={{
                display: "flex",
                color: "#E9E9E9",
                pt: "15px",
                pb: "10px",
                pr: "70px",
                pl: "15px",
                borderRadius: "10px 0px 0px 10px",
                mb: "20px",
                cursor: "pointer",
                ...(pathname == item.path && { backgroundColor: "#F3FCFF66" }),
                "&:hover": {
                  backgroundColor: "#F3FCFF66",
                },
              }}
            >
              <Box sx={{ mr: "18px" }}>{item.icon}</Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
        <Divider
          sx={{
            bgcolor: "#D7D7D7",
            mx: "40px",
            mb: "50px",
            display: { xs: "none", md: "block" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 40,
            bottom: 20,
            width: "100%",
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mr: "10px" }}>
            <Avatar />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#E61C31",
                overflowWrap: "anywhere",
              }}
            >
              {session?.user?.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#CCCED1",
                overflowWrap: "anywhere",
                pr: "10px",
              }}
            >
              {session?.user?.email}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "flex-end",
              pr: "60px",
            }}
          >
            <MoreVert
              onClick={handleClick}
              sx={{
                color: "#FFFFFF",
              }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              disableScrollLock
              sx={{ mt: "5px", ml: "-33px" }}
            >
              <Typography
                // onClick={() => signOut()}
                onClick={setOpenLogoutModal}
                sx={{
                  p: 2,
                  fontWeight: "bold",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#E1E1E1" },
                }}
              >
                <ExitToApp sx={{ mr: "2px" }} />
                Log Out
              </Typography>
            </Popover>
          </Box>
        </Box>
      </Box>
      <Box
        onClick={() => setOpenNavBar(!openNavBar)}
        sx={{ flexGrow: 1 }}
      ></Box>
    </Box>
  );
};

export default SmallNav;
