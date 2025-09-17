'use client';
import { Stack, Typography, TextField } from '@mui/material';
import JobApplicationsTable from './components/table';
import JobApplicationsPanel from './components/panel';
import PaginationControl from './components/pagination-control';
import { useState } from 'react';
import ConfirmationModal from '@/@core/utils/modals/confirmation';

export default function TalentApplicationsPage() {
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  const handleWithdrawSuccess = () => {
    console.log('Withdrawal successful, refreshing data...');
    // Example: queryClient.invalidateQueries('jobApplications');
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <main>
      <Stack flexGrow={1} gap={1}>
        <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '20px' }}>
          Job Applications
        </Typography>
        <Typography sx={{ fontSize: '13px', mb: '14px' }}>
          See jobs past jobs you have applied for
        </Typography>
        {error && (
          <Typography color="error" sx={{ fontSize: '13px' }}>
            {error}
          </Typography>
        )}
      </Stack>
      <Stack gap={2}>
        {/* Search Input */}
        {/* <TextField
          label="Search Applications"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by job title, company, or status..."
          sx={{ mb: 2 }}
        /> */}
        {/* Pass searchQuery and setSearchQuery to JobApplicationsPanel */}
        <JobApplicationsPanel searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Stack gap={1}>
          <PaginationControl />
          {/* Pass searchQuery to JobApplicationsTable for filtering */}
          <JobApplicationsTable
            searchQuery={searchQuery}
            setOpenWithdrawModal={(jobId?: number) => {
              console.log('Selected job ID:', jobId);
              if (jobId !== undefined) {
                setSelectedJobId(jobId);
              }
              setOpenWithdrawModal(true);
            }}
          />
        </Stack>
      </Stack>
      <ConfirmationModal
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application? \n \n The Job will be deleted from your list and a notification would be sent to the Job Poster`}
        buttonOneText="No, Cancel"
        buttonTwoText="Yes, Continue"
        jobId={selectedJobId ?? undefined}
        onWithdrawSuccess={handleWithdrawSuccess}
        open={openWithdrawModal}
        closeFn={() => {
          setOpenWithdrawModal(false);
          setSelectedJobId(null);
          setError(null);
        }}
      />
      <ConfirmationModal
        open={openDeleteModal}
        closeFn={() => setOpenDeleteModal(false)}
        title="Delete Application"
        message="Are you sure you want to delete your application? Your record will be deleted from the job poster database, and will no longer have access to your record"
        buttonOneText="Cancel"
        buttonTwoText="Yes, Continue"
        buttonOneClick={() => setOpenDeleteModal(false)}
        buttonTwoClick={() => {
          console.log('Delete action triggered');
        }}
      />
    </main>
  );
}