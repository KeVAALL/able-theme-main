import { TableCell } from '@mui/material';
import * as yup from 'yup';

// Add form values
const formAllSchemeValues = {
  min_days: '',
  max_days: '',
  rate_of_interest_regular: '',
  rate_of_interest_senior_citezen: '',
  rate_of_interest_female: '',
  rate_of_interest_female_senior_citezen: ''
};
const validationSchema = yup.object().shape(
  {
    min_days: yup
      .number()
      .required('Min Tenure is required')
      .min(1, 'Number must be greater than or equal to 1')
      .when('max_days', (max_days, schema) => {
        return schema.test({
          test: (min_days) => min_days <= max_days,
          message: 'Minimum tenure must be less than or equal to Maximum tenure'
        });
      }),
    max_days: yup
      .number()
      .required('Max Tenure is required')
      .min(1, 'Number must be greater than or equal to 1')
      .when('min_days', (min_days, schema) => {
        return schema.test({
          test: (max_days) => max_days >= min_days,
          message: 'Maximum tenure must be greater than or equal to Minimum tenure'
        });
      }),
    rate_of_interest_regular: yup.number().required('Rate is required').min(1, 'Number must be greater than or equal to 1'),
    rate_of_interest_senior_citezen: yup.number().required('Rate is required').min(1, 'Number must be greater than or equal to 1'),
    rate_of_interest_female: yup.number().required('Rate is required').min(1, 'Number must be greater than or equal to 1'),
    rate_of_interest_female_senior_citezen: yup.number().required('Rate is required').min(1, 'Number must be greater than or equal to 1')
  },
  [['min_days', 'max_days']]
);

export { formAllSchemeValues, validationSchema };
