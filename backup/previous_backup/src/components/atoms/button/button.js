/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, CardHeader, FormControlLabel, Switch } from '@mui/material';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { Additem } from 'iconsax-react';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

export const SubmitButton = ({
  title,
  changeTableVisibility,
  clearFormValues,
  isEditing,
  formValues,
  setActiveClose,
  setIsActive,
  isActive,
  errors,
  handleTabError
}) => {
  useEffect(() => {
    if (setIsActive) {
      setIsActive(formValues.is_active);
    }
  }, [formValues?.is_active]);

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
              // control={<Switch color="primary" checked={isActive} onChange={setIsActive} />}
              label="Active"
              labelPlacement="start"
              sx={{ mr: 1 }}
            />
          </Box>
        ) : (
          <></>
        )}

        <Box>
          <AnimateButton>
            <Button
              // onSubmit={() => {
              //   if (errors) {
              //     handleTabError(errors);
              //   }
              // }}
              variant="contained"
              color="success"
              startIcon={<Additem />}
              type="submit"
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
  );
};

SubmitButton.PropTypes = {
  errors: PropTypes.any,
  handleTabError: PropTypes.any
};
