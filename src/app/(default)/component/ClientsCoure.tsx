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

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//** Custom Component Imports
import CustomTextField from "@/@core/component/mui/text-field";
import ButtonStyled from "@/@core/component/mui/buttonStyled";
import StyledImage from "@/@core/component/mui/image";
import Clients from "../company/Clients";

// * MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { alpha } from "@mui/material/styles";
import { jobSearchSchema } from "@/@core/formSchema";
export default function ClientsCoure() {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
        width: { xs: "100%", sm: "100%" },
        height: { xs: "auto", lg: "10%" },
        borderRadius: 3,
        mt: 6, // Add some top margin if needed
        mb: 6, // Add bottom margin for spacing
        boxShadow: (theme) => `${alpha(theme.palette.primary.dark, 0.4)}`,
        p: (theme) => [
          `${theme.spacing(1)} !important`,
          `${theme.spacing(3)} !important`,
        ],
      }}
    >
      <Clients />
    </Card>
  );
}

