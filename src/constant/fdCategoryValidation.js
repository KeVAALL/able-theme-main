import * as yup from 'yup';

const VisibleColumn = [];

const validationSchema = yup.object().shape({
  fd_tag_name: yup.string().required('FD Name is required')
});

export { VisibleColumn, validationSchema };
