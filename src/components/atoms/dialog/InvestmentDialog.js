/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, memo } from 'react';
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
// assets
import DialogForm from './InterestRateDialog';
import { formAllValues, validationSchema, tableColumns, VisibleColumn } from 'constant/interestRateValidation';
import { DeleteOneInterestRate } from 'hooks/interestRate/interestRate';
import { SaveInterestRate, EditInterestRate } from 'hooks/interestRate/interestRate';
import InterestRateTable from 'components/molecules/fixedDeposit/interestRateTable';

const InvestmentDialog = ({
  openDialog,
  handleOpenDialog,
  schemeEditFormValues,
  clearFormValues,
  schemeData,
  setSchemeData,
  fdId,
  selectedPayoutMethod
}) => {
  // Form Data
  const [schemeEditValues, setSchemeEditValues] = useState();
  // Edit Logic State
  const [isEditingScheme, setIsEditingScheme] = useState(false);
  const [schemeFormValues, setSchemeFormValues] = useState();

  useEffect(() => {
    console.warn(schemeEditFormValues);

    if (schemeEditFormValues) {
      setSchemeEditValues(schemeEditFormValues);
    }
  }, [schemeEditFormValues]);
  // Dialog state
  const [openSchemeDialog, setOpenSchemeDialog] = useState(false);
  // Sets form values for editing
  const schemeEditing = (value) => {
    setSchemeFormValues(value);
  };
  const setActiveEditing = () => {
    setIsEditingScheme(true);
  };
  const setActiveClose = () => {
    setIsEditingScheme(false);
  };
  // // Main Data state
  // const [schemeData, setSchemeData] = useState([]);
  // Dialog state
  const handleOpenSchemeDialog = () => {
    setOpenSchemeDialog(!openDialog);
  };
  // const clearFormValues = () => {
  //   // setFormValues(formAllValues);
  // };
  // Active Button state
  const [isSchemeActive, setSchemeActive] = useState();
  const handleIsSchemeActive = (initialValue) => {
    setSchemeActive(initialValue);
  };
  // Custom fields/ columns
  const columns = useMemo(() => tableColumns, []);

  // if (isLoading) return <Loader />;

  return (
    <Dialog
      className="dialog_main"
      open={openDialog}
      TransitionComponent={PopupTransition}
      onClose={handleOpenDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogForm
        openDialog={openSchemeDialog}
        handleOpenDialog={handleOpenSchemeDialog}
        schemeEditFormValues={schemeFormValues}
        fdId={fdId}
        selectedPayoutMethod={selectedPayoutMethod}
        clearFormValues={clearFormValues}
        setIsActive={handleIsSchemeActive}
        isActive={isSchemeActive}
        isEditingScheme={isEditingScheme}
        setActiveClose={setActiveClose}
        setSchemeData={setSchemeData}
      />
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ p: 2 }}>Existing Schemes</DialogTitle>
        <DialogActions sx={{ gap: 2, p: 2 }}>
          <Button
            color="error"
            onClick={() => {
              handleOpenDialog();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Stack>
      <Divider />
      <DialogContent sx={{ p: 2, overflowY: 'unset' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InterestRateTable
              columns={columns}
              data={schemeData}
              // changeTableVisibility={changeTableVisibility}
              schemeEditing={schemeEditing}
              deleteOneItem={DeleteOneInterestRate}
              // setSearchData={setSearchData}
              setSchemeData={setSchemeData}
              setActiveEditing={setActiveEditing}
              handleIROpenDialog={handleOpenSchemeDialog}
              VisibleColumn={VisibleColumn}
              hideActions={true}
            />
          </Grid>
        </Grid>
      </DialogContent>
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
