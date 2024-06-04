/* eslint-disable react/prop-types */
import React, { memo, useEffect, useState } from 'react';
import { Box, Card, Grid, Button, CardContent, CardHeader, Stack, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project-imports
import AnimateButton from 'helpers/@extended/AnimateButton';
// assets
import { relationship } from 'constant/investorValidation';
import MultiTable from 'components/pages/multiTable/multiTable';
import MainCard from '../mainCard/MainCard';
import { CustomTextField, FormikAutoComplete, NestedCustomTextField } from 'utils/textfield';

// third-party
import { Formik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Additem, Bank } from 'iconsax-react';
import { v4 as uuidv4 } from 'uuid';
import enGB from 'date-fns/locale/en-GB';
import Avatar from 'helpers/@extended/Avatar';

const BankDetails = (props) => {
  // theme
  const theme = useTheme();
  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(true);
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };
  const [isEditing, setIsEditing] = useState(false);
  const setEditing = (value) => {
    console.log(value);
    setFormValues(value);
  };
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  const setActiveClose = () => {
    setIsEditing(false);
  };

  //   const [formValues, setFormValues] = useState(formAllValues);
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

  const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
  };

  return (
    <>
      {showTable && props.values.investor_bank && props.values.investor_bank.length > 0 && (
        <Stack spacing={2}>
          <Formik
            initialValues={props.values}
            //   props.values.investor_bank.map((el) => {
            //     return { ...el, isEditing: false };
            //   })
            validationSchema={props.validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              isValid,
              dirty,
              handleSubmit,
              resetForm,
              isSubmitting
            }) => (
              <Box
                component="form"
                onSubmit={(event) => {
                  event.preventDefault();

                  handleSubmit();
                }}
                sx={{ width: '100%' }}
              >
                {props.values.investor_bank.map((bank, index) =>
                  bank.isEditing ? (
                    <Card
                      elevation={0}
                      key={index}
                      sx={{
                        position: 'relative',
                        border: '1px solid',
                        borderRadius: 1.5,
                        borderColor: '#068e44',
                        overflow: 'visible',
                        marginBottom: 2
                      }}
                    >
                      <CardContent sx={{}}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" type="filled" sx={{ border: '2px solid #D7DFE9', backgroundColor: '#fff' }}>
                            <Bank color="#068e44" style={{ fontSize: '20px', height: '22px', width: '22px' }} />
                          </Avatar>
                          <Stack spacing={0}>
                            <Typography variant="body1" fontWeight={600} color="black">
                              Add Bank Account
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
                          <Grid item xs={12} sm={6} md={4}>
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
                              inputProps={{ maxLength: 12 }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={4}>
                            <NestedCustomTextField
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
                            />
                          </Grid>
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
                          <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                            <AnimateButton>
                              <Button
                                fullWidth
                                // disabled={
                                //   isEditing
                                //     ? !(isEditing && props.isValid)
                                //     : !(props.isValid.valueOf('investor_bank') && props.dirty.valueOf('investor_bank'))
                                // }
                                variant="contained"
                                color="success"
                                // type="submit"
                                startIcon={<Additem />}
                                onClick={(e) => {
                                  //   e.preventDefault();
                                  console.log({
                                    ...values
                                  });
                                }}
                              >
                                Save & Continue
                              </Button>
                            </AnimateButton>
                          </Grid>
                          <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                            <AnimateButton>
                              <Button
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                type="button"
                                onClick={() => {
                                  // changeTableVisibility();
                                  // if (setActiveClose) {
                                  //   setActiveClose();
                                  // }
                                  // clearFormValues();
                                  const remove = props.values.investor_bank.filter((el, elIndex) => elIndex !== index);

                                  props.setFieldValue('investor_bank', remove);
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
                    <></>
                  )
                )}
              </Box>
            )}
          </Formik>
          <Grid container>
            <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
              <AnimateButton>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  // type="submit"
                  startIcon={<Add />}
                  onClick={(e) => {
                    console.log({
                      ...props.values
                    });
                    props.setFieldValue('investor_bank', [
                      ...props.values.investor_bank,
                      {
                        account_no: '',
                        ifsc_code: '',
                        beneficiary_name: ''
                      }
                    ]);
                  }}
                >
                  Add more
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </Stack>
      )}
    </>
  );
};

export default memo(BankDetails);

// const relation = relationship.find((el) => el.id === value.relationship_id);
// if (relation.relation_name) {
//   setSelectedRelation(relation.relation_name);
// } else {
//   selectedRelation(relation.relationship_id);
// }
