import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Dialog,
  Divider,
  Fade,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
import Avatar from 'helpers/@extended/Avatar';
import IconButton from 'helpers/@extended/IconButton';

// assets
import { CallCalling, Link2, Location, More, Sms } from 'iconsax-react';
import progress from '../../../assets/images/progress.png';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| CUSTOMER - CARD ||============================== //

const CustomerCard = ({ title }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [add, setAdd] = useState(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={3}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar src={avatarImage(`./avatar-1.png`)} />
                </ListItemAvatar>
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
                    ₹11,078
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
                    3 Yrs
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
                    ₹11,078
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
            label="Maturity on 17 Mar 2027"
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
