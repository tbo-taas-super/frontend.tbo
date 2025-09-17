import { TextOnlyPill } from '@/@core/utils/pills';
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getAppliedJobs } from '@/@core/services/jobVanciesService';
import { AppliedJob } from '@/@core/services/types/job';

interface JobApplicationsTableProps {
  searchQuery: string;
  setOpenWithdrawModal: (jobId?: number) => void;
}

const JobApplicationsTable: React.FC<JobApplicationsTableProps> = ({ searchQuery, setOpenWithdrawModal }) => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const jobs = await getAppliedJobs();
        setAppliedJobs(jobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load applied jobs.');
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Filter jobs based on searchQuery
  const filteredJobs = appliedJobs.filter((job) =>
    job.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.job.client.company_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerFields = [
    // 'Company Name',
    'Role Applied For',
    'Date of Application',
    'Application Status',
    // 'Action',
  ];

  const companyNameField = (name: string) => (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: '600', color: '#101828', fontSize: '14px' }}>
          {name}
        </Typography>
      </Box>
    </TableCell>
  );

  const textOnlyField = (data: string) => (
    <TableCell>
      <Typography sx={{ fontSize: '14px' }}>{data}</Typography>
    </TableCell>
  );

  const applicationStatusField = (status: string) => {
    // Define status mappings for variant and display text
    const statusConfig: Record<string, { variant: 'grey' | 'warning' | 'success' | 'error' | 'info'; text: string }> = {
      PENDING: { variant: 'grey', text: 'Awaiting Feedback' },
      SCHEDULED: { variant: 'warning', text: 'Interview Scheduled' },
      INTERVIEWED: { variant: 'success', text: 'Interview Completed' },
      REJECTED: { variant: 'error', text: 'Application Rejected' },
      SHORTLISTED: { variant: 'warning', text: 'Shortlisted' },
      HIRED: { variant: 'success', text: 'Hired' },
    };

    // Get the configuration for the current status, default to PENDING if status is unknown
    const { variant, text } = statusConfig[status.toUpperCase()] || statusConfig.PENDING;

    return (
      <TableCell>
        <TextOnlyPill variant={variant} text={text} />
      </TableCell>
    );
  };

  const viewButtonField = (jobId: number) => (
    <TableCell>
      {/* <Button
        onClick={() => setOpenWithdrawModal(jobId)}
        variant="contained"
        sx={{ textTransform: 'none' }}
      >
        Withdraw Application
      </Button> */}
    </TableCell>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!filteredJobs.length) return <Typography>No applied jobs found.</Typography>;

  return (
    <TableContainer sx={{ backgroundColor: 'white', padding: '20px' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
            {headerFields.map((field, index) => (
              <TableCell key={index}>{field}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              {/* {companyNameField(job.job.client.company_name ?? 'Unknown')} */}
              {textOnlyField(job.job.title)}
              {textOnlyField(formatDate(job.created_at))}
              {applicationStatusField(job.status)}
              {viewButtonField(job.job_id)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobApplicationsTable;