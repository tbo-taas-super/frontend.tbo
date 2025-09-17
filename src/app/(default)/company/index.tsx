// ** React Imports
import React from "react";

// ** MUI Imports
import ClientHero from "./ClientHero";
import ClientOffers from "./ClientOffers";
import Talents from "./ViewTalent";
import JobCategories from "../component/JobCategories";
import Banner from "../component/ClientBanner";

const Clients: React.FC = () => {
  return (
    <>
      <ClientHero />
      {/* <ClientOffers /> */}
      {/* <Banner /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}>
      <Talents />
      </div>
    </>
  );
};

export default Clients;
