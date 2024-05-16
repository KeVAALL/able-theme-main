import { useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent, TableCell, Button, Stack, CardHeader, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Trash, Edit2, FilterSearch, DiscountShape, Additem, SearchNormal1 } from 'iconsax-react';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';

// third-party
import { Formik } from 'formik';
import * as yup from 'yup';
import Loader from 'components/atoms/loader/Loader';
import { SubmitButton } from 'components/atoms/button/button';
import CustomTextField, { CustomAutoComplete, FormikAutoComplete, NestedCustomTextField, dateFormatter } from 'utils/textfield';

// assets
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
  residency,
  marital_status,
  occupation,
  investorType
} from 'constant/investorValidation';
import {
  GetInvestorData,
  GetOneInvestor,
  SaveInvestor,
  EditInvestor,
  DeleteOneInvestor,
  GetEditOneInvestor,
  GetIfa
} from 'hooks/investor/investor';
import AnimateButton from 'helpers/@extended/AnimateButton';
import IconTabs from 'components/organisms/iconTabs';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

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
  const [selectedIFA, setSelectedIFA] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [selectedAnnualIncome, setSelectedAnnualIncome] = useState(null);
  const [selectedIncomeSource, setSelectedIncomeSource] = useState(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState({
    isPoliticallyExposed: true,
    isRelativeToPoliticallyExposed: true,
    isResidentOutsideIndia: true
  });

  // Address Details Checkbox
  const [sameAddress, setSameAddress] = useState(false);

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

  // Form State
  const [formValues, setFormValues] = useState(formAllValues);
  // Theme
  const theme = useTheme();
  const mdUp = theme.breakpoints.up('md');

  // Sets form values for editing
  const setEditing = (value) => {
    console.log(value);
    setFormValues(value);
    setSelectedGender(value.investor.gender);
    setSelectedDeclaration({
      isPoliticallyExposed: Boolean(value.declaration.is_pep),
      isRelativeToPoliticallyExposed: Boolean(value.declaration.is_rpep),
      isResidentOutsideIndia: Boolean(value.declaration.is_foreign_tax_resident)
    });
    setNomineeData(value.nominee);
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
    setNomineeData([]);
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
  // Address Details Checkbox
  const handleCheckboxChange = (event) => {
    setSameAddress(event.target.checked);
  };
  // Tabs Error
  const handleTabError = (value) => {
    console.log(value);
    if (value.investor_address) {
      setErrorObject({ ...errorObject, addressDetailsError: true });
    } else {
      setErrorObject({ ...errorObject, addressDetailsError: false });
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
    queryFn: GetInvestorData,
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
    queryFn: GetIfa,
    onSuccess: (data) => {
      setIfaData(data.data);
    }
  });

  if (isPending) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          validateOnBlur={false}
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (isEditing === false) {
              console.log({
                ...values,
                investor: {
                  ...values.investor,
                  is_foreign_tax_resident: Boolean(selectedDeclaration.isResidentOutsideIndia),
                  is_rpep: Boolean(selectedDeclaration.isRelativeToPoliticallyExposed),
                  is_pep: Boolean(selectedDeclaration.isPoliticallyExposed)
                },
                nominee: nomineeData
              });
              const formValues = {
                ...values,
                investor: {
                  ...values.investor,
                  gender_id: genderValidate(selectedGender),
                  is_foreign_tax_resident: selectedDeclaration.isResidentOutsideIndia ? 1 : 0,
                  is_rpep: selectedDeclaration.isRelativeToPoliticallyExposed ? 1 : 0,
                  is_pep: selectedDeclaration.isPoliticallyExposed ? 1 : 0
                },
                nominee: nomineeData
              };
              SaveInvestor(formValues, InvestorTableDataRefetch, clearFormValues);
            }
            if (isEditing === true) {
              console.log('i am editing');

              console.log({ ...values, method_name: 'update' });
              const formValues = {
                ...values,
                investor: {
                  ...values.investor,
                  gender: genderValidate(selectedGender),
                  is_foreign_tax_resident: selectedDeclaration.isResidentOutsideIndia ? 1 : 0,
                  is_rpep: selectedDeclaration.isRelativeToPoliticallyExposed ? 1 : 0,
                  is_pep: selectedDeclaration.isPoliticallyExposed ? 1 : 0
                },
                nominee: nomineeData
              };
              EditInvestor(
                formValues,
                // isFDActive,
                // isInvestorActive,
                InvestorTableDataRefetch,
                clearFormValues,
                setActiveClose
              );
            }
            setErrorObject(errorObject);
            changeTableVisibility();
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm, isSubmitting }) => (
            <Box
              component="form"
              onSubmit={(event) => {
                if (errors) {
                  handleTabError(errors);
                }
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
                  title="Investor Entry"
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsInvestorActive}
                  isActive={isInvestorActive}
                  errors={errors}
                  handleTabError={handleTabError}
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
                        regType="noSpecial"
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
                      {/* <NestedCustomTextField
                        label="Investor type"
                        valueName="investor.investor_type"
                        values={values.investor.investor_type}
                        type="text"
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      /> */}
                      <FormikAutoComplete
                        options={investorType}
                        defaultValue={values.investor.investor_type_id}
                        setFieldValue={setFieldValue}
                        formName="investor.investor_type_id"
                        optionName="investor"
                        label="Investor Type"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      {/* Using Normal Autocomplete because of API issues */}
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
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    // selectedRelation={selectedRelation}
                    // setSelectedRelation={setSelectedRelation}
                    selectedDeclaration={selectedDeclaration}
                    handleDeclarationClick={handleDeclarationClick}
                    nomineeData={nomineeData}
                    handleNewNominee={handleNewNominee}
                    errorObject={errorObject}
                    handleTabError={handleTabError}
                    sameAddress={sameAddress}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </Grid>
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard
          title="Investor"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          {/* here i will add the filter */}
          <Formik
            initialValues={{
              fd_name: '',
              search: ''
            }}
            // validationSchema={formValueFields}
            onSubmit={async (values, { resetForm }) => {
              const searchResult = await GetSchemeSearch(formValues.fd_id, selectedPayoutMethod);
              if (searchResult) {
                console.log(searchResult);
                setSchemeData(searchResult);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm }) => (
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
                    <Grid item xs={3} style={{ paddingLeft: 0, paddingTop: 0 }}>
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
                    </Grid>

                    <Grid item xs={3} style={{ paddingTop: 0 }}>
                      <CustomAutoComplete
                        options={ifaData}
                        defaultValue={selectedIFA}
                        setSelected={setSelectedIFA}
                        optionName="item_value"
                        label="IFA"
                      />
                    </Grid>

                    <Grid item xs={3} style={{ paddingTop: 0 }}>
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

                    <Grid item xs={1.5} style={{ paddingTop: 0 }}>
                      <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        startIcon={<FilterSearch />}
                        sx={{
                          justifySelf: 'center',
                          width: !mdUp ? 'auto' : '100%' // Set width to 'auto' when screen size is medium or larger, otherwise '100%'
                        }}
                      >
                        Search
                      </Button>
                    </Grid>

                    {/* <Grid item xs={2} style={{ paddingTop: 0 }}>
                      <Box>
                        <AnimateButton>
                          <Button fullWidth variant="contained" color="success" startIcon={<SearchNormal1 />} type="submit">
                            Show
                          </Button>
                        </AnimateButton>
                      </Box>
                    </Grid> */}
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
            getOneItem={GetOneInvestor}
            deleteOneItem={DeleteOneInvestor}
            getEditData={GetEditOneInvestor}
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
