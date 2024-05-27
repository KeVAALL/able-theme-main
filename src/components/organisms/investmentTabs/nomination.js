/* eslint-disable react/prop-types */
import React, { memo, useState } from 'react';
import { Box, Card, Grid, Button, CardContent, CardHeader, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project-imports
import AnimateButton from 'helpers/@extended/AnimateButton';
// assets
import { relationship } from 'constant/investorValidation';
import MultiTable from 'components/pages/multiTable/multiTable';
import MainCard from '../mainCard/MainCard';
import { CustomTextField, FormikAutoComplete } from 'utils/textfield';

// third-party
import { Formik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Additem } from 'iconsax-react';
import { UpdateNominee } from 'hooks/transaction/investment';
import { GetEditOneInvestor } from 'hooks/investor/investor';
import enGB from 'date-fns/locale/en-GB';

const Nomination = (props) => {
  // theme
  const theme = useTheme();
  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(false);
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
  // Form State
  const formAllValues = {
    full_name: '',
    pan: '',
    relationship_id: 1,
    birth_date: new Date(),
    address_line_1: '',
    address_line_2: '',
    pincode: '',
    city: '',
    state: '',
    percentage: ''
  };
  const validationSchema = yup.object().shape({
    full_name: yup.string().required('Name is Required'),
    pan: yup.string().matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN format'),
    // /^([A-Z]){3}([P]){1}([A-Z]){1}([0-9]){4}([A-Z]){1}$/
    relationship_id: yup.number(),
    birth_date: yup.date().required('Date of birth is required'),
    address_line_1: yup.string().required('Address is Required'),
    address_line_2: yup.string().required('Address is Required'),
    pincode: yup.string().required('Pin Code is Required'),
    city: yup.string().required('City is Required'),
    state: yup.string().required('State is required'),
    percentage: yup.string().required('Percentage is required')
  });
  const [formValues, setFormValues] = useState(formAllValues);
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
  };

  // Table
  const VisibleColumn = [];
  const columns = [
    {
      Header: 'Name',
      accessor: 'full_name'
    },
    {
      Header: 'Pan Number',
      accessor: 'pan'
    },
    {
      Header: 'Relation',
      accessor: 'relationship_id',
      customCell: ({ value }) => {
        console.log(value);
        return relationship.map((el) => {
          if (el.id === value) {
            console.log(el.relation_name);
            return el.relation_name;
          }
        });
      }
    }
  ];
  const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
  };

  return (
    <>
      <>
        {showTable && (
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (isEditing === false) {
                console.log({ ...values, relation_name: selectedRelation });
              }
              if (isEditing === true) {
                console.log({ ...values, method_name: 'update' });
              }
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
                    <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title="Add Nominee" />
                    <Stack direction="row" alignItems="center" spacing={1.5} paddingRight={2.5}>
                      <Box>
                        <AnimateButton>
                          <Button
                            disabled={isEditing ? !(isEditing && isValid) : !(isValid && dirty)}
                            variant="contained"
                            color="success"
                            startIcon={<Additem />}
                            onClick={async () => {
                              const payload = {
                                fd_investment_id: props.fdInvestmentID,
                                investor_id: props.investorID,
                                nominee: [{ ...values }]
                              };

                              await UpdateNominee(payload);

                              await GetEditOneInvestor(props.setInvestorEditing, props.investorID);

                              changeTableVisibility();
                              clearFormValues();
                            }}
                          >
                            Submit
                          </Button>
                        </AnimateButton>
                      </Box>
                      <Box>
                        <AnimateButton>
                          <Button
                            variant="outlined"
                            color="secondary"
                            type="button"
                            onClick={() => {
                              changeTableVisibility();
                              if (setActiveClose) {
                                setActiveClose();
                              }
                              clearFormValues();
                            }}
                          >
                            Cancel
                          </Button>
                        </AnimateButton>
                      </Box>
                    </Stack>
                  </Stack>
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3} sx={{ marginTop: '0px' }}>
                      <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="Full Name"
                          name="full_name"
                          placeholder="Please enter your Name"
                          values={values}
                          type="string"
                          regType="string"
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="PAN of Nominee"
                          name="pan"
                          placeholder="Please enter your PAN"
                          values={values}
                          type="string"
                          regType="pan"
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                        <FormikAutoComplete
                          options={relationship}
                          defaultValue={values.relationship_id}
                          setFieldValue={setFieldValue}
                          formName="relationship_id"
                          optionName="relation_name"
                          label="Relationship with Investor"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                          <DesktopDatePicker
                            className="calendar_main"
                            label="DOB"
                            inputFormat="dd/MM/yyyy"
                            value={values?.birth_date && new Date(values?.birth_date)}
                            onChange={(newValue) => {
                              console.log(newValue);
                              // setFieldValue('birth_date', dateFormatter(newValue));
                              setFieldValue('birth_date', newValue);
                            }}
                            renderInput={(params) => <CustomTextField {...params} />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="Address Line 1"
                          name="address_line_1"
                          placeholder="Please enter your Address Line 1"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="Address Line 2"
                          name="address_line_2"
                          placeholder="Please enter your Address Line 2"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="Pin Code"
                          name="pincode"
                          placeholder="Please enter your Pin Code"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="City"
                          name="city"
                          placeholder="Please enter your City"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="State"
                          name="state"
                          placeholder="Please enter your State"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="Percentage (%)"
                          name="percentage"
                          placeholder="Please enter your Percentage"
                          values={values}
                          type="string"
                          reg="number"
                          setFieldValue={setFieldValue}
                          // onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Formik>
        )}
        {!showTable && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <MainCard
                title="Nominee"
                changeTableVisibility={changeTableVisibility}
                showButton
                setActiveAdding={setActiveClose}
                border
                contentSX={{ p: 0 }}
                sx={{ height: '100%' }}
              >
                <MultiTable
                  columns={columns}
                  data={props.nomineeData}
                  changeTableVisibility={changeTableVisibility}
                  setEditing={setEditing}
                  // getOneItem={GetOneProduct}
                  // deleteOneItem={DeleteOneProduct}
                  // setSearchData={setSearchData}
                  // tableDataRefetch={ProductTableDataRefetch}
                  setActiveEditing={setActiveEditing}
                  VisibleColumn={VisibleColumn}
                  doNotShowHeader={true}
                />
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ borderRadius: 0.6 }}
                onClick={async () => {
                  props.handleTabChange(event, props.tabValue - 1);
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ borderRadius: 0.6 }}
                onClick={async () => {
                  props.handleTabChange(event, props.tabValue + 1);
                }}
              >
                Proceed
              </Button>
            </Grid>
          </Grid>
        )}
      </>
    </>
  );
};

export default memo(Nomination);
