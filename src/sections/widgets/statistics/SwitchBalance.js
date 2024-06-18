/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
import Avatar from 'helpers/@extended/Avatar';
import { ArrowSwapHorizontal, Wallet3 } from 'iconsax-react';
import { ThemeMode } from 'config';

const SwitchBalanace = ({ name, value, mainIcon }) => {
  const theme = useTheme();

  return (
    <MainCard
      content={false}
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 1),
        color: 'common.white',
        // position: 'relative'
        '&:after': {
          content: '""',
          background: `linear-gradient(20deg, transparent 25.46%, rgba(0, 0, 0, 0.2) 68.77%, rgba(0, 0, 0, 0.3) 81.72%)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.6
        }
      }}
    >
      {/* position: 'inherit', zIndex: 2 */}
      <Box sx={{ p: '10px', position: 'inherit', zIndex: 2 }}>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}> */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Avatar variant="rounded" sx={{ height: '30px', width: '30px', border: '1px solid #fff' }}>
              {/* <Wallet3 color="#fff" style={{ height: '16px !important', width: '16px !important' }} /> */}
              {mainIcon}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {name}
            </Typography>
          </Stack>
          {/* <Typography sx={{ fontSize: '13px' }}>AUM</Typography> */}
          <Typography variant="body1">{value}</Typography>
        </Stack>
        {/* <Avatar
            variant="rounded"
            type="filled"
            size="lg"
            sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.100' : 'primary.darker' }}
          >
            <ArrowSwapHorizontal />
          </Avatar> */}
        {/* </Stack> */}
      </Box>
    </MainCard>
  );
};

export default SwitchBalanace;
