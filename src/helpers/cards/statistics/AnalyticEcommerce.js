import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from '../../../components/organisms/mainCard/MainCard';

// assets
import { ArrowRight, ArrowUp, Money } from 'iconsax-react';
import Avatar from 'helpers/@extended/Avatar';
import { border } from '@mui/system';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({ color = 'primary', icon, title, count, percentage, isLoss, extra }) => (
  <MainCard contentSX={{ padding: '0px !important' }}>
    <MainCard sx={{ border: 'none' }} contentSX={{ p: 2.25 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="rounded" type="filled" sx={{ border: '1px solid #068e44', backgroundColor: '#E0F5EA80' }}>
          {icon}
        </Avatar>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Grid container alignItems="center">
            <Grid item>
              <Typography variant="h4" color="inherit">
                {count}
              </Typography>
            </Grid>
            {percentage && (
              <Grid item>
                <Chip
                  variant="combined"
                  color={color}
                  icon={
                    <>
                      {!isLoss && <ArrowUp style={{ transform: 'rotate(45deg)' }} />}
                      {isLoss && <ArrowRight style={{ transform: 'rotate(45deg)' }} />}
                    </>
                  }
                  label={`${percentage}%`}
                  sx={{ ml: 1.25, pl: 1, borderRadius: 1 }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
      </Stack>
    </MainCard>
    {extra && (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2.2, py: 1.1, backgroundColor: '#E8FFED' }}>
        <Typography variant="body2" color="textSecondary">
          💰 You made an extra{' '}
          <Typography component="span" variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
            {extra}
          </Typography>{' '}
          this year
        </Typography>
      </Box>
    )}
  </MainCard>
);

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  color: PropTypes.string,
  extra: PropTypes.string
};

export default AnalyticEcommerce;
