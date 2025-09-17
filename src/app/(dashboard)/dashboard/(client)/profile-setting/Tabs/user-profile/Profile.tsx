import React, { useEffect, useState, useRef } from 'react';
import { getCurrentUser, updateUser, uploadFile } from '@/@core/services/user';
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  Button,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Edit, Save, Cancel, DeleteOutlineOutlined } from '@mui/icons-material';
import CustomTextField from '@/@core/component/mui/text-field';
import { SelectChangeEvent } from '@mui/material/Select';
import { countryCodes } from '@/@core/utils/data'; // Imported countryCodes

interface CompanyFormData {
  company_logo?: File | string;
  company_name: string;
  company_email_address: string;
  industry: string;
  number_of_employees: string;
  type_of_employer: string;
  company_address: string;
  company_website: string;
  country: string;
  contact_person: string;
  work_email: string;
  position_in_company: string;
  country_code: string;
  phone_number: string;
}

const ClientProfile = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    company_logo: '',
    company_name: '',
    company_email_address: '',
    country_code: '+234',
    phone_number: '',
    industry: '',
    number_of_employees: '',
    type_of_employer: '',
    company_address: '',
    company_website: '',
    country: '',
    contact_person: '',
    work_email: '',
    position_in_company: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        const user = response?.user;
        if (user) {
          setUserId(user.id);
          const phoneParts = user.company_phone_number
            ? user.company_phone_number.match(/^(\+\d{1,3})(\d+)$/) || ['', '+234', '']
            : ['', '+234', ''];
          setFormData({
            company_logo: user.company_logo || '',
            company_name: user.company_name || '',
            company_email_address: user.company_email_address || '',
            country_code: phoneParts[1] || '+234',
            phone_number: phoneParts[2] || '',
            industry: user.industry || '',
            number_of_employees: user.number_of_employees || '',
            type_of_employer: user.type_of_employer || '',
            company_address: user.company_address || '',
            company_website: user.company_website || '',
            country: user.country || '',
            contact_person: user.name || user.contact_person || '',
            work_email: user.email || user.work_email || '',
            position_in_company: user.position_in_company || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as HTMLInputElement | { name?: string; value: unknown };
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setTempImageUrl(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('file', file);
      setIsSavingImage(true);
      try {
        const uploaded = await uploadFile(formData);
        if (uploaded?.url) {
          setFormData((prev) => ({
            ...prev,
            company_logo: uploaded.url,
          }));
          setSuccess('Logo uploaded successfully!');
        } else {
          throw new Error('Invalid upload response');
        }
      } catch (err) {
        console.error('Logo upload failed:', err);
        setError('Failed to upload logo.');
      } finally {
        setIsSavingImage(false);
      }
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.company_logo) {
      errors.push('Company logo is required.');
    }
    if (!formData.company_name.trim()) {
      errors.push('Company name is required.');
    }
    if (!formData.company_email_address.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email_address)) {
      errors.push('A valid company email address is required.');
    }
    if (!formData.country_code) {
      errors.push('Country code is required for the phone number.');
    }
    if (!formData.phone_number.trim() || !/^\d{7,15}$/.test(formData.phone_number)) {
      errors.push('Phone number must be 7-15 digits long.');
    }
    if (!formData.industry) {
      errors.push('Industry selection is required.');
    }
    if (!formData.number_of_employees) {
      errors.push('Number of employees is required.');
    }
    if (!formData.type_of_employer) {
      errors.push('Type of employer is required.');
    }
    if (!formData.company_address.trim()) {
      errors.push('Company address is required.');
    }
    if (formData.company_website && !/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(formData.company_website)) {
      errors.push('Please enter a valid domain name (e.g., company.com).');
    }
    if (!formData.country.trim()) {
      errors.push('Country is required.');
    }
    if (!formData.position_in_company.trim()) {
      errors.push('Position in company is required.');
    }

    return errors;
  };

  const handleSaveClick = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }
    setOpenConfirmDialog(true);
  };

  const saveCompanyInfo = async () => {
    if (!userId) {
      setError('User ID is missing.');
      setOpenConfirmDialog(false);
      return;
    }

    try {
      const fullPhoneNumber = `${formData.country_code}${formData.phone_number}`;
      const updatedFormData = {
        ...formData,
        company_phone_number: fullPhoneNumber,
      };
      await updateUser(userId, updatedFormData);
      setIsEditing(false);
      setSuccess('Company information updated successfully!');
      setOpenConfirmDialog(false);
    } catch (err) {
      console.error('Failed to update company info:', err);
      setError('Failed to update profile. Please try again.');
      setOpenConfirmDialog(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempImageUrl(null);
    setImageFile(null);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={2.5}>
          <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>
            Company Logo
          </Typography>
          <Typography sx={{ fontSize: '13px', mb: 2 }}>
            This is displayed on your profile
          </Typography>
          <Box sx={{
            border: '1px dashed #D0D5DD',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            p: 4,
          }}>
            <Avatar
              src={tempImageUrl || (formData.company_logo ? String(formData.company_logo) : undefined)}
              sx={{ width: 70, height: 70, mb: 2 }}
              alt="Company Logo"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handleImageChange}
                disabled={!isEditing}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isEditing}
                sx={{ textTransform: 'none' }}
              >
                Upload
              </Button>
            </Box>
            {imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Selected: {imageFile.name}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={9.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography
                sx={{ fontWeight: 600, color: '#39353D', fontSize: { xs: '1rem', sm: '1.2rem' } }}
              >
                Company Information
              </Typography>
              <Typography sx={{ fontSize: '13px' }}>
                Details about the company
              </Typography>
            </Box>
            {!isEditing ? (
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <Edit />
              </IconButton>
            ) : (
              <Box>
                <IconButton onClick={handleCancelEdit} color="error" sx={{ mr: 1 }}>
                  <Cancel />
                </IconButton>
                <IconButton onClick={handleSaveClick} color="primary">
                  <Save />
                </IconButton>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Company Name
              </Typography>
              <CustomTextField
                fullWidth
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                size="medium"
                placeholder="ABC Holdings..."
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Company Email Address
              </Typography>
              <CustomTextField
                fullWidth
                name="company_email_address"
                value={formData.company_email_address}
                onChange={handleChange}
                size="medium"
                placeholder="abc@gmail.com"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Industry
              </Typography>
              <CustomTextField
                fullWidth
                select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                size="medium"
                placeholder="Agriculture, Technology..."
                disabled={!isEditing}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { style: { maxHeight: 200 } },
                    disableScrollLock: true,
                  },
                }}
              >
                <MenuItem value="consultancy">Consultancy</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="travel">Travel</MenuItem>
                <MenuItem value="logistic">Logistic</MenuItem>
                <MenuItem value="education">Education</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Number of employees
              </Typography>
              <CustomTextField
                fullWidth
                select
                name="number_of_employees"
                value={formData.number_of_employees}
                onChange={handleChange}
                size="medium"
                placeholder="10-50, 50-100..."
                disabled={!isEditing}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { style: { maxHeight: 200 } },
                    disableScrollLock: true,
                  },
                }}
              >
                <MenuItem value="10-50">10-50</MenuItem>
                <MenuItem value="50-100">50-100</MenuItem>
                <MenuItem value="100-200">100-200</MenuItem>
                <MenuItem value="200+">200+</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Type of employer
              </Typography>
              <CustomTextField
                fullWidth
                select
                name="type_of_employer"
                value={formData.type_of_employer}
                onChange={handleChange}
                size="medium"
                placeholder="Private, Public..."
                disabled={!isEditing}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { style: { maxHeight: 200 } },
                    disableScrollLock: true,
                  },
                }}
              >
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="government">Government</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Company address
              </Typography>
              <CustomTextField
                fullWidth
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                size="medium"
                placeholder="124, Houston Street"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Website
              </Typography>
              <CustomTextField
                fullWidth
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                size="medium"
                placeholder="company.com"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Country
              </Typography>
              <CustomTextField
                fullWidth
                name="country"
                value={formData.country}
                onChange={handleChange}
                size="medium"
                placeholder="Nigeria"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Contact Person
              </Typography>
              <CustomTextField
                fullWidth
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                size="medium"
                placeholder="Jane Doe"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Work Email
              </Typography>
              <CustomTextField
                fullWidth
                name="work_email"
                value={formData.work_email}
                onChange={handleChange}
                size="medium"
                placeholder="jane.doe@company.com"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Position
              </Typography>
              <CustomTextField
                fullWidth
                name="position_in_company"
                value={formData.position_in_company}
                onChange={handleChange}
                size="medium"
                placeholder="HR Manager"
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>
                Company Phone Number
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="country-code-label">Country Code</InputLabel>
                  <Select
                    labelId="country-code-label"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    disabled={!isEditing}
                    label="Country Code"
                  >
                    {countryCodes.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        {`${option.code} (${option.country})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <CustomTextField
                  fullWidth
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  size="medium"
                  placeholder="1234567890"
                  disabled={!isEditing}
                />
              </Box>
            </Grid>
          </Grid>

          {isEditing && (
            <>
              <Divider sx={{ my: 4 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSaveClick}
                  disabled={isSavingImage}
                  sx={{
                    width: { xs: 'fit-content', md: '30%' },
                    textTransform: 'capitalize',
                  }}
                  startIcon={<Save />}
                >
                  Save Changes
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to save the changes to your company profile?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={saveCompanyInfo} autoFocus variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientProfile;