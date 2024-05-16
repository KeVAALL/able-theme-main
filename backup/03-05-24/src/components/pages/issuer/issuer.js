import { useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';

// third-party
import { Formik } from 'formik';
import Loader from 'components/atoms/loader/Loader';
import { SubmitButton } from 'components/atoms/button/button';
import CustomTextField from 'utils/textfield';

// assets
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/issuerValidation';
import { GetIssuerData, GetOneIssuer, SaveIssuer, EditIssuer, DeleteOneIssuer } from 'hooks/issuer/issuer';

function Issuer() {
  // Main data state to hold the list of issuers
  const [issuerData, setIssuerData] = useState([]);
  // Editing States
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [isIssuerActive, setIssuerActive] = useState(); // State to track if the issuer is active or not active
  // Form Visibility
  const [showTable, setShowTable] = useState(false); // State to hold form input values
  // Form State
  const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values
  // Theme
  const theme = useTheme();

  // Functions
  // Editing States
  const setEditing = (value) => {
    setFormValues(value);
  };
  // Activates editing mode
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  // Deactivates editing mode
  const setActiveClose = () => {
    setIsEditing(false);
  };
  const handleIsIssuerActive = (initialValue) => {
    setIssuerActive(initialValue);
  };
  // Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };
  // Search Data
  const setSearchData = (issuer) => {
    setIssuerData(issuer);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
  };
  // Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Query for fetching issuer data // Main Data
  const {
    isPending, // Flag indicating if query is pending
    error, // Error object if query fails
    refetch: issuerTableDataRefetch // Function to refetch issuer data
  } = useQuery({
    queryKey: ['issuerTableData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: GetIssuerData, // Function to fetch issuer data
    onSuccess: (data) => {
      console.log(data);
      setIssuerData(data); // Update issuer data on successful query
    }
  });

  if (isPending) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (isEditing === false) {
              SaveIssuer(values, issuerTableDataRefetch, clearFormValues);
            }
            if (isEditing === true) {
              EditIssuer(values, isIssuerActive, issuerTableDataRefetch, clearFormValues, setActiveClose);
            }
            changeTableVisibility();
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm, isSubmitting }) => (
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
                <SubmitButton
                  title="Issuer Entry"
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsIssuerActive}
                  isActive={isIssuerActive}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Issuer Name"
                        name="issuer_name"
                        values={values}
                        type="text"
                        regType="string"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="GST Number"
                        name="issuer_gst_number"
                        placeholder={'Please enter GST Number'}
                        values={values}
                        type="text"
                        regType="noSpecial"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 15 }}
                      />
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Issuer PAN"
                        name="issuer_pan"
                        placeholder={'Please enter PAN'}
                        values={values}
                        type="text"
                        regType="noSpecial"
                        setFieldValue={setFieldValue}
                        // onChange={(e) => {
                        //   const panReg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
                        //   e.preventDefault();
                        //   const { value } = e.target;
                        //   const panRegex = RegExp(regEx.panRegex);
                        //   if (panRegex.test(value)) {
                        //     console.log(panReg.test(value));
                        //   }
                        // }}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Issuer Tollfree Number"
                        name="issuer_tollfree_number"
                        placeholder={'Please enter Toll-free Number'}
                        values={values}
                        type="text"
                        regType="number"
                        setFieldValue={setFieldValue}
                        // onChange={(e) => {
                        //   e.preventDefault();
                        //   const { value } = e.target;
                        //   const regex = /^\d+$/;
                        //   if (!value || regex.test(value.toString())) {
                        //     setFieldValue('issuer_tollfree_number', value);
                        //   }
                        // }}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 15 }}
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Logo URL"
                        name="logo_url"
                        placeholder={'Please enter logo url'}
                        values={values}
                        type="text"
                        regType="url"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
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
          title="Issuer Name Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <MultiTable
            columns={columns}
            data={issuerData}
            formValues={filterFormValues}
            formValueFields={formValueFields}
            validationSchema={filterValidationSchema}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={GetOneIssuer}
            deleteOneItem={DeleteOneIssuer}
            setSearchData={setSearchData}
            tableDataRefetch={issuerTableDataRefetch}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
          />
        </MainCard>
      )}
    </>
  );
}

export default Issuer;
