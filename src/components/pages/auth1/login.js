// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import Logo from 'helpers/logo/LogoMain';

// project-imports
// import useAuth from 'hooks/useAuth';

import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'components/organisms/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

const Login = () => {
  // const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} textAlign="center">
          <Logo />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>
              Login
            </Typography>
            {/* <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin forgot="/auth/forgot-password" />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
