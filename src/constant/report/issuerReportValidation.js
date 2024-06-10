/* eslint-disable react/prop-types */
import { Chip } from '@mui/material';
import * as yup from 'yup';
import { inrCurrency } from '../utilConstant';

// chip css
import '../../utils/custom.css';

// Autocomplete data

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
    Header: 'Issuer ID',
    accessor: 'issuer_id'
  },
  {
    Header: 'Issuer Name',
    accessor: 'issuer_name',
    minWidth: 150
  },
  {
    Header: 'Gross Value',
    accessor: 'gross_value',
    customCell: ({ value }) => {
      return <span>{inrCurrency(value)}</span>;
    }
  },
  {
    Header: 'Interest Earned',
    accessor: 'interest_earned',
    customCell: ({ value }) => {
      return <span>{inrCurrency(value)}</span>;
    }
  },
  {
    Header: 'Investment Amount',
    accessor: 'current_value',
    customCell: ({ value }) => {
      return <span>{inrCurrency(value)}</span>;
    }
  }
  //   {
  //     Header: 'Status',
  //     accessor: 'is_active',
  //     customCell: StatusCell
  //   }
];

export { tableColumns, VisibleColumn };
