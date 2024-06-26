/* eslint-disable react/prop-types */
import React, { memo, useEffect, useState } from 'react';
import { Box, Card, Grid, Button, CardContent, Stack, Typography, TextField, DialogContent, Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import AnimateButton from 'helpers/@extended/AnimateButton';
// assets
import MainCard from '../mainCard/MainCard';
import { NestedCustomTextField } from 'utils/textfield';

// third-party
import { Formik, getIn } from 'formik';
import * as yup from 'yup';
import { Add, Bank, EmptyWalletAdd, Trash } from 'iconsax-react';
import Avatar from 'helpers/@extended/Avatar';
import BankDetailCard from 'components/molecules/bankDetails/bankDetailCard';
import { AddBankDetails, DeleteBankDetails, GetBankDetails, GetEditOneInvestor } from 'hooks/investor/investor';
import LoadingButton from 'helpers/@extended/LoadingButton';
import { PopupTransition } from 'helpers/@extended/Transitions';
import { setIn } from 'draft-js/lib/DefaultDraftBlockRenderMap';

const BankDetails = (props) => {
  // theme
  const theme = useTheme();
  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(true);
  const [loading, setLoading] = useState(false);
  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogIndex, setIndex] = useState();
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  //   const changeTableVisibility = () => {
  //     setShowTable(!showTable);
  //   };
  //   const [isEditing, setIsEditing] = useState(false);
  //   const setEditing = (value) => {
  //     console.log(value);
  //     setFormValues(value);
  //   };
  //   const setActiveEditing = () => {
  //     setIsEditing(true);
  //   };
  //   const setActiveClose = () => {
  //     setIsEditing(false);
  //   };

  const [formValues, setFormValues] = useState();
  // Handle Editing
  // Make Dynamic States First
  // Make Conditional Rendering for Bank Details
  // On click of Edit button, set the isEditing value of that element by passing its ID to the dynamic handler

  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
  };
  // Delete
  const DeleteOneNominee = (value) => {
    const deleteNominee = props.values.nominee.filter((nominee) => {
      if (nominee.nominee_id) {
        return nominee.nominee_id !== value.nominee_id;
      } else {
        return nominee.id !== value.id;
      }
    });
    props.setFieldValue('nominee', deleteNominee);
  };
  const DeleteBank = memo(({ openDialog, handleOpenDialog, values, investorID, index, setFieldValue }) => {
    console.log(index);
    return (
      <Dialog
        open={openDialog}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={handleOpenDialog}
        maxWidth="xs"
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
        className="dialog_backdrop"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Avatar className="avatar_main" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
              <Trash variant="Bold" />
            </Avatar>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                Are you sure you want to delete?
              </Typography>
              {/* <Typography align="center">By deleting this user, all task assigned to that user will also be deleted.</Typography> */}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={handleOpenDialog} color="secondary" variant="outlined">
                Cancel
              </Button>
              <Button
                fullWidth
                color="error"
                variant="contained"
                onClick={async () => {
                  console.log(index);
                  if (values[index]) {
                    console.log(values[index]);
                    const payload = {
                      method_name: 'deleteBank',
                      investor_bank_id: values[index].investor_bank_id,
                      investor_id: investorID
                    };
                    try {
                      await DeleteBankDetails(payload);
                      const remove = values.filter((el, elIndex) => elIndex !== index);
                      setFieldValue('investor_bank', remove);
                      handleOpenDialog();
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }}
                autoFocus
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  });

  useEffect(() => {
    setFormValues(props.values.investor_bank);
  }, []);

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center">
      <Stack spacing={5} sx={{ width: '70%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="#5E718D">
          Effortlessly add, remove or manage your linked bank accounts
        </Typography>
        <Button
          className="add_circle_button"
          variant="contained"
          color="success"
          startIcon={<Add style={{ margin: '0px !important' }} />}
          onClick={() => {
            props.setFieldValue('investor_bank', [
              ...props.values.investor_bank,
              {
                account_no: '',
                ifsc_code: '',
                beneficiary_name: '',
                is_editing: 1,
                is_new: 1
              }
            ]);
          }}
        ></Button>
      </Stack>
      <DeleteBank
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        values={props.values.investor_bank}
        investorID={props.values.investor.investor_id}
        index={dialogIndex}
        setFieldValue={props.setFieldValue}
      />
      {props.values.investor_bank && props.values.investor_bank.length > 0 ? (
        <Stack spacing={2} sx={{ width: '70%' }}>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            // validate={false}
            //   props.values.investor_bank.map((el) => {
            //     return { ...el, isEditing: false };
            //   })
            initialValues={props.values}
            validationSchema={props.validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log(values);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, dirty, handleSubmit, isSubmitting }) => (
              <Box
                component="form"
                onSubmit={(event) => {
                  event.preventDefault();

                  handleSubmit();
                }}
                sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                {props.values.investor_bank.map((bank, index) =>
                  bank.is_editing ? (
                    <Card
                      elevation={0}
                      key={index}
                      sx={{
                        position: 'relative',
                        border: '1px solid',
                        borderRadius: 1.5,
                        borderColor: '#068e44',
                        overflow: 'visible',
                        my: 2
                      }}
                    >
                      <CardContent sx={{}}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" type="filled" sx={{ border: '2px solid #D7DFE9', backgroundColor: '#fff' }}>
                            <Bank color="#068e44" style={{ fontSize: '20px', height: '22px', width: '22px' }} />
                          </Avatar>
                          <Stack spacing={0}>
                            <Typography variant="body1" fontWeight={600} color="black">
                              {bank.is_editing && bank.is_new ? 'Add' : 'Edit'} Bank Account
                            </Typography>
                            <Grid container alignItems="center">
                              <Grid item>
                                <Typography variant="caption" color="#5E718D">
                                  Manual Verification
                                </Typography>
                              </Grid>
                            </Grid>
                          </Stack>
                        </Stack>
                        <Grid container spacing={3} sx={{ marginTop: '0px' }}>
                          <Grid item xs={12} sm={6} md={bank.investor_bank_id ? 4 : 6}>
                            <NestedCustomTextField
                              label="Bank Account Number"
                              valueName={`investor_bank[${index}].account_no`}
                              placeholder="Please enter your Account Number"
                              values={props.values.investor_bank[index].account_no}
                              type="text"
                              regType="number"
                              setFieldValue={props.setFieldValue}
                              handleBlur={props.handleBlur}
                              touched={props.touched}
                              errors={props.errors}
                              inputProps={{ maxLength: 14 }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={bank.investor_bank_id ? 4 : 6}>
                            <TextField
                              fullWidth
                              className="common-textfield"
                              size="small"
                              label="IFSC Code"
                              name={`investor_bank[${index}].ifsc_code`}
                              onChange={async (e) => {
                                e.preventDefault();
                                const { value } = e.target;
                                const regex = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;
                                props.setFieldValue(`investor_bank[${index}].ifsc_code`, value);
                                if (regex.test(value.toString()) && value.length === 11) {
                                  let payload = { ifsc: value };
                                  try {
                                    const response = await GetBankDetails(payload);
                                    console.log(response);

                                    const newBankDetails = props.values.investor_bank.map((el, elIndex) => {
                                      if (elIndex == index) {
                                        console.log(el);
                                        return { ...el, ...response, ifsc_code: value };
                                      }
                                      return el;
                                    });

                                    props.setFieldValue('investor_bank', newBankDetails);
                                  } catch (err) {
                                    console.log(err);
                                  }
                                }
                              }}
                              onBlur={props.handleBlur}
                              value={props.values.investor_bank[index].ifsc_code}
                              type="text"
                              error={Boolean(
                                getIn(props.touched, `investor_bank[${index}].ifsc_code`) &&
                                  getIn(props.errors, `investor_bank[${index}].ifsc_code`)
                              )}
                              helperText={
                                getIn(props.touched, `investor_bank[${index}].ifsc_code`) &&
                                getIn(props.errors, `investor_bank[${index}].ifsc_code`)
                              }
                              FormHelperTextProps={{
                                style: {
                                  marginLeft: 0
                                }
                              }}
                              inputProps={{ maxLength: 11 }}
                            />
                          </Grid>
                          {bank.investor_bank_id && (
                            <Grid item xs={12} sm={6} md={4}>
                              <NestedCustomTextField
                                label="Beneficiary Name"
                                valueName={`investor_bank[${index}].beneficiary_name`}
                                placeholder="Please enter Beneficiary Name"
                                values={props.values.investor_bank[index].beneficiary_name}
                                type="text"
                                regType="string"
                                setFieldValue={props.setFieldValue}
                                handleBlur={props.handleBlur}
                                touched={props.touched}
                                errors={props.errors}
                              />
                            </Grid>
                          )}
                          <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                            <LoadingButton
                              loading={loading}
                              variant="contained"
                              color="success"
                              loadingPosition="center"
                              startIcon={<Add />}
                              onClick={async (e) => {
                                //   e.preventDefault();
                                const payload = {
                                  investor_id: props.values.investor.investor_id,
                                  account_number: props.values.investor_bank[index].account_no,
                                  ifsc_code: props.values.investor_bank[index].ifsc_code
                                };

                                setLoading(true); // Set loading to true before the API call

                                try {
                                  const response = await AddBankDetails(payload);
                                  const newBank = props.values.investor_bank.map((el, elIndex) => {
                                    if (elIndex == index) {
                                      return { ...el, is_editing: 0, is_new: 0 };
                                    }
                                    return el;
                                  });
                                  console.log(newBank);

                                  // props.setFieldValue('investor_bank', newBank);
                                  await GetEditOneInvestor(props.setEditing, props.values.investor.investor_id);
                                } catch (err) {
                                  console.log(err);
                                } finally {
                                  setLoading(false);
                                }
                              }}
                            >
                              {/* <Button
                                fullWidth
                                // disabled={
                                //   isEditing
                                //     ? !(isEditing && props.isValid)
                                //     : !(props.isValid.valueOf('investor_bank') && props.dirty.valueOf('investor_bank'))
                                // }
                                variant="contained"
                                color="success"
                                // type="submit"
                              > */}
                              Save & Continue
                              {/* </Button> */}
                            </LoadingButton>
                          </Grid>
                          <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                            <AnimateButton>
                              <Button
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                type="button"
                                onClick={() => {
                                  if (bank.is_editing && bank.is_new) {
                                    const remove = props.values.investor_bank.filter((el, elIndex) => elIndex !== index);

                                    props.setFieldValue('investor_bank', remove);
                                  } else {
                                    const editItem = formValues.map((el, elIndex) => {
                                      if (elIndex == index) {
                                        return { ...el, is_editing: 0 };
                                      }
                                      return el;
                                    });

                                    props.setFieldValue('investor_bank', editItem);
                                  }
                                }}
                              >
                                Back
                              </Button>
                            </AnimateButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ) : (
                    <BankDetailCard
                      key={index}
                      index={index}
                      values={props.values}
                      setFieldValue={props.setFieldValue}
                      logoURL={bank.bank_logo}
                      title={bank.bank_name}
                      accountNumber={bank.account_no}
                      IFSC={bank.ifsc_code}
                      branchName={bank.branch}
                      isPrimary={bank.is_primary_account}
                      handleOpenDialog={handleOpenDialog}
                      setIndex={setIndex}
                    />
                  )
                )}
              </Box>
            )}
          </Formik>
        </Stack>
      ) : (
        <Card
          elevation={0}
          sx={{
            width: '70%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F8F9FA',
            my: 2,
            p: 4
          }}
        >
          <Stack spacing={2} alignItems="center">
            <EmptyWalletAdd color="#BEC8D0" style={{ height: '70px', width: '70px' }} />
            <Typography variant="h4" color="secondary">
              Add Bank Account
            </Typography>
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

export default memo(BankDetails);

{
  /* <Grid container> */
}
{
  /* <NestedCustomTextField
                              label="IFSC Code"
                              valueName={`investor_bank[${index}].ifsc_code`}
                              placeholder="Please enter IFSC Code"
                              values={props.values.investor_bank[index].ifsc_code}
                              type="text"
                              regType="noSpecial"
                              setFieldValue={props.setFieldValue}
                              handleBlur={props.handleBlur}
                              touched={props.touched}
                              errors={props.errors}
                            /> */
}
{
  /* <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
              <AnimateButton>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  // type="submit"
                  startIcon={<Add />}
                  onClick={(e) => {
                    props.setFieldValue('investor_bank', [
                      ...props.values.investor_bank,
                      {
                        account_no: '',
                        ifsc_code: '',
                        beneficiary_name: '',
                        is_editing: 1,
                        is_new: 1
                      }
                    ]);
                  }}
                >
                  Add more
                </Button>
              </AnimateButton>
            </Grid> */
}
{
  /* </Grid> */
}
