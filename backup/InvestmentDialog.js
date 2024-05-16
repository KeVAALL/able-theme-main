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
  InputAdornment,
  FormControlLabel,
  Switch,
  Typography,
  Divider
} from '@mui/material';
// third-party
import { PopupTransition } from 'helpers/@extended/Transitions';
import { Formik } from 'formik';
import * as yup from 'yup';
import Loader from '../src/components/atoms/loader/Loader';
// assets
import CustomTextField, { FormikAutoComplete } from 'utils/textfield';
import { SaveInterestRate, EditInterestRate } from 'hooks/interestRate/interestRate';
import { schemeValidation, schemeValues } from 'constant/investmentValidation';

const InvestmentDialog = ({ openDialog, handleOpenDialog, schemeEditFormValues, maturityAction, isEditingScheme }) => {
  // Form Data
  const [schemeEditValues, setSchemeEditValues] = useState();
  const clearFormValues = () => {
    setSchemeEditValues(schemeValues);
  };

  useEffect(() => {
    console.warn(schemeEditFormValues);

    // if (isEditingScheme === false) {
    //   clearFormValues();
    // }
    // if (schemeEditFormValues && isEditingScheme === true) {
    if (schemeEditFormValues) {
      setSchemeEditValues(schemeEditFormValues);
    }
  }, [schemeEditFormValues]);

  // if (isLoading) return <Loader />;

  return (
    <Dialog
      className="dialog_main"
      open={openDialog}
      TransitionComponent={PopupTransition}
      onClose={handleOpenDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box sx={{ overflow: 'visible' }}>
        <Formik
          initialValues={schemeEditValues || schemeValues}
          validationSchema={schemeValidation}
          onSubmit={async (values, { resetForm }) => {
            console.log(values);
          }}
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
              <DialogTitle sx={{ p: 2 }}>Scheme</DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2, overflowY: 'unset' }}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="FD Name"
                      name="fd_name"
                      //   placeholder="Please enter your Maximum Tenure"
                      disabled
                      values={values}
                      type="string"
                      regType="string"
                      setFieldValue={setFieldValue}
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
                      label="Regular ROI (%)"
                      name="rate_of_interest"
                      //   placeholder="Please enter Regular Rate of Interest"
                      disabled
                      values={values}
                      type="string"
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
                      label="Interest on 1 Lakh"
                      name="rate_of_interest_1lakh"
                      //   placeholder="Please enter Rate of Interest for Senior Citizen"
                      disabled
                      values={values}
                      type="string"
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
                      label="Tenure"
                      name="tenure"
                      //   placeholder="Please enter Rate of Interest for Female Senior Citizen"
                      disabled
                      values={values}
                      type="string"
                      regType="noSpecial"
                      setFieldValue={setFieldValue}
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
                    <FormikAutoComplete
                      options={maturityAction}
                      defaultValue={values.maturity_id}
                      setFieldValue={setFieldValue}
                      formName="maturity_id"
                      optionName="item_value"
                      label="Select Maturity Action"
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <CustomTextField
                      label="Investment Amount"
                      name="investment_amount"
                      placeholder="Please enter Investment Amount"
                      values={values}
                      type="number"
                      regType="number"
                      setFieldValue={setFieldValue}
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
              <DialogActions sx={{ gap: 2, p: 2 }}>
                <Button
                  color="error"
                  onClick={() => {
                    handleOpenDialog();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" color="success" type="submit">
                  Proceed
                </Button>
              </DialogActions>
            </Box>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};
export default memo(InvestmentDialog);

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
