// assets
import { dispatch } from '../../../redux';
import { openSnackbar } from 'redux/reducers/snackbar';

export function OpenSnackbar(message, variant, color) {
  return dispatch(
    openSnackbar({
      open: true,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      message: message,
      variant: `${variant}`,
      alert: {
        color: color
      }
    })
  );
}
