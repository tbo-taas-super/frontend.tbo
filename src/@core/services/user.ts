import axios, { type AxiosProgressEvent } from 'axios'
import { API_BASE_URL } from "@/@core/utils/constants"
import { getSession } from 'next-auth/react';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  account_type: string;
  company_logo?: string;
  company_name?: string;
  designation? :string;
  company_email_address?: string;
  industry?: string;
  number_of_employees?: string;
  type_of_employer?: string;
  company_address?: string;
  company_phone_number?: string | null;
  country?: string | null;
  company_website?: string;
  contact_person?: string | null;
  work_email?: string | null;
  position_in_company?: string | null;
}
interface CurrentUserResponse {
  status: boolean;
  user: CurrentUser;
}


export const registerAdmin = async (data: {
  name: string;
  account_type: 'ADMIN' | 'SUPER_ADMIN' | 'TECH';
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("Missing token");
    const response = await axios.post(`${API_BASE_URL}/register-admin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering admin:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      throw new Error(JSON.stringify(error.response.data.errors));
    } else {
      throw new Error("Failed to register admin");
    }
  }
};


export const changePassword = async (data: { current_password: string, password: string, password_confirmation: string }) => {
  try {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) throw new Error("Missing token");
    const response = await axios.post(`${API_BASE_URL}/change_password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to change password. Current password is incorrect.");
    }
  }
};


export interface UpdateUserPayload {
  name: string;
  email: string;
  designation: string;
  account_type: 'TALENT' | 'EMPLOYER';
  phone_number: string;
  cv_upload?: string;
  cover_letter_upload?: string;
  id_upload?: string;
  video_url?: string;
  project_screenshots?: string[];
  work_sample_upload?: string;
  portfolio_link?: string;
  profile_image?: string;
  professional_summary?: string; // Add professional summary
  skills?: string[]; // Skills as an array of strings
  education?: string;
  company_logo?: File | string;
  company_name?: string;
  company_email_address?: string;
  industry?: string;
  number_of_employees?: string;
  type_of_employer?: string;
  company_address?: string;
  company_phone_number?: string;
  country?: string;
  company_website?: string;
  contact_person?: string;
  work_email?: string;
  position_in_company?: string;
  role?: string;
  adminPrivileges?: string;
}
export interface UploadProgressCallback {
  (progress: number): void
}

export const uploadFile = async (
  formData: FormData, 
  onProgress?: UploadProgressCallback
) => {
  const session = await getSession()
  const token = session?.user?.accessToken

  if (!token) throw new Error("Missing token")

  try {
    const response = await axios.post(`${API_BASE_URL}/upload-file`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type manually for multipart/form-data
        // Let axios set it with the boundary
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
      // Add timeout to prevent hanging requests
      timeout: 300000, // 5 minutes
    })

    return response.data // Should include { url: "https://..." }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific CORS and network errors
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error - please check your connection and try again')
      }
      if (error.response?.status === 413) {
        throw new Error('File too large - please choose a smaller file')
      }
      if (error.response?.status === 415) {
        throw new Error('Unsupported file type')
      }
      throw new Error(error.response?.data?.message || 'Upload failed')
    }
    throw error
  }
}

// Alternative upload method using fetch (sometimes works better with CORS)
export const uploadFileWithFetch = async (
  formData: FormData,
  onProgress?: UploadProgressCallback
) => {
  const session = await getSession()
  const token = session?.user?.accessToken

  if (!token) throw new Error("Missing token")

  return new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded * 100) / event.total)
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        } catch (error) {
          reject(new Error('Invalid response format'))
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred'))
    })

    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout'))
    })

    xhr.open('POST', `${API_BASE_URL}/upload-file`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.timeout = 300000 // 5 minutes

    xhr.send(formData)
  })
}

interface ResetRequestResponse {
  status: boolean;
  message: string;
  reset_token: string;
}

interface ResetVerifyResponse {
  status: boolean;
  message: string;
  reset_token: string;
}

interface ResetPasswordResponse {
  status: boolean;
  message: string;
}

interface ResetPasswordPayload {
  email: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}

export const requestPasswordReset = async (email: string): Promise<ResetRequestResponse> => {
  try {
    const response = await axios.post<ResetRequestResponse>(
      `${API_BASE_URL}/password/request-reset`,
      { email }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error requesting password reset:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to request password reset");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};


export const verifyOtp = async ({ email, otp }: { email: string; otp: string }) => {
  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }
  return data;
};

export const verifyResetOtp = async (data: {
  email: string;
  otp: string;
  reset_token: string;
}): Promise<ResetVerifyResponse> => {
  try {
    const response = await axios.post<ResetVerifyResponse>(
      `${API_BASE_URL}/password/verify-otp`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error verifying OTP:", error.response?.data);
      throw new Error(error.response?.data?.message || "OTP verification failed");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};

export const resendOtp = async ({ email }: { email: string }) => {
  const response = await fetch(`${API_BASE_URL}/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }

  return data;
};

export const resetPassword = async (data: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  try {
    const response = await axios.post<ResetPasswordResponse>(
      `${API_BASE_URL}/password/reset`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error resetting password:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to reset password");
    }
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred");
  }
};


export const updateUser = async (userId: number, data: Partial<UpdateUserPayload>) => {
  try {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (!token) throw new Error("Missing token");

    const response = await axios.put(
      `${API_BASE_URL}/user/update/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200 && response.data.status) {
      console.log('User successfully updated');
      return response.data;
    } else {
      const errorMsg = response.data.message || 'Unknown error';
      console.error('Error updating user:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const getCurrentUser = async (): Promise<any> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  const res = await fetch(`${API_BASE_URL}/user-me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("USER ME response:", data);

  if (!res.ok) throw new Error("Unauthorized");

  return data;
};

export const getAllUser = async (): Promise<any> => {
  
  const res = await fetch(`${API_BASE_URL}/users`, {
   
  });

  const data = await res.json();
  console.log("USER ME response:", data);

  if (!res.ok) throw new Error("Unauthorized");

  return data;
};


export const getUserById = async (userId: number): Promise<CurrentUser> => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) throw new Error("Missing token");

  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Get user by ID response:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};

export const getAlljobs = async (): Promise<any> => {
  
  const res = await fetch(`${API_BASE_URL}/jobs`, {
   
  });

  const data = await res.json();
  console.log("USER ME response:", data);

  if (!res.ok) throw new Error("Unauthorized");

  return data;
};



interface GoogleAuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}


export const authService = {
  async loginWithGoogle(token: string): Promise<GoogleAuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google/callback`, {
        token
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Google login failed');
      }
      throw new Error('Google login failed');
    }
  },
} 


export const GoogleAuthService = {
  async initiateGoogleLogin(accountType: 'CLIENT' | 'TALENT'): Promise<void> {
    const returnTo = '/dashboard';
    const url = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(
      `${window.location.origin}/auth/callback`
    )}&account_type=${accountType}`;
    
    // Store pre-auth state
    sessionStorage.setItem('preAuthRoute', returnTo);
    sessionStorage.setItem('accountType', accountType);
    
    window.location.href = url;
  },

  async handleCallback(code: string): Promise<{ token: string; user: any }> {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/callback`, {
      params: { code }
    });
    return response.data;
  }


  
};