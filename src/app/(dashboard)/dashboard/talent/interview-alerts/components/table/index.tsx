import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import InterviewDetailsModal from '@/app/(dashboard)/dashboard/talent/interview-alerts/components/modal/InterviewDetailsModal';
import { getInterviews, getApplicationById } from '@/@core/services/jobVanciesService'; // Adjust path as needed
interface Interview {
  image: string;
  name: string;
  jobTitle: string;
  role: string;
  interviewStage: 'Upcoming' | 'In Progress' | 'Completed';
  date: string;
  time: string;
  location: string;
  address : string; // Optional address field
  application_id: number;
}

// Define props interface for InterviewAlertsTable
interface InterviewAlertsTableProps {
  searchQuery: string;
}

const InterviewAlertsTable: React.FC<InterviewAlertsTableProps> = ({ searchQuery }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = (interview: Interview) => {
    setSelectedInterview(interview);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInterview(null);
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getInterviews();

        // Map through interviews and fetch job title for each
        const mapped = await Promise.all(
          data.map(async (item) => {
            let jobTitle = 'N/A';
            try {
              const application = await getApplicationById(item.application_id.toString());
              jobTitle = application.job?.title || 'N/A';
            } catch (err) {
              console.error(`Failed to fetch job title for application_id ${item.application_id}:`, err);
            }

            return {
              application_id: item.application_id,
              name: item.interviewer_name || 'Unknown',
              jobTitle,
              role: item.interviewer_role || 'N/A', // Use interviewer_role instead of interview_location
              interviewStage:
                item.status === 'scheduled'
                  ? 'Upcoming'
                  : item.status === 'ongoing'
                  ? 'In Progress'
                  : 'Completed',
              date: new Date(item.interview_date).toLocaleDateString(),
              time: item.interview_time,
              location: item.interview_location,
              address: item.address, // Map address directly
              image: '',
            };
          })
        ) as Interview[];

        setInterviews(mapped);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch interviews');
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Filter interviews based on searchQuery
  const filteredInterviews = interviews.filter((interview) =>
    [interview.name, interview.jobTitle, interview.location, interview.address || '']
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const headerFields: string[] = ['Company Name', 'Job Title', 'Location', 'Address', 'Interview Stage', 'Action'];

  const companyNameField = (image: string, name: string) => (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ marginRight: '12px' }}>
          <Box
            sx={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              borderRadius: '20%',
              width: '30px',
              height: '30px',
              backgroundColor: '#E7E7E7',
            }}
          />
        </Box>
        <Typography sx={{ fontWeight: '600', color: '#101828', fontSize: '14px' }}>
          {name}
        </Typography>
      </Box>
    </TableCell>
  );

  const textOnlyField = (data: string | undefined) => (
    <TableCell>
      <Typography sx={{ fontSize: '14px' }}>{data || 'N/A'}</Typography>
    </TableCell>
  );

  const interviewStageField = (stage: 'Upcoming' | 'In Progress' | 'Completed') => (
    <TableCell>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 'bold',
          color:
            stage === 'Upcoming'
              ? 'blue'
              : stage === 'In Progress'
              ? 'orange'
              : 'green',
        }}
      >
        {stage}
      </Typography>
    </TableCell>
  );

  const buttonsField = (row: Interview) => (
    <TableCell>
      <Button
        variant="contained"
        sx={{ textTransform: 'none' }}
        onClick={() => handleOpen(row)}
      >
        View
      </Button>
    </TableCell>
  );

  return (
    <>
      <TableContainer sx={{ backgroundColor: 'white', padding: '20px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ padding: '20px' }}>
            {error}
          </Typography>
        ) : filteredInterviews.length === 0 ? (
          <Typography sx={{ padding: '20px' }}>
            No interviews match your search.
          </Typography>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                {headerFields.map((field, index) => (
                  <TableCell key={index}>{field}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInterviews.map((row, index) => (
                <TableRow key={index}>
                  {companyNameField(row.image, row.name)}
                  {textOnlyField(row.jobTitle)}
                  {textOnlyField(row.location)}
                  {textOnlyField(row.address)}
                  {interviewStageField(row.interviewStage)}
                  {buttonsField(row)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <InterviewDetailsModal open={open} onClose={handleClose} interview={selectedInterview} />
    </>
  );
};

export default InterviewAlertsTable;