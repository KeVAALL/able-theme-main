/* eslint-disable react/prop-types */
import { TableCell, Chip } from '@mui/material';
import * as yup from 'yup';

// chip css
import '../utils/custom.css';

// Add form Values
const formAllValues = {
  issuer_gst_number: '',
  issuer_name: '',
  issuer_pan: '',
  issuer_tollfree_number: '',
  logo_url: '',
  app_bg_colour: '',
  start_colour: '',
  end_colour: ''
  // faqs: []
};
const validationSchema = yup.object({
  issuer_gst_number: yup
    .string()
    .matches(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/, 'Invalid GST')
    .required('GST Number is required'),
  issuer_name: yup.string().required('Issuer Name is required'),
  issuer_pan: yup
    .string()
    .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN format')
    // .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN format')
    .required('Issuer PAN is required'),
  issuer_tollfree_number: yup.string().min(11, 'Must be at least 11 digits').required('Tollfree Number is required'),
  logo_url: yup
    .string()
    .matches(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, 'Please enter valid URL')
    // .matches(/^\s*\S[\s\S]*$/, 'Remove Spaces')
    .required('Logo URL is required')
  // faqs: yup.array().of(
  //   yup.object().shape({
  //     faq: yup.string().required('Question required'),
  //     answer: yup.string().required('Answer required')
  //   })
  // )
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
      return <Chip sx={{ fontSize: '0.75rem' }} color="error" label="In-active" size="medium" variant="outlined" />;
    case 1:
      return <Chip sx={{ fontSize: '0.75rem' }} color="success" label="Active" size="medium" variant="outlined" className="active-chip" />;
    default:
      return <Chip color="info" label="None" size="medium" variant="light" />;
  }
};
const tableColumns = [
  {
    Header: 'Logo URL',
    accessor: 'logo_url',
    customCell: ({ value }) => {
      return (
        <div style={{ width: '120px', height: '65px', borderRadius: '10px' }}>
          <img
            src={value}
            alt="" // Add an alt attribute for accessibility
            style={{
              width: '100%',
              height: '100%',
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
    Header: 'Issuer Name',
    accessor: 'issuer_name'
  },
  {
    Header: 'Tollfree Number',
    accessor: 'issuer_tollfree_number'
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
