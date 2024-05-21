/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Autocomplete, Checkbox, FormControlLabel, TextField, Box } from '@mui/material';
import { getIn } from 'formik';
import PropTypes from 'prop-types';
import './custom.css';

export const NestedCustomTextField = memo(
  ({
    label,
    valueName,
    handleChange,
    handleBlur,
    setFieldValue,
    regType,
    values,
    type,
    multiline,
    autocomplete,
    touched,
    errors,
    ...props
  }) => {
    const strings = /^[a-zA-Z][a-zA-Z\s]*$/;
    const specials = /^[a-zA-Z0-9.]*$/;
    const numbers = /^\d+$/;
    const regexCheck = (e) => {
      e.preventDefault();
      const { value } = e.target;
      const regex = regType === 'string' ? strings : regType === 'noSpecial' ? specials : regType === 'pan' ? specials : numbers;
      if (!value || regex.test(value.toString())) {
        if (regType === 'pan') {
          setFieldValue(valueName, value.toUpperCase());
        } else {
          setFieldValue(valueName, value);
        }
      }
    };
    return (
      <TextField
        fullWidth
        className="common-textfield"
        size="small"
        label={label}
        name={valueName}
        onChange={handleChange ? handleChange : regexCheck}
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
        inputProps={{ maxLength: 50 }}
        // placeholder={Boolean(getIn(touched, valueName) && getIn(errors, valueName))}
        {...props}
      />
    );
  }
);

export const CustomTextField = memo((props) => {
  const strings = /^[a-zA-Z][a-zA-Z\s]*$/;
  const specials = /^[a-zA-Z0-9.]*$/;
  const numbers = /^\d+$/;
  const noSpace = /^\s*\S[\s\S]*$/;
  const regexCheck = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const regex =
      props.regType === 'string'
        ? strings
        : props.regType === 'noSpace'
        ? noSpace
        : props.regType === 'noSpecial'
        ? specials
        : props.regType === 'pan'
        ? specials
        : numbers;
    if (!value || regex.test(value.toString())) {
      if (props.regType === 'pan') {
        props.setFieldValue(props.name, value.toUpperCase());
      } else {
        props.setFieldValue(props.name, value);
      }
    }
  };
  return (
    <Box>
      <TextField
        fullWidth
        className="common-textfield"
        size="small"
        label={props.label}
        name={props.name}
        onChange={props.handleChange ? props.handleChange : regexCheck}
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
        inputProps={{ maxLength: 50 }}
        {...props}
      />
    </Box>
  );
});

export const CustomAutoComplete = memo((props) => {
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

  const handleOptionChange = (e, optionName, formName, setFieldValue, idName) => {
    if (e.target.outerText === undefined) {
      setFieldValue(formName, 0);
    } else {
      props.options.forEach(async (el) => {
        if (el[optionName] === e.target.outerText) {
          if (idName) {
            await setFieldValue(formName, el[idName]);
          } else {
            await setFieldValue(formName, el.id);
          }
        }
      });
    }
  };

  return (
    <Autocomplete
      fullWidth
      disablePortal
      className="common-autocomplete"
      componentsProps={{
        popper: {
          modifiers: [
            // {
            //   name: 'flip',
            //   enabled: false
            // },
            {
              name: 'preventOverflow',
              enabled: false
            }
          ]
        }
      }}
      id="basic-autocomplete-label"
      options={props.options || []}
      disableClearable={props.disableClearable ? true : false}
      defaultValue={
        (typeof props.defaultValue === 'string' &&
          props.options.find((el) => {
            if (props.keyName) {
              return el[props.keyName] === props.defaultValue;
            } else {
              return el[props.optionName] === props.defaultValue;
            }
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
      onChange={(e) => {
        handleOptionChange(e, props.optionName, props.formName, setFieldValue, props.idName);
      }}
      getOptionLabel={(option) => option[props.optionName]} // Assuming 'product_type' is the label you want to display
      renderInput={(params) => (
        <TextField
          // error={Boolean(props.errors[props.formName])}
          {...params}
          label={props.label}
        />
      )}
    />
  );
});

FormikAutoComplete.propTypes = {
  idName: PropTypes.any,
  keyName: PropTypes.any
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
