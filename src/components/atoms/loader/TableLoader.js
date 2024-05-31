// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// ==============================|| Loader ||============================== //

const TableLoader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" sx={{ height: 5, borderRadius: 0 }} />
  </LoaderWrapper>
);

export default TableLoader;
