/* eslint-disable react/prop-types */
import { memo, useMemo, useState } from 'react';

// material-ui
import {
  Divider,
  Box,
  Card,
  Grid,
  CardContent,
  CardHeader,
  Button,
  Stack,
  Avatar,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogContent
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/issuerValidation';
import { GetIssuerData, GetOneIssuer, SaveIssuer, EditIssuer, DeleteOneIssuer, DeleteOneFAQ } from 'hooks/issuer/issuer';
import { SubmitButton } from 'components/atoms/button/button';
import AnimateButton from 'helpers/@extended/AnimateButton';
import Loader from 'components/atoms/loader/Loader';
import IconButton from 'helpers/@extended/IconButton';
import { CustomTextField, NestedCustomTextField } from 'utils/textfield';
import { PopupTransition } from 'helpers/@extended/Transitions';
import './issuer.css';

// third-party
import { Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { toInteger } from 'lodash';

// assets
import { Add, Edit, MessageQuestion, Trash } from 'iconsax-react';

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
  // Color picker
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [startColor, setStartColor] = useState('#ffffff');
  const [endColor, setEndColor] = useState('#ffffff');
  // Theme
  const theme = useTheme();
  // Actions
  const [issuerSubmitting, setIssuerSubmitting] = useState(false);
  const [issuerDeleting, setIssuerDeleting] = useState(false);

  // Functions
  // Editing States
  const setEditing = (value) => {
    setBackgroundColor(value.app_bg_colour);
    setStartColor(value.start_colour);
    setEndColor(value.end_colour);
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
  // Color Picker
  const handleBGColorChange = (newValue) => {
    setBackgroundColor(newValue);
  };
  const handleStartColorChange = (newValue) => {
    setStartColor(newValue);
  };
  const handleEndColorChange = (newValue) => {
    setEndColor(newValue);
  };
  // Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };
  // Search Data
  const setSearchData = (issuer) => {
    console.log(issuer);
    setIssuerData(issuer);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues(formAllValues);
    setBackgroundColor('#ffffff');
    setStartColor('#ffffff');
    setEndColor('#ffffff');
  };
  // Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Query for fetching issuer data // Main Data
  const {
    isPending, // Flag indicating if query is pending
    isFetching,
    error, // Error object if query fails
    refetch: issuerTableDataRefetch // Function to refetch issuer data
  } = useQuery({
    queryKey: ['issuerTableData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const payload = {
        method_name: 'getall'
      };
      return GetIssuerData(payload);
    }, // Function to fetch issuer data
    onSuccess: (data) => {
      console.log(data);
      // Set Panel Names for FAQ Accordion.
      const faqPanelName = data.map((el) => {
        return {
          ...el,
          faqs:
            el.faqs &&
            el.faqs.map((fa, index) => {
              return { ...fa, panelName: `panel${index}` };
            })
        };
      });
      console.log(faqPanelName);
      setIssuerData(faqPanelName); // Update issuer data on successful query
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
            const userID = localStorage.getItem('userID');
            if (isEditing === false) {
              const formValues = {
                ...values,
                method_name: 'add',
                app_bg_colour: backgroundColor,
                start_colour: startColor,
                end_colour: endColor,
                max_dp_fd_limit: 0,
                max_fd_nominee_limit: 0,
                max_pms_nominee_limit: 0,
                renewable_lower_bound: 0,
                renewable_upper_bound: 0,
                is_renewable: 0,
                user_id: toInteger(userID)
              };
              try {
                setIssuerSubmitting(true);
                await SaveIssuer(formValues, issuerTableDataRefetch, clearFormValues);
                changeTableVisibility();
              } catch (err) {
                console.log(err);
              } finally {
                setIssuerSubmitting(false);
              }
            }
            if (isEditing === true) {
              const formValues = {
                ...values,
                is_active: toInteger(isIssuerActive),
                method_name: 'update',
                user_id: toInteger(userID),
                app_bg_colour: backgroundColor,
                start_colour: startColor,
                end_colour: endColor
              };
              try {
                setIssuerSubmitting(true);
                await EditIssuer(formValues, issuerTableDataRefetch, clearFormValues, setActiveClose);
                changeTableVisibility();
              } catch (err) {
                console.log(err);
              } finally {
                setIssuerSubmitting(false);
              }
            }
            // changeTableVisibility();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setErrors,
            isValid,
            dirty,
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
                  loading={issuerSubmitting}
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsIssuerActive}
                  isActive={isIssuerActive}
                  isValid={isValid}
                  dirty={dirty}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        // disabled={isEditing}
                        label="Issuer PAN"
                        name="issuer_pan"
                        placeholder={'Please enter Issuer PAN'}
                        values={values}
                        type="text"
                        regType="pan"
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
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        // disabled={true}
                        label="Issuer Name"
                        name="issuer_name"
                        placeholder={'Please enter Issuer Name'}
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
                        // disabled={isEditing}
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
                        // disabled={isEditing}
                        label="Issuer Tollfree Number"
                        name="issuer_tollfree_number"
                        placeholder={'Please enter Toll-free Number'}
                        values={values}
                        type="text"
                        regType="number"
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
                    <Grid item md={8} sm={6} xs={12}>
                      <CustomTextField
                        label="Logo URL"
                        name="logo_url"
                        placeholder={'Please enter Logo URL'}
                        values={values}
                        type="text"
                        regType="noSpace"
                        setFieldValue={setFieldValue}
                        // onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        fullWidth
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                        inputProps={{ maxLength: 150 }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <MuiColorInput
                        fullWidth
                        label="BG Color"
                        className="color_picker_main"
                        format="hex"
                        // value={values.app_bg_colour}
                        value={backgroundColor}
                        fallbackValue="#ffffff"
                        onChange={(e) => {
                          handleBGColorChange(e);
                          // setFieldValue('app_bg_colour', e);
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <MuiColorInput
                        fullWidth
                        label="Start Color"
                        className="color_picker_main"
                        format="hex"
                        value={startColor}
                        fallbackValue="#ffffff"
                        onChange={(e) => {
                          handleStartColorChange(e);
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <MuiColorInput
                        fullWidth
                        label="End Color"
                        className="color_picker_main"
                        format="hex"
                        value={endColor}
                        fallbackValue="#ffffff"
                        onChange={(e) => {
                          handleEndColorChange(e);
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
            deletingItem={issuerDeleting}
            setDeletingItem={setIssuerDeleting}
            setSearchData={setSearchData}
            tableDataRefetch={issuerTableDataRefetch}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
            isFetching={isFetching}
          />
        </MainCard>
      )}
    </>
  );
}

export default Issuer;
