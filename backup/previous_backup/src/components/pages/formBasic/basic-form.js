import { useMemo, useState } from 'react';
// material-ui

import { Divider, Box, Card, Button, Grid, InputLabel, Stack, TextField, CardHeader, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
import AnimateButton from 'helpers/@extended/AnimateButton';
import MultiTable from 'components/pages/multiTable/multiTable';

// third-party
import { Formik } from 'formik';
import * as yup from 'yup';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// eslint-disable-next-line react/prop-types
const SubmitButton = ({ changeTableVisibility }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title="Form" />
      <Stack direction="row" alignItems="center" spacing={2.5} paddingRight={2.5}>
        <Box>
          <AnimateButton>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </AnimateButton>
        </Box>
        <Box>
          <AnimateButton>
            <Button variant="outlined" type="button" onClick={changeTableVisibility}>
              Cancel
            </Button>
          </AnimateButton>
        </Box>
      </Stack>
    </Stack>
  );
};

function BasicForm() {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        Header: 'User Name',
        accessor: 'userName'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Phone',
        accessor: 'phone'
      }
    ],
    []
  );

  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };

  const validationSchema = yup.object({
    userName: yup.string().required('Name is required'),
    email: yup.string().required('Email is required'),
    phone: yup.string().required('Phone Number is required')
  });
  const formValues = {
    userName: '',
    email: '',
    phone: ''
  };

  return (
    <>
      {showTable && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setData((prevData) => {
              return [...prevData, values];
            });
            changeTableVisibility();
            console.log(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, isSubmitting }) => (
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              sx={{ width: '100%' }}
            >
              <Card
                sx={{
                  position: 'relative',
                  border: '1px solid',
                  borderRadius: 1.5,
                  borderColor: theme.palette.divider
                }}
              >
                <SubmitButton changeTableVisibility={changeTableVisibility} />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="userName">Username</InputLabel>
                        <TextField
                          // fullWidth
                          // id="userName"
                          name="userName"
                          placeholder="Enter User Name"
                          value={values.userName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.userName && Boolean(errors.userName)}
                          helperText={touched.userName && errors.userName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <TextField
                          // fullWidth
                          // id="email"
                          name="email"
                          placeholder="Enter your Email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <TextField
                          // fullWidth
                          // id="phone"
                          name="phone"
                          placeholder="Enter your Phone number"
                          type="tel"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard title="Table" changeTableVisibility={changeTableVisibility} showButton border sx={{ height: '100%', boxShadow: 1 }}>
          <MultiTable columns={columns} data={data} formValues={formValues} />
        </MainCard>
      )}
    </>
  );
}

export default BasicForm;

{
  /* <Grid item xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title="Form" />
                <Box sx={{}}>
                  <AnimateButton>
                    <Button variant="contained" type="submit">
                      Save
                    </Button>
                  </AnimateButton>
                </Box>
              </Stack>
            </Grid> */
}

{
  /* <Divider /> */
}

// <MainCard
//   title="Form"
//   showButton
//   changeTableVisibility={changeTableVisibility}
//   component="form"
//   onSubmit={(event) => {
//     event.preventDefault();
//     handleSubmit();
//   }}
//   border={false}
//   sx={{ height: '100%' }}
// >
