import "../../globals.css";
// *React Imports
import React from "react";

// *Third-Party Imports

// *Images Imports
import MakeLess from "../../../../public/icon/1.png";
import Dorfus from "../../../../public/icon/2.png";
import Green from "../../../../public/icon/3.png";
import Askimet from "../../../../public/icon/4.png";
import Sass from "../../../../public/icon/5.png";
import Works from "../../../../public/icon/6.png";
import Works2 from "../../../../public/icon/7.png";
import Works3 from "../../../../public/icon/8.png";
import Works4 from "../../../../public/icon/9.png";

// *Custom Component Imports
import StyledImage from "@/@core/component/mui/image";

// *MUI Imports
import Box from "@mui/material/Box";

interface Image {
  image: string;
  name: string;
}

const clientsData: Image[] = [
  {
    image: MakeLess.src,
    name: "MakeLess",
  },
  {
    image: Dorfus.src,
    name: "Dorfus",
  },
  {
    image: Green.src,
    name: "Green",
  },
  {
    image: Askimet.src,
    name: "Askimet",
  },
  {
    image: Sass.src,
    name: "Sass",
  },
  {
    image: Works2.src,
    name: "Works2",
  },
  {
    image: Works3.src,
    name: "Works3",
  },
  {
    image: Works4.src,
    name: "Works4",
  },

];

const Clients: React.FC = () => {
  return (
    <Box className="marquee">
      <Box className="marquee__content">
        {clientsData.map((item, i) => {
          return (
            <Box className="marquee__item" key={i}>
              <StyledImage
                src={item.image}
                alt={`${item.name} Logo`}
                className="img"
              />
            </Box>
          );
        })}
      </Box>

      {/* Duplicate for continuity */}
      <Box className="marquee__content">
        {clientsData.map((item, i) => {
          return (
            <Box aria-hidden="true" className="marquee__item" key={i}>
              <StyledImage
                src={item.image}
                alt={`${item.name} Logo`}
                className="img"
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Clients;
