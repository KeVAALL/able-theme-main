import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

// project-imports
import MainCard from '../mainCard/MainCard';
import IconButton from 'helpers/@extended/IconButton';
import { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength } from 'utils/password-validation';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toInteger } from 'lodash';

// assets
import { Eye, EyeSlash, Minus, TickCircle } from 'iconsax-react';
import { CustomTextField } from 'utils/textfield';
import { ChangeUserPassword } from 'hooks/user/user';

// ==============================|| USER PROFILE - PASSWORD CHANGE ||============================== //

const TabPassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
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

  return (
    <MainCard content={false} title="Change Password">
      <Formik
        initialValues={{
          existing_password: '',
          new_password: '',
          confirm_password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          existing_password: Yup.string().required('Existing Password is required'),
          new_password: Yup.string()
            .required('New Password is required')
            .matches(
              /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              'Password must contain at least 8 characters, one uppercase, one number and one special case character'
            ),
          confirm_password: Yup.string()
            .required('Confirm Password is required')
            .test('confirm', `Passwords don't match.`, (confirm, yup) => yup.parent.new_password === confirm)
        })}
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          try {
            const userID = localStorage.getItem('userID');

            setSubmitting(true);

            const payload = { user_id: toInteger(userID), method_name: 'updatepassword', ...values };

            await ChangeUserPassword(payload);

            resetForm();
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValid, dirty, touched, values }) => (
          <Box
            component="form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            sx={{ width: '100%' }}
          >
            <CardHeader title="Password Details" />
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} display="flex" justifyContent="center" alignItems="center">
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <CustomTextField
                        label="Existing Password"
                        name="existing_password"
                        placeholder="Enter Password"
                        values={values}
                        type={showOldPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowOldPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseDownPassword}
                                edge="end"
                                size="large"
                                color="secondary"
                              >
                                {showOldPassword ? <Eye /> : <EyeSlash />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        label="New Password"
                        name="new_password"
                        placeholder="Enter Password"
                        values={values}
                        type={showNewPassword ? 'text' : 'password'}
                        onChange={handleChange}
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
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ pl: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
                    <Typography variant="h5">New password must contain:</Typography>
                    <List sx={{ p: 0, mt: 1 }}>
                      <ListItem divider>
                        <ListItemIcon sx={{ color: minLength(values.new_password) ? 'success.main' : 'inherit', mr: 0.5 }}>
                          {minLength(values.new_password) ? <TickCircle variant="Bold" /> : <Minus />}
                        </ListItemIcon>
                        <ListItemText primary="At least 8 characters" />
                      </ListItem>
                      <ListItem divider>
                        <ListItemIcon sx={{ color: isLowercaseChar(values.new_password) ? 'success.main' : 'inherit', mr: 0.5 }}>
                          {isLowercaseChar(values.new_password) ? <TickCircle variant="Bold" /> : <Minus />}
                        </ListItemIcon>
                        <ListItemText primary="At least 1 lower letter (a-z)" />
                      </ListItem>
                      <ListItem divider>
                        <ListItemIcon sx={{ color: isUppercaseChar(values.new_password) ? 'success.main' : 'inherit', mr: 0.5 }}>
                          {isUppercaseChar(values.new_password) ? <TickCircle variant="Bold" /> : <Minus />}
                        </ListItemIcon>
                        <ListItemText primary="At least 1 uppercase letter (A-Z)" />
                      </ListItem>
                      <ListItem divider>
                        <ListItemIcon sx={{ color: isNumber(values.new_password) ? 'success.main' : 'inherit', mr: 0.5 }}>
                          {isNumber(values.new_password) ? <TickCircle variant="Bold" /> : <Minus />}
                        </ListItemIcon>
                        <ListItemText primary="At least 1 number (0-9)" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ color: isSpecialChar(values.new_password) ? 'success.main' : 'inherit', mr: 0.5 }}>
                          {isSpecialChar(values.new_password) ? <TickCircle variant="Bold" /> : <Minus />}
                        </ListItemIcon>
                        <ListItemText primary="At least 1 special characters" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ margin: '0 -8px !important' }} />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Button variant="outlined" color="secondary">
                      Cancel
                    </Button>
                    <Button
                      // disabled={isSubmitting || isValid}
                      type="submit"
                      variant="contained"
                    >
                      Save
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPassword;
