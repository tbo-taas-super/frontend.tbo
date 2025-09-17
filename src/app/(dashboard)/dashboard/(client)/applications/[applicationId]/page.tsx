"use client";
import React, { useEffect } from "react";
import ApplicationTabs from "./ApplicationTabs";

type ApplicationProps = {
  params: {
    applicationId: string;
  };
};

// import { useAppDispatch } from '../../../hooks'

const ApplicationHome = ({ params }: ApplicationProps) => {
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(fetchDepartments())

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  const { applicationId } = params;

  return <ApplicationTabs tab="all" applicationId={applicationId} />;
};

export default ApplicationHome;
