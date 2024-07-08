import axios from 'utils/axios';

import { enqueueSnackbar } from 'notistack';

export async function GetFdCategory(payload) {
  try {
    const response = await axios.post('/product/getcategory', payload);
    return response.data.data;
  } catch (error) {
    enqueueSnackbar(error.message, {
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
export async function GetTagForCategory(payload) {
  try {
    const response = await axios.post('/product/getcategory', payload);
    return response.data.data;
  } catch (error) {
    enqueueSnackbar(error.message, {
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
export async function AddTagForCategory(payload) {
  try {
    const response = await axios.post('/product/save_fd_tags', payload);
    return response.data.data;
  } catch (error) {
    enqueueSnackbar(error.message, {
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
