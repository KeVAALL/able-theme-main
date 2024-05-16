import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Divider, Box, Card, Grid, CardContent, Button, Stack, CardHeader, FormControlLabel, Switch } from '@mui/material';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { SearchNormal1 } from 'iconsax-react';
import PropTypes from 'prop-types';
// third-party
import { Formik } from 'formik';
import * as yup from 'yup';
import { useQuery } from 'react-query';
import Loader from 'components/atoms/loader/Loader';
import CustomTextField, { CustomAutoComplete, FormikAutoComplete } from 'utils/textfield';
// assets
import { formAllValues, validationSchema, tableColumns, VisibleColumn } from 'constant/interestRateValidation';
import { DeleteOneInterestRate, GetPayoutMethod, GetSchemeSearch } from 'hooks/interestRate/interestRate';
import { DialogForm } from 'components/atoms/dialog/formdialog';
import InterestRateTable from 'components/molecules/fixedDeposit/interestRateTable';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

export default function InterestRate({ formValues, changeTableVisibility, isNotEditingInterestRate, isEditingInterestRate }) {
  // Main Data
  const [schemeData, setSchemeData] = useState([]);

  // Active Button
  const [isSchemeActive, setSchemeActive] = useState();
  const handleIsSchemeActive = (initialValue) => {
    console.log(initialValue);
    setSchemeActive(initialValue);
  };

  // Autocomplete field state
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState('C');
  const [payoutData, setPayoutData] = useState([]);
  // Gender Validation
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

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  // Search one item state
  const setSearchData = (interestRate) => {
    setIssuerData(interestRate);
  };
  // Form state
  const [IRformValues, setFormValues] = useState(formAllValues);
  const clearFormValues = () => {
    setFormValues(formAllValues);
  };
  // Edit Logic State
  const [loading, setLoading] = useState(true);
  const [isEditingScheme, setIsEditingScheme] = useState(false);
  const [schemeFormValues, setSchemeFormValues] = useState();
  const setEditing = (value) => {
    setFormValues({
      fd_name: value.fd_name,
      issuer_name: value.issuer_name
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
  // Custom fields/ columns
  const theme = useTheme();
  const columns = useMemo(() => tableColumns, []);

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
      console.log(data);
      setPayoutData(data);
    }
  });

  useEffect(() => {
    console.log(formValues);
    setEditing(formValues);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [formValues]);

  if (loading) return <Loader />;

  return (
    <Stack spacing={2}>
      <DialogForm
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        schemeEditFormValues={schemeFormValues}
        fdId={formValues.fd_id}
        selectedPayoutMethod={selectedPayoutMethod}
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
          console.log(payoutValidate(selectedPayoutMethod));
          const searchResult = await GetSchemeSearch(formValues.fd_id, selectedPayoutMethod);
          if (searchResult) {
            console.log(searchResult);
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
                    <CustomAutoComplete
                      options={payoutData}
                      defaultValue={selectedPayoutMethod}
                      setSelected={setSelectedPayoutMethod}
                      optionName="item_value"
                      label="Payout Method"
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
}

InterestRate.propTypes = {
  formValues: PropTypes.array,
  setActiveClose: PropTypes.any,
  changeTableVisibility: PropTypes.any,
  isNotEditingInterestRate: PropTypes.any
};
