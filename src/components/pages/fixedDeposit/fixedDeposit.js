import { useEffect, useMemo, useState } from 'react';

// material-ui

import { Divider, Box, Card, Grid, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';

// third-party
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import Select from 'react-select';
import Loader from 'components/atoms/loader/Loader';

// assets
import { SubmitButton } from 'components/atoms/button/button';
import CustomTextField, { CustomCheckbox, FormikAutoComplete } from 'utils/textfield';
import {
  formAllValues,
  validationSchema,
  filterFormValues,
  formValueFields,
  filterValidationSchema,
  tableColumns,
  VisibleColumn
} from 'constant/fixDepositValidation';
import { GetProductData, GetOneProduct, SaveProduct, EditProduct, DeleteOneProduct, GetFDTags } from 'hooks/fixedDeposit/fixedDeposit';
import { GetActiveIssuerData } from 'hooks/issuer/issuer';
import InterestRate from '../../organisms/fixedDeposit/interestRate';
import '../../../utils/custom.css';

function FixDeposit() {
  // Main data state to hold the list of products
  const [productData, setProductData] = useState([]);

  // Edit Logic State
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [editingInterestRate, setEditingInterestRate] = useState(false); // State to track if editing interest rate is active
  const [activeIssuers, setActiveIssuers] = useState([]); // State to hold active issuers
  const [selectedIssuerID, setSelectedIssuerID] = useState(null); // State to hold selected issuer ID
  const [isFDActive, setFDActive] = useState(); // State to track if fixed deposit is active

  // Multi-select
  const [fdTag, setFdTag] = useState([]);
  const [selected, setSelected] = useState([]);

  // Toggle Table and Form Visibility
  const [showTable, setShowTable] = useState(false); // State to toggle visibility of the table form

  // Select field states
  const [checkedCumulative, setCheckedCumulative] = useState(false); // State for cumulative checkbox
  const [checkedNonCumulative, setCheckedNonCumulative] = useState(false); // State for non-cumulative checkbox

  // Form State
  const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values
  // Theme
  const theme = useTheme();

  // Sets form values for editing
  const setEditing = (value) => {
    setFormValues(value);
    setCheckedCumulative(Boolean(value.is_cumulative));
    setCheckedNonCumulative(Boolean(value.is_non_cumulative));
    setSelectedIssuerID(value.issuer_name);
    setSelected(value.fd_tags);
  };
  // Activates editing mode
  const setActiveEditing = () => {
    setIsEditing(true);
  };
  // Deactivates editing mode
  const setActiveClose = () => {
    setIsEditing(false);
  };
  // Sets whether fixed deposit is active
  const handleIsFDActive = (initialValue) => {
    setFDActive(initialValue);
  };

  // Sets editing interest rate to true
  const isEditingInterestRate = () => {
    setEditingInterestRate(true);
  };
  // Sets editing interest rate to false
  const isNotEditingInterestRate = () => {
    setEditingInterestRate(false);
  };

  // Toggle checked state between 0 and 1 when clicked for cumulative checkbox
  const handleCumulativeChange = () => {
    setCheckedCumulative((prevChecked) => (!prevChecked ? 1 : 0)); // Toggle between 0 and 1
  };
  // Toggle checked state between 0 and 1 when clicked for non-cumulative checkbox
  const handleNonCumulativeChange = () => {
    setCheckedNonCumulative((prevChecked) => (!prevChecked ? 1 : 0));
  };

  // Search one item state
  const setSearchData = (fixedDeposit) => {
    // Function to set search results for a single product
    setProductData(fixedDeposit);
  };

  // Form Visibility
  const changeTableVisibility = () => {
    // Function to toggle table visibility
    setShowTable(!showTable);
  };
  // Empty Form Fields
  const clearFormValues = () => {
    // Function to clear form values
    setFormValues(formAllValues);
    setCheckedCumulative(false);
    setCheckedNonCumulative(false);
    setSelected([]);
    setSelectedIssuerID();
  };

  // Custom Fields/ Table Columns
  const columns = useMemo(() => tableColumns, []); // Memoized table columns for performance

  // Fetching Data using React Query
  // Query for fetching active issuer data
  const {
    isPending: isActiveIssuerPending,
    error: activeIssuerError,
    refetch
  } = useQuery({
    queryKey: ['activeIssuerData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: GetActiveIssuerData, // Function to fetch active issuer data
    onSuccess: (data) => {
      // Callback function on successful query
      setActiveIssuers(data); // Update active issuers with fetched data
    }
  });

  // Query for fetching product data
  const {
    isPending,
    error,
    refetch: ProductTableDataRefetch
  } = useQuery({
    queryKey: ['productTableData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: GetProductData, // Function to fetch product data
    onSuccess: (data) => {
      setProductData(data); // Update product data with fetched data
    }
  });
  // Query for fetching tags
  const { isPending: tagsPending, error: tagsError } = useQuery({
    queryKey: ['tagData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: GetFDTags, // Function to fetch product data
    onSuccess: (data) => {
      setFdTag(data); // Update product data with fetched data
    }
  });

  // useEffect(() => {
  //   console.log(selected);
  // }, [selected]);

  if (isPending) return <Loader />;

  if (editingInterestRate)
    return (
      <InterestRate
        formValues={formValues}
        changeTableVisibility={changeTableVisibility}
        isNotEditingInterestRate={isNotEditingInterestRate}
        isEditingInterestRate={editingInterestRate}
      />
    );

  return (
    <>
      {showTable && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (isEditing === false) {
              const tagIds = selected.map((id) => {
                return id.value;
              });
              SaveProduct(
                values,
                ProductTableDataRefetch,
                clearFormValues,
                checkedCumulative,
                checkedNonCumulative,
                tagIds
                // selectedIssuerID
              );
            }
            if (isEditing === true) {
              console.log('i am editing');
              const tagIds = selected.map((id) => {
                return id.value;
              });
              EditProduct(
                values,
                isFDActive,
                ProductTableDataRefetch,
                clearFormValues,
                checkedCumulative,
                checkedNonCumulative,
                tagIds,
                selectedIssuerID,
                setActiveClose
              );
            }
            changeTableVisibility();
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
                  title="FD Entry"
                  changeTableVisibility={changeTableVisibility}
                  clearFormValues={clearFormValues}
                  isEditing={isEditing}
                  formValues={formValues}
                  setActiveClose={setActiveClose}
                  setIsActive={handleIsFDActive}
                  isActive={isFDActive}
                  isValid={isValid}
                  dirty={dirty}
                />

                <Divider />

                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="FD Name"
                        name="fd_name"
                        placeholder={'Please enter FD Name'}
                        values={values}
                        type="text"
                        regType="string"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="Min Amount (₹)"
                        name="fd_min_amount"
                        placeholder={'Please enter Minimum Amount'}
                        values={values}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="Max Amount (₹)"
                        name="fd_max_amount"
                        placeholder={'Please enter Maximum Amount'}
                        values={values}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="Minimum Tenure (Days)"
                        name="min_tenure"
                        placeholder={'Please enter Minimum Tenure'}
                        values={values}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="Max Tenure (Days)"
                        name="max_tenure"
                        placeholder={'Please enter Maximum Tenure'}
                        values={values}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomCheckbox
                        checked={checkedCumulative}
                        handleChange={handleCumulativeChange}
                        name="checkedCumulative"
                        label="Cumulative"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomCheckbox
                        checked={checkedNonCumulative}
                        handleChange={handleNonCumulativeChange}
                        name="checkedNonCumulative"
                        label="Non Cumulative"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        label="Logo URL"
                        name="logo_url"
                        placeholder={'Please enter Logo Url'}
                        values={values}
                        type="text"
                        regType="noSpace"
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        touched={touched}
                        errors={errors}
                        inputProps={{ maxLength: 150 }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      {/* <CustomAutoComplete
                        options={activeIssuers}
                        defaultValue={selectedIssuerID}
                        setSelected={setSelectedIssuerID}
                        optionName="issuer_name"
                        label="Issuers"
                      /> */}
                      <FormikAutoComplete
                        options={activeIssuers}
                        defaultValue={values.issuer_id}
                        idName="issuer_id"
                        setFieldValue={setFieldValue}
                        formName="issuer_id"
                        optionName="issuer_name"
                        label="Issuers"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        className="multi_select"
                        isMulti
                        name="tags"
                        options={fdTag}
                        onChange={(e) => {
                          console.log(e);
                          setSelected(e);
                        }}
                        value={selected}
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
          title="Fixed Deposit Search"
          changeTableVisibility={changeTableVisibility}
          showButton
          setActiveAdding={setActiveClose}
          border
          contentSX={{ p: 2 }}
          sx={{ height: '100%', boxShadow: 1 }}
        >
          <MultiTable
            columns={columns}
            data={productData}
            formValues={filterFormValues}
            formValueFields={formValueFields}
            validationSchema={filterValidationSchema}
            changeTableVisibility={changeTableVisibility}
            setEditing={setEditing}
            getOneItem={GetOneProduct}
            deleteOneItem={DeleteOneProduct}
            setSearchData={setSearchData}
            tableDataRefetch={ProductTableDataRefetch}
            setActiveEditing={setActiveEditing}
            isEditingInterestRateButton={true}
            isEditingInterestRate={isEditingInterestRate}
            VisibleColumn={VisibleColumn}
          />
        </MainCard>
      )}
    </>
  );
}

export default FixDeposit;
