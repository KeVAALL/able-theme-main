import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Divider, Box, Card, Grid, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'react-query';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import MultiTable from '../multiTable/multiTable';

// third-party
import { Formik } from 'formik';
import Loader from 'components/atoms/loader/Loader';

// project-imports
import { tableColumns, VisibleColumn } from 'constant/report/fdReportValidation';
import { inrCurrency } from 'constant/utilConstant';
import { GetFDReport } from 'hooks/report/report';

function FDReport() {
  // Main data state to hold the list of products
  const [data, setData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  // Toggle Table and Form Visibility
  //   const [showTable, setShowTable] = useState(false); // State to toggle visibility of the table form
  //   // Editing States
  //   const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  //   const [isProductTypeActive, setProductTypeActive] = useState(); // State to track if the issuer is active or not active
  //   // Form State
  //   const [formValues, setFormValues] = useState(formAllValues); // State to hold form input values

  // Theme
  const theme = useTheme();

  // State Setting
  // Sets form values for editing
  //   const setEditing = (value) => {
  //     setFormValues({ product_type_id: value.product_type_id, product_type: value.product_type });
  //   };
  //   const handleIsProductTypeActive = (initialValue) => {
  //     setProductTypeActive(initialValue);
  //   };
  //   // Activates editing mode
  //   const setActiveEditing = () => {
  //     setIsEditing(true);
  //   };
  //   // Deactivates editing mode
  //   const setActiveClose = () => {
  //     setIsEditing(false);
  //   };
  //   // Form Visibility
  //   const changeTableVisibility = () => {
  //     setShowTable(!showTable);
  //   };
  //   // Search one item state
  //   const setSearchData = (product) => {
  //     // Function to set search result
  //     setData(product);
  //   };
  // Empty Form Fields
  //   const clearFormValues = () => {
  //     // Function to clear form values
  //     setFormValues(formAllValues);
  //   };

  // Table Columns
  const columns = useMemo(() => tableColumns, []);

  // Fetching Data using React Query // Main data
  const {
    isPending, // Flag indicating if query is pending
    isFetching,
    error, // Error object if query fails
    refetch: fdReportRefetch // Function to refetch product type data
  } = useQuery({
    queryKey: ['fdReportTableData'], // Unique key for the query
    queryFn: () => {
      //   const payload = {
      //     method_name: 'getall'
      //   };
      return GetFDReport();
    }, // Function to fetch product type data
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    onSuccess: (data) => {
      console.log(data);
      setData(data); // Update data with fetched data

      const expData = data.map((el) => {
        return { ...el, current_balance: inrCurrency(el.current_balance) };
      });

      setCsvData(expData);
    }
  });

  // if (isFetching) return <Loader />;

  return (
    <>
      <MainCard
        title="FD Report Search"
        changeTableVisibility={() => {}}
        setActiveAdding={() => {}}
        showButton
        noAddButton
        border
        contentSX={{ p: 2 }}
        sx={{ height: '100%', boxShadow: 1 }}
      >
        <MultiTable
          columns={columns}
          data={data}
          csvData={csvData}
          //   formValues={filterFormValues}
          //   formValueFields={formValueFields}
          //   validationSchema={filterValidationSchema}
          //   changeTableVisibility={changeTableVisibility}
          //   setEditing={setEditing}
          //   getOneItem={SearchProductType}
          //   deleteOneItem={DeleteOneProductType}
          //   setSearchData={setSearchData}
          //   tableDataRefetch={productTypeTableDataRefetch}
          //   setActiveEditing={setActiveEditing}
          VisibleColumn={VisibleColumn}
          isFetching={isFetching}
          hideActions={true}
        />
      </MainCard>
    </>
  );
}

export default FDReport;
