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
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
  FormHelperText,
  useMediaQuery,
  FormControlLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import Select from 'react-select';

import MultiTable from '../multiTable/multiTable';
import {
  formAllValues,
  //   validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/issuerValidation';
import { validationSchema } from 'constant/fdCategoryValidation';
import { GetIssuerData, GetOneIssuer, SaveIssuer, EditIssuer, DeleteOneFAQ } from 'hooks/issuer/issuer';
import { SubmitButton } from 'components/atoms/button/button';
import AnimateButton from 'helpers/@extended/AnimateButton';
import IconButton from 'helpers/@extended/IconButton';
import { CustomTextField, FormikAutoComplete, NestedCustomTextField } from 'utils/textfield';
import { PopupTransition } from 'helpers/@extended/Transitions';
import AddTagDialogForm from '../../atoms/dialog/tagAddDialog';

// third-party
import { Formik } from 'formik';
import * as yup from 'yup';

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
import LoadingButton from 'helpers/@extended/LoadingButton';
import { DeleteTag, GetFdCategory, GetTagForCategory } from 'hooks/fdCategory/FdCategory';
import '../faq/faq.css';

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

function FdCategory() {
  // Main data state to hold the list of issuers
  //   const [issuerData, setIssuerData] = useState([]);
  const [fdCategory, setFdCategory] = useState([]);
  const [tagsForCategory, setTagsforCategory] = useState([]);
  const [fetchingTags, setFetchingTags] = useState(false);
  // Editing States
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [isIssuerActive, setIssuerActive] = useState(); // State to track if the issuer is active or not active
  // Form Visibility
  const [showTable, setShowTable] = useState(true); // State to hold form input values
  // Form State
  const [formValues, setFormValues] = useState({ tag_name: '' }); // State to hold form input values

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
  const [tagDeleting, setTagDeleting] = useState(false);

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
    // setIssuerData(issuer);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    setFormValues({ fd_tag_name: '' });
  };
  // For Delete Dialog
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  // For File Upload
  const handleOpenAddDialog = () => {
    setOpenUpload(!openUpload);
  };

  // Table Columns
  const tableColumns = [
    {
      Header: 'No.',
      accessor: 'fd_tag_id',
      minWidth: 100
    },
    {
      Header: 'FD Tag Name',
      accessor: 'fd_tag_name'
    }
  ];
  const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
  };
  const columns = useMemo(() => tableColumns, []);

  const getTagsForCategory = async (id) => {
    const payload = {
      method_name: 'getFdTagsOnCategory',
      category_id: id
    };
    try {
      setFetchingTags(true);
      const tags = await GetTagForCategory(payload);

      setTagsforCategory(tags);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingTags(false);
    }
  };

  // Query for fetching issuer data // Main Data
  const {
    isPending, // Flag indicating if query is pending
    isFetching,
    error, // Error object if query fails
    refetch: fdCategoryRefetch // Function to refetch issuer data
  } = useQuery({
    queryKey: ['fdCategoryData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const payload = {
        method_name: 'getFdCategory'
      };
      return GetFdCategory(payload);
    }, // Function to fetch issuer data
    onSuccess: (data) => {
      console.log(data);
      // Set Panel Names for FAQ Accordion.

      setFdCategory(data); // Update issuer data on successful query
    }
  });

  //   if (isFetching) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          enableReinitialize
          initialValues={{
            category: 0
          }}
          validationSchema={yup.object({
            category: yup.number()
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
              <AddTagDialogForm
                formValues={formValues}
                openDialog={openUpload}
                handleOpenDialog={handleOpenAddDialog}
                isEditing={isEditing}
                setActiveClose={setActiveClose}
                clearFormValues={clearFormValues}
                dataRefetch={fdCategoryRefetch}
                setFetchingTags={setFetchingTags}
                setTagsforCategory={setTagsforCategory}
                setFieldValue={setFieldValue}
              />
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
                      title="FD Tags Entry"
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
                        Loading Categories
                      </LoadingButton>
                    </Grid>
                  )}
                </Grid>

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <Select
                        className="multi_select"
                        name="category"
                        options={fdCategory}
                        onChange={(e) => {
                          console.log(e);
                          setFieldValue('category', e);
                          getTagsForCategory(e.value);
                          localStorage.setItem('category', JSON.stringify(e));
                        }}
                        value={values?.category}
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <Button
                        fullWidth
                        disabled={values.category === 0}
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 0.6 }}
                        startIcon={<Add variant="Bold" />}
                        onClick={() => {
                          handleOpenAddDialog();
                        }}
                      >
                        Add
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <MultiTable
                        columns={columns}
                        data={tagsForCategory}
                        formValues={[]}
                        formValueFields={[]}
                        validationSchema={{}}
                        changeTableVisibility={handleOpenAddDialog}
                        setEditing={setEditing}
                        getOneItem={() => {}}
                        deleteOneItem={DeleteTag}
                        deletingItem={tagDeleting}
                        setDeletingItem={setTagDeleting}
                        setSearchData={setSearchData}
                        tableDataRefetch={fdCategoryRefetch}
                        setActiveEditing={setActiveEditing}
                        VisibleColumn={VisibleColumn}
                        // isFetching={isFetching}
                        isFetching={fetchingTags}
                      />
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

export default FdCategory;
