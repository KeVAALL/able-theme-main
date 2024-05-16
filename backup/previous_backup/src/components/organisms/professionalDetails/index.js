/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  // annual_income,
  annual_income_data,
  // income_source,
  income_source_data,
  occupation
} from 'constant/investorValidation';
import React from 'react';
import { CustomAutoComplete, FormikAutoComplete } from 'utils/textfield';

const ProfessionalDetails = (props) => {
  const autocompleteData = [
    { product_type_id: 1, product_type: 'Electronics', is_active: true, is_deleted: false },
    { product_type_id: 2, product_type: 'Clothing', is_active: true, is_deleted: false }
  ];

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
          {/* <CustomAutoComplete
            options={annual_income}
            defaultValue={props.selectedAnnualIncome}
            setSelected={props.setSelectedAnnualIncome}
            // handleChange={(event) => {
            //   console.log(event.target.value);
            // }}
            optionName="annual_income"
            label="Annual Income"
          /> */}
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
          {/* <CustomAutoComplete
            options={income_source}
            defaultValue={props.selectedIncomeSource}
            setSelected={props.setSelectedIncomeSource}
            // handleChange={(event) => {
            //   console.log(event.target.value);
            // }}
            optionName="income_source"
            label="Source of Income"
          /> */}
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
