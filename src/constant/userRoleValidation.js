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
    Header: 'Sr. No.',
    accessor: 'role_id'
  },
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

export { formAllValues, validationSchema, StatusCell, tableColumns, VisibleColumn };
