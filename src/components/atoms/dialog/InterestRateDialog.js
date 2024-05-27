/* eslint-disable react/prop-types */
import React, { useEffect, useState, memo } from 'react';
import {
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
  Stack,
  Grid,
  Divider,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
// third-party
import { PopupTransition } from 'helpers/@extended/Transitions';
import { Formik } from 'formik';
import Loader from '../loader/Loader';
// assets
import { CustomTextField } from 'utils/textfield';
import { formAllSchemeValues, validationSchema } from 'constant/interestRateSchemeValidation';
import { SaveInterestRate, EditInterestRate, GetSchemeSearch } from 'hooks/interestRate/interestRate';
import { toInteger } from 'lodash';

const DialogForm = ({
  openDialog,
  handleOpenDialog,
  schemeEditFormValues,
  fdId,
  selectedPayoutMethod,
  setIsActive,
  isActive,
  isEditingScheme,
  setActiveClose,
  setSchemeData
}) => {
  // Active or not Button
  const [activeButton, setActiveButton] = useState(false);
  const [liveButton, setLiveButton] = useState(false);
  // Handle Switch Change
  const handleActiveChange = () => {
    setActiveButton(!activeButton);
  };
  // Form Data
  const [schemeFormValues, setSchemeFormValues] = useState();
  const clearFormValues = () => {
    setSchemeFormValues(formAllSchemeValues);
    setActiveButton(false);
  };

  useEffect(() => {
    console.warn(schemeEditFormValues);

    if (isEditingScheme === false) {
      clearFormValues();
    }
    if (schemeEditFormValues && isEditingScheme === true) {
      setActiveButton(schemeEditFormValues.is_active);
      setLiveButton(schemeEditFormValues.is_live);
      setSchemeFormValues(schemeEditFormValues);
    }
  }, [schemeEditFormValues, isEditingScheme]);

  // if (isLoading) return <Loader />;

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={PopupTransition}
      onClose={() => {
        handleOpenDialog();
        clearFormValues();
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box>
        <DialogTitle sx={{ p: 2 }}>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <DialogTitle sx={{ p: 0 }}>{isEditingScheme ? 'Edit' : 'Add'} Tenure</DialogTitle>
            <Stack flexDirection="row">
              <Box>
                <FormControlLabel
                  value="start"
                  control={<Switch color="primary" checked={activeButton} onChange={handleActiveChange} />}
                  label="Active"
                  labelPlacement="start"
                />
              </Box>
              <Box>
                <FormControlLabel
                  value="live"
                  control={
                    <Switch
                      color="primary"
                      checked={liveButton}
                      onChange={() => {
                        setLiveButton(!liveButton);
                      }}
                    />
                  }
                  label="Live"
                  labelPlacement="start"
                  sx={{ mr: 1 }}
                />
              </Box>
            </Stack>
          </Stack>
        </DialogTitle>
        <Divider />
        <Formik
          initialValues={schemeFormValues || formAllSchemeValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {}}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              sx={{ width: '100%' }}
            >
              <DialogContent sx={{ p: 2, overflowY: 'unset' }}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Min Tenure"
                      name="min_days"
                      placeholder="Please enter your Minimum Tenure"
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
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Max Tenure"
                      name="max_days"
                      placeholder="Please enter your Maximum Tenure"
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
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Regular ROI %"
                      name="rate_of_interest_regular"
                      placeholder="Please enter Regular Rate of Interest"
                      values={values}
                      type="number"
                      pattern="\d+(\.\d+)?"
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
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Senior Citizen ROI %"
                      name="rate_of_interest_senior_citezen"
                      placeholder="Please enter Rate of Interest for Senior Citizen"
                      values={values}
                      type="number"
                      pattern="\d+(\.\d+)?"
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
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Female ROI %"
                      name="rate_of_interest_female"
                      placeholder="Please enter Rate of Interest for Female"
                      values={values}
                      type="number"
                      pattern="\d+(\.\d+)?"
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
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Female Senior Citizen ROI %"
                      name="rate_of_interest_female_senior_citezen"
                      placeholder="Please enter Rate of Interest for Female Senior Citizen"
                      values={values}
                      type="number"
                      pattern="\d+(\.\d+)?"
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
                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2 }}>
                <Button
                  color="error"
                  onClick={() => {
                    handleOpenDialog();
                    setActiveClose();
                    clearFormValues();
                    setTimeout(() => {
                      setLiveButton(false);
                    }, 100);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={async () => {
                    if (isEditingScheme) {
                      const payload = {
                        ...values,
                        is_active: toInteger(activeButton),
                        is_live: toInteger(liveButton),
                        scheme_master_id: values.scheme_master_id,
                        method_name: 'update'
                      };
                      try {
                        await EditInterestRate(payload);

                        setActiveClose();
                        handleOpenDialog();
                        clearFormValues();

                        const schemePayload = {
                          method_name: 'getscheme',
                          fd_id: fdId,
                          fd_payout_method_id: selectedPayoutMethod
                        };
                        const schemeData = await GetSchemeSearch(schemePayload);
                        setSchemeData(schemeData);

                        setTimeout(() => {
                          setLiveButton(false);
                        }, 100);
                      } catch (err) {
                        console.log(err);
                      }
                    } else {
                      const payload = {
                        ...values,
                        fd_id: fdId,
                        fd_payout_method_id: selectedPayoutMethod,
                        is_live: toInteger(liveButton),
                        is_active: toInteger(activeButton),
                        method_name: 'add'
                      };
                      try {
                        await SaveInterestRate(payload);

                        handleOpenDialog();
                        clearFormValues();
                        // Fetch Scheme Again
                        const schemePayload = {
                          method_name: 'getscheme',
                          fd_id: fdId,
                          fd_payout_method_id: selectedPayoutMethod
                        };
                        const schemeData = await GetSchemeSearch(schemePayload);
                        setSchemeData(schemeData);
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Box>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};
export default memo(DialogForm);

// setSchemeFormValues({
//   scheme_master_id: 7,
//   fd_id: 1,
//   min_days: 540,
//   max_days: 600,
//   tenure: '540-600',
//   fd_payout_method: 'NC1',
//   rate_of_interest_regular: 7.91,
//   rate_of_interest_female: 7.67,
//   rate_of_interest_senior_citezen: 7.92,
//   rate_of_interest_female_senior_citezen: 7.91,
//   fd_type: 'NC',
//   is_active: 1
// });

// initialValues={schemeEditFormValues || schemeFormValues}
