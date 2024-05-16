/* eslint-disable react/prop-types */
import { TableCell, Chip } from '@mui/material';
import * as yup from 'yup';

// Add form values
const amountSchema = yup.number().min(1, 'Amount must be greater than or equal to 1').required('Amount is required');
const formAllValues = {
  fd_name: '',
  fd_min_amount: '',
  fd_max_amount: '',
  min_tenure: '',
  max_tenure: '',
  logo_url: '',
  issuer_id: 0
};
const validationSchema = yup.object().shape(
  {
    fd_name: yup.string().required('FD Name is required'),
    fd_min_amount: amountSchema
      .when('fd_max_amount', (fd_max_amount, schema) => {
        return schema.test({
          test: (fd_min_amount) => fd_min_amount <= fd_max_amount,
          message: 'Minimum amount must be less than or equal to Maximum amount'
        });
      })
      .required('Minimum Amount is required'),
    fd_max_amount: amountSchema
      .when('fd_min_amount', (fd_min_amount, schema) => {
        return schema.test({
          test: (fd_max_amount) => fd_max_amount >= fd_min_amount,
          message: 'Maximum amount must be greater than or equal to Minimum amount'
        });
      })
      .required('Maximum Amount is required'),
    min_tenure: yup
      .number()
      .min(1, 'Minimum tenure must be greater than or equal to 1')
      .when('max_tenure', (max_tenure, schema) => {
        return schema.test({
          test: (min_tenure) => min_tenure <= max_tenure,
          message: 'Minimum tenure must be less than or equal to Maximum tenure'
        });
      })
      .required('Minimum Tenure is required'),
    max_tenure: yup
      .number()
      .min(1, 'Maximum tenure must be greater than or equal to 1')
      .when('min_tenure', (min_tenure, schema) => {
        return schema.test({
          test: (max_tenure) => max_tenure >= min_tenure,
          message: 'Maximum tenure must be greater than or equal to Minimum tenure'
        });
      })
      .required('Maximum Tenure is required'),
    logo_url: yup.string().required('Logo URL is required'),
    issuer_id: yup.number()
  },
  [
    ['fd_min_amount', 'fd_max_amount'],
    ['min_tenure', 'max_tenure']
  ]
);
// Search Item form fields
const filterFormValues = {
  fd_name: ''
};
const formValueFields = [
  {
    fieldName: 'fd_name',
    label: 'FD Name',
    type: 'text',
    placeholder: 'Please enter FD Name',
    regType: 'string'
  }
];
const filterValidationSchema = yup.object({
  fd_name: yup.string().trim().required('Name is required').matches(/\S+/, 'Name cannot be empty or contain only whitespace')
});
// Table Columns
const ImageCell = ({ value }) => {
  return (
    <TableCell style={{ paddingLeft: '0px' }}>
      <img src={value} alt="Custom" style={{ width: '90%', height: 60 }} />
    </TableCell>
  );
};
const StatusCell = ({ value }) => {
  // return value === 0 ? 'Not Active' : 'Active';
  switch (value) {
    case 0:
      return <Chip color="error" label="Inactive" size="medium" variant="light" />;
    case 1:
      return <Chip color="success" label="Active" size="medium" variant="light" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const VisibleColumn = [];
const tableColumns = [
  {
    Header: 'Logo URL',
    accessor: 'logo_url',
    customCell: ImageCell
  },
  {
    Header: 'FD Name',
    accessor: 'fd_name'
  },
  {
    Header: 'Issuer Name',
    accessor: 'issuer_name'
  },
  {
    Header: 'Min Tenure',
    accessor: 'min_tenure'
  },
  {
    Header: 'Max Tenure',
    accessor: 'max_tenure'
  },
  {
    Header: 'Status',
    accessor: 'is_active',
    customCell: StatusCell
  }
];

export {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  ImageCell,
  StatusCell,
  tableColumns,
  VisibleColumn
};
