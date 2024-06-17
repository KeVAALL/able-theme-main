// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

export async function UploadFAQ(payload) {
  try {
    const response = await axios.post(
      'faqs/import',
      //   { file: payload.files },
      payload.data,
      {
        params: {
          issuer_id: payload.issuer_id
        }
      }
    );
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

export async function ManualAddFAQ(payload) {
  try {
    const response = await axios.post('faqs/savefaqs', payload);
    enqueueSnackbar('FAQ Added', {
      variant: 'success',
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
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
