// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';

const toInteger = (boolValue) => {
  return boolValue ? 1 : 0;
};

export async function GetPayoutMethod(fdId) {
  try {
    const response = await axios.post('product/getpayouts', {
      method_name: 'getpayouts',
      fd_id: fdId
    });
    return response.data.data;
  } catch (err) {
    return err;
  }
}
export async function GetSchemeSearch(fdId, selectedPayoutMethod) {
  try {
    const response = await axios.post('product/getscheme', {
      method_name: 'getscheme',
      fd_id: fdId,
      fd_payout_method_id: selectedPayoutMethod
    });
    return response.data.data;
  } catch (err) {
    return err;
  }
}

export async function SaveInterestRate(values, fdId, selectedPayoutMethod, isActive, clearFormValues, handleOpenDialog, setSchemeData) {
  try {
    await axios.post('/product/savescheme', {
      ...values,
      fd_id: fdId,
      is_active: toInteger(isActive),
      fd_payout_method_id: selectedPayoutMethod,
      method_name: 'add'
    });
    clearFormValues();
    handleOpenDialog();
    enqueueSnackbar('Product added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    const schemeData = await GetSchemeSearch(fdId, selectedPayoutMethod);
    setSchemeData(schemeData);
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

export async function EditInterestRate(values, activeButton, liveButton, clearFormValues, handleOpenDialog, setSchemeData, setActiveClose) {
  try {
    await axios.post('/product/savescheme', {
      ...values,
      is_active: toInteger(activeButton),
      is_live: toInteger(liveButton),
      scheme_master_id: values.scheme_master_id,
      method_name: 'update'
    });
    clearFormValues();
    handleOpenDialog();
    setActiveClose();
    enqueueSnackbar('Product Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });

    const schemeData = await GetSchemeSearch(values.fd_id, values.fd_payout_method_id);
    setSchemeData(schemeData);
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
export async function DeleteOneInterestRate(values, setSchemeData) {
  try {
    await axios.post('/product/savescheme', {
      scheme_master_id: values.scheme_master_id,
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

    const schemeData = await GetSchemeSearch(values.fd_id, values.fd_payout_method_id);
    setSchemeData(schemeData);
  } catch (err) {
    console.log(err);
  }
}
