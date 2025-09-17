import { AddCard, Badge, Person,Videocam,WorkspacePremiumSharp,SupervisedUserCircle } from "@mui/icons-material";

export const profileTabs = [
  {
    icon: <Person />,
    name: "Personal Information",
  },
  {
    icon: <Videocam />,
    name: "Video Introduction",
  },
  {
    icon: <AddCard />,
    name: "Resume and Cover Letter",
  },
  {
    icon: <WorkspacePremiumSharp />,
    name: "Project work / Portfolio",
  },
    {
    icon: <SupervisedUserCircle />,
    name: "Profile Display",
  },
  {
    icon: <Badge />,
    name: "Password Management",
  },
  // {
  //   icon: <Badge />,
  //   name: "Account Settings",
  // },
];

export default profileTabs;
