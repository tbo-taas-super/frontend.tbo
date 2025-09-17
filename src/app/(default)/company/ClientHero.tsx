// * React Imports
import React, { useRef, useEffect } from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";

// * anime Import
import anime from "animejs";

// * Image Imports
import Bitmap from "../assets/Bitmap.svg";
import ImageOne from "../assets/imageOne.svg";
import ImageTwo from "../assets/imageTwo.svg";
import ImageThree from "../assets/imageThree.svg";
import GroupedImages from "../assets/groupImages.svg";
import Gears from "../assets/gears.svg";
import Gem from "../assets/gem.svg";
import Star from "../assets/star.svg";
import Link from 'next/link';
// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//** Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import ButtonStyled from "@/@core/component/mui/buttonStyled";
import StyledImage from "@/@core/component/mui/image";
import Clients from "./Clients";

// * MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { alpha } from "@mui/material/styles";
import { jobSearchSchema } from "@/@core/formSchema";

interface Defaults {
  title?: string;
  location?: string;
}

const defaultValues: Defaults = {
  title: "",
  location: "",
};

const ClientHero = () => {
  const gemRef = useRef<HTMLDivElement>(null);
  const AvatarRef = useRef<HTMLDivElement>(null);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(jobSearchSchema),
  });

  useEffect(() => {
    anime({
      targets: gemRef.current,
      translateY: -10,
      duration: 1000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });

    anime({
      targets: AvatarRef.current,
      translateY: 10,
      easing: "easeInOutQuad",
      direction: "alternate",
      loop: true,
    });
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: "80dvh", md: "100dvh" },
        background: (theme) =>
          `linear-gradient(to right, ${alpha(
            theme.palette.primary.light,
            0.3
          )}, ${alpha(theme.palette.primary.light, 0.8)})`,
        textAlign: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "center", sm: "center" },
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
        }}
      ></Box>
     

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          pb: 4,
          mt: { xs: 4, sm: 2 },
        }}
      >
        <Box sx={{ color: "#000", fontWeight: 600 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 2 }}
          >
            Give your Team A Boost
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
            Discover the perfect and most skilled candidate for your vacant
            role.
          </Typography>

          <Box
            sx={{
              mt: (theme) => theme.spacing(4),
              display: "flex",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {/* <Link href="/sign-up" passHref>
            <ButtonStyled
              variant="contained"
              size="medium"
              sx={{
                p: {
                  xs: "0.5rem 1rem",
                  md: "0.75rem 1.5rem",
                },
                background: "#A20514",
              }}
            >
              Explore Jobs
              <Icon icon="material-symbols-light:arrow-right-alt-rounded" />
            </ButtonStyled>
            </Link> */}
          </Box>
        </Box>

        {/* Here */}
        <Box
          sx={{
            position: "relative",
            width: "50%",
            display: { xs: "none", sm: "flex" },
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box
            ref={AvatarRef}
            sx={{
              position: "absolute",
              top: "5%",
              left: "30%",
            }}
          >
            <StyledImage src={GroupedImages.src} />
          </Box>
          <Box
            ref={gemRef}
            sx={{
              position: "absolute",
              top: "5%",
              left: "60%",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${Gem.src})`,
              backgroundRepeat: "no-repeat",
            }}
          ></Box>
          <Box>
            <StyledImage src={ImageOne.src} />
          </Box>
          <Box sx={{ mb: -3, mr: 2 }}>
            <StyledImage src={ImageTwo.src} />
          </Box>
        </Box>
      </Box>

      {/* <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexFlow: "column",
          width: { xs: "100%", sm: "85%" },
          height: { xs: "auto", lg: "30%" },
          position: "absolute",
          left: { xs: "0", sm: "7.5%" },
          top: "90%",
          borderRadius: 3,
          // background: (theme) => theme.palette.secondary.light,
          boxShadow: (theme) => `${alpha(theme.palette.primary.dark, 0.4)}`,
          p: (theme) => [
            `${theme.spacing(1)} !important`,
            `${theme.spacing(3)} !important`,
          ],
        }}
      >
        <Clients />

      </Card> */}
    </Box>
  );
};

export default ClientHero;
