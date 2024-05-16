import { useState, useMemo, useEffect, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Divider, Box, Card, Grid, CardContent, Button, Stack, CardHeader, FormControlLabel, Switch } from '@mui/material';
import AnimateButton from 'helpers/@extended/AnimateButton';
import PropTypes from 'prop-types';
// third-party
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import { SearchNormal1 } from 'iconsax-react';
import Loader from 'components/atoms/loader/Loader';
// assets
import { formAllValues, validationSchema, tableColumns, VisibleColumn } from 'constant/interestRateValidation';
import { DeleteOneInterestRate, GetPayoutMethod, GetSchemeSearch } from 'hooks/interestRate/interestRate';
import CustomTextField, { FormikAutoComplete } from 'utils/textfield';
import DialogForm from 'components/atoms/dialog/InterestRateDialog';
import InterestRateTable from 'components/molecules/fixedDeposit/interestRateTable';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

const InterestRate = ({ formValues, changeTableVisibility, isNotEditingInterestRate, isEditingInterestRate }) => {
  // Main Data state
  const [schemeData, setSchemeData] = useState([]);
  // Edit Logic State
  const [loading, setLoading] = useState(true);
  const [isEditingScheme, setIsEditingScheme] = useState(false);
  const [schemeFormValues, setSchemeFormValues] = useState();

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);

  // Autocomplete field state
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState('C');
  const [payoutData, setPayoutData] = useState([]);

  // Form state
  const [IRformValues, setFormValues] = useState(formAllValues);
  // Theme
  const theme = useTheme();

  // Sets form values for editing
  const setEditing = (value) => {
    setFormValues({
      fd_name: value.fd_name,
      issuer_name: value.issuer_name,
      fd_payout_method_id: 'C'
    });
  };
  const schemeEditing = (value) => {
    setSchemeFormValues(value);
  };
  const setActiveEditing = () => {
    setIsEditingScheme(true);
  };
  const setActiveClose = () => {
    setIsEditingScheme(false);
  };

  // Active Button state
  const [isSchemeActive, setSchemeActive] = useState();
  const handleIsSchemeActive = (initialValue) => {
    setSchemeActive(initialValue);
  };

  // Payout Validation
  const payoutValidate = (value) => {
    if (typeof value === 'string') {
      console.log('string');
      payoutData.find((el) => {
        if (el.item_value === value) {
          return el.id;
        }
      });
    } else {
      return value;
    }
  };

  // Dialog state
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  // Search one item state
  const setSearchData = (interestRate) => {
    setIssuerData(interestRate);
  };

  const clearFormValues = () => {
    setFormValues(formAllValues);
  };

  // Custom fields/ columns
  const columns = useMemo(() => tableColumns, []);

  // Effect for setting editing state and loading state
  useEffect(() => {
    setEditing(formValues);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [formValues]);

  // Query for fetching payout data
  const {
    isPending,
    error,
    refetch: refetchPayoutData
  } = useQuery({
    queryKey: ['payoutData', formValues.fd_id],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: () => GetPayoutMethod(formValues.fd_id),
    onSuccess: (data) => {
      setPayoutData(data);
    }
  });

  // Render Loader if data is loading
  if (loading || isPending) return <Loader />;

  return (
    <Stack spacing={2}>
      <DialogForm
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        schemeEditFormValues={schemeFormValues}
        fdId={formValues.fd_id}
        selectedPayoutMethod={formValues.fd_payout_method_id}
        clearFormValues={clearFormValues}
        setIsActive={handleIsSchemeActive}
        isActive={isSchemeActive}
        isEditingScheme={isEditingScheme}
        setActiveClose={setActiveClose}
        setSchemeData={setSchemeData}
      />
      <Formik
        initialValues={IRformValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log(formValues.fd_payout_method_id);
          const searchResult = await GetSchemeSearch(formValues.fd_id, values.fd_payout_method_id);
          if (searchResult) {
            setSchemeData(searchResult);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit, resetForm }) => (
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
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <CardHeader title="Schemes" sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} />
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
              </Stack>

              <Divider />

              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <CustomTextField
                      label="FD Name"
                      name="fd_name"
                      values={values}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched}
                      errors={errors}
                      disabled
                      FormHelperTextProps={{
                        style: {
                          marginLeft: 0
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      label="Issuer Name"
                      name="issuer_name"
                      values={values}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched}
                      errors={errors}
                      disabled
                      FormHelperTextProps={{
                        style: {
                          marginLeft: 0
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormikAutoComplete
                      options={payoutData}
                      defaultValue={values.fd_payout_method_id}
                      setFieldValue={setFieldValue}
                      formName="fd_payout_method_id"
                      keyName="id"
                      optionName="item_value"
                      label="Select Payout Method"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <AnimateButton>
                        <Button fullWidth variant="contained" color="success" startIcon={<SearchNormal1 />} type="submit">
                          Show
                        </Button>
                      </AnimateButton>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <InterestRateTable
                      columns={columns}
                      data={schemeData}
                      changeTableVisibility={changeTableVisibility}
                      schemeEditing={schemeEditing}
                      deleteOneItem={DeleteOneInterestRate}
                      setSearchData={setSearchData}
                      setSchemeData={setSchemeData}
                      // tableDataRefetch={refetchPayoutData}
                      setActiveEditing={setActiveEditing}
                      handleIROpenDialog={handleOpenDialog}
                      VisibleColumn={VisibleColumn}
                    />
                    {/* New table for this */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
      </Formik>
    </Stack>
  );
};

InterestRate.propTypes = {
  formValues: PropTypes.array,
  setActiveClose: PropTypes.any,
  changeTableVisibility: PropTypes.any,
  isNotEditingInterestRate: PropTypes.any
};

export default memo(InterestRate);
