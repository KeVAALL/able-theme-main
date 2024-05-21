// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';

export async function GetProductTypeData() {
  try {
    const response = await axios.post('/product/producttype', {
      method_name: 'getall'
    });
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
export async function GetOneProductType(values, setSearchData) {
  try {
    const response = await axios.post('/product/producttype', {
      method_name: 'getone',
      ...values
    });
    setSearchData(response.data.data);
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
export async function SaveProductType(values, productTypeTableDataRefetch, clearFormValues) {
  try {
    const response = await axios.post('/product/producttype', { ...values, method_name: 'add' });
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
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  }
}
export async function EditProductType(values, productTypeTableDataRefetch, clearFormValues, setIsEditing) {
  try {
    const response = await axios.post('/product/producttype', { ...values, method_name: 'update' });
    console.log(response);
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
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
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
