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
              console.log(dynamicDeclaration);

              const object = setDeclarations(dynamicDeclaration);

              console.log(object);

              const formValues = {
                fd_investment_id: fdInvestmentID,
                declarations: object
              };

              UpdateDeclaration(formValues);
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

// const [selectedDeclaration, setSelectedDeclaration] = useState({
//   isPoliticallyExposed: true,
//   isRelativeToPoliticallyExposed: true,
//   isResidentOutsideIndia: false
// });
// const handleDeclarationClick = (value) => {
//   if (value === 'PoliticallyExposed') {
//     setSelectedDeclaration({ ...selected, isPoliticallyExposed: !selected.isPoliticallyExposed });
//   } else if (value === 'RelativeToPoliticallyExposed') {
//     setSelectedDeclaration({ ...selected, isRelativeToPoliticallyExposed: !selected.isRelativeToPoliticallyExposed });
//   } else if (value === 'ResidentOutsideIndia') {
//     setSelectedDeclaration({ ...selected, isResidentOutsideIndia: !selected.isResidentOutsideIndia });
//   }
// };
{
  /* <Typography sx={{ fontWeight: '600' }} variant="p">
            Politically Exposed Person (PEP)?
          </Typography>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={5}>
              <Chip
                label="Yes"
                color="success"
                variant={selectedDeclaration.isPoliticallyExposed ? '' : 'outlined'}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleDeclarationClick('PoliticallyExposed')}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={5}>
              <Chip
                label="No"
                color="success"
                variant={!selectedDeclaration.isPoliticallyExposed ? '' : 'outlined'}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleDeclarationClick('PoliticallyExposed')}
              />
            </Grid> */
}
{
  /* </Grid> */
}
