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

const DeleteDialog = memo(({ openDialog, handleOpenDialog, values, index, setFieldValue }) => {
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
                if (values[index].issuer_faqs_id) {
                  console.log(values[index]);
                  const payload = { method_name: 'delete', issuer_faqs_id: values[index].issuer_faqs_id };
                  try {
                    await DeleteOneFAQ(payload);
                    const remove = values.filter((el, elIndex) => elIndex !== index);
                    setFieldValue('faqs', remove);
                    handleOpenDialog();
                  } catch (err) {
                    console.log(err);
                  }
                } else {
                  const remove = values.filter((el, elIndex) => elIndex !== index);
                  setFieldValue('faqs', remove);
                  handleOpenDialog();
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

  // Accordion
  const [expanded, setExpanded] = useState('');
  // For Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogIndex, setIndex] = useState();
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  const handleAccChange = (panel) => (event, newExpanded) => {
    console.log(panel, newExpanded);
    setExpanded(newExpanded ? panel : false);
  };

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
    setExpanded('');
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
                await SaveIssuer(formValues, issuerTableDataRefetch, clearFormValues);
                changeTableVisibility();
              } catch (err) {
                console.log(err);
              }
            }
            if (isEditing === true) {
              try {
                const formValues = {
                  ...values,
                  is_active: toInteger(isIssuerActive),
                  method_name: 'update',
                  user_id: toInteger(userID),
                  app_bg_colour: backgroundColor,
                  start_colour: startColor,
                  end_colour: endColor
                };
                await EditIssuer(formValues, issuerTableDataRefetch, clearFormValues, setActiveClose);
                changeTableVisibility();
              } catch (err) {
                console.log(err);
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
                        // value={values.start_color}
                        value={startColor}
                        fallbackValue="#ffffff"
                        onChange={(e) => {
                          handleStartColorChange(e);
                          // setFieldValue('start_color', e);
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <MuiColorInput
                        fullWidth
                        label="End Color"
                        className="color_picker_main"
                        format="hex"
                        // value={values.end_color}
                        value={endColor}
                        fallbackValue="#ffffff"
                        onChange={(e) => {
                          handleEndColorChange(e);
                          // setFieldValue('end_color', e);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                      <CardHeader title="FAQs" sx={{ px: 0 }} />
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                      <Divider />
                    </Grid>

                    {values.faqs.map((qa, index) =>
                      qa.is_editing ? (
                        <>
                          <Grid item xs={12} key={index}>
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
                                    <MessageQuestion color="#068e44" style={{ fontSize: '20px', height: '22px', width: '22px' }} />
                                  </Avatar>
                                  <Stack spacing={0}>
                                    <Typography variant="body1" fontWeight={600} color="black">
                                      Add FAQ
                                    </Typography>
                                  </Stack>
                                </Stack>
                                <Grid container spacing={3} sx={{ marginTop: '0px' }}>
                                  <Grid item xs={12} sm={6}>
                                    <NestedCustomTextField
                                      fullWidth
                                      label="Question"
                                      valueName={`faqs[${index}].faq`}
                                      placeholder="Please enter Question"
                                      values={values.faqs[index].faq}
                                      type="text"
                                      regType="string"
                                      setFieldValue={setFieldValue}
                                      // handleChange={handleChange}
                                      handleBlur={handleBlur}
                                      touched={touched}
                                      errors={errors}
                                      multiline={true}
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <NestedCustomTextField
                                      label="Answer"
                                      valueName={`faqs[${index}].answer`}
                                      placeholder="Please enter Answer"
                                      values={values.faqs[index].answer}
                                      type="text"
                                      regType="string"
                                      setFieldValue={setFieldValue}
                                      // handleChange={handleChange}
                                      handleBlur={handleBlur}
                                      touched={touched}
                                      // errors={Boolean(getIn(touched, `faqs[${index}].answer`) && getIn(errors, `faqs[${index}].answer`))}
                                      errors={errors}
                                      multiline
                                      rows={4}
                                      inputProps={{ maxLength: 500 }}
                                    />
                                  </Grid>
                                  <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                                    <AnimateButton>
                                      <Button
                                        fullWidth
                                        variant="contained"
                                        color="success"
                                        onClick={async (e) => {
                                          // e.preventDefault();

                                          if (values.faqs[index].faq.length < 1 && values.faqs[index].answer.length < 1) {
                                            enqueueSnackbar('Please fill required fields', {
                                              variant: 'error',
                                              autoHideDuration: 2000,
                                              anchorOrigin: {
                                                vertical: 'top',
                                                horizontal: 'right'
                                              }
                                            });
                                            return;
                                          }

                                          const newFAQ = values.faqs.map((el, elIndex) => {
                                            if (elIndex == index) {
                                              return { ...el, panelName: `panel${elIndex}`, is_editing: 0, is_new: 0 };
                                            }
                                            return el;
                                          });

                                          setFieldValue('faqs', newFAQ);
                                        }}
                                      >
                                        Save
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
                                          if (qa.is_editing && qa.is_new) {
                                            const remove = values.faqs.filter((el, elIndex) => elIndex !== index);
                                            setFieldValue('faqs', remove);
                                          } else {
                                            const editItem = values.faqs.map((el, elIndex) => {
                                              if (elIndex == index) {
                                                return { ...el, is_editing: 0 };
                                              }
                                              return el;
                                            });
                                            setFieldValue('faqs', editItem);
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
                          </Grid>
                        </>
                      ) : (
                        <Grid item xs={12} key={index}>
                          <DeleteDialog
                            openDialog={openDialog}
                            handleOpenDialog={handleOpenDialog}
                            values={values.faqs}
                            index={dialogIndex}
                            setFieldValue={setFieldValue}
                          />
                          <Accordion expanded={expanded === qa.panelName} onChange={handleAccChange(qa.panelName)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                              <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                <Typography>{qa.faq}</Typography>

                                <Stack spacing={1} direction="row">
                                  <IconButton
                                    color="error"
                                    sx={{ border: '1.5px solid #FFC5C1' }}
                                    onClick={async () => {
                                      handleOpenDialog();
                                      setIndex(index);
                                      // const remove = values.faqs.filter((el, elIndex) => elIndex !== index);
                                      // setFieldValue('faqs', remove);
                                    }}
                                  >
                                    <Trash size={26} style={{ cursor: 'pointer' }} />
                                  </IconButton>
                                  <IconButton
                                    color="secondary"
                                    sx={{ border: '1.5px solid #D7DFE9' }}
                                    onClick={async () => {
                                      const editItem = values.faqs.map((el, elIndex) => {
                                        if (elIndex == index) {
                                          return { ...el, is_editing: 1 };
                                        }
                                        return el;
                                      });

                                      setFieldValue('faqs', editItem);
                                    }}
                                  >
                                    <Edit size={26} style={{ cursor: 'pointer' }} />
                                  </IconButton>
                                </Stack>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography>{qa.answer}</Typography>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      )
                    )}

                    <Grid item md={4} sm={6} xs={12}>
                      <AnimateButton>
                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          startIcon={<Add />}
                          onClick={(e) => {
                            e.preventDefault();
                            setFieldValue('faqs', [
                              ...values.faqs,
                              {
                                faq: '',
                                answer: '',
                                panelName: '',
                                is_editing: 1,
                                is_new: 1
                              }
                            ]);
                          }}
                        >
                          Add {values.faqs.length > 1 ? 'more' : 'Questions'}
                        </Button>
                      </AnimateButton>
                    </Grid>

                    {/* {values.faq.map(
                      (qa, index) => (
                        qa.is_editing ? (
                        <Grid item xs={12} key={index}>
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
                                  <MessageQuestion color="#068e44" style={{ fontSize: '20px', height: '22px', width: '22px' }} />
                                </Avatar>
                                <Stack spacing={0}>
                                  <Typography variant="body1" fontWeight={600} color="black">
                                    Add FAQ
                                  </Typography>
                                </Stack>
                              </Stack>
                              <Grid container spacing={3} sx={{ marginTop: '0px' }}>
                                <Grid item xs={12} sm={6}>
                                  <NestedCustomTextField
                                    fullWidth
                                    label="Question"
                                    valueName={`faq[${index}].question`}
                                    placeholder="Please enter Question"
                                    values={values.faq[index].question}
                                    type="text"
                                    regType="string"
                                    setFieldValue={setFieldValue}
                                    // handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    errors={errors}
                                    multiline={true}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <NestedCustomTextField
                                    label="Answer"
                                    valueName={`faq[${index}].answer`}
                                    placeholder="Please enter Answer"
                                    values={values.faq[index].answer}
                                    type="text"
                                    regType="string"
                                    setFieldValue={setFieldValue}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    errors={errors}
                                    multiline={true}
                                  />
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} style={{ display: 'grid', gap: '10px' }}>
                                  <AnimateButton>
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      color="success"
                                      onClick={async (e) => {
                                        //   e.preventDefault();
                                        // const payload = {
                                        // };
                                        try {
                                          console.log(values.faq);

                                          // props.setFieldValue('investor_bank', newBank);
                                        } catch (err) {
                                          console.log(err);
                                        }
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
                                        // if (bank.is_editing && bank.is_new) {
                                        //   const remove = values.faq.filter((el, elIndex) => elIndex !== index);
                                        //   setFieldValue('faq', remove);
                                        // } else {
                                        //   const editItem = formValues.map((el, elIndex) => {
                                        //     if (elIndex == index) {
                                        //       return { ...el, is_editing: 0 };
                                        //     }
                                        //     return el;
                                        //   });
                                        //   setFieldValue('faq', editItem);
                                        // }
                                      }}
                                    >
                                      Back
                                    </Button>
                                  </AnimateButton>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>)
                      )
                    )} */}
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
            isFetching={isFetching}
          />
        </MainCard>
      )}
    </>
  );
}

export default Issuer;
