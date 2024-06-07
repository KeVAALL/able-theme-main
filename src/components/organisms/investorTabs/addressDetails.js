/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Checkbox, Grid, Typography, Box } from '@mui/material';
import { NestedCustomTextField } from 'utils/textfield';

const AddressDetails = (props) => {
  return (
    <>
      <Box id="__permanent _address" style={{ marginBottom: '12px' }}>
        <Typography sx={{ color: '#21B546', marginBottom: '12px', display: 'block' }} variant="p">
          Permanent Address
        </Typography>

        <Grid container spacing={3}>
          <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
            <NestedCustomTextField
              disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
              label="Address Line 1"
              valueName="investor_address.address_line_1"
              placeholder="Please enter your Address Line 1"
              values={props.values.investor_address.address_line_1}
              type="string"
              handleChange={props.handleChange}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
            <NestedCustomTextField
              disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
              label="Address Line 2"
              valueName="investor_address.address_line_2"
              placeholder="Please enter your Address Line 2"
              values={props.values.investor_address.address_line_2}
              type="string"
              handleChange={props.handleChange}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>

          <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NestedCustomTextField
              disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
              label="Pincode"
              valueName="investor_address.pincode"
              placeholder="Please enter your Pin Code"
              values={props.values.investor_address.pincode}
              type="string"
              regType="number"
              setFieldValue={props.setFieldValue}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
            />
          </Grid>

          <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NestedCustomTextField
              disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
              label="City"
              valueName="investor_address.city"
              placeholder="Please enter your City"
              values={props.values.investor_address.city}
              type="string"
              regType="string"
              setFieldValue={props.setFieldValue}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
            />
          </Grid>
        </Grid>
      </Box>
      <Box id="__checkbox" style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
        <Checkbox
          checked={props.values.is_permanent_address_correspondent}
          onChange={async (e) => {
            const newValue = e.target.checked ? 1 : 0;
            await props.setFieldValue('is_permanent_address_correspondent', newValue);
          }}
          name="is_permanent_address_correspondent"
          id="is_permanent_address_correspondent"
        />
        <Typography sx={{ color: '#5E718D', marginBottom: '20px' }} variant="p">
          Correspondent Address is same as Permanent Address
        </Typography>
      </Box>

      {/* {!props.values.investor.is_permanent_address_correspond && ( */}
      {!props.values.is_permanent_address_correspondent && (
        <Box id="__permanent _address" style={{ marginTop: '12px', marginBottom: '12px' }}>
          <Typography sx={{ color: '#21B546', marginBottom: '12px', display: 'block' }} variant="p">
            Correspondent Address
          </Typography>

          <Grid container spacing={3}>
            <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
              disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
              <NestedCustomTextField
                label="Address Line 1"
                valueName="correspondent_address.address_line_1"
                placeholder="Please enter your Address Line 1"
                values={props.values.correspondent_address.address_line_1}
                type="string"
                handleChange={props.handleChange}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
              <NestedCustomTextField
                disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
                label="Address Line 2"
                valueName="correspondent_address.address_line_2"
                placeholder="Please enter your Address Line 2"
                values={props.values.correspondent_address.address_line_2}
                type="string"
                handleChange={props.handleChange}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>

            <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <NestedCustomTextField
                disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
                label="Pincode"
                valueName="correspondent_address.pincode"
                placeholder="Please enter your Pin Code"
                values={props.values.correspondent_address.pincode}
                type="string"
                regType="number"
                setFieldValue={props.setFieldValue}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
              />
            </Grid>

            <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <NestedCustomTextField
                disabled={props.values.investor.is_ckyc_verified || props.values.investor.is_digilocker_verified}
                label="City"
                valueName="correspondent_address.city"
                placeholder="Please enter your City"
                values={props.values.correspondent_address.city}
                type="string"
                regType="string"
                setFieldValue={props.setFieldValue}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default memo(AddressDetails);
