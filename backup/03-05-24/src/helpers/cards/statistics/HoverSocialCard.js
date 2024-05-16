import PropTypes from 'prop-types';

// material-ui
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

// ===========================|| STATISTICS - HOVER SOCIAL CARD ||=========================== //

const HoverSocialCard = ({ primary, secondary, iconPrimary, color }) => {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary variant="Bold" size={52} /> : null;

  return (
    <Card
      elevation={0}
      sx={{
        background: color,
        position: 'relative',
        color: '#fff',
        '&:hover svg': {
          opacity: 1,
          transform: 'scale(1.1)'
        }
      }}
    >
      <CardContent>
        <Box
          sx={{
            position: 'absolute',
            right: 15,
            top: 25,
            color: '#fff',
            '& svg': {
              opacity: 0.4,
              transition: 'all .3s ease-in-out'
            }
          }}
        >
          {primaryIcon}
        </Box>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h3" color="inherit">
              {secondary}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="inherit">{primary}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

HoverSocialCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  iconPrimary: PropTypes.object,
  color: PropTypes.string
};

export default HoverSocialCard;
