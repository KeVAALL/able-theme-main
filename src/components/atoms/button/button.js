/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import React, { useEffect, memo } from 'react';
import { Box, Button, Stack, CardHeader, FormControlLabel, Switch, useMediaQuery, Grid } from '@mui/material';
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
    // Theme
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
      <Grid container spacing={2} sx={{ alignItems: 'center !important' }}>
        <Grid item md={3} sm={3} xs={4}>
          <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} />
        </Grid>
        <Grid item md={5} sm={5} xs={2}></Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} padding={2}>
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
                  labelPlacement={matchDownSM ? 'top' : 'start'}
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
                  {!matchDownSM && 'Back'}
                </Button>
              </AnimateButton>
            </Box>
          </Stack>
        </Grid>
      </Grid>
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
