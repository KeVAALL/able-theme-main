/* eslint-disable react/prop-types */
import { Chip } from '@mui/material';
import * as yup from 'yup';

// chip css
import '../utils/custom.css';
import { inrCurrency } from './utilConstant';

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
  { id: 0, status: 'Unmarried' },
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
  is_permanent_address_correspondent: 0,
  nominee: [],
  investor: {
    investor_name: '',
    pan_no: '',
    email_id: '',
    mobile_no: '',
    // gender_id: 1,
    birth_date: new Date(),
    place_of_birth: '',
    is_senior_citizen: 1,
    is_married: 1,
    is_indian_resident: 1,
    is_ckyc_verified: 0,
    is_digilocker_verified: 0
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
  },
  investor_bank: [
    // {
    //   account_no: '',
    //   ifsc_code: '',
    //   beneficiary_name: ''
    // }
  ]
};
const validationSchema = yup.object().shape({
  is_permanent_address_correspondent: yup.number(),
  nominee: yup.array().min(1, 'At least one nominee is required'),
  investor: yup.object().shape({
    investor_name: yup.string().required('Investor Name is required'),
    pan_no: yup
      .string()
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN format')
      .required('Pan number is required'),
    email_id: yup.string().trim().email('Invalid email').required('Email is required'),
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
    occupation_id: yup.number().notOneOf([0], 'Please select Occupation'),
    annual_income_id: yup.number().notOneOf([0], 'Please select Annual Income'),
    income_source_id: yup.number().notOneOf([0], 'Please select Income Source')
  }),
  investor_bank: yup.array().of(
    yup.object().shape({
      account_no: yup.string().required('Account Number required'),
      ifsc_code: yup.string().required('IFSC required'),
      beneficiary_name: yup.string().required('Account Holder Name')
    })
  )
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
      return <Chip color="error" label="In-active" size="medium" variant="outlined" />;
    case 1:
      return <Chip color="success" label="Active" size="medium" variant="outlined" className="active-chip" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const tableColumns = [
  {
    Header: 'Master ID',
    accessor: 'investor_code'
  },
  {
    Header: 'Folio ID',
    accessor: 'folio_code'
  },
  {
    Header: 'Investor Name',
    accessor: 'investor_name'
  },
  {
    Header: 'IFA',
    accessor: 'ifa_name',
    minWidth: 150
  },
  // {
  //   Header: 'Source',
  //   accessor: 'source',
  //   minWidth: 150
  // },
  {
    Header: 'Pan Number',
    accessor: 'pan_no'
  },
  {
    Header: 'Email',
    accessor: 'email_id'
  },
  {
    Header: 'Mobile Number',
    accessor: 'mobile_no'
  },
  {
    Header: 'Reg. date',
    accessor: 'created_on'
  },
  // {
  //   Header: 'Type',
  //   accessor: 'is_senior_citizen',
  //   customCell: ({ value }) => {
  //     switch (value) {
  //       case 1:
  //         return 'Senior Citizen';
  //       case 2:
  //         return 'Normal Citizen';
  //       default:
  //         return '';
  //     }
  //   }
  // },
  {
    Header: 'Status',
    accessor: 'is_active',
    customCell: StatusCell
  }
];
const fdInvestmentColumns = [
  {
    Header: 'Logo',
    accessor: 'logo_url',
    customCell: ({ value }) => {
      return (
        <div style={{ width: '80px', height: '60px', borderRadius: '10px' }}>
          <img
            src={value}
            alt="" // Add an alt attribute for accessibility
            style={{
              width: '100%',
              height: '100%',
              // border: "1px solid red",
              borderRadius: '10px',
              objectFit: 'contain',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              padding: '4px'
            }}
          />
        </div>
      );
    }
  },
  {
    Header: 'Investor ID',
    accessor: 'investor_id'
  },
  {
    Header: 'FD ID',
    accessor: 'fd_id'
  },
  {
    Header: 'FD Name',
    accessor: 'fd_name'
  },
  {
    Header: 'Tenure',
    accessor: 'tenure'
  },
  {
    Header: 'Total Earning',
    accessor: 'total_earning',
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
    Header: 'Maturity Date',
    accessor: 'maturity_date'
  }
];

export {
  formAllValues,
  validationSchema,
  filterFormValues,
  filterValueFields,
  filterValidationSchema,
  StatusCell,
  tableColumns,
  fdInvestmentColumns,
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
