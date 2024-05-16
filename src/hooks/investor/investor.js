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
export async function GetOneInvestor(values, setSearchData) {
  try {
    const response = await axios.post('investor/getinvestor', {
      method_name: 'getone',
      ...values
    });
    setSearchData(response.data.data);
  } catch (error) {
    enqueueSnackbar(error.message, {
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  }
}
export async function SaveInvestor(values, InvestorTableDataRefetch, clearFormValues) {
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
      variant: 'error',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    console.log('error');
  }
}
export async function EditInvestor(
  values,
  // isInvestorActive,
  InvestorTableDataRefetch,
  clearFormValues,
  setActiveClose
) {
  try {
    await axios.post('/investor/save', {
      ...values,
      // is_active: toInteger(isInvestorActive),
      user_id: 2,
      investor_id: values.investor.investor_id,
      method_name: 'update'
    });
    clearFormValues();
    setActiveClose();
    enqueueSnackbar('Investor Updated', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
    // InvestorTableDataRefetch();
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
    });
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
    await axios.post('/investor/save', {
      investor_id: values?.investor_id,
      user_id: 2,
      method_name: 'delete'
    });
    enqueueSnackbar('Investor Deleted', {
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
    console.log(data);
    return data.data;
  } catch (err) {
    console.log(err);
  }
}
export async function GetIFASearch(values, selectedIFA) {
  try {
    const response = await axios.post('investor/getinvestor', {
      method_name: 'getifafilter',
      // ifa_id: selectedIFA,
      ...values
    });
    // setEditing(response.data.data);
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
