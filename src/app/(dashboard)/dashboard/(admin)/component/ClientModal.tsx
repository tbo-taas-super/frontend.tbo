'use client';

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ClientData, editClient } from '@/@core/services/ClientService';
import CloseIcon from '@mui/icons-material/Close';

// Define dropdown options to match client side
const industryOptions = ['consultancy', 'technology', 'travel', 'logistic', 'education'];
const employeeOptions = ['1-10', '10-50', '50-100', '100-500', '500+'];
const employerOptions = ['private', 'public', 'government', 'other'];
const countryCodes = [{ code: '+234', label: '+234 (Nigeria)' }];
interface ModalProps {
  open: boolean;
  onClose: () => void;
  client: ClientData | null;
  onClientUpdate?: (updatedClient: ClientData) => void;
}

const ClientModal: React.FC<ModalProps> = ({ open, onClose, client, onClientUpdate }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'account'>('company');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientData>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  if (!client) return null;

  // Initialize form data when entering edit mode
  const handleEdit = () => {
    setIsEditing(true);
    const phoneParts = client.company_phone_number
      ? client.company_phone_number.match(/^(\+\d{1,3})(\d+)$/) || ['', '+234', '']
      : ['', '+234', ''];
    setFormData({
      company_name: client.company_name || '',
      industry: client.industry || '',
      number_of_employees: client.number_of_employees || '',
      company_address: client.company_address || '',
      country: client.country || '',
      name: client.name || '',
      email: client.email || '',
      company_email_address: client.company_email_address || '',
      phone_number: phoneParts[2] || '',
      country_code: phoneParts[1] || '+234',
      company_phone_number: client.company_phone_number || '',
      company_website: client.company_website || '',
      type_of_employer: client.type_of_employer || '',
      position_in_company: client.position_in_company || '',
      status: client.status || '',
    });
  };

  // Validation function to match client side
const validateForm = () => {
  const errors: string[] = [];
  if (!formData.company_name?.trim()) errors.push('Company name is required.');
  if (!formData.company_email_address?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email_address)) {
    errors.push('A valid company email address is required.');
  }
  if (!formData.country_code) errors.push('Country code is required.');
  if (!formData.phone_number?.trim() || !/^\d{7,15}$/.test(formData.phone_number)) {
    errors.push('Phone number must be 7-15 digits long.');
  }
  if (!formData.industry) errors.push('Industry selection is required.');
  if (!formData.number_of_employees) errors.push('Number of employees is required.');
  if (!formData.type_of_employer) errors.push('Type of employer is required.');
  if (!formData.company_address?.trim()) errors.push('Company address is required.');
  if (!formData.country?.trim()) errors.push('Country is required.');
  if (!formData.position_in_company?.trim()) errors.push('Position in company is required.');
  return errors;
};

  const handleSave = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSnackbar({
        open: true,
        message: validationErrors.join(' '),
        severity: 'error',
      });
      return;
    }
    setOpenConfirmDialog(true);
  };

  const confirmSave = async () => {
    try {
      setIsLoading(true);
      const updatedFormData = {
        ...formData,
        company_phone_number: `${formData.country_code}${formData.phone_number}`,
      };
      const updatedClient = await editClient(client.id, updatedFormData);
      setSnackbar({
        open: true,
        message: 'Client updated successfully',
        severity: 'success',
      });
      if (onClientUpdate) {
        onClientUpdate(updatedClient);
      }
      setIsEditing(false);
      setTimeout(onClose, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to update client',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

const handleInputChange = (field: keyof ClientData, value: string | number) => {
  setFormData((prev) => ({ ...prev, [field]: String(value) }));
};

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'company' | 'contact' | 'account') => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(newValue);
      setIsLoading(false);
    }, 300);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const renderField = (value: string | number | undefined | null) => {
    return value ? value.toString() : 'Not Available';
  };

  const renderEditableField = (label: string, field: keyof ClientData, value: string | undefined | null) => {
    return isEditing ? (
      <TextField
        label={label}
        value={formData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        disabled={isLoading}
      />
    ) : (
      <>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
          {renderField(value)}
        </Typography>
      </>
    );
  };

  const renderEditableSelect = (label: string, field: keyof ClientData, value: string | undefined | null, options: string[]) => {
  return isEditing ? (
    <FormControl fullWidth size="small" sx={{ mb: 2 }} disabled={isLoading}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={formData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
        {renderField(value)}
      </Typography>
    </>
  );
};

  const renderPhoneNumberField = () => {
    return isEditing ? (
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }} size="small" disabled={isLoading}>
          <InputLabel>Country Code</InputLabel>
          <Select
            label="Country Code"
            value={formData.country_code || '+234'}
            onChange={(e) => handleInputChange('country_code', e.target.value)}
          >
            {countryCodes.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Phone Number"
          value={formData.phone_number || ''}
          onChange={(e) => handleInputChange('phone_number', e.target.value)}
          fullWidth
          size="small"
          disabled={isLoading}
        />
      </Box>
    ) : (
      <>
        <Typography variant="subtitle2" color="text.secondary">
          Phone Number
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
          {renderField(client.company_phone_number)}
        </Typography>
      </>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="client-modal-title"
      aria-describedby="client-modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '90%', sm: 600, md: 700 },
          maxWidth: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 3 },
          outline: 'none',
          maxHeight: '90vh',
          overflowY: 'auto',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
         
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="client information tabs"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              '&:hover': { bgcolor: 'action.hover' },
            },
            '& .Mui-selected': { color: 'primary.main', fontWeight: 'bold' },
          }}
        >
          
          <Tab label="Company Info" value="company" />
          <Tab label="Contact Info" value="contact" />
          <Tab label="Account Details" value="account" />
        </Tabs>

        {/* Content */}
        <Box sx={{ minHeight: 200, position: 'relative', mb: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Grid container spacing={2} id="client-modal-description">
              {activeTab === 'company' && (
                <>
                 <Grid item xs={12}>
                    {renderEditableField('Company Name', 'company_name', client.company_name)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableSelect('Industry', 'industry', client.industry, industryOptions)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableSelect('Employees', 'number_of_employees', client.number_of_employees, employeeOptions)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableField('Address', 'company_address', client.company_address)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableField('Country', 'country', client.country)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderPhoneNumberField()}
                  </Grid>
                </>
              )}
              {activeTab === 'contact' && (
                <>
                  <Grid item xs={12}>
                    {renderEditableField('Contact Person', 'name', client.name)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableField('Work Email', 'email', client.email)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableField('Company Email', 'company_email_address', client.company_email_address)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableField('Phone Number', 'phone_number', client.phone_number)}
                  </Grid>
                <Grid item xs={12}>
                  {isEditing ? (
                    <TextField
                      label="Website"
                      value={formData.company_website || client.company_website || ''}
                      onChange={(e) => handleInputChange('company_website', e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                      disabled={isLoading}
                    
                    />
                  ) : (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">
                        Website
                      </Typography>
                      <Typography
                        component="a"
                        href={client.company_website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: client.company_website ? 'primary.main' : 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: client.company_website ? 'underline' : 'none' },
                          mb: 2,
                        }}
                      >
                        {renderField(client.company_website)}
                      </Typography>
                    </>
                  )}
                </Grid>
                </>
              )}
              {activeTab === 'account' && (
                <>
                  <Grid item xs={12}>
                    {renderEditableSelect('Type of Employer', 'type_of_employer', client.type_of_employer, employerOptions)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderEditableField('Position in Company', 'position_in_company', client.position_in_company)}
                  </Grid>
                
                </>
              )}
            </Grid>
          )}
        </Box>

        {/* Divider */}
        <Divider sx={{ mb: 3 }} />

        {/* Footer Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isLoading}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isLoading}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={handleEdit}
                disabled={isLoading}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Edit
              </Button>
              <Button
                onClick={onClose}
                variant="outlined"
                disabled={isLoading}
                sx={{ textTransform: 'none', fontWeight: 'medium' }}
              >
                Close
              </Button>
            </>
          )}
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">Confirm Save</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              Are you sure you want to save the changes to the client profile?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
            <Button onClick={confirmSave} autoFocus variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Success/Error Messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default ClientModal;