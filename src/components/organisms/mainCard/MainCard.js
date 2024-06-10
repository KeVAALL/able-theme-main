import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, CardHeader, Divider, Typography, Stack, Button } from '@mui/material';
import AnimateButton from '../../../helpers/@extended/AnimateButton';

// project-imports
import Highlighter from 'components/molecules/highlighter/Highlighter';
import useConfig from 'hooks/useConfig';
import { AddCircle } from 'iconsax-react';

// header style
const headerSX = {
  p: 2,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow = true,
      children,
      subheader,
      content = true,
      contentSX = {},
      darkTitle,
      divider = true,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight = false,
      codeString,
      modal = false,
      changeTableVisibility,
      showButton,
      noAddButton,
      setActiveAdding,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const { themeContrast } = useConfig();

    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          position: 'relative',
          border: border ? '1px solid' : 'none',
          borderRadius: 1.5,
          borderColor: theme.palette.divider,
          ...(((themeContrast && boxShadow) || shadow) && {
            boxShadow: shadow ? shadow : theme.customShadows.z1
          }),
          ...(codeHighlight && {
            '& pre': {
              m: 0,
              p: '12px !important',
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.75rem'
            }
          }),
          ...(modal && {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
            '& .MuiCardContent-root': {
              overflowY: 'auto',
              minHeight: 'auto',
              maxHeight: `calc(100vh - 200px)`
            }
          }),
          ...sx
        }}
      >
        {/* card header and action */}
        {/* {!darkTitle && title && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <CardHeader
              sx={headerSX}
              titleTypographyProps={{ variant: 'subtitle1' }}
              title={title}
              action={secondary}
              subheader={subheader}
            />
            <Box sx={{ px: 2.5 }}>
              <AnimateButton>
                <Button variant="contained" type="button" onClick={changeTableVisibility}>
                  Add
                </Button>
              </AnimateButton>
            </Box>
          </Stack>
        )} */}
        {(showButton || title) && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <CardHeader
              sx={headerSX}
              titleTypographyProps={{ variant: 'subtitle1' }}
              title={title}
              action={secondary}
              subheader={subheader}
            />
            {!noAddButton && (
              <Box sx={{ p: 2 }}>
                <AnimateButton>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddCircle />}
                    type="button"
                    sx={{ borderRadius: 0.6 }}
                    onClick={() => {
                      setActiveAdding();
                      changeTableVisibility();
                    }}
                  >
                    Add
                  </Button>
                </AnimateButton>
              </Box>
            )}
          </Stack>
        )}

        {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}

        {/* content & header divider */}
        {/* {divider ? <Divider /> : <></>} */}
        {title && divider && <Divider />}

        {/* card content */}
        {content && <CardContent sx={contentSX}>{children}</CardContent>}
        {!content && children}

        {/* card footer - clipboard & highlighter  */}
        {codeString && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Highlighter codeString={codeString} codeHighlight={codeHighlight} />
          </>
        )}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  subheader: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  divider: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  changeTableVisibility: PropTypes.func,
  showButton: PropTypes.bool,
  noAddButton: PropTypes.bool,
  modal: PropTypes.bool,
  codeHighlight: PropTypes.bool,
  codeString: PropTypes.string
};

export default MainCard;
