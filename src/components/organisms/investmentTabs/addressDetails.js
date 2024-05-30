/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Checkbox, Grid, Typography, Box, Button, Divider, useMediaQuery } from '@mui/material';
import { NestedCustomTextField } from 'utils/textfield';
import { UpdateAddressDetails } from 'hooks/transaction/investment';

const AddressDetails = (props) => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <Box id="__permanent _address" style={{ marginBottom: '12px' }}>
        <Typography sx={{ color: '#21B546', marginBottom: '12px', display: 'block' }} variant="p">
          Permanent Address
        </Typography>

        <Grid container spacing={3}>
          <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
            <NestedCustomTextField
              label="Address Line 1"
              valueName="investor_address.address_line_1"
              placeholder="Please enter your Address Line 1"
              values={props.values.investor_address.address_line_1}
              type="string"
              handleChange={props.handleChange}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
            />
          </Grid>
          <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
            <NestedCustomTextField
              label="Address Line 2"
              valueName="investor_address.address_line_2"
              placeholder="Please enter your Address Line 2"
              values={props.values.investor_address.address_line_2}
              type="string"
              handleChange={props.handleChange}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
            />
          </Grid>

          <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NestedCustomTextField
              label="Pincode"
              valueName="investor_address.pincode"
              placeholder="Please enter your Pin Code"
              values={props.values.investor_address.pincode}
              type="string"
              handleChange={props.handleChange}
              handleBlur={props.handleBlur}
              touched={props.touched}
              errors={props.errors}
            />
          </Grid>

          <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NestedCustomTextField
              label="City"
              valueName="investor_address.city"
              placeholder="Please enter your City"
              values={props.values.investor_address.city}
              type="string"
              handleChange={props.handleChange}
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

      {!props.values.is_permanent_address_correspondent && (
        <Box id="__permanent _address" style={{ marginTop: '12px', marginBottom: '12px' }}>
          <Typography sx={{ color: '#21B546', marginBottom: '12px', display: 'block' }} variant="p">
            Correspondent Address
          </Typography>

          <Grid container spacing={3}>
            <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
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
              />
            </Grid>
            <Grid item sm={6} xs={12} style={{ display: 'grid', gap: '8px' }}>
              <NestedCustomTextField
                label="Address Line 2"
                valueName="correspondent_address.address_line_2"
                placeholder="Please enter your Address Line 2"
                values={props.values.correspondent_address.address_line_2}
                type="string"
                handleChange={props.handleChange}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
              />
            </Grid>

            <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <NestedCustomTextField
                label="Pincode"
                valueName="correspondent_address.pincode"
                placeholder="Please enter your Pin Code"
                values={props.values.correspondent_address.pincode}
                type="string"
                handleChange={props.handleChange}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
              />
            </Grid>

            <Grid item sm={6} xs={12} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <NestedCustomTextField
                label="City"
                valueName="correspondent_address.city"
                placeholder="Please enter your City"
                values={props.values.correspondent_address.city}
                type="string"
                handleChange={props.handleChange}
                handleBlur={props.handleBlur}
                touched={props.touched}
                errors={props.errors}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {!matchDownSM && (
          <>
            <Grid item md={4} sm={3} xs={0}></Grid>
            <Grid item md={4} sm={3} xs={0}></Grid>
          </>
        )}
        <Grid item md={2} sm={3} xs={6}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 0.6 }}
            // startIcon={<TimerStart />}
            onClick={async () => {
              props.handleTabChange(event, props.tabValue - 1);
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid item md={2} sm={3} xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ borderRadius: 0.6 }}
            onClick={async () => {
              console.log(props.values.investor_address);
              const payload = {
                fd_investment_id: props.fdInvestmentID,
                investor_id: props.investorID,
                permanent_address: props.values.investor_address,
                correspondent_address: props.values.correspondent_address,
                is_permanent_address_correspondent: props.values.is_permanent_address_correspondent
              };
              const response = await UpdateAddressDetails(payload);

              if (!response) {
                props.handleTabChange(event, props.tabValue + 1);
              }
            }}
          >
            Proceed
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(AddressDetails);
