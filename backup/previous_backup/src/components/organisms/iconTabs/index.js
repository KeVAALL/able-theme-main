/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Tab, Tabs, Divider } from '@mui/material';

// project-imports
import MainCard from 'components/molecules/mainCard';

// assets
import { Briefcase, LocationTick, UserOctagon, Personalcard, ProfileTick } from 'iconsax-react';
import CustomTooltip from 'helpers/@extended/Tooltip';
import PersonalInfo from '../personalInfo';
import AddressDetails from '../addressDetails';
import ProfessionalDetails from '../professionalDetails';
import Nomination from '../nomination';
import Declaration from '../declaration';

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

export default function IconTabs(props) {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    console.log(props.errors);
    //   props.handleTabError(props.errors);
  }, [props.errors]);

  const tabStyle = { borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 1.5, overflow: 'visible' };

  return (
    <Box sx={{ width: '100%' }}>
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          // className={`tab_main ${props.errorObject?.addressDetailsError ? 'indicator_main' : ''}`}
          className={`tab_main`}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          value={tabValue}
          onChange={handleChange}
          aria-label="scrollable force tabs example"
        >
          <Tab className="tab_1" label="Personal Info" icon={<Personalcard />} iconPosition="start" {...a11yProps(0)} />
          {/* <CustomTooltip title="Add" arrow color="#fff" bg="pink"> */}
          <Tab
            className={props.errorObject.addressDetailsError ? 'tab_2' : ''}
            label="Address Details"
            icon={<LocationTick />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          {/* </CustomTooltip> */}
          <Tab className="tab_3" label="Professional Details" icon={<Briefcase />} iconPosition="start" {...a11yProps(2)} />
          <Tab className="tab_4" label="Add Nomination" icon={<UserOctagon />} iconPosition="start" {...a11yProps(3)} />
          <Tab className="tab_5" label="Declaration" icon={<ProfileTick />} iconPosition="start" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel className="panel" value={tabValue} index={0}>
        <MainCard sx={tabStyle}>
          <PersonalInfo
            values={props.values}
            setFieldValue={props.setFieldValue}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            selectedResidenceID={props.selectedResidenceID}
            setSelectedResidenceID={props.setSelectedResidenceID}
            selectedMarital={props.selectedMarital}
            setSelectedMarital={props.setSelectedMarital}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={1}>
        <MainCard sx={tabStyle}>
          <AddressDetails
            sameAddress={props.sameAddress}
            handleCheckboxChange={props.handleCheckboxChange}
            setFieldValue={props.setFieldValue}
            values={props.values}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={2}>
        <MainCard sx={tabStyle}>
          <ProfessionalDetails
            values={props.values}
            setFieldValue={props.setFieldValue}
            selectedOccupation={props.selectedOccupation}
            setSelectedOccupation={props.setSelectedOccupation}
            selectedAnnualIncome={props.selectedAnnualIncome}
            setSelectedAnnualIncome={props.setSelectedAnnualIncome}
            selectedIncomeSource={props.selectedIncomeSource}
            setSelectedIncomeSource={props.setSelectedIncomeSource}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={3}>
        <MainCard sx={tabStyle}>
          <Nomination
            values={props.values}
            handleChange={props.handleChange}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            selectedRelation={props.selectedRelation}
            setSelectedRelation={props.setSelectedRelation}
            nomineeData={props.nomineeData}
            handleNewNominee={props.handleNewNominee}
          />
        </MainCard>
      </TabPanel>
      <TabPanel className="panel" value={tabValue} index={4}>
        <MainCard sx={tabStyle}>
          <Declaration selectedDeclaration={props.selectedDeclaration} handleDeclarationClick={props.handleDeclarationClick} />
        </MainCard>
      </TabPanel>
    </Box>
  );
}

// <MainCard codeString={iconTabCodeString} id="__main_card" sx={{ borderRadius: '0' }}>
// </MainCard>
// const iconTabCodeString = `// IconTabs.tsx
// <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//   <Tab label="Profile" icon={<Profile />} iconPosition="start" {...a11yProps(0)} />
//   <Tab label="Followers" icon={<Book />} iconPosition="start" {...a11yProps(1)} />
//   <Tab label="Friends" icon={<Profile2User />} iconPosition="start" {...a11yProps(2)} />
//   <Tab label="Gallery" icon={<Image />} iconPosition="start" {...a11yProps(3)} />
// </Tabs>
// <TabPanel value={value} index={0}>
//   <Typography variant="h6">
//     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non libero dignissim, viverra augue eu, semper ligula. Mauris
//     purus sem, sagittis eu mauris et, viverra lobortis urna.
//   </Typography>
// </TabPanel>
// <TabPanel value={value} index={1}>
//   <Typography variant="h6">
//     Suspendisse sed lectus ac nunc rhoncus scelerisque. Integer vitae fringilla leo. Aliquam tincidunt et turpis non mattis. Ut sed
//     semper orci, sed facilisis mauris. Suspendisse blandit velit sit amet velit porta aliquet.
//   </Typography>
// </TabPanel>
// <TabPanel value={value} index={2}>
//   <Typography variant="h6">
//     Nam egestas sollicitudin nisl, sit amet aliquam risus pharetra ac. Donec ac lacinia orci. Phasellus ut enim eu ligula placerat
//     cursus in nec est.
//   </Typography>
// </TabPanel>
// <TabPanel value={value} index={3}>
//   <Typography variant="h6">
//     Suspendisse sed lectus ac nunc rhoncus scelerisque. Integer vitae fringilla leo. Aliquam tincidunt et turpis non mattis. Ut sed
//     semper orci, sed facilisis mauris. Suspendisse blandit velit sit amet velit porta aliquet.
//   </Typography>
// </TabPanel>`;
