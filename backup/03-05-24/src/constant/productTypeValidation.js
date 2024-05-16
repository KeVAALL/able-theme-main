import * as yup from 'yup';

// Add form values
const formAllValues = {
  product_type: ''
};
const validationSchema = yup.object({
  product_type: yup.string().required('Required')
});
// Search Item form fields
const filterFormValues = {
  product_type: ''
};
const formValueFields = [
  {
    fieldName: 'product_type',
    label: 'Product Type',
    placeholder: 'Please enter Product Type',
    type: 'text',
    regType: 'noSpecial'
  }
];
const filterValidationSchema = yup.object({
  product_type: yup.string().trim().required('Required').matches(/\S+/, 'Product Type cannot be empty or contain only whitespace')
});
// Table Columns
const VisibleColumn = [];
const tableColumns = [
  {
    Header: 'Product Type',
    accessor: 'product_type'
  }
];

export { formAllValues, validationSchema, filterFormValues, formValueFields, filterValidationSchema, tableColumns, VisibleColumn };
