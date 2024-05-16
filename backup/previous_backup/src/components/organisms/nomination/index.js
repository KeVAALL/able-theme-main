/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Card, Grid, Button, CardContent, CardHeader, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomTextField, { FormikAutoComplete, dateFormatter } from 'utils/textfield';
import { Formik } from 'formik';
import * as yup from 'yup';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiTable from 'components/pages/multiTable/multiTable';
import MainCard from '../mainCard/MainCard';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { Additem } from 'iconsax-react';
import { relationship } from 'constant/investorValidation';

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
    state: ''
  };
  const validationSchema = yup.object().shape({
    full_name: yup.string(),
    pan: yup.string(),
    relationship_id: yup.number(),
    birth_date: yup.date().required('Date of birth is required'),
    address_line_1: yup.string(),
    address_line_2: yup.string(),
    pincode: yup.string(),
    city: yup.string(),
    state: yup.string()
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
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit, resetForm, isSubmitting }) => (
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
                            variant="contained"
                            color="success"
                            startIcon={<Additem />}
                            onClick={() => {
                              console.log({
                                ...values
                              });
                              props.handleNewNominee({
                                ...values
                              });
                              changeTableVisibility();
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
                          label="PAN of Nominee"
                          name="pan"
                          values={values}
                          type="string"
                          onChange={handleChange}
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DesktopDatePicker
                            className="calendar_main"
                            label="DOB"
                            inputFormat="dd/MM/yyyy"
                            // onChange={handleDateChange}
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
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="Pin Code"
                          name="pincode"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="City"
                          name="city"
                          values={values}
                          type="string"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} style={{ display: 'grid', gap: '10px' }}>
                        <CustomTextField
                          label="State"
                          name="state"
                          values={values}
                          type="string"
                          onChange={handleChange}
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
        )}
      </>
    </>
  );
};

export default Nomination;

// Date Picker
// const [dateValue, setDateValue] = useState(new Date());
// const handleDateChange = (newValue) => {
//   setDateValue(newValue);
// };
// const relation = relationship.find((el) => el.id === value.relationship_id);
// if (relation.relation_name) {
//   setSelectedRelation(relation.relation_name);
// } else {
//   selectedRelation(relation.relationship_id);
// }
{
  /* <Typography sx={{ color: '#21B546', marginBottom: '0px', display: 'block' }} variant="p">
            First Nominee
          </Typography> */
}
// <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//                         <NestedCustomTextField
//                           label="Full Name"
//                           valueName="nominee.full_name"
//                           values={props.values.nominee.full_name}
//                           type="string"
//                           onChange={props.handleChange}
//                           onBlur={props.handleBlur}
//                           touched={props.touched}
//                           errors={props.error}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//                         <CustomAutoComplete
//                           options={relationship}
//                           defaultValue={props.selectedRelation}
//                           setSelected={props.setSelectedRelation}
//                           optionName="relation_name"
//                           label="Relationship with Investor"
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//                         <Grid container spacing={1}>
//                           <Grid item xs={6} sm={6} md={12} style={{ display: 'grid', gap: '10px' }}>
//                             <NestedCustomTextField
//                               label="PAN of Nominee"
//                               valueName="nominee.pan"
//                               values={props.values.nominee.pan}
//                               type="string"
//                               onChange={props.handleChange}
//                               onBlur={props.handleBlur}
//                               touched={props.touched}
//                               errors={props.error}
//                             />
//                           </Grid>
//                         </Grid>
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                           <DesktopDatePicker
//                             className="calendar_main"
//                             label="DOB"
//                             inputFormat="dd/MM/yyyy"
//                             value={value}
//                             onChange={handleChange}
//                             renderInput={(params) => <CustomTextField {...params} />}
//                           />
//                         </LocalizationProvider>
//                       </Grid>
{
  /* <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                  <CustomTextField
                    label="Percent Share (%)"
                    name="pan_no"
                    values={''}
                    type="string"
                    onChange={() => {}}
                    onBlur={() => {}}
                    touched={() => {}}
                    errors={() => {}}
                  />
                </Grid> */
}
{
  /* <div id="__checkbox" style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
          <Checkbox defaultChecked={false} />
          <Typography sx={{ color: '#5E718D', marginBottom: '12px' }} variant="p">
            Nominee’s address is same as investor’s address
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '20px' }}>
          <Button variant="outlined" onClick={() => setShowSecondNominiee(true)}>
            Add Nominee
          </Button>{' '}
          <Button variant="outlined" disabled>
            Save & Continue
          </Button>
        </Box> */
}
// {showSecondNominiee && (
//   <>
//     <Box id="__first_nominee" sx={{ marginTop: '30px' }}>
//       <Typography sx={{ color: '#21B546', marginBottom: '0px', display: 'block' }} variant="p">
//         Second Nominee
//       </Typography>

//       <Grid container spacing={2} sx={{ marginTop: '0px' }}>
//         <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//           <Typography sx={{ fontWeight: '600' }} variant="p">
//             Full Name
//           </Typography>

//           <CustomTextField
//             label="Apartment, Building, House"
//             name="pan_no"
//             values={''}
//             type="string"
//             onChange={() => {}}
//             onBlur={() => {}}
//             touched={() => {}}
//             errors={() => {}}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//           <Typography sx={{ fontWeight: '600' }} variant="p">
//             Relationship
//           </Typography>

//           <CustomAutoComplete
//             // options={[]}
//             options={autocompleteData}
//             optionName="product_type"
//             // handleChange={() => {}}
//             handleChange={(event) => {
//               console.log(event.target.value);
//             }}
//             label="Select relation with investor"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//           <Grid container spacing={1}>
//             <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//               <Typography sx={{ fontWeight: '600' }} variant="p">
//                 PAN
//               </Typography>
//               <CustomTextField
//                 label="PAN of nominee"
//                 name="pan_no"
//                 values={''}
//                 type="string"
//                 onChange={() => {}}
//                 onBlur={() => {}}
//                 touched={() => {}}
//                 errors={() => {}}
//               />
//             </Grid>
//             <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//               <Typography sx={{ fontWeight: '600' }} variant="p">
//                 Percent Share
//               </Typography>
//               <CustomTextField
//                 label="Enter % share"
//                 name="pan_no"
//                 values={''}
//                 type="string"
//                 onChange={() => {}}
//                 onBlur={() => {}}
//                 touched={() => {}}
//                 errors={() => {}}
//               />
//             </Grid>
//           </Grid>
//         </Grid>
//         <Grid item xs={12} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
//           <Typography sx={{ fontWeight: '600' }} variant="p">
//             Date of Birth
//           </Typography>

//           <CustomAutoComplete
//             // options={[]}
//             options={autocompleteData}
//             optionName="product_type"
//             // handleChange={() => {}}
//             handleChange={(event) => {
//               console.log(event.target.value);
//             }}
//             label="Select your source of income"
//           />
//         </Grid>
//       </Grid>
//     </Box>
//     <div id="__checkbox" style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
//       <Checkbox defaultChecked />
//       <Typography sx={{ color: '#5E718D', marginBottom: '12px' }} variant="p">
//         Nominee’s address is same as investor’s address
//       </Typography>
//     </div>
//     <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '20px' }}>
//       <Button variant="outlined" onClick={() => setShowSecondNominiee(true)}>
//         Add Nominee
//       </Button>{' '}
//       <Button variant="outlined" disabled>
//         Save & Continue
//       </Button>
//     </Box>
//   </>
// )}
