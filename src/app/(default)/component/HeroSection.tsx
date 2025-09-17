// * React Imports
import React, { useRef, useEffect } from "react";
import { ArrowForward } from '@mui/icons-material';

// ** Icon Imports
import Icon from "@/@core/component/icon";

// * Anime Import
import anime from "animejs";

// * Image Imports
import Bitmap from "../assets/Bitmap.svg";
import ImageOne from "../assets/1.png";
import ImageTwo from "../assets/2.png";
import ImageThree from "../assets/3.png";
import GroupedImages from "../assets/groupImages.svg";
import Gears from "../assets/gears.svg";
import Gem from "../assets/gem.svg";
import Star from "../assets/star.svg";

import { Autocomplete, TextField } from "@mui/material";
// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


//** Custom Component Imports
import CustomTextField from "../../../@core/component/mui/text-field";
import ButtonStyled from "../../../@core/component/mui/buttonStyled";
import StyledImage from "../../../@core/component/mui/image";

// * MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha, styled } from "@mui/material/styles";
import { jobSearchSchema } from "@/@core/formSchema";
import {  useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';

interface Defaults {
  title?: string;
  location?: string;
}
const defaultValues: Defaults = {
  title: "",
  location: "",
};

const HeroSection = () => {
  const gemRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const AvatarRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs = useRef<(SVGSVGElement | null)[]>([]);

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
      targets: starRef.current,
      rotate: 360,
      duration: 3000,
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
  const statesInNigeria = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];


  const services = [
    { image: ImageOne.src },
    { image: ImageTwo.src },
    { image: ImageThree.src }
  ];

  useEffect(() => {
    // Simple hover animation on arrows
    anime({
      targets: arrowRefs.current,
      translateX: 5,
      duration: 1000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine"
    });
  }, []);

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


  
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: "80dvh", md: "100dvh" },
        background: theme => theme.palette.primary.dark,
        textAlign: "center",
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,

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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          pb: 4,
          mt: { xs: 4, sm: 2 },
        }}
      >
        <Box
          sx={{ color: "white", fontWeight: 600, my: { xs: 4, md: 0 }, px: 2 }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, mb: 2 }}
          >
           Matching top talents with perfect opportunities. 
          </Typography>
          <Typography>
          Unlock pre-qualified talents and exclusive job opportunities!
          </Typography>

          <Box
  sx={{
    mt: (theme) => theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    gap: { xs: 2, sm: 4 },
  }}
>
  <Link href="/jobs">
    <ButtonStyled
      variant="contained"
      size="medium"
      sx={{
        background: "#A20514",
        color: "#fff",
        p: {
          xs: "0.5rem 1.5rem",
          md: "0.75rem 2rem",
        },
        fontSize: {
          xs: "0.875rem",
          md: "1rem",
        },
        minHeight: "44px",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.15)",
          background: "#8a0411",
        },
      }}
    >
      Find Jobs <Icon icon="hugeicons:job-search" />
    </ButtonStyled>
  </Link>

  <Link href="/dashboard/applications">
    <ButtonStyled
      variant="contained"
      sx={{
        color: (theme) => theme.palette.primary.dark,
        background: (theme) => theme.palette.primary.light,
        p: {
          xs: "0.5rem 1.5rem",
          md: "0.75rem 2rem",
        },
        fontSize: {
          xs: "0.875rem",
          md: "1rem",
        },
        minHeight: "44px",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.15)",
          background: "#A20514",
          color: (theme) => theme.palette.primary.light,
        },
      }}
    >
      Post Jobs <Icon icon="hugeicons:job-share" />
    </ButtonStyled>
  </Link>
</Box>

        </Box>

        {/* Here */}
        {/* <Box
          sx={{
            position: "relative",
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Box
            ref={AvatarRef}
            sx={{
              position: "absolute",
              top: "5%",
              left: "45%",
            }}
          >
            <StyledImage src={GroupedImages.src} />
          </Box>
          <Box
            ref={gemRef}
            sx={{
              position: "absolute",
              top: "-6%",
              left: "25%",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${Gem.src})`,
              backgroundRepeat: "no-repeat",
            }}
          ></Box>
          <Box
            ref={starRef}
            sx={{
              position: "absolute",
              top: "5%",
              left: "88%",
            }}
          >
            <StyledImage src={Star.src} />
          </Box>

          <Box>
            <StyledImage src={ImageOne.src} />
          </Box>
          <Box sx={{ mb: -3, mr: 2 }}>
            <StyledImage src={ImageTwo.src} />
          </Box>
          <Box>
            <StyledImage src={ImageThree.src} />
          </Box>
        </Box> */}
     <Box
  sx={{
    position: 'relative',
    display: {
      xs: 'none', // hidden on extra-small and small screens
      sm: 'flex'  // shown on small screens and up
    },
    flexDirection: { sm: 'row' },
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    py: 8,
    px: 2
  }}
>
  {[ ImageThree, ImageOne, ImageTwo].map((image, index) => (
    <React.Fragment key={`process-${index}`}>
      <Box
        sx={{
          position: 'relative',
          width: { xs: 150, sm: 250 }, // Reduced width
          height: { xs: 150, sm: 250 }, // Reduced height
          borderRadius: '50%',
          border: '3px solid',
          borderColor: 'primary.main',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 4,
          transition: 'all 0.3s ease-in-out',
          flexShrink: 0,
          '&:hover': {
            transform: 'scale(1.07)',
            boxShadow: 8,
            borderColor: 'secondary.main'
          }
        }}
      >
        <Box
          component="img"
          src={image.src}
          alt={`Step ${index + 1}`}
          sx={{
            width: '70%', // Reduced image size
            height: '70%', // Reduced image size
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'primary.main',
            color: 'white',
            width: { xs: 30, sm: 38 }, // Reduced badge size
            height: { xs: 30, sm: 38 }, // Reduced badge size
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: { xs: '0.875rem', sm: '1rem' }, // Adjusted font size
            boxShadow: 3
          }}
        >
          {index + 1}
        </Box>
      </Box>

      {/* Animated Connector */}
      {index < 2 && (
        <Box
          sx={theme => ({
            position: 'relative',
            width: { xs: 30, sm: 60 }, // Reduced connector width
            height: { xs: 30, sm: 20 }, // Adjusted height
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              backgroundColor: theme.palette.primary.main,
              [theme.breakpoints.up('sm')]: {
                width: '100%',
                height: '2px',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)'
              },
              [theme.breakpoints.down('sm')]: {
                height: '100%',
                width: '2px',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)'
              }
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              [theme.breakpoints.up('sm')]: {
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                borderStyle: 'solid',
                borderWidth: '8px 0 8px 12px',
                borderColor: `transparent transparent transparent ${theme.palette.primary.main}`
              },
              [theme.breakpoints.down('sm')]: {
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                borderStyle: 'solid',
                borderWidth: '12px 8px 0 8px',
                borderColor: `${theme.palette.primary.main} transparent transparent transparent`
              }
            }
          })}
        >
          <Box
            sx={theme => ({
              position: 'absolute',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: theme.palette.secondary.main,
              [theme.breakpoints.up('sm')]: {
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                animation: 'moveRight 2s infinite ease-in-out'
              },
              [theme.breakpoints.down('sm')]: {
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'moveDown 2s infinite ease-in-out'
              },
              '@keyframes moveRight': {
                '0%': { left: 0, opacity: 0 },
                '50%': { opacity: 1 },
                '100%': { left: '100%', opacity: 0 }
              },
              '@keyframes moveDown': {
                '0%': { top: 0, opacity: 0 },
                '50%': { opacity: 1 },
                '100%': { top: '100%', opacity: 0 }
              }
            })}
          />
        </Box>
      )}
    </React.Fragment>
  ))}
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
        borderRadius: 4,
        background: (theme) => theme.palette.secondary.light,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        p: (theme) => [
          `${theme.spacing(3)} !important`,
          `${theme.spacing(4)} !important`,
        ],
        overflow: "visible",
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          height: "100%",
          background: "white",
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          mt: 2,
          border: "none",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-3px)",
          },
        }}
      >
        <Grid container spacing={3} rowSpacing={2} columnSpacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  size="medium"
                  placeholder="Job Title, Keywords, Company Name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(162, 5, 20, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(162, 5, 20, 0.2)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          color: (theme) => theme.palette.primary.main,
                          mr: 1,
                        }}
                      >
                        <Icon icon="lets-icons:search-duotone" fontSize="1.25rem" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="location"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={statesInNigeria}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue)}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Location"
                      size="medium"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: "0 0 0 2px rgba(162, 5, 20, 0.1)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 0 0 2px rgba(162, 5, 20, 0.2)",
                          },
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <Icon icon="hugeicons:location-04" fontSize="1.25rem" color="#A20514" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>

        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 2, sm: 0 },
          }}
        >
          <ButtonStyled
            variant="contained"
            size="large"
            endIcon={<Icon icon="lets-icons:search-duotone" />}
            sx={{
              px: (theme) => [
                `${theme.spacing(4)} !important`,
                `${theme.spacing(5)} !important`,
              ],
              py: (theme) => [
                `${theme.spacing(1.5)} !important`,
                `${theme.spacing(2)} !important`,
              ],
              ml: { xs: 0, sm: 4 },
              background: "linear-gradient(45deg, #A20514 30%, #C62828 90%)",
              borderRadius: 2,
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(162, 5, 20, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(162, 5, 20, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Search
          </ButtonStyled>
        </CardActions>
      </CardContent>

      <Box
        sx={{
          alignSelf: "flex-start",
          display: "flex",
          mt: 3,
          fontSize: { xs: 12, sm: 14 },
          color: (theme) => theme.palette.secondary.dark,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            fontSize: 14,
            fontWeight: 600,
            color: (theme) => theme.palette.primary.main,
            mr: 1,
          }}
        >
          Popular:
        </Typography>
        {["Software testers", "Business Development Officer", "Business Analyst", "Full Stack Developers", "DevOps engineers", "Platform engineers", "Service desk engineers", "Data analysts"].map((item, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              color: "#555",
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                color: "#A20514",
                textDecoration: "underline",
              },
            }}
          >
            {item}{index < 7 ? "," : ""}
          </Box>
        ))}
      </Box>
</Card> */}
    </Box>
  );
};

export default HeroSection;
