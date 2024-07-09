/* eslint-disable react/prop-types */
import React, { useEffect, useState, memo } from 'react';
import {
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
  Stack,
  Grid,
  Divider,
  FormControlLabel,
  Switch,
  useMediaQuery
} from '@mui/material';
// third-party
import { PopupTransition } from 'helpers/@extended/Transitions';
import { Formik } from 'formik';
// assets
import { CustomTextField } from 'utils/textfield';
import { SaveInterestRate, EditInterestRate, GetSchemeSearch } from 'hooks/interestRate/interestRate';
import { toInteger } from 'lodash';
import LoadingButton from 'helpers/@extended/LoadingButton';
import { validationSchema } from 'constant/fdCategoryValidation';
import { AddTagForCategory, GetTagForCategory } from 'hooks/fdCategory/FdCategory';

const AddTagDialogForm = ({
  formValues,
  openDialog,
  handleOpenDialog,
  setIsActive,
  isActive,
  isEditing,
  setActiveClose,
  clearFormValues,
  dataRefetch,
  setFetchingTags,
  setTagsforCategory,
  setFieldValue
}) => {
  // Theme
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // Active or not Button
  const [activeButton, setActiveButton] = useState(false);
  const [liveButton, setLiveButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Switch Change
  const handleActiveChange = () => {
    setActiveButton(!activeButton);
  };
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

  //   useEffect(() => {

  //     // if (isEditingScheme === false) {
  //     //   clearFormValues();
  //     // }
  //     // if (schemeEditFormValues && isEditingScheme === true) {
  //     // }
  //   }, [schemeEditFormValues, isEditingScheme]);

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={PopupTransition}
      onClose={() => {
        // handleOpenDialog();
        clearFormValues();
        setActiveClose();
      }}
      aria-describedby="alert-dialog-slide-description"
      className="dialog-overflow"
    >
      <Box>
        <Divider />
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const selectedCategory = JSON.parse(localStorage.getItem('category'));
            if (!isEditing) {
              console.log(isEditing);
              const payload = {
                method_name: 'add',
                fd_tag_name: values?.fd_tag_name,
                category_id: selectedCategory?.value
              };
              try {
                setIsSubmitting(true);

                const results = await AddTagForCategory(payload);

                setActiveClose();
                handleOpenDialog();
                clearFormValues();
                getTagsForCategory(selectedCategory?.value);
                setFieldValue(selectedCategory);

                // dataRefetch();

                setTimeout(() => {
                  setLiveButton(false);
                }, 100);
              } catch (err) {
                console.log(err);
              } finally {
                setIsSubmitting(false);
              }
            } else {
              console.log(isEditing);

              console.log(values);

              const payload = {
                method_name: 'update',
                fd_tag_name: values?.fd_tag_name,
                fd_tag_id: values?.fd_tag_id
              };
              try {
                setIsSubmitting(true);

                const results = await AddTagForCategory(payload);

                setActiveClose();
                handleOpenDialog();
                clearFormValues();
                getTagsForCategory(selectedCategory?.value);
                setFieldValue(selectedCategory);

                // dataRefetch();

                setTimeout(() => {
                  setLiveButton(false);
                }, 100);
              } catch (err) {
                console.log(err);
              } finally {
                setIsSubmitting(false);
              }
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              sx={{ width: '100%' }}
            >
              <DialogTitle sx={{ p: 2 }}>
                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <DialogTitle sx={{ p: 0 }}>{isEditing ? 'Edit' : 'Add'} Tag</DialogTitle>
                  <Stack flexDirection="row">
                    {/* <Box>
                <FormControlLabel
                  value="start"
                  control={<Switch color="primary" checked={activeButton} onChange={handleActiveChange} />}
                  label="Active"
                  labelPlacement={matchDownSM ? 'top' : 'start'}
                />
              </Box> */}
                    {/* <Box>
                <FormControlLabel
                  disabled={isEditingScheme}
                  value="live"
                  control={
                    <Switch
                      color="primary"
                      checked={liveButton}
                      onChange={() => {
                        setLiveButton(!liveButton);
                      }}
                    />
                  }
                  label="Live"
                  labelPlacement={matchDownSM ? 'top' : 'start'}
                  sx={{ mr: 1 }}
                />
              </Box> */}
                  </Stack>
                </Stack>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2, overflowY: 'visible' }}>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      label="Tag Name"
                      name="fd_tag_name"
                      placeholder="Please enter your Tag Name"
                      values={values}
                      type="string"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched}
                      errors={errors}
                      FormHelperTextProps={{
                        style: {
                          marginLeft: 0
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2 }}>
                <Button
                  color="secondary"
                  onClick={() => {
                    handleOpenDialog();
                    setActiveClose();
                    clearFormValues();
                    setTimeout(() => {
                      setLiveButton(false);
                    }, 100);
                  }}
                >
                  Back
                </Button>
                <LoadingButton loading={isSubmitting} loadingPosition="center" variant="contained" color="success" type="submit">
                  Save
                </LoadingButton>
              </DialogActions>
            </Box>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};
export default memo(AddTagDialogForm);
