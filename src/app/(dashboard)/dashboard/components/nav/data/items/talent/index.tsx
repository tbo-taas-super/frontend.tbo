import { Message, CasesOutlined, Dashboard, List, Person } from "@mui/icons-material";

export const talentNavItemsData = [
    {
        icon: <Dashboard />,
        name: 'Dashboard',
        path: '/dashboard/talent'
    },
    {
        icon: <Person />,
        name: 'Profile',
        path: '/dashboard/talent/profile'
    },
    {
        icon: <Message />,
        name: 'Inbox',
        path: '/dashboard/talent/inbox'
    },
    {
        icon: <List />,
        name: 'Opportunities',
        path: '/dashboard/talent/job-vacancies'
    },
    {
        icon: <Dashboard />,
        name: 'Applications',
        path: '/dashboard/talent/applications'
    },
    {
        icon: <CasesOutlined />,
        name: 'Interview Alerts',
        path: '/dashboard/talent/interview-alerts'
    }
   
   
    
]