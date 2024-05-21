/* eslint-disable react/prop-types */
import { Chip } from '@mui/material';
import * as yup from 'yup';

// chip css
import '../utils/custom.css';

// Add form Values
const formAllValues = {
  role_name: ''
};
const validationSchema = yup.object({
  role_name: yup.string().required('Role Name is required')
});
// Search Item form fields
// const filterFormValues = {
//   issuer_name: ''
// };
// const formValueFields = [
//   {
//     fieldName: 'issuer_name',
//     label: 'Issuer Name',
//     placeholder: 'Please enter Issuer name',
//     type: 'text',
//     regType: 'string'
//   }
// ];
// const filterValidationSchema = yup.object({
//   issuer_name: yup.string().trim().matches(/\S+/, 'Remove Spaces')
// });
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
    Header: 'Role Name',
    accessor: 'role_name',
    minWidth: 600
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
  // filterFormValues,
  // formValueFields,
  // filterValidationSchema,
  StatusCell,
  tableColumns,
  VisibleColumn
};
