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
  DialogContent,
  TextField,
  Autocomplete
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
import { GetIssuerData, GetOneIssuer, SaveIssuer, EditIssuer, DeleteOneFAQ } from 'hooks/issuer/issuer';
import { SubmitButton } from 'components/atoms/button/button';
import AnimateButton from 'helpers/@extended/AnimateButton';
import Loader from 'components/atoms/loader/Loader';
import IconButton from 'helpers/@extended/IconButton';
import { CustomTextField, FormikAutoComplete, NestedCustomTextField } from 'utils/textfield';
import { PopupTransition } from 'helpers/@extended/Transitions';

// third-party
import { Formik } from 'formik';
import * as yup from 'yup';
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

function FAQ() {
  // Main data state to hold the list of issuers
  const [issuerData, setIssuerData] = useState([]);
  // Editing States
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [isIssuerActive, setIssuerActive] = useState(); // State to track if the issuer is active or not active
  // Form Visibility
  const [showTable, setShowTable] = useState(true); // State to hold form input values
  // Form State
  const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values

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
  const handleDropdownChange = (e, optionName, formName, setFieldValue) => {
    if (e.target.outerText === undefined) {
      setFieldValue(formName, 0);
    } else {
      issuerData.forEach(async (el) => {
        if (el.issuer_name === e.target.outerText) {
          console.log('here');
          await setFieldValue(formName, el.issuer_id);
          handleIssuerChange(el.issuer_id, setFieldValue);
        }
      });
    }
  };
  const handleIssuerChange = (selectedIssuerId, setFieldValue) => {
    const selectedIssuer = issuerData.find((issuer) => issuer.issuer_id === selectedIssuerId);
    console.log(selectedIssuer.faqs);
    if (selectedIssuer) {
      setFieldValue('faqs', selectedIssuer.faqs);
    } else {
      setFieldValue('faqs', []);
    }
  };

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

  if (isFetching) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          enableReinitialize
          initialValues={{
            issuer_id: 0,
            faqs: []
          }}
          validationSchema={yup.object({
            issuer_id: yup.number(),
            faqs: yup.array().of(
              yup.object().shape({
                faq: yup.string().required('Question required'),
                answer: yup.string().required('Answer required')
              })
            )
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const userID = localStorage.getItem('userID');
            if (isEditing === false) {
              const formValues = {
                ...values,
                method_name: 'add',

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
                  user_id: toInteger(userID)
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
                  title="FAQ Entry"
                  changeTableVisibility={() => {}}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsIssuerActive}
                  isActive={isIssuerActive}
                  isValid={isValid}
                  dirty={dirty}
                  showBackButton
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      {/* <FormikAutoComplete
                        options={issuerData.map((issuer) => ({
                          label: issuer.issuer_name,
                          id: issuer.issuer_id
                        }))}
                        defaultValue={values.issuer_id}
                        setFieldValue={setFieldValue}
                        formName="issuer_id"
                        optionName="label"
                        label="Select Issuer"
                      /> */}
                      <Autocomplete
                        disabled={false}
                        id="basic-autocomplete-label"
                        className="common-autocomplete"
                        fullWidth
                        disablePortal
                        value={
                          typeof values.issuer_id === 'number' &&
                          issuerData.find((el) => {
                            return el.issuer_id === values.issuer_id;
                          })
                        }
                        onChange={(e) => {
                          handleDropdownChange(e, 'issuer_id', 'issuer_id', setFieldValue);
                        }}
                        options={issuerData}
                        getOptionLabel={(option) => option.issuer_name} // Assuming 'product_type' is the label you want to display
                        componentsProps={{
                          popper: {
                            modifiers: [
                              {
                                name: 'preventOverflow',
                                enabled: false
                              }
                            ]
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            // error={Boolean(props.errors[props.formName])}
                            {...params}
                            className="autocomplete-textfield"
                            name="issuer_id"
                            label="Select Issuer"
                            InputProps={{
                              ...params.InputProps,
                              inputProps: {
                                ...params.inputProps
                              }
                            }}
                          />
                        )}
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
                                      //   regType="string"
                                      //   setFieldValue={setFieldValue}
                                      handleChange={handleChange}
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
                                      //   regType="string"
                                      //   setFieldValue={setFieldValue}
                                      handleChange={handleChange}
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
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Formik>
      )}
    </>
  );
}

export default FAQ;
