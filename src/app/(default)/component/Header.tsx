"use client";
// ** React Imports
import * as React from "react";

// ** Custom Component Imports
import StyledImage from "@/@core/component/mui/image";

// ** MUI Imports
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme, useTheme } from "@mui/material/styles";

// ** Next Imports
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// ** Logo Import
import Logo from "../../../../public/TBO.svg";
import Bitmap from "../assets/Bitmap.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import { Dashboard, ExitToApp, Person } from "@mui/icons-material";
import { Button, IconButton, Popover } from "@mui/material";

const pages = [
  { href: "/", title: "Home" },
  { href: "/jobs", title: "Find a job" },
  { href: "/company", title: "Find Talents" },
  { href: "/contact", title: "Contact" },
  { href: "/support", title: "Support" },
];

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const [active, setActive] = React.useState<number>(0);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorMobileNav, setAnchorMobileNav] = React.useState(false);

  const theme: Theme = useTheme();

  // Update active state based on the current route
  React.useEffect(() => {
    const activeIndex = pages.findIndex((page) => page.href === pathname);
    setActive(activeIndex !== -1 ? activeIndex : 0); // Default to 0 if no match
  }, [pathname]);

  const handleActive = (index: number) => {
    setActive(index);
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileNavOpen = () => {
    setAnchorMobileNav(true);
  };

  const handleCloseMobileNav = () => setAnchorMobileNav(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isMediumScreenUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          p: 3,
          position: "relative",
          backgroundColor: (theme) => theme.palette.primary.dark,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${Bitmap.src})`,
            backgroundSize: "cover",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: (theme) => theme.palette.primary.light,
            borderRadius: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Link href="/">
              <StyledImage src={Logo.src} alt="TBO Logo" />
            </Link>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              mt: "-10px",
              ml: "-90px",
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
              px: (theme) => `${theme.spacing(0)} !important`,
            }}
          >
            {pages.map((page, i) => (
              <Link href={page?.href} key={page?.title}>
                <Button
                  onClick={() => handleActive(i)}
                  sx={{
                    borderBottomLeftRadius: "0 !important",
                    borderBottomRightRadius: "0 !important",
                    position: "relative",
                    mt: 3,
                    minWidth: 70,
                    textTransform: "capitalize",
                    color: "#444",
                    display: "block",
                    borderBottom:
                      active === i ? "2px solid" : "6px solid transparent",
                    borderColor:
                      active === i
                        ? (theme) => theme.palette.primary.dark
                        : "transparent",
                    transition: "border-color 0.3s",
                    "&:after": {
                      content: '""',
                      display: "block",
                      width: "fit",
                    },
                    "&:focus, &.MuiButton-root:hover": {
                      borderBottom: "2px solid #444",
                      borderColor: (theme) =>
                        `${theme.palette.primary.dark} !important`,
                      content: '""',
                      display: "block",
                      width: "fit",
                      transition: "width 1.2s",
                    },
                    "&:active": {
                      borderBottom: "2px solid #444",
                      borderColor: (theme) =>
                        `${theme.palette.primary.dark} !important`,
                      content: '""',
                      display: "block",
                      width: "fit",
                      transition: "width 1.2s",
                    },
                  }}
                >
                  {page.title}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "baseline" }}>
            {!session?.user ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    onClick={() => signIn()}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "capitalize",
                      fontSize: "small",
                      p: (theme) => theme.spacing(1),
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.main} !important`,
                        color: "#fff",
                        transition: "all 0.3",
                      },
                    }}
                  >
                    Login
                  </Button>
                  {isMediumScreenUp && (
                    <Divider orientation="vertical" variant="middle" flexItem />
                  )}

                  <Button
                    variant="outlined"
                    sx={{
                      display: { xs: "none", md: "flex" },
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "capitalize",
                      fontSize: "small",
                      p: (theme) => theme.spacing(1),
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.main} !important`,
                        color: "#fff",
                        transition: "all 0.3",
                      },
                    }}
                  >
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Button
                  aria-describedby={id}
                  onClick={handleClick}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    color: "#E61C31",
                    mt: "8px",
                    px: "10px",
                    py: "3px",
                    borderRadius: "8px",
                    textTransform: "none",
                  }}
                >
                  <Person sx={{ mr: "2px" }} />
                </Button>
              </>
            )}

            {!isMediumScreenUp && (
              <Divider orientation="vertical" variant="middle" flexItem />
            )}

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="Navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMobileNavOpen}
              >
                <MenuIcon
                  sx={{ color: (theme) => theme.palette.primary.dark }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                open={Boolean(anchorMobileNav)}
                onClose={handleCloseMobileNav}
                sx={{
                  display: {
                    width: "100%",
                    minWidth: "400px",
                    xs: "flex",
                    md: "none",
                    mt: "5rem",
                    ml: "-33px",
                  },
                }}
              >
                {pages.map((page, i) => (
                  <MenuItem
                    key={page.title}
                    onClick={() => {
                      handleCloseMobileNav();
                      handleActive(i); // Update active state for mobile menu
                    }}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                    }}
                  >
                    <Button
                      sx={{
                        color:
                          active === i
                            ? (theme) => theme.palette.primary.dark
                            : (theme) => theme.palette.primary.main,
                        fontSize: "small",
                      }}
                    >
                      <Link href={page.href}>{page.title}</Link>
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Container>
      </AppBar>
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
          sx={{
            p: 2,
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {session?.user.email}
        </Typography>
        <Divider />
        <Typography
          onClick={() =>
            router.push(`/dashboard/${session?.user.accountType.toLowerCase()}`)
          }
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
          <Dashboard sx={{ mr: "2px" }} />
          Dashboard
        </Typography>
        <Divider />
        <Typography
          onClick={() => signOut()}
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
          Sign Out
        </Typography>
      </Popover>
    </>
  );
}
export default Header;