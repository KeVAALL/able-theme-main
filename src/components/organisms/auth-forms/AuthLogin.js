import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// assets
import {
  HomeTrendUp,
  Profile2User,
  ShoppingBag,
  Eye,
  EyeSlash,
  Add,
  UserCirlceAdd,
  MenuBoard,
  MoneySend,
  StatusUp,
  User,
  Convert,
  Tag,
  Moneys,
  ArrangeHorizontalCircle,
  Document,
  DirectInbox,
  Bank,
  Note,
  Note1,
  UserOctagon,
  Messages2
} from 'iconsax-react';

import { FormattedMessage } from 'react-intl';
// material-ui
import { Button, Grid, Link, InputAdornment } from '@mui/material';

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
import { setMenuItems } from 'redux/reducers/menu';
import { CustomTextField } from 'utils/textfield';
import { enqueueSnackbar } from 'notistack';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ forgot }) => {
  const { isLoggedIn, login } = useAuth();
  const scriptedRef = useScriptRef();
  const location = useLocation();
  const navigate = useNavigate();

  const formAllValues = {
    email_id: '',
    password: '',
    submit: null
  };
  const [checked, setChecked] = useState(false);
  const [formValues, setFormValues] = useState(formAllValues);
  const [showPassword, setShowPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // icons
  const icons = {
    Add: Add,
    ArrangeHorizontalCircle: ArrangeHorizontalCircle,
    Bank: Bank,
    Document: Document,
    DirectInbox: DirectInbox,
    HomeTrendUp: HomeTrendUp,
    Moneys: Moneys,
    MenuBoard: MenuBoard,
    Messages2: Messages2,
    MoneySend: MoneySend,
    Note: Note,
    Note1: Note1,
    Profile2User: Profile2User,
    ShoppingBag: ShoppingBag,
    StatusUp: StatusUp,
    Tag: Tag,
    User: User,
    UserCirlceAdd: UserCirlceAdd,
    UserOctagon: UserOctagon
  };

  const transformData = (menu) => {
    console.log(menu);
    let organizedMenu = [];

    menu?.forEach((item, index) => {
      organizedMenu[index] = {
        id: item.menu_id,
        title: item.menu_name,
        icon: item.menu_icon,
        type: item.child_menu === null ? 'item' : 'collapse',
        url: item.child_menu === null && `/${item.menu_url}`,
        children:
          item.child_menu?.length > 0 &&
          item.child_menu?.map((item) => {
            return {
              id: item.menu_id,
              title: item.menu_name,
              type: 'item',
              url: `/${item.menu_url}`,
              icon: item.menu_icon
            };
          })
      };
    });
    return organizedMenu;
  };

  useEffect(() => {
    document.title = 'AltCase - Login';
  }, []);
  useEffect(() => {
    const data = location.state || {};
    console.log(Object.keys(data));
    console.log(data);
    if (Object.keys(data).length === 0) {
      console.log('No Redirection');
      setIsReset(false);
      return;
    }
    if (Object.keys(data)[0] === 'email_id') {
      setFormValues({
        ...data,
        password: ''
      });
      setIsReset(true);
    } else {
      setIsReset(false);
    }
  }, [isReset, location.state]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={formValues}
        validationSchema={Yup.object().shape({
          email_id: Yup.string().trim().email('Invalid email').required('Email is required'),
          password: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[0-9]/, 'Password must contain at least 1 numeric character')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character')
            .required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          if (isReset) {
            try {
              const response = await login(values.email_id, values.password);
              console.log(response);

              navigate('/reset-password', { state: response.data.data });
              setIsReset(false);
            } catch (err) {
              console.error(err);
              enqueueSnackbar(err.message, {
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
              setIsReset(false);
            }
          }
          if (!isReset) {
            try {
              const response = await login(values.email_id, values.password);

              const transformedData = transformData(response.data.data.menus);

              console.log(transformedData);

              // navigate(transformedData[0].url, {
              //   state: {
              //     from: ''
              //   },
              //   replace: true
              // });

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
              enqueueSnackbar(err.message, {
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
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form
            noValidate
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
                  // autoComplete
                  FormHelperTextProps={{
                    style: {
                      marginLeft: 0
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
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
                <Link
                  variant="body2"
                  component={RouterLink}
                  to={isLoggedIn && forgot ? forgot : '/forgot-password'}
                  color="text.primary"
                  sx={{ opacity: 0.8 }}
                >
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

// menu?.forEach((item, index) => {
//   organizedMenu[index] = {
//     id: item.menu_id,
//     // title: <FormattedMessage id={item.menu_name} />,
//     title: item.menu_name,
//     // icon: icons[item.menu_icon],
//     icon: item.menu_icon,
//     type: item.child_menu === null ? 'item' : 'collapse',
//     url: item.child_menu === null && `/${item.menu_url}`,
//     children:
//       item.child_menu?.length > 0 &&
//       item.child_menu?.map((item) => {
//         return {
//           id: item.menu_id,
//           // title: <FormattedMessage id={item.menu_name} />,
//           title: item.menu_name,
//           type: 'item',
//           url: `/${item.menu_url}`
//         };
//       })
//   };
// });
