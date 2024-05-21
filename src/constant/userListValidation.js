/* eslint-disable react/prop-types */
import { TableCell, Chip } from '@mui/material';
import * as yup from 'yup';

// chip css
import '../utils/custom.css';

// Add form Values
const formAllValues = {
  username: '',
  mobile_no: '',
  email_id: '',
  role_id: 1
};
const validationSchema = yup.object({
  username: yup.string().required('User Name is required'),
  mobile_no: yup.string().min(10, 'Must be at least 10 digits').required('Mobile Number is required'),
  email_id: yup.string().trim().email('Invalid email').required('Email is required'),
  role: yup.number()
});
// Search Item form fields
const filterFormValues = {
  issuer_name: ''
};
const formValueFields = [
  {
    fieldName: 'issuer_name',
    label: 'Issuer Name',
    placeholder: 'Please enter Issuer name',
    type: 'text',
    regType: 'string'
  }
];
const filterValidationSchema = yup.object({
  issuer_name: yup.string().trim().matches(/\S+/, 'Remove Spaces')
});
// Table Columns
const VisibleColumn = [];

const StatusCell = ({ value }) => {
  switch (value) {
    case 0:
      return <Chip color="error" label="In-active" size="medium" variant="outlined" />;
    case 1:
      return <Chip color="success" label="Active" size="medium" variant="outlined" className="active-chip" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const tableColumns = [
  {
    Header: 'Username',
    accessor: 'username'
  },
  {
    Header: 'Email ID',
    accessor: 'email_id'
  },
  {
    Header: 'Mobile Number',
    accessor: 'mobile_no'
  },
  {
    Header: 'Role',
    accessor: 'role'
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
  StatusCell,
  tableColumns,
  VisibleColumn
};
