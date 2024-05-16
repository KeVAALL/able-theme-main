/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Autocomplete, Checkbox, FormControlLabel, TextField, Box, Typography } from '@mui/material';
import { getIn, FastField } from 'formik';
import React, { memo } from 'react';
import './custom.css';

export const dateFormatter = (date) => {
  // console.log(typeof date);
  console.log(date);
  // // Extract year, month, and day
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  // const day = String(date.getDate()).padStart(2, '0');

  // // Construct the date string in YYYY-MM-DD format
  // const formattedDate = `${year}-${month}-${day}`;

  // return formattedDate; // Output: "2024-04-02"
  const datePart = date.split(' ').slice(0, 4).join(' ');

  // Create a new Date object
  const dateIs = new Date(datePart);

  console.log(dateIs.toISOString().slice(0, 10));
};

export const NestedCustomTextField = memo(
  ({ label, valueName, handleChange, handleBlur, values, type, multiline, autocomplete, touched, errors, ...props }) => {
    return (
      <TextField
        fullWidth
        className="common-textfield"
        size="small"
        label={label}
        name={valueName}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values}
        type={type}
        multiline={multiline ? true : false}
        autoComplete={!autocomplete ? 'off' : 'on'}
        error={Boolean(getIn(touched, valueName) && getIn(errors, valueName))}
        helperText={getIn(touched, valueName) && getIn(errors, valueName)}
        FormHelperTextProps={{
          style: {
            marginLeft: 0
          }
        }}
        // placeholder={Boolean(getIn(touched, valueName) && getIn(errors, valueName))}
        {...props}
      />
    );
  }
);

export const CustomTextField = memo((props) => {
  // console.log(props);
  const strings = /^[a-zA-Z][a-zA-Z\s]*$/;
  const specials = /^[a-zA-Z0-9.]*$/;
  const numbers = /^\d+$/;
  return (
    <Box>
      <TextField
        fullWidth
        className="common-textfield"
        size="small"
        label={props.label}
        name={props.name}
        // onChange={props.handleChange}
        onChange={(e) => {
          e.preventDefault();
          const { value } = e.target;
          const regex = props.regType === 'string' ? strings : props.regType === 'noSpecial' ? specials : numbers;
          if (!value || regex.test(value.toString())) {
            props.setFieldValue(props.name, value);
          }
        }}
        onBlur={props.handleBlur}
        value={props.values[props.name]}
        type={props.type}
        multiline={props.multiline ? true : false}
        autoComplete={!props.autocomplete ? 'off' : 'on'}
        error={props.touched[props.name] && Boolean(props.errors[props.name])}
        placeholder={props.touched[props.name] && props.errors[props.name]}
        helperText={props.touched[props.name] && props.errors[props.name]}
        FormHelperTextProps={{
          style: {
            marginLeft: 0
          }
        }}
        endAdornment={props.endAdornment && props.endAdornment}
        {...props}
      />
      {/* {props.errors[props.name] && props.touched[props.name] && <Typography className="error">{props.errors[props.name]}</Typography>} */}
    </Box>
  );
});

export const CustomAutoComplete = memo((props) => {
  console.log(props.defaultValue);
  const handleOptionChange = (event, optionName, setSelected) => {
    props.options.forEach((el) => {
      if (el[optionName] === event.target.outerText) {
        setSelected(el.id);
      }
    });
  };

  return (
    <Autocomplete
      fullWidth
      disablePortal
      className="common-autocomplete"
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: 'flip',
              enabled: false
            },
            {
              name: 'preventOverflow',
              enabled: false
            }
          ]
        }
      }}
      id="basic-autocomplete-label"
      options={props.options}
      defaultValue={(props.defaultValue && props.options.find((el) => el[props.optionName] === props.defaultValue)) || props.options[0]}
      onChange={(e) => handleOptionChange(e, props.optionName, props.setSelected)}
      // getOptionSelected
      getOptionLabel={(option) => option[props.optionName]} // Assuming 'product_type' is the label you want to display
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
});

export const FormikAutoComplete = memo((props) => {
  const setFieldValue = props.setFieldValue;

  const handleOptionChange = (event, optionName, formName, setFieldValue, idName) => {
    props.options.forEach(async (el) => {
      if (el[optionName] === event.target.outerText) {
        if (idName) {
          await setFieldValue(formName, el[idName]);
        } else {
          await setFieldValue(formName, el.id);
        }
      }
    });
  };

  return (
    <Autocomplete
      fullWidth
      disablePortal
      className="common-autocomplete"
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: 'flip',
              enabled: false
            },
            {
              name: 'preventOverflow',
              enabled: false
            }
          ]
        }
      }}
      id="basic-autocomplete-label"
      options={props.options}
      // defaultValue={(props.defaultValue && props.options.find((el) => el[props.optionName] === props.defaultValue)) || props.options[0]}
      defaultValue={
        (typeof props.defaultValue === 'string' &&
          props.options.find((el) => {
            return el[props.optionName] === props.defaultValue;
          })) ||
        (typeof props.defaultValue === 'number' &&
          props.options.find((el) => {
            if (props.idName) {
              return el[props.idName] === props.defaultValue;
            } else {
              return el.id === props.defaultValue;
            }
          }))
      }
      onChange={(e) => handleOptionChange(e, props.optionName, props.formName, setFieldValue, props.idName)}
      getOptionLabel={(option) => option[props.optionName]} // Assuming 'product_type' is the label you want to display
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
});

FormikAutoComplete.propTypes = {
  idName: PropTypes.any
};

export const CustomCheckbox = (props) => {
  return (
    <FormControlLabel
      value={props.checked}
      control={<Checkbox checked={props.checked} onChange={props.handleChange} name={props.name} />}
      label={props.label}
      labelPlacement="start"
      sx={{ mr: 1, ml: 0 }}
    />
  );
};

export default CustomTextField;

{
  /* <TextField
                  variant="standard"
                  label="Product ID"
                  name="product_type_id"
                  type="number"
                  autoComplete="off"
                  // placeholder="Product ID"
                  value={values.product_type_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.product_type_id && Boolean(errors.product_type_id)}
                  helperText={touched.product_type_id && errors.product_type_id}
                /> */
}
//   InputProps={{
//     disableUnderline: true, // <== added this
//     startAdornment: props.startAdornment && props.startAdornment
//     // step: "0.1",
//   }}
