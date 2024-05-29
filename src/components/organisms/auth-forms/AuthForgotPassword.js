import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useCallback, forwardRef } from 'react';
// material-ui
import { styled } from '@mui/material/styles';
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Link,
  Card,
  CardActions,
  Box,
  IconButton,
  Collapse,
  Paper,
  Tooltip
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { enqueueSnackbar, useSnackbar, SnackbarContent } from 'notistack';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { dispatch } from '../../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';
import { CustomTextField } from 'utils/textfield';
import { ResetPasswordEmail } from 'hooks/user/user';
import { Add, ArrowDown2, ArrowLeft2, Copy, TickCircle } from 'iconsax-react';
import CopyToClipboard from 'react-copy-to-clipboard';

const SnackbarBox = styled(SnackbarContent)(() => ({
  '@media (min-width:600px)': {
    minWidth: '344px !important'
  }
}));
// // ==============================|| NOTISTACK - CUSTOM ||============================== //

const CustomNotistack = forwardRef((props, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    console.log('refresh');
    closeSnackbar(props.id);
  }, [props.id, closeSnackbar]);

  return (
    <SnackbarBox ref={ref}>
      <Card sx={{ bgcolor: 'success.main', width: '100%' }}>
        <CardActions sx={{ padding: '8px 8px 8px 16px', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="white">
            {props.message}
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <CopyToClipboard
              text={props.otp}
              onCopy={() => {
                enqueueSnackbar('Text Copied', {
                  variant: 'success',
                  autoHideDuration: 2000,
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                  }
                });
              }}
            >
              <Tooltip title="Copy">
                <IconButton size="large">
                  <Copy color="white" />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
            {/* <IconButton size="large" sx={{ p: 1, transition: 'all .2s' }} onClick={handleDismiss}>
              <Add color="white" style={{ transform: 'rotate(45deg)' }} />
            </IconButton> */}
          </Box>
        </CardActions>
      </Card>
    </SnackbarBox>
  );
});

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { isLoggedIn, resetPassword } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          email_id: ''
          // submit: null
        }}
        validationSchema={Yup.object().shape({
          email_id: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
          // debugger; // eslint-disable-line no-debugger
          try {
            const response = await ResetPasswordEmail(values);
            console.log(response);
            enqueueSnackbar(`OTP: ${response}`, {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
              },
              content: (key, message) => <CustomNotistack id={key} message={message} otp={response} />
            });
            // navigate('/login', { state: values });
            setTimeout(() => {
              navigate(isLoggedIn ? '/auth/login' : '/login', { replace: true, state: values });
            }, 1500);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);

            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CustomTextField
                  label="Email ID"
                  name="email_id"
                  placeholder="Enter Email ID"
                  values={values}
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  autocomplete="autoComplete"
                  FormHelperTextProps={{
                    style: {
                      marginLeft: 0
                    }
                  }}
                />
              </Grid>
              {/* {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
              {/* <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="body1">Do not forgot to check SPAM box.</Typography>
              </Grid> */}
              <Grid item xs={12}>
                {/* <AnimateButton> */}
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" variant="contained" color="success" type="submit">
                  Send OTP
                </Button>
                {/* </AnimateButton> */}
              </Grid>

              <Grid item xs={12} sx={{ paddingTop: '14px !important' }}>
                <Link
                  variant="body2"
                  component={RouterLink}
                  to={isLoggedIn ? '/auth/login' : '/login'}
                  color="text.primary"
                  sx={{ display: 'flex', gap: 0.5, alignItems: 'center', opacity: 0.8 }}
                >
                  <ArrowLeft2 size="14" color="#37d67a" />
                  Back to Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
