// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';
import { toInteger } from 'lodash';

export async function GetProductData(payload) {
  try {
    const response = await axios.post('product/getproduct', payload);
    return response.data.data;
  } catch (err) {
    enqueueSnackbar(err.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    return [];
  }
}
export async function GetFDTags(payload) {
  try {
    const response = await axios.post('product/getproduct', payload);
    return response.data.data;
  } catch (error) {
    enqueueSnackbar(err.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    return [];
  }
}

export async function GetOneProduct(values) {
  try {
    const response = await axios.post('product/getproduct', {
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

export async function SaveProduct(payload, ProductTableDataRefetch, clearFormValues) {
  try {
    await axios.post('/product/saveproduct', payload);
    clearFormValues();
    enqueueSnackbar('Product added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    ProductTableDataRefetch();
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

export async function EditProduct(payload, ProductTableDataRefetch, clearFormValues) {
  try {
    await axios.post('/product/saveproduct', payload);
    clearFormValues();
    // setActiveClose();
    enqueueSnackbar('Product Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    ProductTableDataRefetch();
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
export async function DeleteOneProduct(values) {
  const userID = localStorage.getItem('userID');
  try {
    await axios.post('/product/saveproduct', {
      fd_id: values.fd_id,
      user_id: toInteger(userID),
      method_name: 'delete'
    });
    enqueueSnackbar('Product Deleted', {
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
