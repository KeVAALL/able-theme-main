import * as yup from 'yup';
import { Chip } from '@mui/material';

// chip css
import '../utils/custom.css';

// Add form values
const formAllValues = {
  fd_name: '',
  issuer_name: '',
  fd_payout_method_id: 'C'
};
const validationSchema = yup.object({
  fd_name: yup.string().required('FD Name is required'),
  issuer_name: yup.string().required('Issuer Name is required'),
  fd_payout_method_id: yup.string()
});
// Table Columns
const StatusCell = ({ value }) => {
  // return value === 0 ? 'Not Active' : 'Active';
  switch (value) {
    case 0:
      return <Chip color="error" label="In-active" size="medium" variant="outlined" />;
    case 1:
      return <Chip color="success" label="Active" size="medium" variant="outlined" className="active-chip" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const VisibleColumn = [];
const tableColumns = [
  {
    Header: 'Payout Method',
    accessor: 'fd_payout_method'
  },
  {
    Header: 'Tenure (Years)',
    accessor: 'tenure'
  },
  {
    Header: 'Tenure (Days)',
    accessor: 'period'
  },
  {
    // Header: 'Normal Citizen (%)',
    Header: 'NC (%)',
    accessor: 'rate_of_interest_regular',
    customCell: ({ value }) => {
      return <span>{value}%</span>;
    }
  },
  {
    // Header: 'Senior Citizen (%)',
    Header: 'SC (%)',
    accessor: 'rate_of_interest_senior_citezen',
    customCell: ({ value }) => {
      return <span>{value}%</span>;
    }
  },
  {
    // Header: 'Female Citizen (%)',
    Header: 'FC (%)',
    accessor: 'rate_of_interest_female',
    customCell: ({ value }) => {
      return <span>{value}%</span>;
    }
  },
  {
    // Header: 'Senior Female Citizen (%)',
    Header: 'SFC (%)',
    accessor: 'rate_of_interest_female_senior_citezen',
    customCell: ({ value }) => {
      return <span>{value}%</span>;
    }
  },
  {
    Header: 'Status',
    accessor: 'is_active',
    customCell: StatusCell
  }
];

export { formAllValues, validationSchema, tableColumns, VisibleColumn };
