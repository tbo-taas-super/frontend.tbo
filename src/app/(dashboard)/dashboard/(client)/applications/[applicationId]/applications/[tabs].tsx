import ApplicationsHome from "../ApplicationTabs";

type ApplicationProps = {
  tab: string;
  applicationId: string;
};

const ApplicationPages = ({ tab, applicationId }: ApplicationProps) => {
  return <ApplicationsHome tab={tab} applicationId={applicationId} />;
};

export default ApplicationPages;
