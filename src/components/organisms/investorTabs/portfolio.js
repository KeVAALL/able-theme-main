/* eslint-disable react/prop-types */
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, CardMedia, Grid, Stack, Typography } from '@mui/material';
import { Add, InfoCircle, Money, Money3, Money4, MoneyAdd, ProfileTick } from 'iconsax-react';

import TabPortfolio from 'components/molecules/portfolio/userPortfolio';
import LinearWithLabel from 'helpers/@extended/progress/LinearWithLabel';
import MainCard from '../mainCard/MainCard';
import InvoiceChart from 'helpers/cards/invoice/InvoiceChart';
import InvoiceCard from 'helpers/cards/invoice/InvoiceCard';
import AnalyticEcommerce from 'helpers/cards/statistics/AnalyticEcommerce';
import CustomerCard from 'components/molecules/portfolio/fixDepositCard';
import progress from '../../../assets/images/progress.png';
import pie from '../../../assets/images/ChartPie.png';

function Portfolio(props) {
  // Theme
  const theme = useTheme();

  const widgetsData = [
    {
      title: 'Paid',
      count: '$7,825',
      percentage: 70.5,
      isLoss: false,
      invoice: '9',
      color: theme.palette.success,
      chartData: [200, 600, 100, 400, 300, 400, 50]
    },
    {
      title: 'Unpaid',
      count: '$1,880',
      percentage: 27.4,
      isLoss: true,
      invoice: '6',
      color: theme.palette.warning,
      chartData: [100, 550, 300, 350, 200, 100, 300]
    },
    {
      title: 'Overdue',
      count: '$3,507',
      percentage: 27.4,
      isLoss: true,
      invoice: '4',
      color: theme.palette.error,
      chartData: [100, 550, 200, 300, 100, 200, 300]
    }
  ];
  return (
    <>
      <Grid container spacing={2.5} id="grid_box" sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} md={4}>
          <TabPortfolio values={props.values} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={12}>
              <Box
                sx={{
                  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  borderRadius: 1,
                  padding: '19px 18px'
                }}
              >
                <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      variant="rounded"
                      type="filled"
                      sx={{ backgroundColor: '#068e44', color: '#fff', height: '45px', width: '45px' }}
                    >
                      <Money style={{ fontSize: '24px', height: '24px', width: '24px' }} />
                    </Avatar>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body1" color="white">
                          Total Portfolio Value
                        </Typography>
                        <InfoCircle color={theme.palette.background.paper} />
                      </Stack>
                      <Typography variant="h4" color="white">
                        ₹43,078
                      </Typography>
                    </Stack>
                  </Stack>
                  {/* <Stack direction="row" spacing={1}>
                <Typography variant="body2" color="white">
                  Overdue
                </Typography>
                <Typography variant="body1" color="white">
                  62k
                </Typography>
              </Stack> */}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ pt: 1, pb: 1, pl: 7, zIndex: 1 }}>
                  <CardMedia component="img" sx={{ height: '20px', width: '20px' }} image={progress} alt="My Image" />
                  <Typography variant="body1" color="white">
                    8.75% XIRR
                  </Typography>
                </Stack>
                {/* <Box sx={{ maxWidth: '100%' }}> */}
                {/* <LinearWithLabel value={100} /> */}
                {/* </Box> */}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <AnalyticEcommerce
                title="Total Investment"
                icon={<MoneyAdd color="#068e44" style={{ fontSize: '20px', height: '22px', width: '22px' }} />}
                count="₹35,078"
                color="success"
                extra="₹20,395"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AnalyticEcommerce
                title="Total Earnings"
                icon={<Add color="#068e44" style={{ fontSize: '20px', height: '22px', width: '22px' }} />}
                percentage={10}
                count="₹11,078"
                color="success"
                extra="₹10,395"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CardMedia component="img" sx={{ height: '20px', width: '20px' }} image={pie} alt="My Image" />
            <Typography variant="body1" color="#5E718D" fontWeight={500}>
              Fixed Deposits (1)
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerCard title="Shriram Finance" />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerCard title="Bajaj Finance" />
        </Grid>
      </Grid>
    </>
  );
}

export default Portfolio;
