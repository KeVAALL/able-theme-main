/* eslint-disable react/prop-types */
// material-ui
import {
  useMediaQuery,
  Chip,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from '../../organisms/mainCard/MainCard';
import Avatar from '../../../helpers/@extended/Avatar';
import LinearWithLabel from '../../../helpers/@extended/progress/LinearWithLabel';

// assets
import { CallCalling, Gps, Link1, Sms } from 'iconsax-react';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabPortfolio = (props) => {
  return (
    <MainCard contentSX={{ paddingBottom: '24px !important' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* <Stack direction="row" justifyContent="flex-end">
            <Chip label="Pro" size="small" color="primary" />
          </Stack> */}
          <Stack spacing={2.5} alignItems="center">
            <Avatar
              alt="Avatar 1"
              size="xl"
              src={
                props.values.investor.gender === 'Male' || props.values.investor.gender === 'male'
                  ? avatarImage(`./avatar-1.png`)
                  : avatarImage(`./default.png`)
              }
            />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{props.values.investor.investor_name}</Typography>
              {/* <Typography color="secondary">Project Manager</Typography> */}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: '8px !important' }}>
          <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
            <ListItem>
              <ListItemIcon>
                <Sms size={18} />
              </ListItemIcon>
              <ListItemSecondaryAction>
                <Typography align="right">{props.values.investor.email_id}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CallCalling size={18} />
              </ListItemIcon>
              <ListItemSecondaryAction>
                <Typography align="right">(+91) {props.values.investor.mobile_no}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Gps size={18} />
              </ListItemIcon>
              <ListItemSecondaryAction>
                <Typography align="right">{props.values.investor.place_of_birth}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <Link1 size={18} />
              </ListItemIcon>
              <ListItemSecondaryAction>
                <Link align="right" href="https://google.com" target="_blank">
                  https://anshan.dh.url
                </Link>
              </ListItemSecondaryAction>
            </ListItem> */}
          </List>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default TabPortfolio;
