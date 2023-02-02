const invalidationMessage = {
  emptyField: 'Todos os campos devem ser preenchidos.',
};

const returnToInvalidForm = invalidationMessage => ({
  invalidationMessage,
  isValid: false,
});

const validForm = {isValid: true};

const isEmptyField = field => !field;
const defaultRequiredFieldsValue = [
  'street',
  'zipcode',
  'complement',
  'number',
  'neighborhood',
  'city',
  'state',
];
export const validateAddressForm = (
  fields,
  requiredFields = defaultRequiredFieldsValue,
) => {
  const fieldKeys = Object.keys(fields);
  let invalidForm = null;
  fieldKeys.every(field => {
    if (requiredFields.includes(field)) {
      console.log(field.toLocaleUpperCase(), fields[field].length);
      if (isEmptyField(fields[field])) {
        invalidForm = returnToInvalidForm(invalidationMessage.emptyField);
        return false;
      }
      return true;
    }
    return true;
  });

  return invalidForm ? invalidForm : validForm;
};
