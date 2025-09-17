import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdminProfileSchema } from "@/@core/formSchema";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import CustomTextField from "@/@core/component/mui/text-field";
import { getCurrentUser, updateUser } from "@/@core/services/user"; // Assuming there's a service function to update user
import CircularProgress from "@mui/material/CircularProgress";


interface CurrentUser {
  id: number;
  name: string;
  email: string;
  account_type: string;
  phone_number: string;
  admin_privileges: string;
}

type AdminProfileFormValues = {
  name: string; // Change fullName to name
  email: string;
  role: string;
  adminPrivileges: string;
};

const defaultValues: AdminProfileFormValues = {
  name: "",
  email: "",
  role: "",
  adminPrivileges: "",
};

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,  // Add handleSubmit here to handle form submission
  } = useForm<AdminProfileFormValues>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(AdminProfileSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.user;

        setCurrentUser(userData);
        console.log("Fetched User Data:", userData);  // Check if the data is correct

        // Reset form with fetched data
        reset({
          name: userData.name,
          email: userData.email,
          role: userData.account_type,
          adminPrivileges: userData.admin_privileges,
        });
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [reset]);

  const onSubmit = async (data: AdminProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const accountType: "EMPLOYER" | "TALENT" =
        data.role === "Admin" ? "EMPLOYER" : "TALENT"; // adjust logic as needed
  
      const payload = {
        name: data.name,
        email: data.email,
        account_type: accountType,
        admin_privileges: data.adminPrivileges,
        phone_number: currentUser?.phone_number || "",
      };
  
      const response = await updateUser(currentUser?.id || 0, payload);
      console.log("Updated User Data:", response);
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>{error}</div>;
  if (!currentUser) return <div>No user data available</div>;

  return (
    <Box sx={{ mb: 8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, color: "#39353D", fontSize: { xs: "1rem", sm: "1.2rem" } }}>
            Admin Information
          </Typography>
          <Typography sx={{ fontSize: "13px", mb: "10px" }}>
            Details about the Admin
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setIsEditable(!isEditable)}
          sx={{ textTransform: "none" }}
        >
          {isEditable ? "Cancel" : "Edit"}
        </Button>
      </Box>

      <Box sx={{ my: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ my: 4 }}>
            <Grid item xs={12} sm={6} lg={6}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                Full Name
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    size="medium"
                    disabled={!isEditable}  // Only editable if isEditable is true
                    placeholder="Sarah Doe"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                Email
              </Typography>
              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    size="medium"
                    disabled  // Email is always disabled
                    placeholder="admin@example.com"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                Role
              </Typography>
              <Controller
                name="role"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    size="medium"
                    disabled  // Role is always disabled
                    placeholder="Admin"
                    error={Boolean(errors.role)}
                    helperText={errors.role?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6}>
              <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: "10px" }}>
                Admin Privileges
              </Typography>
              <Controller
                name="adminPrivileges"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    size="medium"
                    disabled  // Admin Privileges is always disabled
                    placeholder="Access to admin panel"
                    error={Boolean(errors.adminPrivileges)}
                    helperText={errors.adminPrivileges?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {isSubmitting ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            isEditable && (
              <Button
                variant="contained"
                type="submit"
                sx={{ textTransform: "none", mt: 2 }}
              >
                Save Changes
              </Button>
            )
          )}
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
