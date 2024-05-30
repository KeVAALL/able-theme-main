/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Grid, Typography, Chip, FormControlLabel, Switch, useMediaQuery } from '@mui/material';

const Declaration = ({ selectedDeclaration, handleDeclarationClick }) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchUpSM = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  return (
    <>
      <Grid id="__parent" container spacing={2.5} sx={{ width: '100%', marginLeft: '-10px !important' }}>
        <Grid item xs={12} lg={4} sx={{ paddingLeft: '0px !important' }}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                color="success"
                checked={selectedDeclaration.isPoliticallyExposed}
                onChange={() => {
                  handleDeclarationClick('PoliticallyExposed');
                }}
              />
            }
            label="Politically Exposed Person (PEP)?"
            labelPlacement="start"
            sx={{ ml: matchDownSM ? 0 : 2 }}
          />
        </Grid>

        <Grid item xs={12} lg={4} sx={{ paddingLeft: '0px !important' }}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                color="success"
                checked={selectedDeclaration.isRelativeToPoliticallyExposed}
                onChange={() => {
                  handleDeclarationClick('RelativeToPoliticallyExposed');
                }}
              />
            }
            label="Relative to politically exposed person (PEP)?"
            labelPlacement="start"
            sx={{ ml: matchDownSM ? 0 : matchUpSM ? 2 : 0 }}
          />
        </Grid>

        <Grid item xs={12} lg={4} sx={{ paddingLeft: '0px !important' }}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                color="success"
                checked={selectedDeclaration.isResidentOutsideIndia}
                onChange={() => {
                  handleDeclarationClick('ResidentOutsideIndia');
                }}
                sx={{ marginBottom: '26px' }}
              />
            }
            label="Citizen national or tax resident of any other country outside India?"
            labelPlacement="start"
            sx={{ ml: matchDownSM ? 0 : 2 }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(Declaration);

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
            </Grid>
          </Grid> */
}
{
  /* <Typography sx={{ fontWeight: '600' }} variant="p">
            Relative to politically exposed person (PEP)?
          </Typography>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={5}>
              <Chip
                label="Yes"
                color="success"
                variant={selectedDeclaration.isRelativeToPoliticallyExposed ? '' : 'outlined'}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleDeclarationClick('RelativeToPoliticallyExposed')}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={5}>
              <Chip
                label="No"
                color="success"
                variant={!selectedDeclaration.isRelativeToPoliticallyExposed ? '' : 'outlined'}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleDeclarationClick('RelativeToPoliticallyExposed')}
              />
            </Grid>
          </Grid> */
}
{
  /* <Typography sx={{ fontWeight: '600' }} variant="p">
            A citizen national or tax resident of any other country outside India?
          </Typography>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={5}>
              <Chip
                label="Yes"
                color="success"
                variant={selectedDeclaration.isResidentOutsideIndia ? '' : 'outlined'}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleDeclarationClick('ResidentOutsideIndia')}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={5}>
              <Chip
                label="No"
                color="success"
                variant={!selectedDeclaration.isResidentOutsideIndia ? '' : 'outlined'}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleDeclarationClick('ResidentOutsideIndia')}
              />
            </Grid>
          </Grid> */
}
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
