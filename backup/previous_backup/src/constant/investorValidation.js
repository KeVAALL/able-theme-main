/* eslint-disable react/prop-types */
import { TableCell, Chip } from '@mui/material';
import * as yup from 'yup';

// Autocomplete data
const genderData = [
  { id: 1, gender: 'Male' },
  { id: 2, gender: 'Female' },
  { id: 3, gender: 'Other' }
];
const investorType = [
  { id: 1, investor: 'Senior Citizen' },
  { id: 2, investor: 'Normal Citizen' }
];
const residency = [
  { id: 0, status: 'Non-Indian Resident' },
  { id: 1, status: 'Indian Resident' }
];
const marital_status = [
  { id: 0, status: 'Not Married' },
  { id: 1, status: 'Married' }
];
const occupation = [
  {
    id: 1,
    occupation_name: 'Public Sector'
  },
  {
    id: 2,
    occupation_name: 'Private Sector'
  },
  {
    id: 3,
    occupation_name: 'Govt Sector'
  },
  {
    id: 4,
    occupation_name: 'Business'
  },
  {
    id: 5,
    occupation_name: 'Professional'
  },
  {
    id: 6,
    occupation_name: 'Retired'
  },
  {
    id: 7,
    occupation_name: 'Housewife'
  },
  {
    id: 8,
    occupation_name: 'Student'
  },
  {
    id: 9,
    occupation_name: 'Others'
  },
  {
    id: 10,
    occupation_name: 'Self Employed'
  },
  {
    id: 11,
    occupation_name: 'Service'
  },
  {
    id: 12,
    occupation_name: 'Agriculture'
  }
];
const income_source_data = [
  {
    id: 1,
    income_source: 'Salary'
  },
  {
    id: 2,
    income_source: 'Freelancing'
  },
  {
    id: 3,
    income_source: 'Investments'
  },
  {
    id: 4,
    income_source: 'Rental Income'
  }
];
const annual_income_data = [
  {
    id: 1,
    annual_income: 'BELOW 1 LAC'
  },
  {
    id: 2,
    annual_income: '1-5 LAC'
  },
  {
    id: 3,
    annual_income: '5-10 LAC'
  },
  {
    id: 4,
    annual_income: '10-25 LAC'
  },
  {
    id: 5,
    annual_income: '25-50 LAC'
  },
  {
    id: 6,
    annual_income: '50 LAC - 1CR'
  },
  {
    id: 7,
    annual_income: '> 1 CR'
  }
];
const relationship = [
  {
    id: 1,
    relation_name: 'Mother'
  },
  {
    id: 2,
    relation_name: 'Father'
  },
  {
    id: 3,
    relation_name: 'Brother'
  },
  {
    id: 4,
    relation_name: 'Wife'
  }
];
// Add form values
const formAllValues = {
  is_permanent_address_correspond: 0,
  investor: {
    investor_name: '',
    pan_no: '',
    mobile_no: '',
    investor_type_id: 1,
    // gender_id: 1,
    birth_date: new Date(),
    place_of_birth: '',
    is_married: 0,
    is_indian_resident: 0
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
const validationSchema = yup.object().shape({
  is_permanent_address_correspond: yup.number(),
  investor: yup.object().shape({
    investor_name: yup.string().required('Investor Name is required'),
    pan_no: yup.string().required('Pan number is required'),
    // mobile_no: yup.number().required('Mobile number is required'),
    mobile_no: yup.string().required('Mobile number is required'),
    investor_type_id: yup.number().required('Investor type is required'),
    // gender_id: yup.number(),
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
    address_line_1: yup.string().when('$is_permanent_address_correspond', {
      is: 0,
      then: () => yup.string().required('Address Line 1 is required'),
      otherwise: () => yup.string().optional()
    }),
    address_line_2: yup.string().when('$is_permanent_address_correspond', {
      is: 0,
      then: () => yup.string().required('Address Line 2 is required'),
      otherwise: () => yup.string().optional()
    }),
    pincode: yup.string().when('$is_permanent_address_correspond', {
      is: 0,
      then: () => yup.string().required('Pin Code is required'),
      otherwise: () => yup.string().optional()
    }),
    city: yup.string().when('$is_permanent_address_correspond', {
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
  // personal_info: yup.object().shape({
  //   is_indian_resident: yup.string(), // Resident Status
  //   is_married: yup.string(), // Marital Status
  //   birth_date: yup.date()
  // }),
  // professional_details: yup.object().shape({
  //   annual_income: yup.number(),
  //   income_source: yup.string(),
  //   occupation_name: yup.string()
  // })
  // nominee: yup.object().shape({
  //   full_name: yup.string().required('Name is required'),
  //   pan: yup.string().required('PAN is required'),
  //   date_of_birth: yup.date(),
  //   share_percent: yup.number()
  // })
});
// Search Item form fields
const filterFormValues = {
  search: ''
};
// const filterFormValues = {
//   investor_id: ''
// };
// const formValueFields = [
//   {
//     fieldName: 'investor_id',
//     label: 'Investor',
//     type: 'number'
//   }
// ];
const filterValueFields = [
  {
    fieldName: 'search',
    label: 'Search',
    type: 'string',
    regType: 'string'
  }
];
const filterValidationSchema = yup.object({
  search: yup.string()
});
// Table Columns
const VisibleColumn = [];
const StatusCell = ({ value }) => {
  switch (value) {
    case 0:
      return <Chip color="error" label="Inactive" size="medium" variant="light" />;
    case 1:
      return <Chip color="success" label="Active" size="medium" variant="light" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const tableColumns = [
  {
    Header: 'investor Name',
    accessor: 'investor_name'
  },
  {
    Header: 'Pan Number',
    accessor: 'pan_no'
  },
  {
    Header: 'Mobile Number',
    accessor: 'mobile_no'
  },
  {
    Header: 'Type',
    accessor: 'investor_type'
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
  // formValueFields,
  filterValueFields,
  filterValidationSchema,
  StatusCell,
  tableColumns,
  VisibleColumn,
  genderData,
  investorType,
  relationship,
  residency,
  marital_status,
  occupation,
  annual_income_data,
  income_source_data
};

// formAllValues = [
// is_married: null,
// is_indian_resident: null

// Personal Info
// personal_info: {
//   is_indian_resident: '', // Resident Status
//   is_married: '', // Marital Status
//   birth_date: ''
// },
// Personal Details??
// Nomination
// nominee: {
//   full_name: '',
//   pan: '',
//   date_of_birth: '',
//   share_percent: ''
//   relationship: '', ??
// }
// ]
// address_line_1: yup.string().required('Address Line is required'),
// address_line_2: yup.string().required('Address Line 2 is required'),
// pincode: yup.string().required('Pin Code is required'),
// city: yup.string().required('City is required')
