// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';

export async function GetProductTypeData(payload) {
  try {
    const response = await axios.post('/product/producttype', payload);
    return response.data.data;
  } catch (error) {
    dispatch(
      openSnackbar({
        open: true,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        message: error,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      })
    );
    return [];
  }
}
export async function SearchProductType(values) {
  try {
    const response = await axios.post('/product/producttype', {
      method_name: 'getone',
      ...values
    });
    return response.data.data;
  } catch (error) {
    dispatch(
      openSnackbar({
        open: true,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        message: error.message,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      })
    );
  }
}
export async function SaveProductType(payload, productTypeTableDataRefetch, clearFormValues) {
  try {
    const response = await axios.post('/product/producttype', payload);
    console.log(response);
    clearFormValues();
    enqueueSnackbar('Product type added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    productTypeTableDataRefetch();
  } catch (err) {
    enqueueSnackbar(err.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    throw err;
  }
}
export async function EditProductType(payload, productTypeTableDataRefetch, clearFormValues, setIsEditing) {
  try {
    const response = await axios.post('/product/producttype', payload);
    clearFormValues();
    setIsEditing(false);
    enqueueSnackbar('Product type Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    productTypeTableDataRefetch();
  } catch (err) {
    enqueueSnackbar(err.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    throw err;
  }
}
export async function DeleteOneProductType(values) {
  try {
    await axios.post('/product/producttype', {
      product_type_id: values.product_type_id,
      method_name: 'delete'
    });
    enqueueSnackbar('Product Type Deleted', {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  } catch (err) {
    console.log(err);
  }
}
