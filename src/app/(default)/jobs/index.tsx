// ** React Imports
import React from "react";

// ** Component Imports
import JobOffers from "./JobOffers";
import JobCategories from "../component/JobCategories";
import FeaturedJobs from "./FeaturedJobs";
import Careers from "./Careers";
import TalentHero from "./TalentHero";

const Clients: React.FC = () => {
  return (
    <>
      <TalentHero />
      {/* <JobOffers /> */}
     
      <FeaturedJobs />
      {/* <JobCategories /> */}
      {/* <Careers /> */}
    </>
  );
};

export default Clients;
