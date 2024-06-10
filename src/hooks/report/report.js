// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

export async function GetFDReport() {
  try {
    const response = await axios.get('reports/get_fd_report');
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
export async function GetIssuerReport() {
  try {
    const response = await axios.get('reports/get_issuer_report');
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
