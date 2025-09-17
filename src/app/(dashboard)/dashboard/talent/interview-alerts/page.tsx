'use client';

import { Box, Stack, Typography } from '@mui/material';
import InterviewAlertsTable from './components/table';
import JobApplicationsPanel from './panel';
import PaginationControl from '../applications/components/pagination-control';
import { useState } from 'react';

export default function TalentProfilePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main>
      <Stack flexGrow={1} gap={1}>
        <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '20px' }}>
          Interviews
        </Typography>
        <Typography sx={{ fontSize: '13px', mb: '14px' }}>
          See interview schedules you have
        </Typography>
      </Stack>
      <Stack gap={2}>
        <JobApplicationsPanel searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Stack gap={2}>
          <PaginationControl />
          <InterviewAlertsTable searchQuery={searchQuery} />
        </Stack>
      </Stack>
    </main>
  );
}