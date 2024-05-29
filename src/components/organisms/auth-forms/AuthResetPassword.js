import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'helpers/@extended/IconButton';
import AnimateButton from 'helpers/@extended/AnimateButton';

import { dispatch } from '../../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { CustomTextField } from 'utils/textfield';
import { ResetUserPassword } from 'hooks/user/user';

// ============================|| FIREBASE - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserID] = useState();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);
  useEffect(() => {
    const data = location.state || {};

    console.log(data);

    setUserID(data.user_id);
  }, [location.state]);

  return (
    <>
      <Formik
        initialValues={{
          new_password: '',
          confirm_password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          new_password: Yup.string().max(255).required('New Password is required'),
          confirm_password: Yup.string()
            .required('Confirm Password is required')
            .test('confirm_password', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.new_password === confirmPassword)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const payload = { method_name: 'resetpassword', user_id: userId, ...values };
            // password reset
            // if (scriptedRef.current) {
            // setStatus({ success: true });
            await ResetUserPassword(payload);

            setSubmitting(false);
            setTimeout(() => {
              navigate(isLoggedIn ? '/auth/login' : '/login');
            }, 1500);
            // }
          } catch (err) {
            console.error(err);
            // if (scriptedRef.current) {
            // setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            // }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CustomTextField
                  label="New Password"
                  name="new_password"
                  placeholder="Enter Password"
                  values={values}
                  type={showNewPassword ? 'text' : 'password'}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  onBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseDownPassword}
                          edge="end"
                          size="large"
                          color="secondary"
                        >
                          {showNewPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  label="Confirm Password"
                  name="confirm_password"
                  placeholder="Enter Password"
                  values={values}
                  type={showConfirmPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseDownPassword}
                          edge="end"
                          size="large"
                          color="secondary"
                        >
                          {showConfirmPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="success">
                    Reset Password
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

export default AuthResetPassword;
