import { useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';
import { SubmitButton } from 'components/atoms/button/button';
import { CustomTextField } from 'utils/textfield';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/productTypeValidation';
import {
  GetProductTypeData,
  SearchProductType,
  SaveProductType,
  EditProductType,
  DeleteOneProductType
} from 'hooks/productType/productType';

// third-party
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import { toInteger } from 'lodash';

function ProductType() {
  // Main data state to hold the list of products
  const [data, setData] = useState([]);
  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(false); // State to toggle visibility of the table form
  // Editing States
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [isProductTypeActive, setProductTypeActive] = useState(); // State to track if the issuer is active or not active
  // Form State
  const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values

  // Theme
  const theme = useTheme();
  // Actions
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productDeleting, setProductDeleting] = useState(false);

  // State Setting
  // Sets form values for editing
  const setEditing = (value) => {
    setFormValues({ product_type_id: value.product_type_id, product_type: value.product_type });
  };
  const handleIsProductTypeActive = (initialValue) => {
    setProductTypeActive(initialValue);
  };
  // Activates editing mode
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  // Deactivates editing mode
  const setActiveClose = () => {
    setIsEditing(false);
  };
  // Form Visibility
  const changeTableVisibility = () => {
    setShowTable(!showTable);
  };
  // Search one item state
  const setSearchData = (product) => {
    // Function to set search result
    setData(product);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    // Function to clear form values
    setFormValues(formAllValues);
  };

  // Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Fetching Data using React Query // Main data
  const {
    isPending, // Flag indicating if query is pending
    isFetching,
    error, // Error object if query fails
    refetch: productTypeTableDataRefetch // Function to refetch product type data
  } = useQuery({
    queryKey: ['productTypeTableData'], // Unique key for the query
    queryFn: () => {
      const payload = {
        method_name: 'getall'
      };
      return GetProductTypeData(payload);
    }, // Function to fetch product type data
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    onSuccess: (data) => {
      setData(data); // Update data with fetched data
    }
  });

  // if (isFetching) return <Loader />;

  return (
    <>
      {showTable && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const userID = localStorage.getItem('userID');
            if (isEditing === false) {
              const payload = { ...values, user_id: toInteger(userID), method_name: 'add' };
              try {
                setProductSubmitting(true);
                await SaveProductType(payload, productTypeTableDataRefetch, clearFormValues);
                changeTableVisibility();
              } catch (err) {
                console.log(err);
              } finally {
                setProductSubmitting(false);
              }
            }
            if (isEditing === true) {
              try {
                setProductSubmitting(true);
                const payload = { ...values, user_id: toInteger(userID), method_name: 'update' };
                await EditProductType(payload, productTypeTableDataRefetch, clearFormValues, setIsEditing);
                changeTableVisibility();
              } catch (err) {
                console.log(err);
              } finally {
                setProductSubmitting(false);
              }
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isValid,
            dirty,
            resetForm,
            isSubmitting
          }) => (
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
                  borderColor: theme.palette.divider,
                  overflow: 'visible'
                }}
              >
                <SubmitButton
                  title="Product Entry"
                  loading={productSubmitting}
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsProductTypeActive}
                  isActive={isProductTypeActive}
                  isValid={isValid}
                  dirty={dirty}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={6} xs={12}>
                      <CustomTextField
                        label="Product"
                        name="product_type"
                        placeholder={'Please enter Product'}
                        values={values}
                        type="text"
                        regType="string"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        FormHelperTextProps={{
                          style: {
                            marginLeft: 0
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Formik>
      )}
      {!showTable && (
        <MainCard
          title="Product Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <MultiTable
            columns={columns}
            data={data}
            formValues={filterFormValues}
            formValueFields={formValueFields}
            validationSchema={filterValidationSchema}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={SearchProductType}
            deleteOneItem={DeleteOneProductType}
            deletingItem={productDeleting}
            setDeletingItem={setProductDeleting}
            setSearchData={setSearchData}
            tableDataRefetch={productTypeTableDataRefetch}
            setActiveEditing={setActiveEditing}
            VisibleColumn={VisibleColumn}
            isFetching={isFetching}
          />
        </MainCard>
      )}
    </>
  );
}

export default ProductType;
