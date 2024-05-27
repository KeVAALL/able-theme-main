import { useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent, Button, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';
import IconButton from 'helpers/@extended/IconButton';

// third-party
import { Eye, EyeSlash, FilterSearch } from 'iconsax-react';
import { toInteger } from 'lodash';
import { Formik } from 'formik';
import Loader from 'components/atoms/loader/Loader';

// assets
import { SubmitButton } from 'components/atoms/button/button';
import { CustomTextField, FormikAutoComplete } from 'utils/textfield';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/userListValidation';
import { DeleteUser, EditUser, GetRoles, GetUsers, SaveUser, SearchUsers } from 'hooks/user/user';

function UserList() {
  const [userListData, setUserListData] = useState([]);
  // Editing States
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [isUserActive, setUserActive] = useState(); // State to track if the issuer is active or not active
  // Form Visibility
  const [showTable, setShowTable] = useState(false); // State to hold form input values
  // Form State
  const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values
  // Dropdown
  const [roleDropdown, setRoleDropdown] = useState([]);
  // User Password
  const [showPassword, setShowPassword] = useState(false);

  // Theme
  const theme = useTheme();
  const mdUp = theme.breakpoints.up('md');

  // Functions
  // Editing States
  const setEditing = (value) => {
    setFormValues(value);
  };
  // Activates editing mode
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  // Deactivates editing mode
  const setActiveClose = () => {
    setIsEditing(false);
  };
  const handleIsUserActive = (initialValue) => {
    setUserActive(initialValue);
  };
  // Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };
  // Search Data
  const setSearchData = (user) => {
    setUserListData(user);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
  };
  // User Password
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Query for fetching role Data
  const {
    isPending: rolePending, // Flag indicating if query is pending
    error: roleError, // Error object if query fails
    refetch: refetchRole // Function to refetch issuer data
  } = useQuery({
    queryKey: ['getAllRoles'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const payload = {
        method_name: 'getall'
      };
      return GetRoles(payload);
    }, // Function to fetch issuer data
    onSuccess: (data) => {
      setRoleDropdown(data);
    }
  });
  // Query for fetching All Users
  const {
    isPending: userPending, // Flag indicating if query is pending
    error: userError, // Error object if query fails
    refetch: userListRefetch // Function to refetch issuer data
  } = useQuery({
    queryKey: ['getUserList'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const payload = {
        method_name: 'getall'
      };
      return GetUsers(payload);
    }, // Function to fetch issuer data
    onSuccess: (data) => {
      setUserListData(data);
    }
  });

  if (rolePending || userPending) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const userID = localStorage.getItem('userID');
            const applicationID = localStorage.getItem('applicationID');
            if (isEditing === false) {
              const formValues = {
                method_name: 'add',
                admin_user_id: toInteger(userID),
                application_id: toInteger(applicationID),
                is_active: toInteger(isUserActive),
                ...values
              };

              try {
                const response = await SaveUser(formValues);
                changeTableVisibility();
                userListRefetch();
              } catch (err) {
                console.log(err);
              }
            }
            if (isEditing === true) {
              const formValues = {
                ...values,
                method_name: 'update',
                admin_user_id: toInteger(userID),
                application_id: toInteger(applicationID),
                is_active: toInteger(isUserActive)
              };

              try {
                const response = await EditUser(formValues);
                changeTableVisibility();
                userListRefetch();
              } catch (err) {
                console.log(err);
              }
            }
            // changeTableVisibility();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isValid,
            dirty,
            resetForm,
            isSubmitting
          }) => (
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              sx={{ width: '100%' }}
            >
              <Card
                sx={{
                  position: 'relative',
                  border: '1px solid',
                  borderRadius: 1.5,
                  borderColor: theme.palette.divider,
                  overflow: 'visible'
                }}
              >
                <SubmitButton
                  title="User List Entry"
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={true}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsUserActive}
                  isActive={isUserActive}
                  isValid={isValid}
                  dirty={dirty}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="User Name"
                        name="user_name"
                        placeholder={'Please enter User Name'}
                        values={values}
                        type="text"
                        regType="string"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                      />
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Email ID"
                        name="email_id"
                        placeholder="Please enter Email ID"
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
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        disabled={isEditing}
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
                          endAdornment: !isEditing && (
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

                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Mobile Number"
                        name="mobile_no"
                        placeholder={'Please enter Mobile Number'}
                        values={values}
                        type="text"
                        regType="number"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}>
                      <FormikAutoComplete
                        options={roleDropdown}
                        defaultValue={values.role_id}
                        setFieldValue={setFieldValue}
                        formName="role_id"
                        idName="role_id"
                        optionName="role_name"
                        label="Role"
                      />
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard
          title="User List Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <Formik
            initialValues={{
              username: '',
              role_id: 0
            }}
            onSubmit={async (values, { resetForm }) => {
              const payload = {
                method_name: 'getone',
                ...values
              };
              const search = await SearchUsers(payload);

              setUserListData(search);
            }}
          >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, resetForm }) => (
              <Box
                component="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
                sx={{ width: '100%' }}
              >
                <CardContent sx={{ paddingLeft: '16px !important' }}>
                  <Grid container spacing={2}>
                    <Grid item md={2.5} sm={3} xs={4} style={{ paddingLeft: 0, paddingTop: 0 }}>
                      <CustomTextField
                        label="User Name"
                        name="username"
                        values={values}
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                      />
                    </Grid>

                    <Grid item md={2.5} sm={3} xs={4} style={{ paddingTop: 0 }}>
                      <FormikAutoComplete
                        options={roleDropdown}
                        defaultValue={values.role_id}
                        setFieldValue={setFieldValue}
                        formName="role_id"
                        idName="role_id"
                        optionName="role_name"
                        label="Role"
                      />
                    </Grid>

                    <Grid item md={2.5} sm={3} xs={4} style={{ paddingTop: 0 }}>
                      <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        startIcon={<FilterSearch />}
                        sx={{
                          justifySelf: 'center',
                          width: !mdUp ? 'auto' : '100%',
                          borderRadius: 0.6 // Set width to 'auto' when screen size is medium or larger, otherwise '100%'
                        }}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Box>
            )}
          </Formik>

          <MultiTable
            columns={columns}
            data={userListData}
            formValues={{}}
            // formValueFields={formValueFields}
            // validationSchema={filterValidationSchema}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={() => {}}
            deleteOneItem={DeleteUser}
            setSearchData={setSearchData}
            tableDataRefetch={userListRefetch}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
          />
        </MainCard>
      )}
    </>
  );
}

export default UserList;
