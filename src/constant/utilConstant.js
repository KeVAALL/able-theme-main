export const inrCurrency = (currencyValue) => {
  // Convert the number to a string
  let numStr = currencyValue.toString();

  // Split the string into integral and fractional parts (if any)
  let [integerPart, fractionalPart] = numStr.split('.');

  // Apply regex to format the integral part with commas
  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);

  // Format the other numbers with commas
  if (otherNumbers != '') {
    lastThree = ',' + lastThree;
  }
  let formattedValue = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  // If there's a fractional part, add it back
  if (fractionalPart) {
    formattedValue += '.' + fractionalPart;
  }

  // return '₹' + formattedValue;
  return '₹ ' + formattedValue;
};
