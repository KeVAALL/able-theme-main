/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent, Button, useMediaQuery, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';
import { SubmitButton } from 'components/atoms/button/button';
import { CustomTextField, FormikAutoComplete, NestedCustomTextField } from 'utils/textfield';
import {
  formAllValues,
  validationSchema,
  // tableColumns,
  VisibleColumn,
  genderData,
  StatusCell
} from 'constant/investorValidation';
import {
  GetInvestorData,
  SaveInvestor,
  EditInvestor,
  DeleteOneInvestor,
  GetEditOneInvestor,
  GetIfa,
  GetIFASearch
} from 'hooks/investor/investor';
import IconTabs from 'components/organisms/investorTabs';
import Loader from 'components/atoms/loader/Loader';
import axios from 'utils/axios';

// third-party
import { enqueueSnackbar } from 'notistack';
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
import { toInteger } from 'lodash';

// assets
import { Add, FilterSearch } from 'iconsax-react';
import { minWidth } from '@mui/system';
import { Stack } from 'immutable';
import LoadingButton from 'helpers/@extended/LoadingButton';

function Investor() {
  // Main data states
  const [investorData, setInvestorData] = useState([]);
  const [ifaData, setIfaData] = useState([]);
  // const [loading, setLoading] = useState(true);

  // Edit Logic State
  const [isEditing, setIsEditing] = useState(false);
  const [isInvestorActive, setInvestorActive] = useState();

  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(false); // State to toggle visibility of the table form
  // Loader
  const [loadingInvestor, setLoadingInvestor] = useState(false);

  // Selection states
  const [selectedGender, setSelectedGender] = useState(null);

  const [selectedDeclaration, setSelectedDeclaration] = useState({
    isPoliticallyExposed: false,
    isRelativeToPoliticallyExposed: false,
    isResidentOutsideIndia: false
  });

  // Nominee
  const [nomineeData, setNomineeData] = useState([]);

  // Tabs Error
  const [errorObject, setErrorObject] = useState({
    personalInfoError: false,
    addressDetailsError: false,
    professionalDetailsError: false,
    nomineeError: false,
    declarationError: false
  });
  const [personalInfoError, setPersonalInfoError] = useState(false);
  const [addressDetailsError, setAddressDetailsError] = useState(false);
  const [professionalDetailsError, setProfessionalDetailsError] = useState(false);
  const [nomineeError, setNomineeError] = useState(false);
  const [declarationError, setDeclarationError] = useState(false);

  // Form State
  const [formValues, setFormValues] = useState(formAllValues);
  // Theme
  const theme = useTheme();
  const mdUp = theme.breakpoints.up('md');
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Sets form values for editing
  const setEditing = (value) => {
    setFormValues(value);
    handleIsInvestorActive(value.investor.is_active);
    setSelectedGender(value.investor.gender);
    setSelectedDeclaration({
      isPoliticallyExposed: Boolean(value.declaration.is_pep),
      isRelativeToPoliticallyExposed: Boolean(value.declaration.is_rpep),
      isResidentOutsideIndia: Boolean(value.declaration.is_foreign_tax_resident)
    });
  };
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  const setActiveClose = () => {
    setIsEditing(false);
  };
  const handleIsInvestorActive = (initialValue) => {
    setInvestorActive(initialValue);
  };

  // Toggle Table and Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };

  // Search one item state
  const setSearchData = (investor) => {
    setInvestorData(investor);
  };

  const tableColumns = [
    {
      Header: 'Master ID',
      accessor: 'investor_code'
    },
    {
      Header: 'Folio ID',
      accessor: 'folio_code'
    },
    {
      Header: 'Investor Name',
      accessor: 'investor_name',
      minWidth: 250,
      Cell: ({ value, row }) => {
        return (
          // <Stack direction="row" spacing={1}>
          <Box>
            <Link
              component="button"
              variant="body2"
              underline="always"
              sx={{ fontSize: '0.80rem' }}
              onClick={async () => {
                setLoadingInvestor(true);
                try {
                  await GetEditOneInvestor(setEditing, row.original.investor_id);
                } catch (err) {
                  console.log(err);
                } finally {
                  console.log('Here');
                  setLoadingInvestor(false);
                }
                setActiveEditing();
                changeTableVisibility();
              }}
            >
              {value}
            </Link>
            {/* {loadingInvestor && ( */}
            <LoadingButton loading={true} color="secondary" sx={{ display: !loadingInvestor ? 'none' : 'inline' }} />
            {/* <Add style={{ transform: 'rotate(45deg)' }} /> */}
            {/* </LoadingButton> */}
            {/* )} */}
          </Box>
          // </Stack>
        );
      }
    },
    {
      Header: 'IFA',
      accessor: 'ifa_name',
      minWidth: 150
    },
    {
      Header: 'Pan Number',
      accessor: 'pan_no'
    },
    {
      Header: 'Email',
      accessor: 'email_id'
    },
    {
      Header: 'Mobile Number',
      accessor: 'mobile_no'
    },
    {
      Header: 'Reg. date',
      accessor: 'created_on'
    },
    {
      Header: 'Status',
      accessor: 'is_active',
      customCell: StatusCell
    }
  ];

  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
    setSelectedGender();
    setSelectedDeclaration({
      isPoliticallyExposed: false,
      isRelativeToPoliticallyExposed: false,
      isResidentOutsideIndia: false
    });
    setPersonalInfoError(false);
    setAddressDetailsError(false);
    setProfessionalDetailsError(false);
    setNomineeError(false);
    setDeclarationError(false);
  };

  // Gender Validation
  const genderValidate = (value) => {
    if (typeof value === 'string') {
      genderData.find((el) => {
        if (el.gender === value) {
          return el.id;
        }
      });
    } else {
      return value;
    }
  };
  // Nominee
  const handleNewNominee = (value) => {
    console.log(value);
    setNomineeData((prev) => {
      return [...prev, value];
    });
  };
  // Declaration
  const handleDeclarationClick = (value) => {
    if (value === 'PoliticallyExposed') {
      setSelectedDeclaration({ ...selectedDeclaration, isPoliticallyExposed: !selectedDeclaration.isPoliticallyExposed });
    } else if (value === 'RelativeToPoliticallyExposed') {
      setSelectedDeclaration({
        ...selectedDeclaration,
        isRelativeToPoliticallyExposed: !selectedDeclaration.isRelativeToPoliticallyExposed
      });
    } else if (value === 'ResidentOutsideIndia') {
      setSelectedDeclaration({ ...selectedDeclaration, isResidentOutsideIndia: !selectedDeclaration.isResidentOutsideIndia });
    }
  };

  // Custom fields/ Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Query for fetching IFA data
  const {
    isPending: ifaPending,
    error: ifaError,
    refetch: IfaTableDataRefetch
  } = useQuery({
    queryKey: ['ifaTableData'],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: () => {
      const payload = {
        method_name: 'getall'
      };
      return GetIfa(payload);
    },
    onSuccess: (data) => {
      setIfaData(data);
    }
  });

  // Query for fetching investor data
  const {
    isFetching,
    isPending,
    error,
    refetch: InvestorTableDataRefetch
  } = useQuery({
    queryKey: ['investorTableData'],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: () => {
      const payload = {
        method_name: 'getinvestor',
        search: '',
        ifa_id: 0
      };
      return GetInvestorData(payload);
    },
    onSuccess: (data) => {
      setInvestorData(data);
    }
  });

  const location = useLocation();
  const navigate = useNavigate();

  const callFirstApi = useCallback(async (data) => {
    try {
      console.log(data, 'calling api');
      const response = await axios.get(
        `https://altcaseinvestor.we3.in/api/v1/onboarding/digilocker-sso/callback?status=success&initiation_decentro_transaction_id=${data}`
      );
      console.log('First API call', response);

      console.log(response.data.status);
      if (response.data.status === 200) {
        console.log('2nd api call');
        enqueueSnackbar('Success', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
        const retrievedObject = localStorage.getItem('tempVar');

        const currentUrl = location.pathname + location.search;
        const newUrl = '/investor';

        if (currentUrl !== newUrl) {
          // This will update the URL without reloading the page
          navigate(newUrl, { replace: true });
        }

        await GetEditOneInvestor(setEditing, JSON.parse(retrievedObject).investor_id);
        setActiveEditing();
        changeTableVisibility();
        localStorage.removeItem('tempVar');
      }
    } catch (error) {
      console.error('Error in first API call:', error);
    }
  }, []);

  useEffect(() => {
    if (!!location?.search?.split('=').slice(1)[0] && !!localStorage.getItem('tempVar')) {
      callFirstApi(location?.search?.split('=').slice(1)[0]);
    }

    const retrievedObject = localStorage.getItem('tempVar');

    console.log('retrievedObject: ', JSON.parse(retrievedObject));
  }, [location, navigate]);

  if (isPending || ifaPending) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          validateOnBlur={false}
          // validateOnChange={false}
          // validate={validate}
          enableReinitialize={true}
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const userID = localStorage.getItem('userID');
            if (isEditing === false) {
              const payload = {
                ...values,
                user_id: toInteger(userID),
                method_name: 'add',
                investor: {
                  ...values.investor,
                  gender_id: genderValidate(selectedGender),
                  is_foreign_tax_resident: toInteger(selectedDeclaration.isResidentOutsideIndia),
                  is_rpep: toInteger(selectedDeclaration.isRelativeToPoliticallyExposed),
                  is_pep: toInteger(selectedDeclaration.isPoliticallyExposed)
                }
              };
              try {
                await SaveInvestor(payload);

                changeTableVisibility();
                InvestorTableDataRefetch();
                clearFormValues();
              } catch (err) {
                console.log(err);
              }
            }
            if (isEditing === true) {
              // console.log(values.filter((el) => el));
              // const newData = delete values.port_folio;
              const { port_folio, investor_bank, ...newData } = values;
              try {
                const payload = {
                  ...newData,
                  user_id: toInteger(userID),
                  investor_id: values.investor.investor_id,
                  method_name: 'update',
                  investor: {
                    ...values.investor,
                    is_active: toInteger(isInvestorActive),
                    gender_id: genderValidate(selectedGender),
                    is_foreign_tax_resident: toInteger(selectedDeclaration.isResidentOutsideIndia),
                    is_rpep: toInteger(selectedDeclaration.isRelativeToPoliticallyExposed),
                    is_pep: toInteger(selectedDeclaration.isPoliticallyExposed)
                  }
                };
                await EditInvestor(payload);

                changeTableVisibility();
                InvestorTableDataRefetch();
                clearFormValues();
                setActiveClose();
              } catch (err) {
                console.log(err);
              }
            }
            // setErrorObject(errorObject);
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
                handleSubmit();
                event.preventDefault();
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
                  title="Investor Entry"
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues?.investor}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsInvestorActive}
                  isActive={isInvestorActive}
                  isValid={isValid}
                  dirty={dirty}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} xs={6}>
                      <NestedCustomTextField
                        disabled={values.investor.is_ckyc_verified || values.investor.is_digilocker_verified}
                        label="Investor Name"
                        valueName="investor.investor_name"
                        placeholder="Please enter Investor Name"
                        values={values.investor.investor_name}
                        type="text"
                        regType="string"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <NestedCustomTextField
                        disabled={values.investor.is_ckyc_verified || values.investor.is_digilocker_verified}
                        label="Mobile Number"
                        valueName="investor.mobile_no"
                        placeholder="Please enter Mobile Number"
                        values={values.investor.mobile_no}
                        type="string"
                        regType="number"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    {isEditing && (
                      <Grid item md={4} xs={6}>
                        <NestedCustomTextField
                          disabled={true}
                          label="Master ID"
                          valueName="investor.investor_code"
                          values={values.investor.investor_code}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                          inputProps={{ maxLength: 10 }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>

                <Grid item xs={12} lg={6}>
                  <IconTabs
                    values={values}
                    validationSchema={validationSchema}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    isEditing={isEditing}
                    errors={errors}
                    touched={touched}
                    setEditing={setEditing}
                    setFieldValue={setFieldValue}
                    selectedGender={selectedGender}
                    setSelectedGender={setSelectedGender}
                    selectedDeclaration={selectedDeclaration}
                    handleDeclarationClick={handleDeclarationClick}
                    nomineeData={nomineeData}
                    handleNewNominee={handleNewNominee}
                    // errorObject={errorObject}
                    // handleTabError={handleTabError}
                    personalInfoError={personalInfoError}
                    setPersonalInfoError={setPersonalInfoError}
                    addressDetailsError={addressDetailsError}
                    setAddressDetailsError={setAddressDetailsError}
                    professionalDetailsError={professionalDetailsError}
                    setProfessionalDetailsError={setProfessionalDetailsError}
                    nomineeError={nomineeError}
                    setNomineeError={setNomineeError}
                    declarationError={declarationError}
                    setDeclarationError={setDeclarationError}
                    isValid={isValid}
                    dirty={dirty}
                  />
                </Grid>
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard
          title="Investor Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <Formik
            initialValues={{
              search: '',
              ifa_id: 0
            }}
            onSubmit={async (values, { resetForm }) => {
              const payload = {
                method_name: 'getinvestor',
                ...values
              };
              const searchResult = await GetIFASearch(payload);
              if (searchResult) {
                setSearchData(searchResult);
              }
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
                <CardContent sx={{ paddingLeft: '16px !important', paddingRight: matchDownSM ? '0px !important' : '24px !important' }}>
                  <Grid container spacing={2}>
                    {/* <Grid item xs={2.5} style={{ paddingLeft: 0, paddingTop: 0 }}>
                      <CustomTextField
                        label="FD Name"
                        name="fd_name"
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
                    </Grid> */}

                    <Grid item md={2.5} sm={3} xs={4} style={{ paddingLeft: 0, paddingTop: 0 }}>
                      <FormikAutoComplete
                        options={ifaData}
                        defaultValue={values.ifa_id}
                        setFieldValue={setFieldValue}
                        formName="ifa_id"
                        optionName="item_value"
                        label="Select IFA"
                      />
                    </Grid>

                    <Grid item md={2.5} sm={3} xs={4} style={{ paddingTop: 0 }}>
                      <CustomTextField
                        label="Search"
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

                    <Grid item md={1.5} sm={3} xs={4} style={{ paddingTop: 0 }}>
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

          {/* ------------- */}
          <MultiTable
            columns={columns}
            data={investorData}
            formValues={[]}
            formValueFields={[]}
            validationSchema={{}}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={() => {}}
            deleteOneItem={DeleteOneInvestor}
            getEditData={GetEditOneInvestor}
            getEditReqField={'investor_id'}
            setSearchData={setSearchData}
            tableDataRefetch={InvestorTableDataRefetch}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
            isFetching={isFetching}
          />
        </MainCard>
      )}
    </>
  );
}

export default Investor;

{
  /* <CustomAutoComplete
                        options={ifaData}
                        defaultValue={selectedIFA}
                        setSelected={setSelectedIFA}
                        optionName="item_value"
                        label="IFA"
                      /> */
}
// if (errors) {
//   handleTabError(errors);
// }
{
  /* <Card
                  sx={{
                    position: 'relative',
                    border: '1px solid',
                    borderRadius: 1.5,
                    borderColor: theme.palette.divider,
                    overflow: 'visible'
                  }}
                > */
}
{
  /* <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title="Interest Rate" />
                    <Stack direction="row" alignItems="center" spacing={1.5} paddingRight={2.5}>
                      <Box>
                        <AnimateButton>
                          <Button
                            variant="outlined"
                            color="secondary"
                            type="button"
                            onClick={() => {
                              isNotEditingInterestRate();
                            }}
                          >
                            Cancel
                          </Button>
                        </AnimateButton>
                      </Box>
                    </Stack>
                  </Stack> */
}

{
  /* <Divider /> */
}

// const handleOnGenderChange = (event) => {
//   residency.map((el) => {
//     if (el.gender === event.target.outerText) {
//       setSelectedGender(el.id);
//     }
//   });
// };
// const handleOnResidenceChange = (event) => {
//   residency.map((el) => {
//     if (el.status === event.target.outerText) {
//       setSelectedResidenceID(el.id);
//     }
//   });
// };
// const handleOnMaritalChange = (event) => {
//   marital_status.map((el) => {
//     if (el.status === event.target.outerText) {
//       setSelectedMarital(el.id);
//     }
//   });
// };
// const handleOnOccupationChange = (event) => {
//   occupation.map((el) => {
//     if (el.occupation_name === event.target.outerText) {
//       setSelectedOccupation(el.occupation_id);
//     }
//   });
// };

// Tabs Error
// const handleTabError = (value) => {
//   if (value.investor_address) {
//     setErrorObject((prevValue) => {
//       return { ...prevValue, addressDetailsError: true };
//     });
//   }
//   if (value.investor) {
//     setErrorObject((prevValue) => {
//       return { ...prevValue, personalInfoError: true };
//     });
//   } else {
//     setErrorObject({ ...errorObject, addressDetailsError: false, personalInfoError: false });
//   }
// };
