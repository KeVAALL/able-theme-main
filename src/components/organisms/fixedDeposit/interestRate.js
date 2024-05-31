/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Divider,
  Box,
  Card,
  Grid,
  CardContent,
  Button,
  Stack,
  CardHeader,
  Autocomplete,
  TextField,
  useMediaQuery,
  Typography,
  FormControl,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  List
} from '@mui/material';
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
import { CustomTextField, FormikAutoComplete } from 'utils/textfield';
import useMemoize from './useMemoize';
import DialogForm from 'components/atoms/dialog/InterestRateDialog';
import InterestRateTable from 'components/molecules/fixedDeposit/interestRateTable';
import Dot from 'helpers/@extended/Dot';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

const APIAutoComplete = memo((props) => {
  // const memoizedGetSchemeSearch = useMemoize(GetSchemeSearch);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleOptionChange = async (e, optionName, formName, setFieldValue) => {
    if (e.target.outerText === undefined) {
      setFieldValue(formName, 0);
    } else {
      for (const el of props.options) {
        if (el[optionName] === e.target.outerText) {
          if (props.idName) {
            await setFieldValue(formName, el[props.idName]);
            const payload = {
              method_name: 'getscheme',
              fd_id: el[props.idName],
              fd_payout_method_id: props.correspondingId
            };

            if (props.correspondingId === 'A') {
              const searchResult = await GetSchemeSearch(payload);
              if (searchResult) {
                props.setSchemeData(searchResult);
                // props.setCache(el.id, searchResult); // Update the cache
              }
              return;
            }
            // if (!props.cache[el.id]) {
            // const searchResult = await memoizedGetSchemeSearch(el.id, payload);
            const searchResult = await GetSchemeSearch(payload);
            if (searchResult) {
              props.setSchemeData(searchResult);
              // props.setCache(el.id, searchResult); // Update the cache
            }
            // } else {
            //   props.setSchemeData(props.cache[el.id]);
            // }
          } else {
            await setFieldValue(formName, el.id);
            const payload = {
              method_name: 'getscheme',
              fd_id: props.correspondingId,
              fd_payout_method_id: el.id
            };

            if (el.id === 'A') {
              const searchResult = await GetSchemeSearch(payload);
              if (searchResult) {
                props.setSchemeData(searchResult);
                props.setCache(el.id, searchResult); // Update the cache
              }
              return;
            }
            // if (!props.cache[el.id]) {
            // const searchResult = await memoizedGetSchemeSearch(el.id, payload);
            const searchResult = await GetSchemeSearch(payload);
            if (searchResult) {
              props.setSchemeData(searchResult);
              // props.setCache(el.id, searchResult); // Update the cache
            }
            // } else {
            //   props.setSchemeData(props.cache[el.id]);
            // }
          }
        }
      }
    }
  };

  return (
    <Autocomplete
      id="basic-autocomplete-label"
      className="common-autocomplete"
      fullWidth
      disablePortal
      value={
        (typeof props.defaultValue === 'string' &&
          props.options.find((el) => {
            if (props.keyName) {
              return el[props.keyName] === props.defaultValue;
            } else {
              return el[props.optionName] === props.defaultValue;
            }
          })) ||
        (typeof props.defaultValue === 'number' &&
          props.options.find((el) => {
            if (props.idName) {
              return el[props.idName] === props.defaultValue;
            } else {
              return el.id === props.defaultValue;
            }
          }))
      }
      onChange={(e) => {
        handleOptionChange(e, props.optionName, props.formName, props.setFieldValue, props.idName);
      }}
      options={props.options || []}
      getOptionLabel={(option) => option[props.optionName]} // Assuming 'product_type' is the label you want to display
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: 'preventOverflow',
              enabled: false
            }
          ]
        }
      }}
      disableClearable={props.disableClearable ? true : false}
      renderInput={(params) => (
        <TextField
          // error={Boolean(props.errors[props.formName])}
          {...params}
          className="autocomplete-textfield"
          name={props.formName}
          label={props.label}
          InputProps={{
            ...params.InputProps,
            inputProps: {
              ...params.inputProps,
              readOnly: matchDownSM ? true : false // Prevents mobile keyboard from opening
            }
          }}
        />
      )}
    />
  );
});

FormikAutoComplete.propTypes = {
  idName: PropTypes.any,
  keyName: PropTypes.any
};

const InterestRate = ({ formValues, productData, changeTableVisibility, isNotEditingInterestRate, isEditingInterestRate }) => {
  // Main Data state
  const [schemeData, setSchemeData] = useState([]);
  const [cache, setCache] = useState({});

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
    console.log(productData);
    console.log(value.fd_name);
    // const fd = productData.find((fd) => fd.fd_name === value.fd_name);
    setFormValues({
      // fd_id: fd.fd_id,
      fd_id: value.fd_id,
      fd_name: value.fd_name,
      issuer_name: value.issuer_name,
      fd_payout_method_id: 'C'
    });
  };
  const updateCache = (key, data) => {
    setCache((prevCache) => ({
      ...prevCache,
      [key]: data
    }));
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

  // Query for fetching payout data
  const {
    isPending,
    error,
    refetch: refetchPayoutData
  } = useQuery({
    queryKey: ['payoutData', formValues.fd_id],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    // queryFn: () => GetPayoutMethod(formValues.fd_id),
    queryFn: () => {
      const payload = {
        method_name: 'getpayouts',
        fd_id: formValues.fd_id
      };
      return GetPayoutMethod(payload);
    },
    onSuccess: (data) => {
      setPayoutData(data);
    }
  });
  const {
    isFetching,
    isPending: schemePending,
    error: schemeError,
    refetch: refetchSchemeData
  } = useQuery({
    queryKey: ['schemeData'],
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: () => {
      const payload = {
        method_name: 'getscheme',
        fd_id: formValues.fd_id,
        fd_payout_method_id: 'C'
      };
      return GetSchemeSearch(payload);
    },
    onSuccess: (data) => {
      setSchemeData(data);
    }
  });
  // Effect for setting editing state and loading state
  useEffect(() => {
    setEditing(formValues);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [formValues]);

  // Render Loader if data is loading
  if (loading || isPending) return <Loader />;

  return (
    <Stack spacing={2}>
      <Formik
        initialValues={IRformValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          // const payload = {
          //   method_name: 'getscheme',
          //   fd_id: formValues.fd_id,
          //   fd_payout_method_id: values.fd_payout_method_id
          // };
          // const searchResult = await GetSchemeSearch(payload);
          // if (searchResult) {
          //   setSchemeData(searchResult);
          // }
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
            <DialogForm
              openDialog={openDialog}
              handleOpenDialog={handleOpenDialog}
              schemeEditFormValues={schemeFormValues}
              fdId={values.fd_id}
              // payoutData={payoutData.filter((payout) => payout.item_value !== 'All')}
              selectedPayoutMethod={values.fd_payout_method_id}
              clearFormValues={clearFormValues}
              setIsActive={handleIsSchemeActive}
              isActive={isSchemeActive}
              isEditingScheme={isEditingScheme}
              setActiveClose={setActiveClose}
              setCache={updateCache} // Pass the update function
              setSchemeData={setSchemeData}
            />
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
                        Back
                      </Button>
                    </AnimateButton>
                  </Box>
                </Stack>
              </Stack>

              <Divider />

              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  {/* <Grid item md={3} sm={4} xs={6}>
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
                  </Grid> */}
                  <Grid item md={3} sm={4} xs={6}>
                    {/* <FormikAutoComplete
                      options={productData}
                      defaultValue={values.fd_id}
                      setFieldValue={setFieldValue}
                      // errors={errors}
                      formName="fd_id"
                      idName="fd_id"
                      optionName="fd_name"
                      label="Select FD"
                    /> */}
                    <APIAutoComplete
                      disableClearable
                      options={productData}
                      defaultValue={values.fd_id}
                      correspondingId={values.fd_payout_method_id}
                      cache={cache}
                      setCache={updateCache} // Pass the update function
                      setFieldValue={setFieldValue}
                      setSchemeData={setSchemeData}
                      formName="fd_id"
                      idName="fd_id"
                      optionName="fd_name"
                      label="Select FD"
                    />
                  </Grid>
                  {/* <Grid item md={3} sm={4} xs={6}>
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
                  </Grid> */}
                  <Grid item md={3} sm={4} xs={6}>
                    <APIAutoComplete
                      disableClearable
                      options={payoutData}
                      defaultValue={values.fd_payout_method_id}
                      correspondingId={values.fd_id}
                      cache={cache}
                      setCache={updateCache} // Pass the update function
                      setFieldValue={setFieldValue}
                      setSchemeData={setSchemeData}
                      formName="fd_payout_method_id"
                      keyName="id"
                      optionName="item_value"
                      label="Select Payout Method"
                    />
                  </Grid>
                  {/* <Grid item md={2} xs={6}>
                    <Box>
                      <AnimateButton>
                        <Button fullWidth variant="contained" color="success" startIcon={<SearchNormal1 />} type="submit">
                          Show
                        </Button>
                      </AnimateButton>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12}>
                    <InterestRateTable
                      columns={columns}
                      data={schemeData}
                      selectedPayout={values.fd_payout_method_id}
                      changeTableVisibility={changeTableVisibility}
                      schemeEditing={schemeEditing}
                      deleteOneItem={DeleteOneInterestRate}
                      setSearchData={setSearchData}
                      setSchemeData={setSchemeData}
                      // tableDataRefetch={refetchPayoutData}
                      setActiveEditing={setActiveEditing}
                      handleIROpenDialog={handleOpenDialog}
                      VisibleColumn={VisibleColumn}
                      isFetching={isFetching}
                    />
                    {/* New table for this */}
                  </Grid>

                  <Grid item md={8}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        '& .MuiListItemButton-root': { borderRadius: 0, my: 0, py: 0.2, px: 0.3 },
                        '& .MuiListItemText-root': { color: 'text.primary' }
                      }}
                    >
                      <Typography variant="body2">Notes: </Typography>
                      <Stack direction="row" alignItems="center">
                        <ListItemIcon sx={{ minWidth: '14px' }}>
                          <Dot color="secondary" size={5} />
                        </ListItemIcon>
                        <Typography variant="body2">NC: Normal Citizen</Typography>
                        {/* <ListItemText  primary="Incoming requests" /> */}
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <ListItemIcon sx={{ minWidth: '14px' }}>
                          <Dot color="secondary" size={5} />
                        </ListItemIcon>
                        <Typography variant="body2">SC: Senior Citizen</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <ListItemIcon sx={{ minWidth: '14px' }}>
                          <Dot color="secondary" size={5} />
                        </ListItemIcon>

                        <Typography variant="body2">FC: Female Citizen</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <ListItemIcon sx={{ minWidth: '14px' }}>
                          <Dot color="secondary" size={5} />
                        </ListItemIcon>

                        <Typography variant="body2">SFC: Senior Female Citizen</Typography>
                      </Stack>
                    </Stack>
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
  formValues: PropTypes.object,
  setActiveClose: PropTypes.any,
  changeTableVisibility: PropTypes.any,
  isNotEditingInterestRate: PropTypes.any
};

export default memo(InterestRate);

// // Payout Validation
// const payoutValidate = (value) => {
//   if (typeof value === 'string') {
//     console.log('string');
//     payoutData.find((el) => {
//       if (el.item_value === value) {
//         return el.id;
//       }
//     });
//   } else {
//     return value;
//   }
// };
