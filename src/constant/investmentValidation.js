/* eslint-disable react/prop-types */
import { Chip } from '@mui/material';
import { minWidth } from '@mui/system';
import * as yup from 'yup';

// chip css
import '../utils/custom.css';

// Autocomplete data

// Add form values
const formAllValues = {
  investor_id: 0,
  fd_id: 0,
  ifa_id: 0,
  maturity_action_id: 0,
  payout_method_id: 'C',
  investment_amount: null,
  years: 0,
  months: 0,
  days: 0,
  interest_rate: '0',
  aggrigated_interest: 0,
  maturity_amount: 0
};
const validationSchema = yup.object().shape({
  investor_id: yup.number(),
  fd_id: yup.number(),
  ifa_id: yup.number(),
  maturity_action_id: yup.number(),
  payout_method_id: yup.string(),
  investment_amount: yup.number().min(1, 'Maximum tenure must be greater than or equal to 1').required('Investment Amount is required'),
  years: yup.number(),
  months: yup.number(),
  days: yup.number(),
  interest_rate: yup.number(),
  aggrigated_interest: yup.number(),
  maturity_amount: yup.number()
});
// Scheme Form values
const schemeValues = {
  fd_name: '',
  logo_url: '',
  rate_of_interest: '',
  rate_of_interest_1lakh: '',
  tenure: '',
  maturity_id: 1,
  investment_amount: 0
};
const schemeValidation = yup.object().shape({});
// Investor Values
const investorValues = {
  is_permanent_address_correspondent: 0,
  investor: {
    investor_name: '',
    pan_no: '',
    mobile_no: '',
    is_senior_citizen: 1,
    birth_date: new Date(),
    place_of_birth: '',
    is_married: 1,
    is_indian_resident: 1
  },
  // Investor Address
  investor_address: {
    address_line_1: '',
    address_line_2: '',
    pincode: '',
    city: ''
  },
  correspondent_address: {
    address_line_1: '',
    address_line_2: '',
    pincode: '',
    city: ''
  },
  professional_details: {
    occupation_id: 1,
    annual_income_id: 1,
    income_source_id: 1
  }
};
const investorValidationSchema = yup.object().shape({
  is_permanent_address_correspondent: yup.number(),
  investor: yup.object().shape({
    investor_name: yup.string().required('Investor Name is required'),
    pan_no: yup
      .string()
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN format')
      .required('Pan number is required'),
    mobile_no: yup.string().required('Mobile number is required'),
    is_senior_citizen: yup.number().required('Investor type is required'),
    birth_date: yup.date(),
    place_of_birth: yup.string().required('Place of Birth is required'),
    is_married: yup.number(),
    is_indian_resident: yup.number()
  }),
  investor_address: yup.object().shape({
    address_line_1: yup.string().required('Address Line is required'),
    address_line_2: yup.string().required('Address Line 2 is required'),
    pincode: yup.string().required('Pin Code is required'),
    city: yup.string().required('City is required')
  }),
  correspondent_address: yup.object().shape({
    address_line_1: yup.string().when('$is_permanent_address_correspondent', {
      is: 0,
      then: () => yup.string().required('Address Line 1 is required'),
      otherwise: () => yup.string().optional()
    }),
    address_line_2: yup.string().when('$is_permanent_address_correspondent', {
      is: 0,
      then: () => yup.string().required('Address Line 2 is required'),
      otherwise: () => yup.string().optional()
    }),
    pincode: yup.string().when('$is_permanent_address_correspondent', {
      is: 0,
      then: () => yup.string().required('Pin Code is required'),
      otherwise: () => yup.string().optional()
    }),
    city: yup.string().when('$is_permanent_address_correspondent', {
      is: 0,
      then: () => yup.string().required('City is required'),
      otherwise: () => yup.string().optional()
    })
  }),
  professional_details: yup.object().shape({
    occupation_id: yup.number(),
    annual_income_id: yup.number(),
    income_source_id: yup.number()
  })
});
// Search Item form fields
const filterFormValues = {
  search: ''
};
const filterValueFields = [
  // {
  //   fieldName: 'search',
  //   label: 'Search',
  //   type: 'string',
  //   regType: 'string'
  // }
];
const filterValidationSchema = yup.object({
  search: yup.string()
});
// Table Columns
const VisibleColumn = [];
const StatusCell = ({ value }) => {
  switch (value) {
    case 0:
      return <Chip color="warning" label="Pending" size="medium" variant="outlined" />;
    case 1:
      return <Chip color="info" label="In-progress" size="medium" variant="outlined" />;
    case 2:
      return <Chip color="success" label="Active" size="medium" variant="outlined" className="active-chip" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
// Function to parse and modify the value
const parseAndModifyValue = (value) => {
  let parsedValue = value;

  // Split the value by semicolon
  const parts = value.split('.').map((part) => part.trim());

  // Join the parts back with line breaks
  parsedValue = parts.join('.\n');

  return parsedValue;
};
const tableColumns = [
  {
    Header: 'Folio ID',
    accessor: 'folio_id'
  },
  {
    Header: 'Investor Name',
    accessor: 'investor_name',
    minWidth: 150
  },
  {
    Header: 'Master ID',
    accessor: 'master_id'
  },
  {
    Header: 'Application ID',
    accessor: 'application_id'
  },
  {
    Header: 'Status',
    accessor: 'status',
    customCell: StatusCell
  },
  {
    Header: 'Duration',
    accessor: 'tenure_selected',
    minWidth: 150
  },
  // {
  //   Header: 'Scheme Details',
  //   columns: [
  //     {
  //       Header: 'Scheme Details 1',
  //       accessor: 'visits'
  //     },
  //     {
  //       Header: 'Scheme Details 2',
  //       accessor: 'status2'
  //     }
  //   ],
  //   minWidth: 400
  // },
  {
    Header: 'FD Name',
    accessor: 'fd_name',
    minWidth: 150
  },
  {
    Header: 'IFA Name',
    accessor: 'ifa_name',
    minWidth: 150
  },

  {
    Header: 'Reg. date',
    accessor: 'created_on',
    minWidth: 150
  },
  {
    Header: 'Principal amount',
    accessor: 'investment_amount',
    customCell: ({ value }) => {
      return <span>₹ {value}</span>;
    }
  },
  {
    Header: 'Interest Earned',
    accessor: 'interest_earned',
    customCell: ({ value }) => {
      return <span>₹ {value}</span>;
    }
  },
  {
    Header: 'Payout Method',
    accessor: 'fd_payout_method'
    // customCell: ({ value }) => {
    //   return <span>₹ {value}</span>;
    // }
  },
  {
    Header: 'Rate of Interest (%)',
    accessor: 'rate_of_interest'
  },
  {
    Header: 'Issuer Reference Number',
    accessor: 'issuer_ref_number'
  }
];

export {
  formAllValues,
  validationSchema,
  schemeValues,
  schemeValidation,
  investorValues,
  investorValidationSchema,
  filterFormValues,
  filterValueFields,
  filterValidationSchema,
  StatusCell,
  tableColumns,
  VisibleColumn
};

// {
//   Header: 'Description',
//   accessor: 'description',
//   minWidth: 250,
//   customCell: ({ value }) => {
//     const parsedValue = parseAndModifyValue(value);

//     return <span>{parsedValue}</span>;
//   }
// },
