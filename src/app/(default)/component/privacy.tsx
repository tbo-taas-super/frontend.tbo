// *React Imports
import React from "react";

// *MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const Privacy: React.FC = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "1rem", sm: "1.5rem" },
          fontWeight: 400,
          textTransform: "capitalize",
          mb: 2,
          mt: 4,
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Privacy Policy
      </Typography>

      <Typography sx={{ mb: 2, textAlign: "center", fontSize: "0.9rem", color: "text.secondary" }}>
        <strong>Effective Date:</strong> June 18, 2025 | <strong>Last Updated:</strong> June 18, 2025
      </Typography>

      <Typography sx={{ mb: 3, textAlign: "center" }}>
        At Tbo Taas, we are committed to protecting your privacy and ensuring the security of your personal information.
      </Typography>

      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        This Privacy Policy explains how Tbo Taas ("we," "us," or "our") collects, uses, discloses, and protects your information when you use our job matching platform. By using our services, you agree to the collection and use of information in accordance with this policy. We are committed to transparency about our data practices and your rights regarding your personal information.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        1. Information We Collect
      </Typography>

      <Typography sx={{ mb: 2, textAlign: "justify", fontWeight: "bold" }}>
        1.1 Personal Information You Provide
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        When you create an account or use our services, we may collect:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Contact information (name, email address, phone number)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Professional information (resume, work experience, skills, education)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Company information (for employers: company name, size, industry)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Profile photos and other uploaded content" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Payment information (for premium services)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Communications with us (messages, support requests)" />
        </ListItem>
      </List>

      <Typography sx={{ mb: 2, textAlign: "justify", fontWeight: "bold", mt: 3 }}>
        1.2 Information We Collect Automatically
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Device information (IP address, browser type, operating system)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Usage data (pages visited, time spent, features used)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Location information (general location based on IP address)" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Cookies and similar tracking technologies" />
        </ListItem>
      </List>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        2. How We Use Your Information
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        We use your information to provide, maintain, and improve our services:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Match job seekers with relevant job opportunities" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Enable communication between employers and talent" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Personalize your experience and recommendations" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Process payments and transactions" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Send important updates and notifications" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Analyze usage patterns to improve our platform" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Prevent fraud and ensure platform security" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Comply with legal obligations" />
        </ListItem>
      </List>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        3. Information Sharing and Disclosure
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        We share your information in the following circumstances:
      </Typography>

      <Typography sx={{ mb: 2, textAlign: "justify", fontWeight: "bold" }}>
        3.1 With Other Users
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Job seekers: Your profile may be visible to employers when you apply for jobs" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Employers: Your job postings and company information are visible to job seekers" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You control the visibility settings of your profile information" />
        </ListItem>
      </List>

      <Typography sx={{ mb: 2, textAlign: "justify", fontWeight: "bold", mt: 3 }}>
        3.2 With Service Providers
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Third-party services that help us operate our platform" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Payment processors for transaction handling" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Analytics and marketing service providers" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Cloud storage and hosting providers" />
        </ListItem>
      </List>

      <Typography sx={{ mb: 2, textAlign: "justify", fontWeight: "bold", mt: 3 }}>
        3.3 Legal Requirements
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        We may disclose your information when required by law, to protect our rights, or to ensure user safety. This includes compliance with legal processes, preventing fraud, and enforcing our terms of service.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        4. Data Security
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        We implement appropriate security measures to protect your personal information:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Encryption of data in transit and at rest" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Regular security assessments and updates" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Access controls and authentication measures" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Employee training on data protection practices" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Incident response procedures for data breaches" />
        </ListItem>
      </List>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        5. Your Rights and Choices
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        You have the following rights regarding your personal information:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Access: Request a copy of your personal information" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Correction: Update or correct inaccurate information" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Deletion: Request deletion of your personal information" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Portability: Receive your data in a portable format" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Opt-out: Unsubscribe from marketing communications" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Privacy settings: Control visibility of your profile" />
        </ListItem>
      </List>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        6. Cookies and Tracking Technologies
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        We use cookies and similar technologies to enhance your experience:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Essential cookies: Required for basic platform functionality" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Analytics cookies: Help us understand how you use our platform" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Preference cookies: Remember your settings and preferences" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Marketing cookies: Deliver relevant advertisements" />
        </ListItem>
      </List>
      <Typography sx={{ mb: 3, textAlign: "justify", mt: 2 }}>
        You can manage your cookie preferences through your browser settings or our cookie preference center.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        7. Data Retention
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your personal information, except where we need to retain it for legal compliance, dispute resolution, or fraud prevention.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        8. International Data Transfers
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information during international transfers.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        9. Third-Party Links and Services
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external sites or services. We encourage you to review their privacy policies before providing any personal information.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        10. Children's Privacy
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        11. Changes to This Privacy Policy
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our platform and, where required, obtaining your consent. Your continued use of our services after the effective date constitutes acceptance of the updated policy.
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        12. Contact Us
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Email: Hr@tboisl.com" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Address: 3rd Floor, Propertygate center,
            2 The Rock Drive, Lekki Phase 1,Lagos State." />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Phone: +234-803-391-8955" />
        </ListItem>
        {/* <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Data Protection Officer: [DPO contact if applicable]" />
        </ListItem> */}
      </List>

      <Box sx={{ 
        border: 1, 
        borderColor: 'primary.main', 
        borderRadius: 2, 
        p: 3, 
        mt: 4, 
        backgroundColor: 'rgba(0,0,0,0.02)' 
      }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
          By using Tbo Taas, you acknowledge that you have read and understood this Privacy Policy and consent to our collection, use, and disclosure of your information as described herein.
        </Typography>
      </Box>
    </Box>
  );
};

export default Privacy;