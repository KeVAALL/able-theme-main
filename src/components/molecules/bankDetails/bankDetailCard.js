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
  Typography
} from '@mui/material';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
// import Avatar from 'helpers/@extended/Avatar';

// assets
import progress from '../../../assets/images/progress.png';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - CARD ||============================== //

const BankDetailCard = ({ logoURL, title, accountNumber, IFSC, branchName, isPrimary }) => {
  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={3}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding sx={{ gap: 1 }}>
                {/* <ListItemAvatar>
                  <Avatar src={avatarImage(`./avatar-1.png`)} />
                </ListItemAvatar> */}
                <div style={{ width: '45px', height: '45px', borderRadius: '100%' }}>
                  <img
                    src={logoURL}
                    alt="MMFSL Logo" // Add an alt attribute for accessibility
                    style={{
                      width: '100%',
                      height: '100%',
                      // border: "1px solid red",
                      borderRadius: '8px',
                      objectFit: 'contain',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      padding: '4px'
                    }}
                  />
                </div>

                <ListItemText
                  primary={
                    <Typography variant="h4" fontWeight={800}>
                      {title}
                    </Typography>
                  }
                  secondary={<Typography color="text.secondary"></Typography>}
                />
              </ListItem>
            </List>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                IFSC Code
              </Typography>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant="h4" color="inherit" fontSize={16}>
                    {IFSC}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex' }}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                Branch
              </Typography>
              <Grid container alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <Typography variant="h4" fontSize={16}>
                    {branchName}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            {isPrimary ? (
              <Chip label="Primary Account" sx={{ backgroundColor: '#1DB4691F', color: '#11A75C', fontWeight: 600, borderRadius: '6px' }} />
            ) : (
              <Chip label="Make Primary" sx={{ backgroundColor: '#1DB4691F', color: '#21B546', fontWeight: 600, borderRadius: '6px' }} />
            )}
          </Grid>
        </Grid>

        {/* </Stack> */}
      </MainCard>
    </>
  );
};

export default BankDetailCard;
