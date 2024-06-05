// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

// assets
import { dispatch } from '../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';
import { toInteger } from 'lodash';

export async function GetInvestorData(payload) {
  try {
    const response = await axios.post('investor/getinvestor', payload);
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
//fetch the ifa
export async function GetIfa(payload) {
  try {
    const { data } = await axios.post('/ifa/getifa', payload);

    return data.data;
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

export async function GetIFASearch(payload) {
  try {
    const response = await axios.post('investor/getinvestor', payload);
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
export async function SaveInvestor(payload) {
  try {
    await axios.post('/investor/save', payload);

    enqueueSnackbar('Investor added', {
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
    console.log('error');
  }
}
export async function EditInvestor(payload) {
  try {
    await axios.post('/investor/save', payload);
    enqueueSnackbar('Investor Updated', {
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
  const userID = localStorage.getItem('userID');

  try {
    await axios.post('/investor/save', {
      investor_id: values?.investor_id,
      user_id: toInteger(userID),
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
// Bank APIs
export async function GetBankDetails(payload) {
  try {
    const response = await axios.post('onboarding/getbankbranch', payload);
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
    throw err;
  }
}
export async function AddBankDetails(payload) {
  try {
    const response = await axios.post('onboarding/verifybank', payload);
    enqueueSnackbar('Bank Details Added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
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
    throw err;
  }
}
export async function VerifyPAN(payload) {
  try {
    const response = await axios.post('investor/verifypan', payload);
    enqueueSnackbar('PAN Verified', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
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
    throw err;
  }
}
// export async function GetOneInvestor(values, setSearchData) {
//   try {
//     const response = await axios.post('investor/getinvestor', {
//       method_name: 'getone',
//       ...values
//     });
//     setSearchData(response.data.data);
//   } catch (error) {
//     enqueueSnackbar(error.message, {
//       variant: 'error',
//       autoHideDuration: 2000,
//       anchorOrigin: {
//         vertical: 'top',
//         horizontal: 'right'
//       }
//     });
//   }
// }
