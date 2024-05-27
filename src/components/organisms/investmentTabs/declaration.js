/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Grid, Typography, Chip, Button, Divider, FormControlLabel, Switch } from '@mui/material';
import { UpdateDeclaration } from 'hooks/transaction/investment';

const Declaration = ({
  // selectedDeclaration,
  // handleDeclarationClick,
  dynamicDeclaration,
  handleDynamicDeclaration,
  fdInvestmentID,
  tabValue,
  handleTabChange
}) => {
  function setDeclarations(array) {
    const declarations = {};
    array.map((dec) => {
      if (dec.isSelected === true) {
        declarations[dec.declaration_id] = 'yes';
      } else {
        declarations[dec.declaration_id] = 'no';
      }
    });
    return declarations;
  }

  return (
    <>
      <Grid id="__parent" container spacing={2.5} sx={{ width: '100%', marginLeft: '-10px !important' }}>
        {dynamicDeclaration &&
          dynamicDeclaration.map((dec) => {
            return (
              <Grid key={dec.declaration_id} item xs={12} lg={4}>
                <FormControlLabel
                  value="start"
                  control={
                    <Switch
                      color="primary"
                      checked={dec.isSelected}
                      onChange={() => {
                        handleDynamicDeclaration(dec.declaration_id);
                      }}
                    />
                  }
                  label={dec.declaration}
                  labelPlacement="start"
                  sx={{ mr: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}
                />
              </Grid>
            );
          })}

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 0.6 }}
            onClick={async () => {
              handleTabChange(event, tabValue - 1);
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ borderRadius: 0.6 }}
            onClick={async () => {
              const object = setDeclarations(dynamicDeclaration);

              const payload = {
                fd_investment_id: fdInvestmentID,
                declarations: object
              };

              await UpdateDeclaration(payload);
            }}
          >
            Proceed
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(Declaration);
