// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { toInteger } from 'lodash';

export async function GetIssuerData(payload) {
  try {
    const response = await axios.post('/issuer/getissuer', payload);
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
export async function GetActiveIssuerData(payload) {
  try {
    const response = await axios.post('/issuer/getissuer', payload);
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
export async function GetOneIssuer(values, setSearchData) {
  try {
    const response = await axios.post('/issuer/getissuer', {
      method_name: 'getone',
      ...values
    });
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
export async function SaveIssuer(values, issuerTableDataRefetch, clearFormValues) {
  try {
    const response = await axios.post('/issuer/saveissuer', values);
    clearFormValues();
    enqueueSnackbar('Issuer added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    issuerTableDataRefetch();
    return response;
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
export async function EditIssuer(values, issuerTableDataRefetch, clearFormValues, setActiveClose) {
  try {
    const response = await axios.post('/issuer/saveissuer', values);
    clearFormValues();
    setActiveClose();
    enqueueSnackbar('Issuer Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    issuerTableDataRefetch();
    return response;
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
export async function DeleteOneIssuer(values, setDeletingItem, handleOpenDialog) {
  const userID = localStorage.getItem('userID');
  try {
    setDeletingItem(true);
    await axios.post('/issuer/saveissuer', {
      issuer_id: values?.issuer_id,
      user_id: toInteger(userID),
      method_name: 'delete'
    });
    enqueueSnackbar('Issuer Deleted', {
      variant: 'error',
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
  } finally {
    setDeletingItem(false);
    handleOpenDialog();
  }
}
export async function DeleteOneFAQ(payload) {
  try {
    await axios.post('issuer/delete_faqs', payload);
    enqueueSnackbar('FAQ Deleted', {
      variant: 'error',
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
