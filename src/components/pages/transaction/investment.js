import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent, Button, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';
import Loader from 'components/atoms/loader/Loader';

// third-party
import * as yup from 'yup';
import { Formik } from 'formik';
import { Eye, FilterSearch, Calculator, TimerStart } from 'iconsax-react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

// assets
import { SubmitButton } from 'components/atoms/button/button';
import CustomTextField, { FormikAutoComplete } from 'utils/textfield';
import { investorValues as investorFormValues, investorValidationSchema as investorFormValidation } from 'constant/investmentValidation';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  // formValueFields,
  filterValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/investmentValidation';
import { GetProductData } from 'hooks/fixedDeposit/fixedDeposit';
import {
  GetInvestorData,
  GetOneInvestor,
  SaveInvestor,
  EditInvestor,
  DeleteOneInvestor,
  GetEditOneInvestor,
  GetIfa,
  GetIFASearch
} from 'hooks/investor/investor';
import '../../../utils/custom.css';
import {
  GetInvestmentData,
  GetStatusDropdown,
  GetMaturityAction,
  GetScheme,
  CalculateFD,
  StartFD,
  GetDeclaration
} from 'hooks/transaction/investment';
import { GetPayoutMethod, GetSchemeSearch } from 'hooks/interestRate/interestRate';
import InvestmentDialog from 'components/atoms/dialog/InvestmentDialog';
import AnimateButton from 'helpers/@extended/AnimateButton';
import InvestmentTabs from 'components/organisms/investmentTabs';

function Investment() {
  // Main data states
  const [investmentData, setInvestmentData] = useState([]);
  const [investorData, setInvestorData] = useState([]);
  const [ifaData, setIfaData] = useState([]);
  const [payoutData, setPayoutData] = useState([]);
  const [maturityAction, setMaturityAction] = useState([]);
  // Main Data state
  const [schemeData, setSchemeData] = useState([]);

  // const [loading, setLoading] = useState(true);

  // Edit Logic State
  const [isEditing, setIsEditing] = useState(false);
  const [isInvestmentActive, setInvestmentActive] = useState();
  const [schemeFormValues, setSchemeFormValues] = useState();
  const [isInvestorEditing, setIsInvestorEditing] = useState(false); // For Investor Form Visibility
  const [fdInvestmentID, setFdInvestmentID] = useState();

  // Nominee
  const [nomineeData, setNomineeData] = useState([]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);

  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(false); // State to toggle visibility of the table form

  // Radio states
  const [selectedDeclaration, setSelectedDeclaration] = useState({
    isPoliticallyExposed: true,
    isRelativeToPoliticallyExposed: true,
    isResidentOutsideIndia: true
  });
  const [dynamicDeclaration, setDynamicDeclaration] = useState([]);
  // Selection states
  const [fdDropdown, setFdDropdown] = useState([]);
  const [statusDropdown, setStatusDropdown] = useState([]);
  const [dateValue, setDateValue] = useState([null, null]);

  // Address Details Checkbox
  const [sameAddress, setSameAddress] = useState(false);
  // form pending
  const [formPending, setFormPending] = useState(false);

  // Form State
  const [formValues, setFormValues] = useState(formAllValues);
  const [investorEditFormValues, setInvestorEditFormValues] = useState(investorFormValues);
  // Theme
  const theme = useTheme();
  const mdUp = theme.breakpoints.up('md');

  // Sets form values for editing
  const setEditing = (value) => {
    console.log(value);
    setFormValues(value);
    // handleIsInvestmentActive(value.investor.is_active);
  };
  const setInvestorEditing = (value) => {
    console.log(value);
    setInvestorEditFormValues(value);
    // handleIsInvestorActive(value.investor.is_active);
    // setSelectedGender(value.investor.gender);
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
  const handleIsInvestmentActive = (initialValue) => {
    setInvestmentActive(initialValue);
  };
  const handleIsInvestorEditing = () => {
    setIsInvestorEditing(true);
  };
  const handleIsNotInvestorEditing = () => {
    setIsInvestorEditing(false);
  };
  // Nominee
  const handleNewNominee = (value) => {
    console.log(value.values);
    if (value.values.nominee_id) {
      const editNom = nomineeData.map((nominee, index) => {
        if (nominee.nominee_id === value.values.nominee_id) {
          return value.values;
        } else {
          return nominee;
        }
      });
      console.log(editNom);
      setNomineeData(editNom);
    } else {
      setNomineeData((prev) => {
        return [...prev, value.values];
      });
    }
  };
  // Declaration
  const handleDynamicDeclaration = (value) => {
    // setDynamicDeclaration([
    //   ...dynamicDeclaration,
    //   dynamicDeclaration[value]: { ...dynamicDeclaration[value], isSelected: !dynamicDeclaration[value].isSelected }
    // ]);
    setDynamicDeclaration((prevDynamicDeclaration) => {
      // Create a new array with modified objects
      return prevDynamicDeclaration.map((item, index) => {
        if (item.declaration_id === value) {
          // If the index matches the value, toggle the isSelected property
          return { ...item, isSelected: !item.isSelected };
        }
        // For other indexes, return the original item
        return item;
      });
    });
  };
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
  // Toggle Table and Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };

  // Dialog state
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  // Search one item state
  const setSearchData = (investor) => {
    setInvestmentData(investor);
  };
  // Form State
  const handleCalculate = (value) => {
    console.log(value);
    setFormValues(value);
  };
  // Disable field
  const checkField = (formValue) => {
    return (
      formValue.investor_id != 0 &&
      formValue.fd_id != 0 &&
      formValue.ifa_id != 0 &&
      formValue.maturity_action_id != 0 &&
      formValue.investment_amount != null &&
      formValue.years != 0 &&
      formValue.interest_rate != '0' &&
      formValue.aggrigated_interest != 0 &&
      formValue.maturity_amount != 0
    );
  };
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
  };

  // Custom fields/ Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Duration Dropdown
  const days = Array(32)
    .fill()
    .map((_, index) => ({ id: index, value: index.toString() }));
  const month = Array(13)
    .fill()
    .map((_, index) => ({ id: index, value: index.toString() }));
  const year = Array(6)
    .fill()
    .map((_, index) => ({ id: index, value: index.toString() }));
  // Query for fetching investor data
  const {
    isPending: investorPending,
    // error,
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
  // Query for fetching payout data
  const {
    isPending: payoutPending,
    error,
    refetch: refetchPayoutData
  } = useQuery({
    queryKey: ['payoutData', 0],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: () => GetPayoutMethod(0),
    onSuccess: (data) => {
      setPayoutData(data);
    }
  });
  // Query for fetching product data
  const {
    isPending: productPending,
    // error,
    refetch: ProductTableDataRefetch
  } = useQuery({
    queryKey: ['productTableData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: GetProductData, // Function to fetch product data
    onSuccess: (data) => {
      setFdDropdown(data); // Update product data with fetched data
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
      setIfaData(data);
    }
  });
  // Query for fetching status dropdown
  // const { pending: statusPending, refetch: StatusDropdownRefetch } = useQuery({
  //   queryKey: ['statusDropdownData'], // Unique key for the query
  //   refetchOnWindowFocus: false, // Disable refetch on window focus
  //   keepPreviousData: true, // Keep previous data when refetching
  //   queryFn: GetStatusDropdown, // Function to fetch product data
  //   onSuccess: (data) => {
  //     setStatusDropdown(data); // Update product data with fetched data
  //   }
  // });
  // Query for fetching status dropdown
  const { pending: maturityPending, refetch: MaturityDropdownRefetch } = useQuery({
    queryKey: ['maturityDropdownData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: GetMaturityAction, // Function to fetch product data
    onSuccess: (data) => {
      setMaturityAction(data); // Update product data with fetched data
    }
  });

  if (payoutPending || investorPending || ifaPending || productPending || maturityPending) return <Loader />;

  return (
    <>
      <InvestmentDialog
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        schemeEditFormValues={schemeFormValues}
        clearFormValues={clearFormValues}
        schemeData={schemeData}
        setSchemeData={setSchemeData}
      />
      {showTable && (
        <Formik
          enableReinitialize={true}
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (isEditing === false) {
              // const reqValues = { ...values, compounding_type: 'yearly' };
              // const result = await CalculateFD(reqValues);
              // const calculated = result.data;
              // console.log({
              //   ...values,
              //   interest_rate: calculated.interestRate,
              //   aggrigated_interest: calculated.aggrigated_interest,
              //   maturity_amount: calculated.maturity_amount
              // });
              // handleCalculate({
              //   ...values,
              //   interest_rate: calculated.interestRate,
              //   aggrigated_interest: calculated.aggrigated_interest,
              //   maturity_amount: calculated.maturity_amount
              // });
              //   SaveInvestor(formValues, InvestmentTableDataRefetch, clearFormValues);
            }
            if (isEditing === true) {
              console.log('edit');
              //   EditInvestor(
              //     formValues,
              //     isFDActive,
              //     isInvestorActive,
              //     InvestmentTableDataRefetch,
              //     clearFormValues,
              //     setActiveClose
              //   );
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
            isSubmitting,
            setSubmitting
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
                  title="Investment Entry"
                  buttonTitle="View Scheme"
                  handleOpenDialog={handleOpenDialog}
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsInvestmentActive}
                  isActive={isInvestmentActive}
                  handleIsInvestorEditing={handleIsNotInvestorEditing}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <FormikAutoComplete
                        options={investorData}
                        defaultValue={values.investor_id}
                        setFieldValue={setFieldValue}
                        formName="investor_id"
                        idName="investor_id"
                        optionName="investor_name"
                        label="Select Investor"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormikAutoComplete
                        options={fdDropdown}
                        defaultValue={values.fd_id}
                        setFieldValue={setFieldValue}
                        // errors={errors}
                        formName="fd_id"
                        idName="fd_id"
                        optionName="fd_name"
                        label="Select FD"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormikAutoComplete
                        options={ifaData}
                        defaultValue={values.ifa_id}
                        setFieldValue={setFieldValue}
                        formName="ifa_id"
                        optionName="item_value"
                        label="Select IFA"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormikAutoComplete
                        options={maturityAction}
                        defaultValue={values.maturity_action_id}
                        setFieldValue={setFieldValue}
                        formName="maturity_action_id"
                        optionName="item_value"
                        label="Select Maturity Action"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomTextField
                        label="Investment Amount (₹)"
                        name="investment_amount"
                        placeholder="Please enter Investment Amount"
                        values={values}
                        type="number"
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
                    <Grid item xs={1}>
                      <FormikAutoComplete
                        disableClearable
                        options={year}
                        defaultValue={values.years}
                        setFieldValue={setFieldValue}
                        formName="years"
                        optionName="value"
                        label="Years"
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <FormikAutoComplete
                        disableClearable
                        options={month}
                        defaultValue={values.months}
                        setFieldValue={setFieldValue}
                        formName="months"
                        optionName="value"
                        label="Months"
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <FormikAutoComplete
                        disableClearable
                        options={days}
                        defaultValue={values.days}
                        setFieldValue={setFieldValue}
                        formName="days"
                        optionName="value"
                        label="Days"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormikAutoComplete
                        options={payoutData}
                        defaultValue={values.payout_method_id}
                        setFieldValue={setFieldValue}
                        formName="payout_method_id"
                        keyName="id"
                        optionName="item_value"
                        label="Select Payout Method"
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <AnimateButton>
                        <Button
                          // disabled={formPending}
                          // formPending is custom state
                          fullWidth
                          disabled={isSubmitting}
                          variant="contained"
                          type="submit"
                          color="success"
                          startIcon={<Calculator />}
                          onClick={async () => {
                            setSubmitting(true);
                            const reqValues = {
                              ...values,
                              interest_rate: '0',
                              aggrigated_interest: 0,
                              maturity_amount: 0,
                              compounding_type: 'yearly'
                            };

                            const result = await CalculateFD(reqValues);

                            setSubmitting(false);

                            const calculated = result.data;

                            handleCalculate({
                              ...values,
                              interest_rate: calculated.interestRate,
                              aggrigated_interest: calculated.aggrigated_interest,
                              maturity_amount: calculated.maturity_amount
                            });
                          }}
                          sx={{ borderRadius: 0.6 }}
                        >
                          {isSubmitting ? 'Calculating' : 'Calculate'}
                        </Button>
                      </AnimateButton>
                    </Grid>
                    <Grid item xs={1.5}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 0.6 }}
                        startIcon={<Eye />}
                        onClick={async () => {
                          const searchResult = await GetSchemeSearch(values.fd_id, values.payout_method_id);
                          setSchemeData(searchResult);

                          setTimeout(() => {
                            handleOpenDialog();
                          }, 200);
                        }}
                      >
                        Scheme
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        disabled
                        className="common-textfield"
                        size="small"
                        label="Interest Rate (%)"
                        name="interest_rate"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={dirty ? '0' : values['interest_rate']}
                        type="text"
                        error={touched['interest_rate'] && Boolean(errors['interest_rate'])}
                        placeholder={touched['interest_rate'] && errors['interest_rate']}
                        helperText={touched['interest_rate'] && errors['interest_rate']}
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        disabled
                        className="common-textfield"
                        size="small"
                        label="Interest Amount (₹)"
                        name="aggrigated_interest"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={dirty ? 0 : values['aggrigated_interest']}
                        type="text"
                        error={touched['aggrigated_interest'] && Boolean(errors['aggrigated_interest'])}
                        placeholder={touched['aggrigated_interest'] && errors['aggrigated_interest']}
                        helperText={touched['aggrigated_interest'] && errors['aggrigated_interest']}
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        disabled
                        className="common-textfield"
                        size="small"
                        label="Maturity Amount (₹)"
                        name="maturity_amount"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={dirty ? 0 : values['maturity_amount']}
                        type="text"
                        error={touched['maturity_amount'] && Boolean(errors['maturity_amount'])}
                        placeholder={touched['maturity_amount'] && errors['maturity_amount']}
                        helperText={touched['maturity_amount'] && errors['maturity_amount']}
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        // disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                        disabled={
                          !(
                            values.investor_id != 0 &&
                            values.fd_id != 0 &&
                            values.ifa_id != 0 &&
                            values.maturity_action_id != 0 &&
                            values.investment_amount != null &&
                            values.years != 0 &&
                            values.interest_rate != '0' &&
                            values.aggrigated_interest != 0 &&
                            values.maturity_amount != 0
                          )
                        }
                        fullWidth
                        variant="contained"
                        type="submit"
                        color="success"
                        sx={{ borderRadius: 0.6 }}
                        startIcon={<TimerStart />}
                        onClick={async () => {
                          setSubmitting(true);
                          const result = await StartFD(values);

                          setFdInvestmentID(result.fd_investment_id);

                          const declarations = await GetDeclaration(result.fd_investment_id);
                          const mappedDeclarations = declarations.map((dec) => {
                            return { ...dec, isSelected: false };
                          });
                          console.log(mappedDeclarations);

                          setDynamicDeclaration(mappedDeclarations);

                          await GetEditOneInvestor(setInvestorEditing, values.investor_id);

                          handleIsInvestorEditing();

                          setSubmitting(false);
                        }}
                      >
                        Start Investment
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
                {isInvestorEditing && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Formik
                        enableReinitialize={true}
                        initialValues={investorEditFormValues}
                        validationSchema={investorFormValidation}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {}}
                      >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm, isSubmitting }) => (
                          <Box
                            component="form"
                            onSubmit={(event) => {
                              event.preventDefault();
                              handleSubmit();
                            }}
                            sx={{ width: '100%' }}
                          >
                            <InvestmentTabs
                              values={values}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              selectedDeclaration={selectedDeclaration}
                              handleDeclarationClick={handleDeclarationClick}
                              nomineeData={nomineeData}
                              handleNewNominee={handleNewNominee}
                              dynamicDeclaration={dynamicDeclaration}
                              handleDynamicDeclaration={handleDynamicDeclaration}
                              fdInvestmentID={fdInvestmentID}
                              investorID={formValues.investor_id}
                              setInvestorEditing={setInvestorEditing}
                              // errorObject={errorObject}
                              // handleTabError={handleTabError}
                              // sameAddress={sameAddress}
                              // handleCheckboxChange={handleCheckboxChange}
                            />
                          </Box>
                        )}
                      </Formik>
                    </Grid>
                  </Grid>
                )}
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard
          title="Investment Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <Formik
            initialValues={{
              investor_id: 0,
              ifa_id: 0
            }}
            validationSchema={yup.object({
              investor_id: yup.number(),
              ifa_id: yup.number()
            })}
            onSubmit={async (values, { resetForm }) => {
              const formValues = { ...values, from_date: dateValue[0], end_date: dateValue[1] };

              const investmentData = await GetInvestmentData(formValues);

              setInvestmentData(investmentData);
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
                    <Grid item xs={3} style={{ paddingLeft: 0, paddingTop: 0 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} localeText={{ start: 'Date From', end: 'To' }}>
                        <DesktopDateRangePicker
                          className="calendar_main"
                          value={dateValue}
                          onChange={(newValue) => {
                            setDateValue(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2.5} style={{ paddingTop: 0 }}>
                      <FormikAutoComplete
                        options={investorData}
                        defaultValue={values.investor_id}
                        setFieldValue={setFieldValue}
                        formName="investor_id"
                        idName="investor_id"
                        optionName="investor_name"
                        label="Select Investor"
                      />
                      {/* {errors && <>`${JSON.stringify(errors)}`</>} */}
                    </Grid>

                    <Grid item xs={2.5} style={{ paddingTop: 0 }}>
                      <FormikAutoComplete
                        options={ifaData}
                        defaultValue={values.ifa_id}
                        setFieldValue={setFieldValue}
                        formName="ifa_id"
                        optionName="item_value"
                        label="Select IFA"
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
            data={investmentData}
            // formValues={filterFormValues}
            // formValueFields={filterValueFields}
            // validationSchema={filterValidationSchema}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={() => {}}
            deleteOneItem={() => {}}
            // getEditData={() => {}}
            setSearchData={setSearchData}
            // tableDataRefetch={InvestmentTableDataRefetch}
            tableDataRefetch={() => {}}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
          />
        </MainCard>
      )}
    </>
  );
}

export default Investment;

// onChange={(e) => {
//   if (values.aggrigated_interest !== null) {
//     handleChange(e);

//     setFormValues({
//       ...values,
//       investment_amount: e.target.value,
//       interest_rate: '0',
//       aggrigated_interest: 0,
//       maturity_amount: 0
//     });
//   } else {
//     // handleChange('investment_amount')(event);
//     handleChange(e);
//   }
// }}
