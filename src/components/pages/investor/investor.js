import { useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FilterSearch } from 'iconsax-react';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';

// third-party
import { Formik } from 'formik';
import { toInteger } from 'lodash';
import Loader from 'components/atoms/loader/Loader';

// assets
import { SubmitButton } from 'components/atoms/button/button';
import { CustomTextField, CustomAutoComplete, FormikAutoComplete, NestedCustomTextField } from 'utils/textfield';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  // formValueFields,
  filterValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn,
  genderData,
  investorType
} from 'constant/investorValidation';
import {
  GetInvestorData,
  // GetOneInvestor,
  SaveInvestor,
  EditInvestor,
  DeleteOneInvestor,
  GetEditOneInvestor,
  GetIfa,
  GetIFASearch
} from 'hooks/investor/investor';
import IconTabs from 'components/organisms/investorTabs';

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

  // Tabs Error
  const handleTabError = (value) => {
    if (value.investor_address) {
      setErrorObject((prevValue) => {
        return { ...prevValue, addressDetailsError: true };
      });
    }
    if (value.investor) {
      setErrorObject((prevValue) => {
        return { ...prevValue, personalInfoError: true };
      });
    } else {
      setErrorObject({ ...errorObject, addressDetailsError: false, personalInfoError: false });
    }
  };

  // Custom fields/ Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Query for fetching investor data
  const {
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
      // setLoading(false);
    }
  });

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

  if (isPending || ifaPending) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          // validateOnBlur={false}
          // validateOnChange={false}
          // validate={validate}
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
              try {
                const payload = {
                  ...values,
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
                console.log(errors);
                console.log(dirty.valueOf('investor_address'));
                console.log(isValid.valueOf('investor_address'));
                // const errorsList = validate(values);
                // console.log(errorsList);

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
                    <Grid item xs={4}>
                      <NestedCustomTextField
                        label="Investor Name"
                        valueName="investor.investor_name"
                        placeholder="Please enter your Investor Name"
                        values={values.investor.investor_name}
                        type="text"
                        regType="string"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NestedCustomTextField
                        label="Pan Number"
                        valueName="investor.pan_no"
                        placeholder="Please enter your PAN Number"
                        values={values.investor.pan_no}
                        type="string"
                        regType="pan"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NestedCustomTextField
                        label="Mobile Number"
                        valueName="investor.mobile_no"
                        placeholder="Please enter your Mobile Number"
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
                    <Grid item xs={4}>
                      <FormikAutoComplete
                        options={investorType}
                        defaultValue={values.investor.is_senior_citizen}
                        setFieldValue={setFieldValue}
                        formName="investor.is_senior_citizen"
                        optionName="investor"
                        label="Investor Type"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      {/* Using Normal Autocomplete because of API body */}
                      <CustomAutoComplete
                        options={genderData}
                        defaultValue={selectedGender}
                        setSelected={setSelectedGender}
                        optionName="gender"
                        label="Gender"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NestedCustomTextField
                        label="Place of birth"
                        valueName="investor.place_of_birth"
                        placeholder="Please enter your Place of Birth"
                        values={values.investor.place_of_birth}
                        type="string"
                        regType="string"
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                  </Grid>
                </CardContent>

                <Grid item xs={12} lg={6}>
                  <IconTabs
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    isEditing={isEditing}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
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
            formValues={filterFormValues}
            formValueFields={filterValueFields}
            validationSchema={filterValidationSchema}
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
