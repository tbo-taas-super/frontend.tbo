// * React Imports
import React, { useRef, useEffect } from "react";

// ** Icon Imports
import Icon from "@/@core/component/icon";
import Link from 'next/link';
// * anime Import
import anime from "animejs";

// * Image Imports
import Bitmap from "../assets/Bitmap.svg";
import ImageThree from "../assets/imageThree.svg";
import GroupedImages from "../assets/groupImages.svg";
import Star from "../assets/star.svg";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//** Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import ButtonStyled from "@/@core/component/mui/buttonStyled";
import StyledImage from "@/@core/component/mui/image";

// * MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { jobSearchSchema } from "@/@core/formSchema";

interface Defaults {
  title?: string;
  location?: string;
}

const defaultValues: Defaults = {
  title: "",
  location: "",
};

const popularSearches = [
  "Designer",
  "Programming",
  "Digital Marketing", 
  "Animation", 
  "Videography"
];

const TalentHero = () => {
  const starRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);

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
    // Rotating star animation
    anime({
      targets: starRef.current,
      rotate: 360,
      duration: 5000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });

    // Floating avatar animation
    anime({
      targets: avatarRef.current,
      translateY: 15,
      duration: 2500,
      easing: "easeInOutQuad",
      direction: "alternate",
      loop: true,
    });

    // Add gear rotation if you have a gear element
    if (gearRef.current) {
      anime({
        targets: gearRef.current,
        rotate: 180,
        duration: 8000,
        loop: true,
        easing: "linear"
      });
    }
  }, []);

  const onSubmit = (data: Defaults) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: "90dvh", md: "100dvh" },
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.primary.light,
            0.2
          )}, ${alpha(theme.palette.primary.main, 0.6)})`,
        textAlign: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${Bitmap.src})`,
          opacity: 0.6,
          backgroundSize: "cover",
        }}
      />
      
      {/* Animated elements in background */}
      <Box 
        ref={gearRef}
        sx={{
          position: "absolute",
          top: "15%",
          right: "10%",
          opacity: 0.4,
          display: { xs: "none", md: "block" }
        }}
      >
        <StyledImage src={Star.src} alt="Decorative element" width={60} height={60} />
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          px: { xs: 2, sm: 4, md: 6 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 4, md: 2 },
          mb: { xs: 10, sm: 16, md: 6 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Content Section */}
        <Box 
          sx={{ 
            flex: "1 1 50%", 
            textAlign: { xs: "center", md: "left" },
            pb: { xs: 4, md: 0 },
          }}
        >
          <Typography
            variant="h1"
            sx={{ 
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" }, 
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 3,
              color: "#111827",
              textShadow: "0px 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            Elevate Your Career Journey
          </Typography>
          
          <Typography 
            sx={{ 
              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.4rem" },
              lineHeight: 1.5,
              mb: 4,
              color: "#374151",
              maxWidth: "540px",
              mx: { xs: "auto", md: 0 }
            }}
          >
            Connect with top employers and unlock new levels of professional growth in the most sought-after industries.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: { xs: "center", md: "flex-start" },
              mb: { xs: 2, md: 0 }
            }}
          >
            {/* <Link href="/sign-up" passHref>
            <ButtonStyled
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                background: "#A20514",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 14px rgba(162, 5, 20, 0.25)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#870411",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(162, 5, 20, 0.35)",
                }
              }}
            >
              Get started
              <Icon icon="material-symbols-light:arrow-right-alt-rounded" fontSize={24} />
            </ButtonStyled>
            </Link> */}
            
            {/* <ButtonStyled
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1rem",
                borderWidth: "2px",
                display: { xs: "none", sm: "flex" },
                "&:hover": {
                  borderWidth: "2px",
                  background: "rgba(255,255,255,0.1)",
                }
              }}
            >
              View Latest Jobs
            </ButtonStyled> */}
          </Box>
        </Box>

        {/* Image Section */}
        <Box
          sx={{
            flex: "1 1 40%",
            position: "relative",
            height: { xs: "280px", sm: "340px", md: "400px" },
            display: { xs: "none", sm: "block" },
          }}
        >
          <Box
            ref={avatarRef}
            sx={{
              position: "absolute",
              top: "0%",
              left: "10%",
              zIndex: 2,
            }}
          >
            <StyledImage 
              src={GroupedImages.src} 
              alt="Team members" 
              sx={{ 
                filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.15))",
                maxWidth: "100%",
                height: "auto"
              }} 
            />
          </Box>

          <Box
            ref={starRef}
            sx={{
              position: "absolute",
              top: "15%",
              right: "15%",
              zIndex: 1,
            }}
          >
            <StyledImage 
              src={Star.src} 
              alt="Star graphic" 
              sx={{ 
                maxWidth: "60px",
                height: "auto"
              }} 
            />
          </Box>
          
          <Box
            sx={{
              position: "absolute",
              right: "5%",
              bottom: "5%",
              zIndex: 1,
            }}
          >
            <StyledImage 
              src={ImageThree.src} 
              alt="Illustration" 
              sx={{ 
                filter: "drop-shadow(0px 12px 24px rgba(0,0,0,0.2))",
                maxWidth: "100%",
                height: "auto"
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* Search Card */}
      {/* <Card
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "absolute",
          bottom: { xs: "-80px", sm: "-60px" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "92%", sm: "85%", md: "80%", lg: "75%" },
          maxWidth: "1200px",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          overflow: "visible",
          p: 0,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            "&:last-child": { pb: { xs: 2, sm: 3 } }
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
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
                    placeholder="Job Title, Skills or Company"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            color: (theme) => theme.palette.primary.main,
                            mr: 1
                          }}
                        >
                          <Icon icon="lets-icons:search-duotone" fontSize={24} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        height: "56px",
                        backgroundColor: "#F9FAFB",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                          transition: "all 0.2s ease",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.light,
                        },
                        "&.Mui-focused fieldset": {
                          borderWidth: "1px",
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Controller
                name="location"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    size="medium"
                    placeholder="Location or Remote"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            color: (theme) => theme.palette.primary.main,
                            mr: 1
                          }}
                        >
                          <Icon icon="hugeicons:location-04" fontSize={24} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        height: "56px",
                        backgroundColor: "#F9FAFB",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                          transition: "all 0.2s ease",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) => theme.palette.primary.light,
                        },
                        "&.Mui-focused fieldset": {
                          borderWidth: "1px",
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <ButtonStyled
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: "56px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: (theme) => theme.palette.primary.main,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  }
                }}
              >
                Search
                <Icon icon="lets-icons:search-duotone" fontSize={20} />
              </ButtonStyled>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: (theme) => theme.palette.primary.main,
                  }}
                >
                  Popular:
                </Typography>
                
                {popularSearches.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    size="small"
                    variant="outlined"
                    onClick={() => console.log(`Search for ${item}`)}
                    sx={{
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: (theme) => alpha(theme.palette.primary.light, 0.1),
                        borderColor: (theme) => theme.palette.primary.main,
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}
    </Box>
  );
};

export default TalentHero;