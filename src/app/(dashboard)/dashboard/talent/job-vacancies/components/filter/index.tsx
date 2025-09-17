import { Box, Checkbox, Typography } from '@mui/material';
import { useState } from 'react';

interface JobFilterProps {
  title: string;
  options?: { label: string; checkState: boolean }[];
  onFilterChange: (selectedOptions: string[]) => void; // Callback to notify parent
}

const JobFilter: React.FC<JobFilterProps> = ({ title, options, onFilterChange }) => {
  // Initialize state with the first checked option or empty array
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    options?.filter((opt) => opt.checkState).map((opt) => opt.label).slice(0, 1) || []
  );

  // Handle checkbox change to allow only one selection
  const handleCheckboxChange = (label: string, checked: boolean) => {
    const updatedOptions = checked ? [label] : [];
    setSelectedOptions(updatedOptions);
    onFilterChange(updatedOptions); // Notify parent
  };

  // Handle clear button
  const handleClear = () => {
    setSelectedOptions([]);
    onFilterChange([]); // Notify parent
  };

  return (
    <Box sx={{ backgroundColor: 'white', padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: '12px', gap: 2, mb: 2 }}>
        <Typography sx={{ flexGrow: 1, fontWeight: 600 }}>{title}</Typography>
        <Typography
          sx={{ color: '#E61C31', cursor: 'pointer' }}
          onClick={handleClear}
        >
          {options ? 'Clear' : 'Clear All'}
        </Typography>
      </Box>
      {options?.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', px: '12px' }}>
          <Checkbox
            checked={selectedOptions.includes(option.label)}
            onChange={(e) => handleCheckboxChange(option.label, e.target.checked)}
          />
          <Typography>{option.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default JobFilter;