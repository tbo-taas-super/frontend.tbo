// *React Imports
import React from "react";

// *MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const Terms: React.FC = () => {
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
          fontSize: { xs: "1.5rem", sm: "2rem" },
          fontWeight: 600,
          textTransform: "capitalize",
          mb: 2,
          mt: 4,
          textAlign: "center",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Terms of Use
      </Typography>

      <Typography sx={{ mb: 2, textAlign: "center", fontSize: "0.9rem", color: "text.secondary" }}>
        <strong>Effective Date:</strong> June 18, 2025 | <strong>Last Updated:</strong> June 18, 2025
      </Typography>

      <Typography sx={{ mb: 3, textAlign: "center" }}>
        By accessing or using Tbo Taas, you confirm that you are in agreement with and bound by these terms and conditions.
      </Typography>

      {/* Section 1 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        1. Acceptance of Terms
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        By accessing or using Tbo Taas ("Platform," "Service," "we," "us," or "our"), you ("User," "you," or "your") agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, please do not use our Platform.
      </Typography>

      {/* Section 2 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        2. Description of Service
      </Typography>
      <Typography sx={{ mb: 2, textAlign: "justify" }}>
        Tbo Taas is an online platform that connects job seekers ("Talent") with employers ("Companies") seeking to hire. Our Platform facilitates:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Job posting and discovery" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Talent profile creation and showcase" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Application and recruitment processes" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Communication between Companies and Talent" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Skill assessment and verification tools" />
        </ListItem>
      </List>

      {/* Section 3 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        3. User Categories and Eligibility
      </Typography>
      
      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        3.1 General Eligibility
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You must be at least 18 years old to use this Platform" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You must provide accurate and complete information" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You must have the legal capacity to enter into binding agreements" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        3.2 For Job Seekers (Talent)
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You represent that you are legally authorized to work in the jurisdictions where you seek employment" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You warrant that all information in your profile is accurate and up-to-date" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You agree to maintain the confidentiality of your account credentials" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        3.3 For Employers (Companies)
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You represent that you are authorized to act on behalf of your company" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You warrant that all job postings comply with applicable employment laws" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You agree to engage in lawful and non-discriminatory hiring practices" />
        </ListItem>
      </List>

      {/* Section 4 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        4. Account Registration and Security
      </Typography>
      
      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        4.1 Account Creation
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You must create an account to access certain features" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You are responsible for maintaining the confidentiality of your login credentials" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You must notify us immediately of any unauthorized use of your account" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        4.2 Profile Information
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Talent: You may create a profile showcasing your skills, experience, and qualifications" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Companies: You may create a company profile and post job opportunities" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="All users must ensure their information is accurate, current, and not misleading" />
        </ListItem>
      </List>

      {/* Section 5 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        5. Platform Usage Rules
      </Typography>
      
      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        5.1 Prohibited Activities
      </Typography>
      <Typography sx={{ mb: 1, textAlign: "justify" }}>
        You agree NOT to:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Post false, misleading, or fraudulent information" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Impersonate another person or entity" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Engage in discriminatory practices based on race, gender, religion, age, disability, or other protected characteristics" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Post jobs that are not genuine employment opportunities" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Use the Platform for any illegal or unauthorized purpose" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Harvest or collect user information without consent" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Spam or send unsolicited communications" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Violate any applicable laws or regulations" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        5.2 Content Guidelines
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="All content must be professional and appropriate" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Job postings must accurately represent available positions" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Talent profiles must truthfully represent qualifications and experience" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We reserve the right to remove content that violates these guidelines" />
        </ListItem>
      </List>

      {/* Section 6 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        6. Privacy and Data Protection
      </Typography>
      
      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        6.1 Data Collection
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We collect and process personal information as described in our Privacy Policy" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="By using the Platform, you consent to such collection and processing" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        6.2 Data Sharing
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Companies may view Talent profiles and contact information when Talent applies for positions" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Talent information may be shared with Companies for recruitment purposes" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We do not sell personal information to third parties" />
        </ListItem>
      </List>

      {/* Section 7 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        7. Disclaimers and Limitations
      </Typography>
      
      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        7.1 Platform Disclaimer
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="The Platform is provided 'as is' without warranties of any kind" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We do not guarantee the accuracy of user-submitted information" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We are not responsible for the actions of users or the outcome of employment relationships" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        7.2 Employment Relationships
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We are not a party to any employment relationship formed through the Platform" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Companies and Talent are solely responsible for their employment agreements" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We do not verify employment eligibility, background checks, or credentials" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        7.3 Limitation of Liability
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Our liability is limited to the maximum extent permitted by law" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We are not liable for indirect, incidental, or consequential damages" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Our total liability shall not exceed the amount paid by you to use the Platform" />
        </ListItem>
      </List>

      {/* Section 8 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        8. Termination
      </Typography>
      
      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        8.1 Termination by You
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 2 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="You may terminate your account at any time" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="Upon termination, you lose access to Platform features" />
        </ListItem>
      </List>

      <Typography
        variant="h5"
        sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1, mt: 3 }}
      >
        8.2 Termination by Us
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We may suspend or terminate accounts for Terms violations" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We may terminate accounts with or without cause" />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText primary="We will provide notice when reasonably possible" />
        </ListItem>
      </List>

      {/* Section 9 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        9. Changes to Terms
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        We may update these Terms from time to time. Continued use of the Platform constitutes acceptance of updated Terms. 
        Material changes will be communicated via email or Platform notification. If we change our terms of use, we will post 
        those changes on this page. Registered users will be sent an email that outlines changes made to the terms of use.
      </Typography>

      {/* Section 10 */}
      <Typography
        variant="h4"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2, mt: 4 }}
      >
        10. Contact Information
      </Typography>
      <Typography sx={{ mb: 3, textAlign: "justify" }}>
        For questions about these Terms, please contact us at:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 3 }}>
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
          By using Tbo Taas, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
        </Typography>
      </Box>
    </Box>
  );
};

export default Terms;