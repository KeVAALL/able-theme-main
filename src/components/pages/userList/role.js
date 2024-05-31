import { useMemo, useState } from 'react';

// material-ui
import {
  Divider,
  Box,
  Card,
  Grid,
  CardContent,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';
import Loader from 'components/atoms/loader/Loader';

// third-party
import { Formik } from 'formik';
import { toInteger } from 'lodash';

// assets
import { SubmitButton } from 'components/atoms/button/button';
import { CustomTextField, CustomCheckbox, FormikAutoComplete } from 'utils/textfield';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/userRoleValidation';
import { FilterSearch } from 'iconsax-react';
import { DeleteRole, EditRole, GetMenu, GetRoles, GetSelectedMenu, SaveRole, SearchRoles } from 'hooks/user/user';

function Role() {
  // Main data state to hold the list of issuers
  const [userRoleData, setUserRoleData] = useState([]);
  // Editing States
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [isRoleActive, setRoleActive] = useState(); // State to track if the issuer is active or not active
  // Form Visibility
  const [showTable, setShowTable] = useState(false); // State to hold form input values
  // Form State
  const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values
  // Dropdown
  const [roleDropdown, setRoleDropdown] = useState([]);
  // Checkbox
  const [allMenu, setAllMenu] = useState([]);
  // Theme
  const theme = useTheme();
  const mdUp = theme.breakpoints.up('md');

  // Functions
  // Editing States
  const setEditing = (value) => {
    console.log(value);
    setFormValues(value);

    const selectedMenus = allMenu.map((menu) => {
      return {
        ...menu,
        isSelected: value.menu_ids.includes(menu.menu_id)
      };
    });

    setAllMenu(selectedMenus);
  };
  // Activates editing mode
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  // Deactivates editing mode
  const setActiveClose = () => {
    setIsEditing(false);
  };
  const handleIsRoleActive = (initialValue) => {
    setRoleActive(initialValue);
  };
  // Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };
  // Search Data
  const setSearchData = (role) => {
    setUserRoleData(role);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
    setAllMenu((prevMenu) => {
      return prevMenu.map((item) => {
        return { ...item, isSelected: false };
      });
    });
  };
  // Checkbox
  const handleCheckbox = (value) => {
    setAllMenu((prevMenu) => {
      return prevMenu.map((item) => {
        if (item.menu_id === value) {
          return { ...item, isSelected: !item.isSelected };
        }
        return item;
      });
    });
  };
  // Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Query for fetching menu Data
  const {
    isPending, // Flag indicating if query is pending
    error, // Error object if query fails
    refetch // Function to refetch issuer data
  } = useQuery({
    queryKey: ['getAllMenu'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const payload = {
        method_name: 'getmenu'
      };
      return GetMenu(payload);
    }, // Function to fetch issuer data
    onSuccess: (data) => {
      const mappedMenus = data.map((menu) => {
        return { ...menu, isSelected: false };
      });

      console.log(mappedMenus);

      setAllMenu(mappedMenus);
    }
  });

  // Query for fetching role Data
  const {
    isFetching,
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
      setUserRoleData(data);
    }
  });

  // if (isPending || rolePending) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const userID = localStorage.getItem('userID');
            if (isEditing === false) {
              const selectedMenus = allMenu.filter((menu) => menu.isSelected === true).map((menu) => menu.menu_id);

              const formValues = {
                method_name: 'add',
                user_id: toInteger(userID),
                menu_id: selectedMenus,
                ...values
              };

              try {
                const response = await SaveRole(formValues);
                changeTableVisibility();
                refetchRole();
              } catch (err) {
                console.log(err);
              }
            }
            if (isEditing === true) {
              const selectedMenus = allMenu.filter((menu) => menu.isSelected === true).map((menu) => menu.menu_id);
              const formValues = {
                ...values,
                method_name: 'update',
                is_active: toInteger(isRoleActive),
                user_id: toInteger(userID),
                menu_id: selectedMenus
              };
              try {
                const response = await EditRole(formValues);
                changeTableVisibility();
                refetchRole();
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
                  title="Role Entry"
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsRoleActive}
                  isActive={isRoleActive}
                  isValid={isValid}
                  dirty={dirty}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Role Name"
                        name="role_name"
                        placeholder={'Please enter Role Name'}
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

                    <Grid item xs={0} lg={4}></Grid>
                    <Grid item xs={0} lg={4}></Grid>

                    <Grid item xs={12}>
                      <MainCard sx={{ borderRadius: 0.6 }} content={false}>
                        <List sx={{ p: 0, '& .MuiListItemButton-root': { borderRadius: 0, my: 0 } }}>
                          <Grid container>
                            <Grid item xs={12}>
                              <ListItem disablePadding divider sx={{ height: '100%' }}>
                                <Stack sx={{ width: '100%', height: '100%' }} flexDirection="row" alignItems="center">
                                  <ListItemButton sx={{ width: '5%', backgroundColor: '#F5F5F5', height: '100%' }}>
                                    <ListItemText primary="#" sx={{ display: 'flex', justifyContent: 'center' }} />
                                  </ListItemButton>
                                  <Divider orientation="vertical" flexItem />
                                  <Stack sx={{ width: '95%', height: '100%' }} flexDirection="row" alignItems="center">
                                    <ListItemButton sx={{ width: '80%', height: '100%', backgroundColor: '#F5F5F5' }}>
                                      <ListItemText primary="Menu Name" />
                                    </ListItemButton>
                                    <Divider orientation="vertical" flexItem />
                                    <ListItemButton sx={{ width: '11.5%', backgroundColor: '#F5F5F5' }}>
                                      <ListItemText sx={{ display: 'flex', justifyContent: 'center' }} primary="Display Flag" />
                                    </ListItemButton>
                                  </Stack>
                                </Stack>
                              </ListItem>
                            </Grid>
                            {allMenu &&
                              allMenu.map((dec, index) => {
                                return (
                                  <Grid key={dec.menu_id} item xs={12}>
                                    <ListItem disablePadding divider>
                                      <Stack sx={{ width: '100%' }} flexDirection="row" alignItems="center">
                                        <ListItemText
                                          // primary={dec.menu_id}
                                          primary={index + 1}
                                          sx={{ width: '5%', display: 'flex', justifyContent: 'center' }}
                                        />
                                        <Divider orientation="vertical" flexItem />
                                        <Stack sx={{ width: '95%' }} flexDirection="row" alignItems="center">
                                          <ListItemButton sx={{ width: '80%' }}>
                                            <ListItemText primary={dec.menu_name} />
                                          </ListItemButton>
                                          <Divider orientation="vertical" flexItem />
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={dec.isSelected}
                                                onChange={() => {
                                                  handleCheckbox(dec.menu_id);
                                                }}
                                                name="isSelected"
                                                sx={{ width: '100%' }}
                                              />
                                            }
                                            labelPlacement="start"
                                            sx={{ mr: 1, ml: 0, width: '15%', display: 'flex', justifyContent: 'center' }}
                                          />
                                        </Stack>
                                      </Stack>
                                    </ListItem>
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </List>
                      </MainCard>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard
          title="Role Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <Formik
            initialValues={{
              search: ''
            }}
            onSubmit={async (values, { resetForm }) => {
              const payload = {
                method_name: 'getone',
                ...values
              };
              const search = await SearchRoles(payload);

              setUserRoleData(search);
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
                    <Grid item md={2.5} sm={3} xs={5} style={{ paddingLeft: 0, paddingTop: 0 }}>
                      <CustomTextField
                        label="Role Name"
                        name="search"
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

                    <Grid item md={2.5} sm={3} xs={5} style={{ paddingTop: 0 }}>
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
            data={userRoleData}
            formValues={{}}
            // formValueFields={formValueFields}
            // validationSchema={filterValidationSchema}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={() => {}}
            deleteOneItem={DeleteRole}
            getEditData={GetSelectedMenu}
            getEditReqField={'role_id'}
            setSearchData={setSearchData}
            tableDataRefetch={refetchRole}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
            isFetching={isFetching}
          />
        </MainCard>
      )}
    </>
  );
}

export default Role;

// <Grid key={dec.menu_id} item xs={12} lg={4}>
//   <FormControlLabel
//     control={
//       <Checkbox
//         checked={dec.isSelected}
//         onChange={() => {
//           handleCheckbox(dec.menu_id);
//         }}
//         name="isSelected"
//       />
//     }
//     label={dec.menu_name}
//     labelPlacement="start"
//     sx={{ mr: 1, ml: 0 }}
//   />
// </Grid>
