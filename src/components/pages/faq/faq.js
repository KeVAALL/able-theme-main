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
  Autocomplete,
  FormHelperText,
  useMediaQuery,
  FormControlLabel
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
import {
  Add,
  AddCircle,
  Additem,
  Category,
  CloseCircle,
  CloudAdd,
  Edit,
  MessageQuestion,
  TableDocument,
  TickCircle,
  Trash
} from 'iconsax-react';
import MultiFileUpload from 'helpers/third-party/dropzone/MultiFile';
import { ManualAddFAQ } from 'hooks/faq/faq';
import LoadingButton from 'helpers/@extended/LoadingButton';
import './faq.css';

const DeleteDialog = memo(
  ({ openDialog, handleOpenDialog, values, index, setFieldValue, issuerTableDataRefetch, faqDeleting, setFaqDeleting }) => {
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
              <LoadingButton
                fullWidth
                color="error"
                variant="contained"
                loading={faqDeleting}
                loadingPosition="center"
                onClick={async () => {
                  if (values[index].issuer_faqs_id) {
                    console.log(values[index]);
                    const payload = { method_name: 'delete', issuer_faqs_id: values[index].issuer_faqs_id };
                    try {
                      setFaqDeleting(true);
                      await DeleteOneFAQ(payload);
                      const remove = values.filter((el, elIndex) => elIndex !== index);
                      setFieldValue('faqs', remove);
                      issuerTableDataRefetch();
                      handleOpenDialog();
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setFaqDeleting(false);
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
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }
);

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

  // Accordion
  const [expanded, setExpanded] = useState('');
  // Dropzone
  const [list, setList] = useState(false);
  // For File Upload
  const [openUpload, setOpenUpload] = useState(false);
  // For Delete Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogIndex, setIndex] = useState();
  // Theme
  const theme = useTheme();
  // Theme
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // Actions
  const [faqUploading, setFaqUploading] = useState(false);
  const [faqDeleting, setFaqDeleting] = useState(false);

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
  // For Delete Dialog
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  // For File Upload
  const handleOpenUploadDialog = () => {
    setOpenUpload(!openUpload);
  };
  // Accordion
  const handleAccChange = (panel) => (event, newExpanded) => {
    console.log(panel, newExpanded);
    setExpanded(newExpanded ? panel : false);
  };
  // Issuer Dropdown
  const handleDropdownChange = (e, issuerData, optionName, formName, setFieldValue) => {
    if (e.target.outerText === undefined) {
      setFieldValue(formName, 0);
    } else {
      issuerData?.forEach(async (el) => {
        if (el.issuer_name === e.target.outerText) {
          console.log('here');
          await setFieldValue(formName, el.issuer_id);
          handleIssuerChange(issuerData, el.issuer_id, setFieldValue);
        }
      });
    }
  };
  const handleIssuerChange = (issuerData, selectedIssuerId, setFieldValue) => {
    console.log(selectedIssuerId, issuerData);
    const selectedIssuer = issuerData?.find((issuer) => {
      console.log(issuer.issuer_id === selectedIssuerId);
      return issuer.issuer_id === selectedIssuerId;
    });
    console.log(selectedIssuer.faqs);
    if (selectedIssuer) {
      setFieldValue('faqs', selectedIssuer.faqs);
    } else {
      setFieldValue('faqs', []);
    }
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

  //   if (isFetching) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          enableReinitialize
          initialValues={{
            issuer_id: 0,
            faqs: [],
            files: null
          }}
          validationSchema={yup.object({
            issuer_id: yup.number(),
            faqs: yup.array().of(
              yup.object().shape({
                faq: yup.string().required('Question required'),
                answer: yup.string().required('Answer required')
              })
            ),
            files: yup.mixed().required('Avatar is a required.')
          })}
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
                <Grid container spacing={2} sx={{ alignItems: 'center !important' }}>
                  <Grid item md={3} sm={3} xs={4}>
                    <CardHeader
                      sx={{
                        p: 2,
                        '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
                      }}
                      titleTypographyProps={{ variant: 'subtitle1' }}
                      title="FAQ Entry"
                    />
                  </Grid>
                  <Grid item md={7} sm={7} xs={6}></Grid>
                  {isFetching && (
                    <Grid item md={2} sm={2} xs={2} textAlign="right">
                      <LoadingButton
                        loading={isFetching}
                        color="secondary"
                        loadingPosition="start"
                        startIcon={<Add style={{ transform: 'rotate(45deg)' }} />}
                        sx={{ color: 'gray !important' }}
                      >
                        Loading FAQs
                      </LoadingButton>
                    </Grid>
                  )}
                  {/* <Grid item md={4} sm={4} xs={6}>
                    <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} padding={2}>
                      <Box>
                        <AnimateButton>
                          <Button
                            disabled={isEditing ? !(isEditing && isValid) : !(isValid && dirty)}
                            className={matchDownSM ? 'icon_button' : ''}
                            variant="contained"
                            color="success"
                            sx={{ borderRadius: 0.6 }}
                            startIcon={matchDownSM ? <TickCircle variant="Bold" /> : <Additem />}
                            type="submit"
                          >
                            {!matchDownSM && 'Update'}
                          </Button>
                        </AnimateButton>
                      </Box>
                    </Stack>
                  </Grid> */}
                </Grid>

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <Autocomplete
                        disabled={false}
                        id="basic-autocomplete-label"
                        className="common-autocomplete"
                        fullWidth
                        disablePortal
                        value={
                          typeof values?.issuer_id === 'number' &&
                          issuerData?.find((el) => {
                            return el.issuer_id === values.issuer_id;
                          })
                        }
                        onChange={(e) => {
                          handleDropdownChange(e, issuerData, 'issuer_id', 'issuer_id', setFieldValue);
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
                    <Grid item md={4} sm={6} xs={12}>
                      <Button
                        fullWidth
                        disabled={values.issuer_id === 0}
                        // className={matchDownSM ? 'icon_button' : ''}
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 0.6 }}
                        startIcon={matchDownSM ? <CloudAdd variant="Bold" /> : <CloudAdd />}
                        onClick={() => {
                          handleOpenUploadDialog();
                        }}
                      >
                        Upload
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                          <CardHeader title="FAQs" sx={{ px: 0 }} />
                        </Grid>
                        <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                          <Divider />
                        </Grid>

                        {values?.faqs?.map((qa, index) =>
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
                                          inputProps={{ maxLength: 500 }}
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
                                        <LoadingButton
                                          size="small"
                                          variant="contained"
                                          color="success"
                                          loading={faqUploading}
                                          loadingPosition="center"
                                          startIcon={<AddCircle />}
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

                                            try {
                                              setFaqUploading(true);
                                              const payload = {
                                                method_name: 'update',
                                                issuer_id: values.issuer_id,
                                                faqs: newFAQ
                                              };

                                              await ManualAddFAQ(payload);

                                              const issuerPayload = {
                                                method_name: 'getall'
                                              };
                                              const issuer = await GetIssuerData(issuerPayload);

                                              const faqPanel = issuer.map((el) => {
                                                return {
                                                  ...el,
                                                  faqs:
                                                    el.faqs &&
                                                    el.faqs.map((fa, index) => {
                                                      return { ...fa, panelName: `panel${index}` };
                                                    })
                                                };
                                              });
                                              setIssuerData(faqPanel);

                                              handleIssuerChange(faqPanel, values.issuer_id, setFieldValue);
                                            } catch (err) {
                                              console.log(err);
                                            } finally {
                                              setFaqUploading(false);
                                            }
                                          }}
                                        >
                                          Save
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
                                issuerTableDataRefetch={issuerTableDataRefetch}
                                faqDeleting={faqDeleting}
                                setFaqDeleting={setFaqDeleting}
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
                              Add {values.faqs?.length > 1 ? 'more' : 'Questions'}
                            </Button>
                          </AnimateButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Dialog
                      open={openUpload}
                      TransitionComponent={PopupTransition}
                      keepMounted
                      onClose={handleOpenUploadDialog}
                      maxWidth="xs"
                      aria-labelledby="column-delete-title"
                      aria-describedby="column-delete-description"
                      className="dialog_backdrop"
                    >
                      <Grid item xs={12}>
                        <MainCard title="Upload FAQ File" noAddButton>
                          <Grid container spacing={3}>
                            <Grid
                              item
                              xs={12}
                              sx={{
                                paddingTop: '0px !important'
                              }}
                            >
                              <Stack spacing={1.5} alignItems="center">
                                <MultiFileUpload
                                  showList={list}
                                  setFieldValue={setFieldValue}
                                  files={values?.files}
                                  issuer_id={values.issuer_id}
                                  setIssuerData={setIssuerData}
                                  issuerTableDataRefetch={issuerTableDataRefetch}
                                  handleOpenUploadDialog={handleOpenUploadDialog}
                                  handleIssuerChange={handleIssuerChange}
                                  faqUploading={faqUploading}
                                  setFaqUploading={setFaqUploading}
                                  error={touched.files && !!errors.files}
                                />
                                {touched.files && errors.files && (
                                  <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.files}
                                  </FormHelperText>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                    </Dialog>
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