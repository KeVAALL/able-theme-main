/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import React, { useEffect, memo } from 'react';
import { Box, Button, Stack, CardHeader, FormControlLabel, Switch, useMediaQuery } from '@mui/material';
import AnimateButton from 'helpers/@extended/AnimateButton';
import { Add, Additem, CloseCircle, TickCircle } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';

const headerSX = {
  p: 2,
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
    console.log(isValid, dirty);
    // Theme
    const theme = useTheme();
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
      if (setIsActive) {
        setIsActive(formValues?.is_active);
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
        <Stack direction="row" alignItems="center" spacing={1.5} padding={2}>
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
            <></>
          ) : (
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
                  {!matchDownSM && 'Submit'}
                </Button>
              </AnimateButton>
            </Box>
          )}
          <Box>
            <AnimateButton>
              <Button
                className={matchDownSM ? 'icon_button' : ''}
                variant={matchDownSM ? 'contained' : 'outlined'}
                color={matchDownSM ? 'error' : 'secondary'}
                sx={{ borderRadius: 0.6 }}
                startIcon={matchDownSM && <CloseCircle variant="Bold" />}
                type="button"
                onClick={CancelForm}
              >
                {!matchDownSM && 'Cancel'}
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
