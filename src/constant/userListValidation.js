/* eslint-disable react/prop-types */
import { TableCell, Chip } from '@mui/material';
import * as yup from 'yup';

// chip css
import '../utils/custom.css';

// Add form Values
const formAllValues = {
  user_name: '',
  mobile_no: '',
  email_id: '',
  password: '',
  role_id: 1
};
const validationSchema = yup.object({
  user_name: yup.string().required('User Name is required'),
  mobile_no: yup.string().min(10, 'Must be at least 10 digits').required('Mobile Number is required'),
  email_id: yup.string().trim().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[0-9]/, 'Password must contain at least 1 numeric character')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character')
    .required('Password is required'),
  role_id: yup.number()
});
// Search Item form fields

// Table Columns
const VisibleColumn = [];

const StatusCell = ({ value }) => {
  switch (value) {
    case 0:
      return <Chip sx={{ fontSize: '0.75rem' }} color="error" label="In-active" size="medium" variant="outlined" />;
    case 1:
      return <Chip sx={{ fontSize: '0.75rem' }} color="success" label="Active" size="medium" variant="outlined" className="active-chip" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const tableColumns = [
  {
    Header: 'User name',
    accessor: 'user_name'
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
    Header: 'Role Name',
    accessor: 'role_name'
  },
  {
    Header: 'Status',
    accessor: 'is_active',
    customCell: StatusCell
  }
];

export { formAllValues, validationSchema, StatusCell, tableColumns, VisibleColumn };
