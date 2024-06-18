/* eslint-disable react/prop-types */
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Chip, Grid, ListItemButton, Menu, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';

// assets
import SwitchBalanace from './SwitchBalance';
import { UserAdd, Wallet3 } from 'iconsax-react';
import { inrCurrency } from 'constant/utilConstant';

// ===========================|| STATISTICS - WALLET PROFILE ||=========================== //

const WalletProfile = ({ logoURL, fdName, investorCount, fdInvestment }) => {
  const theme = useTheme();

  return (
    <MainCard contentSX={{ padding: '16px !important' }}>
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">Add Fund</Typography>
            <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <More style={{ transform: 'rotate(90deg)' }} />
            </IconButton>
            <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'wallet-button',
                sx: { p: 1.25, minWidth: 150 }
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid> */}
        <Grid item xs={12}>
          <MainCard content={false}>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  {/* <Avatar alt="Jone Doe" src={avatar} size="lg" /> */}
                  <div style={{ width: '120px', height: '65px' }}>
                    <img
                      src={logoURL}
                      alt="" // Add an alt attribute for accessibility
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px',
                        objectFit: 'contain',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        padding: '8px'
                      }}
                    />
                  </div>
                  <Stack>
                    <Typography variant="h6" fontWeight={700}>
                      {fdName}
                    </Typography>
                    {/* <Typography variant="body1" fontWeight={500} color="#5E718D">
                      Issuer Name
                    </Typography> */}
                  </Stack>
                </Stack>

                {/* <IconButton
                  color="secondary"
                  id="profile-button"
                  aria-controls={openProfile ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openProfile ? 'true' : undefined}
                  onClick={handleClickProfile}
                >
                  {openProfile ? <ArrowDown2 /> : <ArrowUp2 />}
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorElProfile}
                  open={openProfile}
                  onClose={handleCloseProfile}
                  MenuListProps={{
                    'aria-labelledby': 'profile-button',
                    sx: { p: 1.25, minWidth: 150 }
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <ListItemButton onClick={handleCloseProfile}>Active</ListItemButton>
                  <ListItemButton onClick={handleCloseProfile}>Disable</ListItemButton>
                  <ListItemButton onClick={handleCloseProfile}>Remove</ListItemButton>
                </Menu> */}
              </Stack>
            </Box>
          </MainCard>
        </Grid>
        <Grid item xs={6}>
          <SwitchBalanace name="AUM" value={inrCurrency(fdInvestment)} mainIcon={<Wallet3 color="#fff" />} />
        </Grid>
        <Grid item xs={6}>
          <SwitchBalanace name="Investors" value={investorCount} mainIcon={<UserAdd color="#fff" />} />
        </Grid>
        {/* <Grid item xs={12}>
          <Stack alignItems="center">
            <Typography>Amount</Typography>
            <Typography variant="h3">$100</Typography>
          </Stack>
        </Grid> */}
        {/* <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1.25}
            sx={{ '& .MuiChip-root': { borderColor: theme.palette.divider, borderRadius: 1 } }}
          >
            <Chip color="primary" label="$100" variant="light" size="small" />
            <Chip label="$150" variant="outlined" size="small" />
            <Chip label="$200" variant="outlined" size="small" />
            <Chip label="$250" variant="outlined" size="small" />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth variant="contained">
            Confirm
          </Button>
        </Grid> */}
      </Grid>
    </MainCard>
  );
};

export default WalletProfile;
