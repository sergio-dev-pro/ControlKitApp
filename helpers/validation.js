export function isValidEmail(mail) {
  if (!mail.length) return false;
  var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (mail.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

export const validateDate = date => {
  if (!date || date.length < 10) return false;
  const dateSplited = date.split('/');
  const year = parseInt(dateSplited[2]);
  // console.log('validateDate', dateSplited);
  const isLeapYear = year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  const daysByMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const mm = parseInt(dateSplited[1]);
  const dd = parseInt(dateSplited[0]);
  if (dd > daysByMonth[mm - 1]) return false;

  return true;
};

export function cpfValidation(cpf) {
  const numberOfCharactersAllowed = [11, 14];
  if (!numberOfCharactersAllowed.includes(cpf.length)) return false;

  const isFakeCpf = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '00000000000',
    '111.111.111-11',
    '222.222.222-22',
    '333.333.333-33',
    '444.444.444-44',
    '555.555.555-55',
    '666.666.666-66',
    '777.777.777-77',
    '888.888.888-88',
    '999.999.999-99',
  ].includes(cpf);
  if (isFakeCpf) return false;

  const isCPF =
    /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/.test(
      cpf,
    );
  if (!isCPF) return false;

  return true;
}
