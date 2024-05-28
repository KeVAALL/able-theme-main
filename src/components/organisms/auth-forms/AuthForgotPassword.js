import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { dispatch } from '../../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';
import { CustomTextField } from 'utils/textfield';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { isLoggedIn, resetPassword } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          email_id: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email_id: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
          try {
            enqueueSnackbar('Check your mail for OTP', {
              variant: 'success',
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            });
            navigate('/login', { state: values });
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
          <form
            noValidate
            onSubmit={() => {
              handleSubmit();
              // setTimeout(() => {
              //   resetForm();
              // });
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
                  autoComplete
                  FormHelperTextProps={{
                    style: {
                      marginLeft: 0
                    }
                  }}
                />
                {/* <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">Email ID</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Email ID"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-forgot">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack> */}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="body1">Do not forgot to check SPAM box.</Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Send Password Reset Email
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
