/* eslint-disable react/prop-types */
import React from 'react';
import { Grid } from '@mui/material';

// project-imports
import { annual_income_data, income_source_data, occupation } from 'constant/investorValidation';
import { FormikAutoComplete } from 'utils/textfield';

const ProfessionalDetails = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <CustomAutoComplete
            options={occupation}
            defaultValue={props.selectedOccupation}
            // handleChange={props.handleOnOccupationChange}
            setSelected={props.setSelectedOccupation}
            optionName="occupation_name"
            label="Occupation"
          /> */}
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
      </Grid>
    </>
  );
};

export default ProfessionalDetails;
