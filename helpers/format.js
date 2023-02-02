export const formatPhone = (phoneNumber = '') => {
  if (!phoneNumber.length) return null;
  const regex = /[(-)--- a-zA-Z ,.]/g;

  let justNumbers = phoneNumber.replace(regex, '');
  let ddd = '';
  if (justNumbers.length >= 1) ddd = `(${justNumbers[0]}`;
  if (justNumbers.length >= 2) ddd += `${justNumbers[1]}`;
  justNumbers = justNumbers.substring(2);
  let phoneNumberFormated = ddd;
  if (justNumbers.length >= 6) {
    phoneNumberFormated += `) ${justNumbers.substring(0, 5)}`;
    if (justNumbers.length)
      phoneNumberFormated += `-${justNumbers.substring(5, 9)}`;
  } else if (justNumbers) {
    phoneNumberFormated += ') ' + justNumbers;
  }

  return phoneNumberFormated;
};

// Format date from dd/mm/aaaa to aaaa-mm-dd
export function formatDateAaaaMmDd(date) {
  return date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
}

export const formatBirthDate = (date = '') => {
  if (!date.length) return null;

  const regex = /[a-zA-Z/ ]/g;
  let birthDate = date.replace(regex, '');

  let dd = '';
  if (birthDate.length >= 2) {
    dd = birthDate.substring(0, 2);
    birthDate = birthDate.substring(2);
  } else return birthDate;

  let mm = '';
  if (birthDate.length) {
    mm = '/' + birthDate.substring(0, 2);
    birthDate = birthDate.substring(2);
  }
  let yyyy = '';
  if (birthDate.length) {
    yyyy = '/' + birthDate.substring(0, 4);
  }

  let birthDateFormated = dd + mm + yyyy;
  return birthDateFormated;
};

export const formatCEP = (cep = '') => {
  if (!cep.length) return null;

  const regex = /[- ]/g;
  const cepReplaced = cep.replace(regex, '');

  let cepFormated = cepReplaced.substring(0, 5);
  if (cep.length > 5) cepFormated += '-' + cepReplaced.substring(5, 8);

  return cepFormated;
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}