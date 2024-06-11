import { useOutletContext } from 'react-router'; // Check this
import { useState } from 'react';

// material-ui
import { Box, CardHeader, Divider, Grid } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toInteger } from 'lodash';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

// project-imports
import MainCard from '../mainCard/MainCard';
import countries from './data/countries';
// import { dispatch } from 'redux';
// import { openSnackbar } from 'redux/reducers/snackbar';

// assets
import { CustomTextField, FormikAutoComplete } from 'utils/textfield';
import { GetUser } from 'hooks/user/user';
import Loader from 'components/atoms/loader/Loader';
import Loadable from 'helpers/Loadable';

// ==============================|| USER PROFILE - PERSONAL ||============================== //

const TabPersonal = () => {
  // const location = useLocation();
  // useEffect(() => {
  //   const data = location.state || {};
  //   if (data = {}) {

  //   }
  //   console.log(data);
  //   setFormValues(data);
  // }, [location.state]);

  const formAllValues = {
    user_name: '',
    email_id: '',
    mobile_no: 0
  };
  const [formValues, setFormValues] = useState(formAllValues);

  // Query for fetching status dropdown
  const { pending: UserDetailPending, refetch: UserDetailRefetch } = useQuery({
    queryKey: ['userDetailData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const userID = localStorage.getItem('userID');

      const payload = { user_id: toInteger(userID), method_name: 'get_user_by_id' };

      return GetUser(payload);
    }, // Function to fetch product data
    onSuccess: (data) => {
      setFormValues(data); // Update product data with fetched data
    }
  });

  if (UserDetailPending) return <Loader />;

  return (
    <MainCard content={false} title="Personal Information" noAddButton sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
      <Formik
        enableReinitialize
        initialValues={{
          ...formValues,
          countryCode: '+91',
          address: '',
          address1: '',
          country: 'IN',
          state: 'Maharashtra',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          user_name: Yup.string().max(255).required('First Name is required.'),
          email_id: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
          mobile_no: Yup.number()
            .test('len', 'Contact should be exactly 10 digit', (val) => val?.toString().length === 10)
            .required('Phone number is required'),
          address: Yup.string().min(50, 'Address to short.').required('Address is required'),
          country: Yup.string().required('Country is required'),
          state: Yup.string().required('State is required')
        })}
        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // dispatch(
            //   openSnackbar({
            //     open: true,
            //     message: 'Personal profile updated successfully.',
            //     variant: 'alert',
            //     alert: {
            //       color: 'success'
            //     },
            //     close: false
            //   })
            // );
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <CardHeader title="User Details" />
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    disabled
                    label="User Name"
                    name="user_name"
                    placeholder="Enter User Name"
                    values={values}
                    type="text"
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
                <Grid item xs={12} sm={6}>
                  {/* <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Select value={values.countryCode} name="countryCode" onBlur={handleBlur} onChange={handleChange}>
                      <MenuItem value="+91">+91</MenuItem>
                      <MenuItem value="1-671">1-671</MenuItem>
                      <MenuItem value="+36">+36</MenuItem>
                      <MenuItem value="(225)">(255)</MenuItem>
                      <MenuItem value="+39">+39</MenuItem>
                      <MenuItem value="1-876">1-876</MenuItem>
                      <MenuItem value="+7">+7</MenuItem>
                      <MenuItem value="(254)">(254)</MenuItem>
                      <MenuItem value="(373)">(373)</MenuItem>
                      <MenuItem value="1-664">1-664</MenuItem>
                      <MenuItem value="+95">+95</MenuItem>
                      <MenuItem value="(264)">(264)</MenuItem>
                    </Select> */}
                  <CustomTextField
                    disabled
                    label="Contact Number"
                    name="mobile_no"
                    placeholder="Enter Contact Number"
                    values={values}
                    type="text"
                    regType="number"
                    setFieldValue={setFieldValue}
                    onBlur={handleBlur}
                    touched={touched}
                    errors={errors}
                    autoComplete
                    FormHelperTextProps={{
                      style: {
                        marginLeft: 0
                      }
                    }}
                    inputProps={{ maxLength: 10 }}
                  />
                  {/* </Stack> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    disabled
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
              </Grid>
            </Box>
            <Divider />
            <CardHeader title="Address" />
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    multiline
                    rows={3}
                    label="Address"
                    name="address"
                    placeholder="Enter Address"
                    values={values}
                    type="text"
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
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    multiline
                    rows={3}
                    label="Address Line 2"
                    name="address1"
                    placeholder="Enter Address"
                    values={values}
                    type="text"
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
                <Grid item xs={12} sm={6}>
                  <FormikAutoComplete
                    options={countries}
                    defaultValue={values.country}
                    setFieldValue={setFieldValue}
                    formName="country"
                    keyName="code"
                    idName="code"
                    optionName="label"
                    label="Select Country"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label="State"
                    name="state"
                    placeholder="Enter State"
                    values={values}
                    type="text"
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
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPersonal;

{
  /* <Stack spacing={1.25}>
  <InputLabel htmlFor="personal-country">Country</InputLabel>
  <Autocomplete
    id="personal-country"
    fullWidth
    value={countries.filter((item) => item.code === values?.country)[0]}
    onBlur={handleBlur}
    onChange={(event, newValue) => {
      setFieldValue('country', newValue === null ? '' : newValue.code);
    }}
    options={countries}
    autoHighlight
    isOptionEqualToValue={(option, value) => option.code === value?.code}
    getOptionLabel={(option) => option.label}
    renderOption={(props, option) => (
      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        {option.code && (
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
        )}
        {option.label}
        {option.code && `(${option.code}) ${option.phone}`}
      </Box>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Choose a country"
        name="country"
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password' // disable autocomplete and autofill
        }}
      />
    )}
  />
  {touched.country && errors.country && (
    <FormHelperText error id="personal-country-helper">
      {errors.country}
    </FormHelperText>
  )}
</Stack>; */
}
