/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Tab, Tabs, Divider } from '@mui/material';

// project-imports
import MainCard from 'components/molecules/mainCard';

// assets
import { Briefcase, LocationTick, UserOctagon, Personalcard, ProfileTick, UserSquare, Bank } from 'iconsax-react';
import PersonalInfo from './personalInfo';
import AddressDetails from './addressDetails';
import ProfessionalDetails from './professionalDetails';
import Nomination from './nomination';
import Declaration from './declaration';

// css
import './index.css';
import { enqueueSnackbar } from 'notistack';
import Portfolio from './portfolio';
import BankDetails from './bankDetails';
import { height } from '@mui/system';

// ==============================|| TAB PANEL ||============================== //

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| TABS - ICON ||============================== //

export default function IconTabs(props) {
  const [tabValue, setTabValue] = useState(0);
  const [addressErrorShown, setAddressErrorShown] = useState(false);
  const [professionalErrorShown, setProfessionalErrorShown] = useState(false);
  const [nomineeErrorShown, setNomineeErrorShown] = useState(false);

  const validateCurrentTab = () => {
    const { errors, dirty, setAddressDetailsError, setProfessionalDetailsError, setNomineeError, isEditing } = props;
    switch (isEditing ? tabValue : tabValue + 1) {
      case 0:
        return true;
      case 1:
        return true;
      case 2:
        return true;
      case 3: {
        if (
          errors.investor_address ||
          (!isEditing && !dirty.valueOf('investor_address')) ||
          errors.correspondent_address ||
          (!isEditing && !dirty.valueOf('correspondent_address'))
        ) {
          console.log(addressErrorShown);
          if (!addressErrorShown) {
            console.log('Set Error false');
            enqueueSnackbar('Please fill Address Details', {
              variant: 'error',
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            });
            setAddressErrorShown(true);
          }
          setAddressDetailsError(true);
        } else {
          console.log('Set Error false');
          setAddressDetailsError(false);
          setAddressErrorShown(false);
        }

        return true;
      }

      case 4: {
        if (errors.professional_details) {
          if (!professionalErrorShown) {
            enqueueSnackbar('Please fill Professional Details', {
              variant: 'error',
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            });
            setProfessionalErrorShown(true);
          }
          setProfessionalDetailsError(true);
        } else {
          setProfessionalDetailsError(false);
          setProfessionalErrorShown(false);
        }

        return true;
      }
      case 5: {
        if (errors.nominee || (!isEditing && !dirty.valueOf('nominee'))) {
          if (!nomineeErrorShown) {
            enqueueSnackbar('Please fill Nominee Details', {
              variant: 'error',
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              }
            });
            setNomineeErrorShown(true);
          }
          setNomineeError(true);
        } else {
          setNomineeError(false);
          setNomineeErrorShown(false);
        }

        return true;
      }
      default:
        return true;
    }
  };

  const getTabClass = () => {
    const { addressDetailsError, professionalDetailsError, nomineeError, isEditing } = props;
    switch (isEditing ? tabValue : tabValue + 1) {
      case 0:
        return 'indicator_secondary';
      case 1:
        return 'indicator_secondary';
      case 2:
        return 'indicator_secondary';
      case 3:
        return addressDetailsError ? 'indicator_main' : 'indicator_secondary';
      case 4:
        return professionalDetailsError ? 'indicator_main' : 'indicator_secondary';
      case 5:
        return nomineeError ? 'indicator_main' : 'indicator_secondary';
      default:
        return 'indicator_secondary';
    }
  };

  const handleChange = (event, newValue) => {
    if (validateCurrentTab()) {
      setTabValue(newValue);
    } else {
      console.log('Please fix the errors before proceeding');
    }
  };

  const tabStyle = { borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 1.5, overflow: 'visible' };

  return (
    <Box sx={{ width: '100%' }}>
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          className={`tab_main ${getTabClass()}`}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={tabValue}
          onChange={handleChange}
          aria-label="scrollable force tabs example"
        >
          {/* <CustomTooltip title="Add" arrow color="#fff" bg="pink"> */}
          {props.isEditing && (
            <Tab
              // className='tab_0'
              label="Portfolio"
              icon={<UserSquare />}
              iconPosition="start"
              {...a11yProps(0)}
            />
          )}
          <Tab
            className={props.personalInfoError ? 'tab_1' : ''}
            label="Personal Info"
            icon={<Personalcard />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            // className='tab_2'
            label="Bank Details"
            icon={<Bank />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          <Tab
            className={props.addressDetailsError ? 'tab_3' : ''}
            label="Address Details"
            icon={<LocationTick />}
            iconPosition="start"
            {...a11yProps(3)}
          />
          <Tab
            className={props.professionalDetailsError ? 'tab_4' : ''}
            label="Professional Details"
            icon={<Briefcase />}
            iconPosition="start"
            {...a11yProps(4)}
          />
          <Tab
            className={props.nomineeError ? 'tab_5' : ''}
            label="Nominee Details"
            icon={<UserOctagon />}
            iconPosition="start"
            {...a11yProps(5)}
          />
          {/* <Tab className="tab_5" label="Declaration" icon={<ProfileTick />} iconPosition="start" {...a11yProps(4)} /> */}
        </Tabs>
      </Box>
      {props.isEditing && (
        <TabPanel className="panel" value={tabValue} index={0}>
          <MainCard sx={tabStyle} contentSX={{ height: '500px', overflow: 'scroll' }}>
            <Portfolio
              values={props.values}
              setFieldValue={props.setFieldValue}
              handleChange={props.handleChange}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
            />
          </MainCard>
        </TabPanel>
      )}
      <TabPanel className="panel" value={tabValue} index={props.isEditing ? 1 : 0}>
        <MainCard sx={tabStyle}>
          <PersonalInfo
            isEditing={props.isEditing}
            values={props.values}
            selectedGender={props.selectedGender}
            setSelectedGender={props.setSelectedGender}
            setFieldValue={props.setFieldValue}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={props.isEditing ? 2 : 1}>
        <MainCard sx={tabStyle}>
          <BankDetails
            values={props.values}
            validationSchema={props.validationSchema}
            handleChange={props.handleChange}
            setFieldValue={props.setFieldValue}
            setEditing={props.setEditing}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            isValid={props.isValid}
            dirty={props.dirty}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className={`panel`} value={tabValue} index={props.isEditing ? 3 : 2}>
        <MainCard sx={tabStyle}>
          <AddressDetails
            isEditing={props.isEditing}
            values={props.values}
            handleChange={props.handleChange}
            setFieldValue={props.setFieldValue}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={props.isEditing ? 4 : 3}>
        <MainCard sx={tabStyle}>
          <ProfessionalDetails values={props.values} setFieldValue={props.setFieldValue} />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={props.isEditing ? 5 : 4}>
        <MainCard sx={tabStyle}>
          <Nomination
            values={props.values}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            setFieldValue={props.setFieldValue}
            nomineeData={props.nomineeData}
            handleNewNominee={props.handleNewNominee}
          />
        </MainCard>
      </TabPanel>
      {/* <TabPanel className="panel" value={tabValue} index={4}>
        <MainCard sx={tabStyle}>
          <Declaration selectedDeclaration={props.selectedDeclaration} handleDeclarationClick={props.handleDeclarationClick} />
        </MainCard>
      </TabPanel> */}
    </Box>
  );
}
