import { Grid, Typography, useTheme } from '@mui/material';
import Loader from 'components/atoms/loader/Loader';
import { inrCurrency } from 'constant/utilConstant';
import AnalyticEcommerce from 'helpers/cards/statistics/AnalyticEcommerce';
import EcommerceDataCard from 'helpers/cards/statistics/EcommerceDataCard';
import EcommerceMetrix from 'helpers/cards/statistics/EcommerceMetrix';
import { GetDashboardData } from 'hooks/dashboard/dashboard';
import { ArrowUp, MoneyAdd, MoneyChange, UserAdd, UserTick, Wallet3 } from 'iconsax-react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import EcommerceDataChart from 'sections/chart/EcommerceDataChart';
import TotalIncome from 'sections/chart/TotalIncome';
import SwitchBalanace from 'sections/widgets/statistics/SwitchBalance';
import WalletProfile from 'sections/widgets/statistics/WalletProfile';
import Error500 from '../maintenance/error/500';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState([]);
  const theme = useTheme();

  // Query for fetching dashboard data // Main Data
  const {
    isPending, // Flag indicating if query is pending
    isFetching,
    error, // Error object if query fails
    refetch // Function to refetch dashboard data
  } = useQuery({
    queryKey: ['dashboardData'], // Unique key for the query
    refetchOnWindowFocus: false, // Disable refetch on window focus
    keepPreviousData: true, // Keep previous data when refetching
    queryFn: () => {
      const payload = {
        method_name: 'getdashboard'
      };
      return GetDashboardData(payload);
    }, // Function to fetch dashboard data
    onSuccess: (data) => {
      console.log(data);

      setDashboardData(data); // Update dashboard data on successful query
    },
    onError: (err) => {
      console.log(err);
    }
  });

  if (isFetching) return <Loader />;

  if (dashboardData.length === 0) return <Error500 />;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={3}>
        <EcommerceMetrix
          primary="Total Investors"
          secondary={dashboardData.investor_details.investor_count}
          // content="20,032 Last Month"
          color={theme.palette.primary.main}
          iconPrimary={UserAdd}
        />
        {/* <EcommerceDataCard
          title="Total Investors"
          count="50,000"
          iconPrimary={<User variant="Bold" />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.light} />
        </EcommerceDataCard> */}
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EcommerceMetrix
          primary="Registered Users"
          secondary={dashboardData.investor_details.registered_user}
          // content="20,032 Last Month"
          color={theme.palette.info.main}
          iconPrimary={UserTick}
        />
        {/* <EcommerceDataCard
          title="Total Investors"
          count="50,000"
          iconPrimary={<User variant="Bold" />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.light} />
        </EcommerceDataCard> */}
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4}>
        <AnalyticEcommerce title="Total AUM" count="₹50,00,0000" percentage={27.4} extra="₹50,395" />
      </Grid> */}
      <Grid item xs={12} sm={6} md={3}>
        <EcommerceMetrix
          primary="Total AUM"
          secondary={inrCurrency(dashboardData.investor_details.total_investments)}
          // content="20,032 Last Month"
          color={theme.palette.success.main}
          iconPrimary={MoneyAdd}
        />
        {/* <EcommerceDataCard
          title="Total AUM"
          count="₹50,00,0000"
          iconPrimary={<Wallet3 variant="Bold" />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.light} />
        </EcommerceDataCard> */}
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <EcommerceMetrix
          primary="Net Volume"
          secondary={inrCurrency(1000000)}
          // content="20,032 Last Month"
          color={theme.palette.warning.main}
          iconPrimary={MoneyChange}
        />
        {/* <EcommerceDataCard
          title="Net Volume"
          count="₹50,00,0000"
          iconPrimary={<MoneyAdd variant="Bold" />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.light} />
        </EcommerceDataCard> */}
      </Grid>

      {dashboardData.fd_details.map((fd, id) => {
        return (
          <Grid key={id} item xs={12} md={4}>
            <WalletProfile logoURL={fd.logo_url} fdName={fd.fd_name} investorCount={fd.investor_count} fdInvestment={fd.investment_on_fd} />
          </Grid>
        );
      })}

      {/* <Grid item xs={12} md={4}>
        <SwitchBalanace/>
      </Grid> */}

      {/* <Grid item xs={12} md={6}>
        <TotalIncome />
      </Grid> */}
    </Grid>
  );
}

export default Dashboard;
