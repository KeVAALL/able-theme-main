// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';

const toInteger = (boolValue) => {
  return boolValue ? 1 : 0;
};

export async function GetInvestorData() {
  try {
    const response = await axios.post('investor/getinvestor', {
      method_name: 'getall'
    });
    console.log(response);
    return response.data.data;
  } catch (err) {
    return err;
  }
}
export async function GetOneInvestor(values, setSearchData) {
  try {
    const response = await axios.post('investor/getinvestor', {
      method_name: 'getone',
      // method_name: 'getdetails',
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
export async function SaveInvestor(values, InvestorTableDataRefetch, clearFormValues) {
  console.log({
    ...values,
    user_id: 2,
    method_name: 'add'
  });
  try {
    await axios.post('/investor/save', {
      ...values,
      user_id: 2,
      method_name: 'add'
    });
    clearFormValues();
    enqueueSnackbar('Investor added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    InvestorTableDataRefetch();
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
export async function EditInvestor(
  values,
  // isInvestorActive,
  InvestorTableDataRefetch,
  clearFormValues,
  setActiveClose
) {
  console.log('hiting api');
  try {
    await axios.post('/investor/create', {
      ...values,
      is_active: toInteger(isInvestorActive),
      method_name: 'update',
      user_id: 2
    });
    clearFormValues();
    setActiveClose();
    enqueueSnackbar('Product Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    InvestorTableDataRefetch();
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
export async function GetEditOneInvestor(setEditing, investor_id) {
  try {
    const response = await axios.post('investor/getinvestor', {
      method_name: 'getdetails',
      investor_id: investor_id
      // investor_id: 99
    });
    console.log(response.data.data);
    setEditing(response.data.data);
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
export async function DeleteOneInvestor(values) {
  try {
    console.log(values.osb_issuer_id);
    await axios.post('/investor/create', {
      investor_id: values?.investor_id,
      user_id: 2,
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
//fetch the ifa
export async function GetIfa() {
  try {
    const { data } = await axios.post('/ifa/getifa', {
      method_name: 'getall'
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}
