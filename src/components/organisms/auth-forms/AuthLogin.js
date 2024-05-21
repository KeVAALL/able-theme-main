import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// assets
import { HomeTrendUp, Profile2User, ShoppingBag, Eye, EyeSlash } from 'iconsax-react';

import { FormattedMessage } from 'react-intl';
// material-ui
import { Button, Checkbox, FormHelperText, Grid, Link, InputAdornment, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'helpers/@extended/IconButton';
import AnimateButton from 'helpers/@extended/AnimateButton';

// assets
import { dispatch } from '../../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';
import { setMenuItems } from 'redux/reducers/menu';
import CustomTextField from 'utils/textfield';
import { enqueueSnackbar } from 'notistack';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ forgot }) => {
  const [checked, setChecked] = useState(false);

  const { isLoggedIn, login } = useAuth();
  const scriptedRef = useScriptRef();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // icons
  const icons = {
    HomeTrendUp: HomeTrendUp,
    Profile2User: Profile2User,
    ShoppingBag: ShoppingBag
    // data: Fatrows
  };

  const transformData = (menu) => {
    let organizedMenu = [];

    menu?.forEach((item, index) => {
      organizedMenu[index] = {
        id: item.menu_id,
        // title: <FormattedMessage id={item.menu_name} />,
        title: item.menu_name,
        // icon: icons[item.menu_icon],
        icon: item.menu_icon,
        type: item.child_menu === null ? 'item' : 'collapse',
        url: item.child_menu === null && `/${item.menu_url}`,
        children:
          item.child_menu?.length > 0 &&
          item.child_menu?.map((item) => {
            return {
              id: item.menu_id,
              // title: <FormattedMessage id={item.menu_name} />,
              title: item.menu_name,
              type: 'item',
              url: `/${item.menu_url}`
            };
          })
      };
    });
    console.log(organizedMenu);
    return organizedMenu;
  };

  useEffect(() => {
    document.title = 'AltCase - Login';
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email_id: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email_id: Yup.string().trim().email('Invalid email').required('Email is required'),
          password: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[0-9]/, 'Password must contain at least 1 numeric character')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character')
            .required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await login(values.email_id, values.password);

            const transformedData = transformData(response.data.data.menus);

            dispatch(
              setMenuItems([
                {
                  id: 'group-applications',
                  title: <FormattedMessage id="applications" />,
                  icon: icons.data,
                  type: 'group',
                  children: transformedData
                }
              ])
            );

            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            enqueueSnackbar('Invalid Login Credentials', {
              variant: 'error',
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            });
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
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
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  label="Password"
                  name="password"
                  placeholder="Enter Password"
                  values={values}
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />

                  
                </Stack>
              </Grid> */}
              {/* {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="success">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>

              <Grid item xs={12} sx={{ paddingTop: '14px !important' }}>
                <Link variant="h6" component={RouterLink} to={isLoggedIn && forgot ? forgot : '/forgot-password'} color="text.primary">
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

AuthLogin.propTypes = {
  forgot: PropTypes.string
};

export default AuthLogin;
