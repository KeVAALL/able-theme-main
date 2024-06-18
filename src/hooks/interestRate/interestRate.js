// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';

const toInteger = (boolValue) => {
  return boolValue ? 1 : 0;
};

export async function GetPayoutMethod(payload) {
  try {
    const response = await axios.post('product/getpayouts', payload);

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
export async function GetSchemeSearch(payload) {
  try {
    const response = await axios.post('product/getscheme', payload);
    return response.data.data;
  } catch (err) {
    enqueueSnackbar('Please provide payout method', {
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

export async function SaveInterestRate(payload) {
  try {
    await axios.post('/product/savescheme', payload);

    enqueueSnackbar('Scheme added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  } catch (err) {
    enqueueSnackbar(err.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  }
}

export async function EditInterestRate(payload) {
  try {
    await axios.post('/product/savescheme', payload);
    enqueueSnackbar('Scheme Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  } catch (err) {
    enqueueSnackbar(err.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  }
}
export async function DeleteOneInterestRate(values, setSchemeData, setDeletingItem, handleOpenDialog) {
  try {
    setDeletingItem(true);
    await axios.post('/product/savescheme', {
      scheme_master_id: values.scheme_master_id,
      method_name: 'delete'
    });
    enqueueSnackbar('Scheme Deleted', {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });

    const schemeData = await GetSchemeSearch(values.fd_id, values.fd_payout_method_id);
    setSchemeData(schemeData);
  } catch (err) {
    console.log(err);
  } finally {
    setDeletingItem(false);
    handleOpenDialog();
  }
}
