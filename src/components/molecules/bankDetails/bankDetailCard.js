/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

// material-ui
import {
  // Box,
  CardMedia,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  // ListItemAvatar,
  // ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
// import Avatar from 'helpers/@extended/Avatar';

// assets
import IconButton from 'helpers/@extended/IconButton';
import { Edit, Edit2, Trash } from 'iconsax-react';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - CARD ||============================== //

const BankDetailCard = ({
  key,
  index,
  values,
  setFieldValue,
  logoURL,
  title,
  accountNumber,
  IFSC,
  branchName,
  isPrimary,
  handleOpenDialog,
  setIndex
}) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <MainCard
        sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}
        contentSX={{ p: 4, paddingBotton: '32px !important' }}
      >
        <Grid id="print" container spacing={3}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <ListItem disablePadding sx={{ gap: 1 }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '100%' }}>
                  <img
                    src={logoURL}
                    alt=""
                    // alt="MMFSL Logo" // Add an alt attribute for accessibility
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      objectFit: 'contain',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      padding: '4px'
                    }}
                  />
                </div>

                <ListItemText
                  primary={
                    <Typography variant="h5" fontWeight={800}>
                      {title}
                    </Typography>
                  }
                  secondary={<Typography color="text.secondary"></Typography>}
                />
              </ListItem>
              <Stack spacing={1} direction="row">
                {values.investor.is_bank_verified ? (
                  <IconButton
                    color="error"
                    sx={{ border: '1.5px solid #FFC5C1' }}
                    onClick={async () => {
                      setIndex(index);
                      handleOpenDialog();
                    }}
                  >
                    <Trash size={26} style={{ cursor: 'pointer' }} />
                  </IconButton>
                ) : (
                  <IconButton
                    color="secondary"
                    sx={{ border: '1.5px solid #D7DFE9' }}
                    onClick={async () => {
                      const editItem = values.investor_bank.map((el, elIndex) => {
                        if (elIndex == index) {
                          return { ...el, is_editing: 1 };
                        }
                        return el;
                      });

                      setFieldValue('investor_bank', editItem);
                    }}
                  >
                    <Edit size={26} style={{ cursor: 'pointer' }} />
                  </IconButton>
                )}
              </Stack>
            </List>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                Bank Account Number
              </Typography>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant="h4" color="inherit" fontSize={16}>
                    {accountNumber}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                IFSC Code
              </Typography>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant="h4" color="inherit" fontSize={14}>
                    {IFSC}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item md={8} sm={6} xs={12} sx={{ display: 'flex' }}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                Branch
              </Typography>
              <Grid container alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <Typography variant="h4" fontSize={14}>
                    {branchName}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            display="flex"
            justifyContent={matchDownSM ? 'center' : 'flex-end'}
            alignItems={matchDownSM ? 'flex-start' : 'flex-end'}
          >
            {/* {isPrimary ? ( */}
            <Chip
              label="Primary Account"
              sx={{ backgroundColor: '#1DB4691F', color: '#11A75C', fontSize: 12, fontWeight: 500, borderRadius: '6px' }}
            />
            {/* ) : ( */}
            {/* <Chip
                label="Make Primary"
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#21B546',
                  border: '1.5px solid #21B546',
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: '6px'
                }}
              /> */}
            {/* )} */}
          </Grid>
        </Grid>

        {/* </Stack> */}
      </MainCard>
    </>
  );
};

export default BankDetailCard;
