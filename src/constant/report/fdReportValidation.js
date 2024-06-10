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
    Header: 'Application ID',
    accessor: 'application_number'
  },
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
    Header: 'Investor ID',
    accessor: 'investor_id'
  },
  {
    Header: 'Investor Name',
    accessor: 'investor_name'
  },
  {
    Header: 'Invested On',
    accessor: 'invested_on'
  },
  {
    Header: 'Rate of Interest',
    accessor: 'rate_of_interest'
  },
  {
    Header: 'Tenure',
    accessor: 'lock_in_period'
  },
  {
    Header: 'Maturity Date',
    accessor: 'fd_maturity_date'
  },
  {
    Header: 'Current Balance',
    accessor: 'current_balance',
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
