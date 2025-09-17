import React, { useEffect, useState, useRef } from 'react';
import { getCurrentUser, updateUser, uploadFile } from '@/@core/services/user';
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  Stack,
  FormControl,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Edit, DeleteOutlineOutlined, Save, Add } from '@mui/icons-material';
import { countryCodes } from '@/@core/utils/data';

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

const MyProfileTab = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [editable, setEditable] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    designation: '',
    profile_image: '',
    account_type: 'TALENT' as const,
    professional_summary: '',
    skills: [] as string[],
    education: [] as EducationEntry[],
  });
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<EducationEntry>({ degree: '', institution: '', year: '' });
  const [newSkill, setNewSkill] = useState<string>(''); // New state for skill input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        const user = response?.user;

        if (user) {
          setUserId(user.id);
          let phone = user.phone_number || '';
          let code = '+1';
          for (const country of countryCodes) {
            if (phone.startsWith(country.code)) {
              code = country.code;
              phone = phone.slice(country.code.length);
              break;
            }
          }
          setSelectedCountryCode(code);
          setFormData({
            name: user.name || '',
            email: user.email || '',
            designation: user.designation || '',
            phone_number: phone,
            profile_image: user.profile_image || '',
            account_type: user.account_type || 'TALENT',
            professional_summary: user.professional_summary || '',
            skills: user.skills || [],
            education: user.education ? JSON.parse(user.education) : [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCountryCodeChange = (e: any) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
      setNewSkill('');
    }
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEducation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation],
      }));
      setNewEducation({ degree: '', institution: '', year: '' });
    }
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploaded = await uploadFile(formData);
        if (uploaded?.url) {
          setFormData((prev) => ({
            ...prev,
            profile_image: uploaded.url,
          }));
          setTempImageUrl(null);
          setSuccess('Profile image uploaded successfully!');
          if (userId) {
            await updateUser(userId, { profile_image: uploaded.url });
          }
        } else {
          throw new Error('Invalid upload response');
        }
      } catch (err) {
        console.error('Profile image upload failed:', err);
        setError('Failed to upload profile image.');
      }
    }
  };

  const savePersonalInfo = async () => {
    if (!userId) return;
    try {
      const { profile_image, phone_number, ...personalInfo } = formData;
      const fullPhoneNumber = `${selectedCountryCode}${phone_number}`.replace(/\s/g, '');
      await updateUser(userId, {
        ...personalInfo,
        phone_number: fullPhoneNumber,
        professional_summary: formData.professional_summary,
        skills: formData.skills,
        education: JSON.stringify(formData.education), // Stringify the education array
      });
      setEditable(false);
      setSuccess('Personal information updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = async () => {
    try {
      setTempImageUrl(null);
      setFormData((prev) => ({
        ...prev,
        profile_image: '',
      }));
      if (userId) {
        await updateUser(userId, { profile_image: '' });
      }
      setSuccess('Profile image removed successfully!');
    } catch (error) {
      console.error('Failed to remove image:', error);
      setError('Failed to remove profile image.');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const nameParts = formData.name.split(' ');
  const firstName = nameParts[0] || '';
  const surname = nameParts.slice(1).join(' ') || '';

  return (
    <section>
      <Grid rowSpacing={3} columnSpacing={5} container>
        {/* Picture Section */}
        <Grid lg={2.5} item>
          <Box sx={{ width: 'fit-content' }}>
            <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>Picture</Typography>
            <Typography sx={{ fontSize: '13px', mb: '10px' }}>This is displaying on your profile</Typography>
            <Box
              sx={{
                border: '1px dashed #D0D5DD',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <Avatar src={tempImageUrl || formData.profile_image} sx={{ width: '70px', height: '70px', mb: '10px' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 2 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={triggerFileInput}>
                  Upload
                </Button>
                <IconButton onClick={removeImage}>
                  <DeleteOutlineOutlined />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Personal Info Section */}
        <Grid lg={9.5} item>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>
                Personal Information
              </Typography>
              <Typography sx={{ fontSize: '13px', mb: '10px' }}>Details about yourself</Typography>
            </Box>
            <Box>
              {editable ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditable(false)}
                    startIcon={<DeleteOutlineOutlined />}
                    sx={{
                      fontSize: '12px',
                      textTransform: 'none',
                      borderColor: '#D0D5DD',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      color: '#667085',
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={savePersonalInfo}
                    startIcon={<Save />}
                    sx={{
                      fontSize: '12px',
                      textTransform: 'none',
                      borderRadius: '8px',
                      padding: '4px 12px',
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setEditable(true)}
                  startIcon={<Edit />}
                  sx={{
                    fontSize: '12px',
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '4px 12px',
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>

          <Grid columnSpacing={4} rowSpacing={3} container>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: '5px' }}>First Name</Typography>
              <TextField
                name="firstName"
                value={firstName}
                onChange={(e) => {
                  const newName = `${e.target.value} ${surname}`.trim();
                  setFormData((prev) => ({ ...prev, name: newName }));
                }}
                placeholder="Enter First Name"
                disabled={!editable}
                fullWidth
                inputProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: '5px' }}>Surname</Typography>
              <TextField
                name="surname"
                value={surname}
                onChange={(e) => {
                  const newName = `${firstName} ${e.target.value}`.trim();
                  setFormData((prev) => ({ ...prev, name: newName }));
                }}
                placeholder="Enter Surname"
                disabled={!editable}
                fullWidth
                inputProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: '5px' }}>Email Address</Typography>
              <TextField
                name="email"
                value={formData.email}
                placeholder="Enter Email Address"
                disabled={true}
                fullWidth
                inputProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: '5px' }}>Phone Number</Typography>
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <FormControl sx={{ minWidth: 100 }} disabled={!editable}>
                  <InputLabel sx={{ fontSize: '12px' }}>Country Code</InputLabel>
                  <Select
                    value={selectedCountryCode}
                    onChange={handleCountryCodeChange}
                    label="Country Code"
                    sx={{ height: '50px', fontSize: '12px' }}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {`${country.country} (${country.code})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  disabled={!editable}
                  fullWidth
                  inputProps={{ style: { fontSize: '12px' } }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: '5px' }}>Designation</Typography>
              <TextField
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Eg, Frontend Engineer"
                disabled={!editable}
                fullWidth
                inputProps={{ style: { fontSize: '12px' } }}
              />
            </Grid>
          </Grid>

          {/* Professional Summary Section */}
          <Box mt={4}>
            <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>
              Professional Summary
            </Typography>
            <Typography sx={{ fontSize: '13px', mb: '10px' }}>
              A brief summary of your professional background
            </Typography>
            <TextField
              name="professional_summary"
              value={formData.professional_summary}
              onChange={handleChange}
              placeholder="Enter your professional summary"
              disabled={!editable}
              fullWidth
              multiline
              rows={4}
              inputProps={{ style: { fontSize: '12px' } }}
            />
          </Box>

          {/* Skills Section */}
          <Box mt={4}>
            <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>Skills</Typography>
            <Typography sx={{ fontSize: '13px', mb: '10px' }}>
              List your skills (type a skill and press Enter or click Add)
            </Typography>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <TextField
                name="skills"
                value={newSkill}
                onChange={handleSkillsChange}
                onKeyDown={handleSkillsKeyDown}
                placeholder="Enter a skill (e.g., JavaScript)"
                disabled={!editable}
                fullWidth
                inputProps={{ style: { fontSize: '12px' } }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={addSkill}
                disabled={!newSkill.trim()}
                sx={{ textTransform: 'none' }}
              >
                Add
              </Button>
            </Box>
            {formData.skills.length > 0 && (
              <Box mt={2}>
                {formData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={
                      editable
                        ? () =>
                            setFormData((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== index),
                            }))
                        : undefined
                    }
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Education Section */}
          <Box mt={4}>
            <Typography sx={{ fontWeight: 600, color: '#39353D', fontSize: '16px' }}>Education</Typography>
            <Typography sx={{ fontSize: '13px', mb: '10px' }}>
              Add your educational background
            </Typography>
            {editable && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="degree"
                    value={newEducation.degree}
                    onChange={handleEducationChange}
                    placeholder="Degree"
                    fullWidth
                    inputProps={{ style: { fontSize: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="institution"
                    value={newEducation.institution}
                    onChange={handleEducationChange}
                    placeholder="Institution"
                    fullWidth
                    inputProps={{ style: { fontSize: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    name="year"
                    value={newEducation.year}
                    onChange={handleEducationChange}
                    placeholder="Year"
                    fullWidth
                    inputProps={{ style: { fontSize: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={addEducation}
                    disabled={!newEducation.degree || !newEducation.institution || !newEducation.year}
                    sx={{ textTransform: 'none' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            )}
            {formData.education.length > 0 && (
              <List sx={{ mt: 2 }}>
                {formData.education.map((edu, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${edu.degree}, ${edu.institution}`}
                      secondary={`Year: ${edu.year}`}
                    />
                    {editable && (
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => removeEducation(index)}>
                          <DeleteOutlineOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default MyProfileTab;