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

const CustomerCard = ({ logoURL, title, tenure, currentValue, interestEarned, maturityDate }) => {
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
                      borderRadius: '100%',
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
          <Grid item xs={4}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                Current Value
              </Typography>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant="h4" color="inherit" fontSize={16}>
                    ₹ {currentValue}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                Tenure
              </Typography>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant="h4" color="inherit" fontSize={16}>
                    {tenure}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Stack spacing={0.5}>
              <Typography variant="h6" color="#5E718D">
                Interest Earned
              </Typography>
              <Grid container alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <Typography variant="h4" color="#21B546" fontSize={16}>
                    ₹ {interestEarned}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Stack direction="row" spacing={1}>
            <Typography variant="body1" color="#21B546">
              8.75% XIRR
            </Typography>
            <CardMedia component="img" sx={{ height: '20px', width: '20px' }} image={progress} alt="My Image" />
          </Stack>
          <Chip
            label={`Maturity on ${new Date(maturityDate).getDay()} ${new Date(maturityDate).toLocaleString('default', {
              month: 'long'
            })} ${new Date(maturityDate).getFullYear()}`}
            sx={{ backgroundColor: '#F0F3F9', color: '#5E718D', fontWeight: 600, borderRadius: '6px' }}
          />
        </Stack>
      </MainCard>
    </>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.object
};

export default CustomerCard;
