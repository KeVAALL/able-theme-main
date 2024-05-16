/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Button, Divider, Grid } from '@mui/material';

// project-imports
import { annual_income_data, income_source_data, occupation } from 'constant/investorValidation';
import { FormikAutoComplete } from 'utils/textfield';
import { UpdateProfessionalDetails } from 'hooks/transaction/investment';

const ProfessionalDetails = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <FormikAutoComplete
            options={occupation}
            defaultValue={props.values.professional_details.occupation_id}
            setFieldValue={props.setFieldValue}
            formName="professional_details.occupation_id"
            optionName="occupation_name"
            label="Occupation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <FormikAutoComplete
            options={annual_income_data}
            defaultValue={props.values.professional_details.annual_income_id}
            setFieldValue={props.setFieldValue}
            formName="professional_details.annual_income_id"
            optionName="annual_income"
            label="Annual Income"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <FormikAutoComplete
            options={income_source_data}
            defaultValue={props.values.professional_details.income_source_id}
            setFieldValue={props.setFieldValue}
            formName="professional_details.income_source_id"
            optionName="income_source"
            label="Source of Income"
          />
        </Grid>
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
              props.handleTabChange(event, props.tabValue - 1);
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
              console.log(props.values.professional_details);
              const formValues = {
                fd_investment_id: props.fdInvestmentID,
                investor_id: props.investorID,
                ...props.values.professional_details
              };
              const response = await UpdateProfessionalDetails(formValues);

              if (!response) {
                props.handleTabChange(event, props.tabValue + 1);
              }
            }}
          >
            Proceed
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(ProfessionalDetails);
