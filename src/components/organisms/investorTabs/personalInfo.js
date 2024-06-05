/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Grid, InputAdornment, Typography } from '@mui/material';

// project-imports
import { CustomAutoComplete, CustomTextField, FormikAutoComplete, NestedCustomTextField } from 'utils/textfield';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { residency, marital_status, investorType, genderData } from 'constant/investorValidation';

// third-party
import enGB from 'date-fns/locale/en-GB';
import IconButton from 'helpers/@extended/IconButton';
import { VerifyPAN } from 'hooks/investor/investor';
import { TickCircle } from 'iconsax-react';

const PersonalInfo = (props) => {
  return (
    <>
      <Grid container spacing={2.5} id="grid_box" sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} md={4}>
          <NestedCustomTextField
            label="Pan Number"
            valueName="investor.pan_no"
            placeholder="Please enter your PAN Number"
            values={props.values.investor.pan_no}
            type="string"
            regType="pan"
            setFieldValue={props.setFieldValue}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
            inputProps={{ maxLength: 10 }}
            InputProps={{
              endAdornment: !props.values.investor.is_digilocker_verified ? (
                <InputAdornment position="end">
                  <IconButton
                    className="personal_info_icon_button"
                    aria-label="toggle password visibility"
                    onClick={async (e) => {
                      const testObject = {
                        pan_no: props.values.investor.pan_no,
                        investor_id: props.values.investor.investor_id
                      };
                      localStorage.setItem('tempVar', JSON.stringify(testObject));
                      try {
                        const payload = {
                          pan_no: props.values.investor.pan_no,
                          investor_id: props.values.investor.investor_id,
                          redirection_url: 'https://able-theme-main.vercel.app/investor'
                        };

                        const response = await VerifyPAN(payload);
                        console.log(response);

                        window.location.href = response.details.data.authorizationUrl;
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    edge="end"
                    color="secondary"
                  >
                    <Typography variant="caption" fontWeight={500}>
                      VERIFY
                    </Typography>
                  </IconButton>
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <TickCircle color="#068e44" />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <NestedCustomTextField
            label="Email ID"
            valueName="investor.email_id"
            placeholder="Please enter your Email ID"
            values={props.values.investor.email_id}
            type="email"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormikAutoComplete
            options={investorType}
            defaultValue={props.values.investor.is_senior_citizen}
            setFieldValue={props.setFieldValue}
            formName="investor.is_senior_citizen"
            optionName="investor"
            label="Investor Type"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Using Normal Autocomplete because of API body */}
          <CustomAutoComplete
            options={genderData}
            defaultValue={props.selectedGender}
            setSelected={props.setSelectedGender}
            optionName="gender"
            label="Gender"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormikAutoComplete
            options={marital_status}
            defaultValue={props.values.investor.is_married}
            setFieldValue={props.setFieldValue}
            formName="investor.is_married"
            optionName="status"
            label="Marital Status"
          />
        </Grid>

        <Grid
          id="__place_of_birth"
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <DesktopDatePicker
              className="calendar_main"
              label="Date of Birth"
              inputFormat="dd/MM/yyyy"
              value={props.values?.investor.birth_date && new Date(props.values?.investor.birth_date)}
              onChange={(newValue) => {
                console.log(newValue);
                props.setFieldValue('investor.birth_date', newValue);
              }}
              renderInput={(params) => <CustomTextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item md={4} sm={6} xs={12}>
          <NestedCustomTextField
            label="Place of birth"
            valueName="investor.place_of_birth"
            placeholder="Please enter your Place of Birth"
            values={props.values.investor.place_of_birth}
            type="string"
            regType="string"
            setFieldValue={props.setFieldValue}
            handleBlur={props.handleBlur}
            touched={props.touched}
            errors={props.errors}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormikAutoComplete
            options={residency}
            defaultValue={props.values.investor.is_indian_resident}
            setFieldValue={props.setFieldValue}
            formName="investor.is_indian_resident"
            optionName="status"
            label="Resident Status"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(PersonalInfo);

// const handleClick = (value) => {
//   switch (value) {
//     case 'Resident':
//       setSelected({ ...selected, isIndian: true });
//       break;
//     case '!Resident':
//       setSelected({ ...selected, isIndian: false });
//       break;
//     case 'Married':
//       setSelected({ ...selected, inMarried: true });
//       break;
//     default:
//       setSelected({ ...selected, inMarried: false });
//       break;
//   }
// };
// const [selected, setSelected] = useState({
//   isIndian: true,
//   inMarried: true,
//   placeOfBirth: ''
// });
{
  /* <Grid item xs={6} sm={6} md={6} lg={6}>
              <Chip
                label="Indian Resident"
                color="success"
                variant={!selected?.isIndian ? 'outlined' : ''}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleClick('Resident')}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <Chip
                label="Non-Indian Resident (NRI)"
                color="success"
                variant={selected?.isIndian ? 'outlined' : ''}
                style={{ cursor: 'pointer', borderRadius: '6px', width: '100%', paddingBlock: '18px', fontSize: '12px' }}
                onClick={(e) => handleClick('!Resident')}
              />
            </Grid> */
}
{
  /* <Stack id="__checkbox" gap={1} sx={{ mt: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Checkbox
          checked={personalTermCondition}
          onChange={(e) => setPersonalTermCondition(e.target.checked)}
          inputProps={{ 'aria-label': 'Same address' }}
        />

        <Typography sx={{ color: '#5E718D' }}>
          I hereby authorize Utkarsh Small Finance Bank Ltd to fetch my documents from UIDAI to setup my fixed deposit account.
        </Typography>
      </Stack> */
}
