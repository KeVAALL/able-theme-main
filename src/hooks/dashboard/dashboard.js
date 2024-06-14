// third-party
import axios from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

export async function GetDashboardData(payload) {
  try {
    const response = await axios.post('/dashboard/getdashboard', payload);
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
