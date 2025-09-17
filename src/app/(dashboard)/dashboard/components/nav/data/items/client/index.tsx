import {
  Message,
  CasesOutlined,
  Dashboard,
  Person,
  Settings,
  SupportAgent,
  DocumentScanner,
  VerifiedUser
} from "@mui/icons-material";

export const clientNavItemsData = [
  {
    icon: <Dashboard />,
    name: "Dashboard",
    path: "/dashboard/client",
  },
  {
    icon: <Person />,
    name: "Profile",
    path: "/dashboard/profile-setting",
  },
  {
          icon: <Message />,
          name: 'Inbox',
          path: '/dashboard/hire',
  },
  {
    icon: <CasesOutlined />,
    name: "Job List",
    path: "/dashboard/applications",
  },
  {
    icon: <VerifiedUser />,
    name: "Talent Pool",
    path: "/dashboard/pool",
  },
  {
    icon: <DocumentScanner />,
    name: "Applications",
    path: "/dashboard/applications-list",
  },
 
 
];
