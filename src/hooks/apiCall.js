import axios from 'axios';

const onError = (error) => {
  enqueueSnackbar(error.message, {
    variant: 'error',
    autoHideDuration: 2000,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    }
  });
  console.error('Error:', error);
};
const onSuccess = (response) => {
  enqueueSnackbar('Investor added', {
    variant: 'success',
    autoHideDuration: 2000,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    }
  });
};
async function postRequest(url, data, successMessage, onSuccess, onError) {
  try {
    const response = await axios.post(url, data);
    enqueueSnackbar(successMessage, {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
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

export default postRequest;
