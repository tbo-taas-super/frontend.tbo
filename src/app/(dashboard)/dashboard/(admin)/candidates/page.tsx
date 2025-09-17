"use client";
import React, { useEffect } from "react";
import CandidateTabs from "./CandidateTabs";

type ApplicationProps = {
  params: {
    applicationId: string;
  };
};

const ApplicationHome = ({ params }: ApplicationProps) => {
  const { applicationId } = params;

  return <CandidateTabs tab="all" />;
};

export default ApplicationHome;
