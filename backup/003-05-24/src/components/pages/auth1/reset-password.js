// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthResetPassword from 'components/organisms/auth-forms/AuthResetPassword';

// ================================|| RESET PASSWORD ||================================ //

const ResetPassword = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
          <Typography variant="h3">Reset Password</Typography>
          <Typography color="secondary">Please choose your new password</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthResetPassword />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default ResetPassword;
