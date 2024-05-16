/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Tab, Tabs, Divider } from '@mui/material';

// project-imports
import MainCard from 'components/molecules/mainCard';

// assets
import { Briefcase, LocationTick, UserOctagon, Personalcard, ProfileTick } from 'iconsax-react';
import PersonalInfo from './personalInfo';
import AddressDetails from './addressDetails';
import ProfessionalDetails from './professionalDetails';
import Nomination from './nomination';
import Declaration from './declaration';

// css
import './index.css';

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

export default function InvestmentTabs(props) {
  console.log(props.values);
  const [tabValue, setTabValue] = useState(0);

  // const handleTabChange = (event, newValue) => {
  const handleTabChange = (event, newValue) => {
    console.log(newValue);
    setTabValue(newValue);
  };

  // useEffect(() => {
  //   console.log(props.errors);
  //   props.handleTabError(props.errors);
  // }, [props.errors]);
  useEffect(() => {
    console.log(props.dynamicDeclaration);
  }, []);

  const tabStyle = { borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 1.5, overflow: 'visible' };
  const contentSX = { paddingTop: 4 };

  return (
    <Box sx={{ width: '100%' }}>
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          // className={`tab_main ${props.errorObject?.addressDetailsError || props.errorObject?.personalInfoError ? 'indicator_main' : ''}`}
          className={`tab_main`}
          // orientation="vertical"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={tabValue}
          onChange={handleTabChange}
          aria-label="scrollable force tabs example"
        >
          <Tab
            // className={props.errorObject.personalInfoError ? 'tab_1' : ''}
            label="Personal Info"
            icon={<Personalcard />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          {/* <CustomTooltip title="Add" arrow color="#fff" bg="pink"> */}
          <Tab
            // className={props.errorObject.addressDetailsError ? 'tab_2' : ''}
            label="Address Details"
            icon={<LocationTick />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab className="tab_3" label="Professional Details" icon={<Briefcase />} iconPosition="start" {...a11yProps(2)} />
          <Tab className="tab_4" label="Add Nomination" icon={<UserOctagon />} iconPosition="start" {...a11yProps(3)} />
          <Tab className="tab_5" label="Declaration" icon={<ProfileTick />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel className="panel" value={tabValue} index={0}>
        <MainCard sx={tabStyle} contentSX={contentSX}>
          <PersonalInfo
            values={props.values}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            setFieldValue={props.setFieldValue}
            touched={props.touched}
            errors={props.errors}
            investorID={props.investorID}
            fdInvestmentID={props.fdInvestmentID}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className={`panel`} value={tabValue} index={1}>
        <MainCard sx={tabStyle} contentSX={contentSX}>
          <AddressDetails
            values={props.values}
            handleChange={props.handleChange}
            setFieldValue={props.setFieldValue}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            investorID={props.investorID}
            fdInvestmentID={props.fdInvestmentID}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={2}>
        <MainCard sx={tabStyle} contentSX={contentSX}>
          <ProfessionalDetails
            values={props.values}
            setFieldValue={props.setFieldValue}
            investorID={props.investorID}
            fdInvestmentID={props.fdInvestmentID}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={3}>
        <MainCard sx={tabStyle} contentSX={contentSX}>
          <Nomination
            values={props.values}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            nomineeData={props.nomineeData}
            handleNewNominee={props.handleNewNominee}
            investorID={props.investorID}
            fdInvestmentID={props.fdInvestmentID}
            setInvestorEditing={props.setInvestorEditing}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={4}>
        <MainCard sx={tabStyle} contentSX={contentSX}>
          <Declaration
            selectedDeclaration={props.selectedDeclaration}
            handleDeclarationClick={props.handleDeclarationClick}
            dynamicDeclaration={props.dynamicDeclaration}
            handleDynamicDeclaration={props.handleDynamicDeclaration}
            fdInvestmentID={props.fdInvestmentID}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
        </MainCard>
      </TabPanel>
    </Box>
  );
}
