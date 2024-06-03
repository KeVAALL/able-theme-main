import { Grid, Typography, useTheme } from '@mui/material';
import AnalyticEcommerce from 'helpers/cards/statistics/AnalyticEcommerce';
import EcommerceDataCard from 'helpers/cards/statistics/EcommerceDataCard';
import EcommerceMetrix from 'helpers/cards/statistics/EcommerceMetrix';
import { ArrowUp, MoneyAdd, User, UserAdd, Wallet3 } from 'iconsax-react';
import React from 'react';
import EcommerceDataChart from 'sections/chart/EcommerceDataChart';
import TotalIncome from 'sections/chart/TotalIncome';

function Dashboard() {
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={4}>
        <EcommerceMetrix
          primary="Total Investors"
          secondary="50,000"
          content="20,032 Last Month"
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
      {/* <Grid item xs={12} sm={6} md={4}>
        <AnalyticEcommerce title="Total AUM" count="₹50,00,0000" percentage={27.4} extra="₹50,395" />
      </Grid> */}
      <Grid item xs={12} sm={6} md={4}>
        <EcommerceDataCard
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
        </EcommerceDataCard>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <EcommerceDataCard
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
        </EcommerceDataCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <TotalIncome />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
