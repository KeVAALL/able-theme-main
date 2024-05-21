/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import React, { useEffect, memo } from 'react';
import { Box, Button, Stack, CardHeader, FormControlLabel, Switch } from '@mui/material';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { Additem } from 'iconsax-react';
import { isValid } from 'date-fns';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

export const SubmitButton = memo(
  ({
    title,
    buttonTitle,
    handleOpenDialog,
    changeTableVisibility,
    clearFormValues,
    isEditing,
    formValues,
    setActiveClose,
    setIsActive,
    isActive,
    errors,
    handleTabError,
    handleIsInvestorEditing,
    isValid,
    dirty
  }) => {
    useEffect(() => {
      console.log(isEditing);
      console.log(formValues.is_active);
      if (setIsActive) {
        setIsActive(formValues.is_active);
      }
    }, [formValues?.is_active]);

    const CancelForm = () => {
      changeTableVisibility();
      if (handleIsInvestorEditing) {
        handleIsInvestorEditing();
      }
      if (setActiveClose) {
        setActiveClose();
      }
      clearFormValues();
    };

    return (
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} />
        <Stack direction="row" alignItems="center" spacing={1.5} paddingRight={2.5}>
          {isEditing ? (
            <Box>
              <FormControlLabel
                value="start"
                control={
                  <Switch
                    color="primary"
                    checked={isActive}
                    onChange={() => {
                      setIsActive(!isActive);
                    }}
                  />
                }
                label="Active"
                labelPlacement="start"
                sx={{ mr: 1 }}
              />
            </Box>
          ) : (
            <></>
          )}

          {location.pathname === '/transaction/investment' ? (
            // <Box>
            //   <AnimateButton>
            //     <Button variant="contained" color="success" startIcon={<Eye />} type="submit">
            //       {buttonTitle}
            //     </Button>
            //   </AnimateButton>
            // </Box>
            <></>
          ) : (
            <Box>
              <AnimateButton>
                <Button
                  disabled={isEditing ? !(isEditing && isValid) : !(isValid && dirty)}
                  variant="contained"
                  color="success"
                  sx={{ borderRadius: 0.6 }}
                  startIcon={<Additem />}
                  type="submit"
                >
                  Submit
                </Button>
              </AnimateButton>
            </Box>
          )}
          <Box>
            <AnimateButton>
              <Button variant="outlined" color="secondary" sx={{ borderRadius: 0.6 }} type="button" onClick={CancelForm}>
                Cancel
              </Button>
            </AnimateButton>
          </Box>
        </Stack>
      </Stack>
    );
  }
);

SubmitButton.PropTypes = {
  buttonTitle: PropTypes.any,
  handleOpenDialog: PropTypes.any,
  errors: PropTypes.any,
  handleTabError: PropTypes.any,
  handleIsInvestorEditing: PropTypes.any,
  isValid: PropTypes.any,
  dirty: PropTypes.any
};
