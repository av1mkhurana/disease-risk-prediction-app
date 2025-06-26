import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Security,
  Lock,
  Storage,
  CloudSync,
  Shield,
  Visibility,
  Delete,
  Update,
  LocationOn,
  Timer,
  CheckCircle,
  Warning,
  Info,
  VpnKey,
} from '@mui/icons-material';

const PrivacyPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Privacy Policy & Data Protection
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Your Health Data Security and Privacy Rights
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Security />} label="HIPAA Compliant" color="primary" />
            <Chip icon={<Shield />} label="End-to-End Encryption" color="secondary" />
            <Chip icon={<Lock />} label="Zero-Knowledge Architecture" color="success" />
          </Box>
        </Box>

        {/* Last Updated */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Last Updated:</strong> December 26, 2024 | 
            <strong> Effective Date:</strong> December 26, 2024 | 
            <strong> Version:</strong> 1.0
          </Typography>
        </Alert>

        {/* Data Collection Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Storage color="primary" />
              Data Collection & Storage Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                    What We Collect
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Health assessment responses" secondary="Demographics, lifestyle, medical history" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Laboratory test results" secondary="Optional lab values you choose to share" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Risk prediction results" secondary="AI-generated health risk assessments" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Account information" secondary="Email, encrypted authentication data" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: '#fff3e0' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
                    What We DON'T Collect
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Warning color="warning" /></ListItemIcon>
                      <ListItemText primary="Personal identifiers" secondary="No SSN, driver's license, or government IDs" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Warning color="warning" /></ListItemIcon>
                      <ListItemText primary="Financial information" secondary="No payment cards, bank accounts, or billing data" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Warning color="warning" /></ListItemIcon>
                      <ListItemText primary="Location tracking" secondary="No GPS, IP geolocation, or movement data" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Warning color="warning" /></ListItemIcon>
                      <ListItemText primary="Device fingerprinting" secondary="No device IDs, browser fingerprints, or tracking" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Supabase Data Infrastructure */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CloudSync color="primary" />
              Supabase Data Infrastructure & Security
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn color="primary" />
                      Data Location
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Primary: AWS US-East-1 (Virginia)" 
                          secondary="SOC 2 Type II certified data center"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Backup: AWS US-West-2 (Oregon)" 
                          secondary="Automated daily backups with 30-day retention"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Compliance: HIPAA, SOC 2, ISO 27001" 
                          secondary="Enterprise-grade security standards"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VpnKey color="secondary" />
                      Encryption Standards
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Data at Rest: AES-256" 
                          secondary="Military-grade encryption for stored data"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Data in Transit: TLS 1.3" 
                          secondary="End-to-end encryption for all communications"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Database: PostgreSQL with RLS" 
                          secondary="Row-level security with user isolation"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer color="success" />
                      Data Retention
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Active Accounts: Indefinite" 
                          secondary="Data retained while account is active"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Inactive Accounts: 2 years" 
                          secondary="Automatic deletion after 24 months of inactivity"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Deleted Accounts: 30 days" 
                          secondary="Grace period for account recovery"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Alert severity="info">
                <Typography variant="body1">
                  <strong>Supabase Security Features:</strong> Our data infrastructure leverages Supabase's enterprise-grade security, 
                  including automatic security updates, DDoS protection, and 24/7 monitoring. All data is stored in PostgreSQL 
                  databases with row-level security (RLS) ensuring users can only access their own data.
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>

        {/* Data Usage & Processing */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Shield color="primary" />
              Data Usage & AI Processing
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Data Type</strong></TableCell>
                    <TableCell><strong>Processing Purpose</strong></TableCell>
                    <TableCell><strong>AI Model Access</strong></TableCell>
                    <TableCell><strong>Retention Period</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Assessment Responses</TableCell>
                    <TableCell>Risk calculation via medical algorithms</TableCell>
                    <TableCell>Llama-4 for personalized insights (anonymized)</TableCell>
                    <TableCell>Lifetime of account</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lab Results</TableCell>
                    <TableCell>Enhanced risk predictions and trends</TableCell>
                    <TableCell>No direct AI access (processed locally)</TableCell>
                    <TableCell>Lifetime of account</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Risk Predictions</TableCell>
                    <TableCell>Historical tracking and trend analysis</TableCell>
                    <TableCell>No AI access (stored results only)</TableCell>
                    <TableCell>Lifetime of account</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User Profile</TableCell>
                    <TableCell>Account management and personalization</TableCell>
                    <TableCell>No AI access (authentication only)</TableCell>
                    <TableCell>Lifetime of account + 30 days</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                AI Data Processing Safeguards
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Data Anonymization
                    </Typography>
                    <Typography variant="body2">
                      Before sending data to Llama-4 AI, all personally identifiable information is removed. 
                      Only anonymized health metrics and risk factors are processed for insights generation.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#f3e5f5' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      No Model Training
                    </Typography>
                    <Typography variant="body2">
                      Your data is never used to train or improve AI models. Each request is processed 
                      independently without data retention by the AI service provider.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* User Rights & Controls */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Visibility color="primary" />
              Your Data Rights & Controls
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Data Access Rights
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="View All Data" 
                      secondary="Access complete record of your stored information via dashboard"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Export Data" 
                      secondary="Download your data in JSON format for portability"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Data History" 
                      secondary="View complete audit trail of data modifications"
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="error">
                  Data Control Rights
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Update color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Modify Data" 
                      secondary="Update or correct any stored information at any time"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Delete color="error" /></ListItemIcon>
                    <ListItemText 
                      primary="Delete Specific Data" 
                      secondary="Remove individual assessments or lab results"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Delete color="error" /></ListItemIcon>
                    <ListItemText 
                      primary="Delete All Data" 
                      secondary="Complete account and data deletion within 30 days"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Data Portability & Interoperability
            </Typography>
            <Alert severity="success">
              <Typography variant="body1">
                <strong>FHIR Compliance:</strong> Your health data is structured according to HL7 FHIR standards, 
                ensuring compatibility with other healthcare systems. You can export your data in standard formats 
                for use with other health applications or sharing with healthcare providers.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security color="primary" />
              Third-Party Services & Data Sharing
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Service</strong></TableCell>
                    <TableCell><strong>Purpose</strong></TableCell>
                    <TableCell><strong>Data Shared</strong></TableCell>
                    <TableCell><strong>Privacy Policy</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Supabase (Database)</TableCell>
                    <TableCell>Data storage and authentication</TableCell>
                    <TableCell>All user data (encrypted)</TableCell>
                    <TableCell>HIPAA compliant, SOC 2 certified</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Groq (AI Processing)</TableCell>
                    <TableCell>Llama-4 AI insights generation</TableCell>
                    <TableCell>Anonymized health metrics only</TableCell>
                    <TableCell>No data retention, GDPR compliant</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vercel (Hosting)</TableCell>
                    <TableCell>Application hosting and delivery</TableCell>
                    <TableCell>No health data (frontend only)</TableCell>
                    <TableCell>SOC 2 certified, GDPR compliant</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Railway (Backend)</TableCell>
                    <TableCell>API hosting and processing</TableCell>
                    <TableCell>Temporary processing only</TableCell>
                    <TableCell>SOC 2 certified, data residency controls</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <Alert severity="warning">
                <Typography variant="body1">
                  <strong>No Data Sales:</strong> We never sell, rent, or trade your personal health information. 
                  All third-party integrations are strictly for service delivery and are bound by data processing 
                  agreements that prohibit unauthorized use of your data.
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>

        {/* Security Measures */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Lock color="primary" />
              Security Measures & Incident Response
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, backgroundColor: '#e8f5e8' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                    Technical Safeguards
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Multi-factor authentication" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Role-based access controls" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Automated security monitoring" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Regular security audits" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Penetration testing" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, backgroundColor: '#e3f2fd' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Administrative Safeguards
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Security officer designation" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Employee security training" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Access management procedures" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Incident response plan" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Business associate agreements" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, backgroundColor: '#fff3e0' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
                    Physical Safeguards
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Secure data center facilities" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Biometric access controls" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="24/7 security monitoring" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Environmental controls" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Secure media disposal" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Incident Response & Breach Notification
              </Typography>
              <Alert severity="info">
                <Typography variant="body1">
                  In the unlikely event of a security incident, we will notify affected users within 72 hours 
                  and relevant authorities as required by law. Our incident response team follows established 
                  protocols to contain, investigate, and remediate any security issues while preserving evidence 
                  and minimizing impact to users.
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>

        {/* Contact & Legal */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Contact Information & Legal
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Privacy Officer Contact
                </Typography>
                <Typography variant="body1" paragraph>
                  For privacy-related questions, data requests, or security concerns:
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> privacy@healthrisk.app<br/>
                  <strong>Response Time:</strong> Within 48 hours<br/>
                  <strong>Data Requests:</strong> Processed within 30 days
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Legal Compliance
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="HIPAA (Health Insurance Portability and Accountability Act)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="GDPR (General Data Protection Regulation)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="CCPA (California Consumer Privacy Act)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary="SOC 2 Type II Compliance" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Policy Updates */}
        <Alert severity="warning">
          <Typography variant="body1">
            <strong>Policy Updates:</strong> We may update this privacy policy to reflect changes in our practices 
            or legal requirements. Users will be notified of material changes via email and in-app notifications 
            at least 30 days before changes take effect. Continued use of the service after notification constitutes 
            acceptance of the updated policy.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default PrivacyPage;
