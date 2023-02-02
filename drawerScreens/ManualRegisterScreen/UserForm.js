import {CheckBox, Input, Text} from '@rneui/themed';
import {useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useMaskedInputProps} from 'react-native-mask-input';
import Button from '../../components/Button';
import SelectModal from '../../components/SelectModal';
import {formatDate} from '../../helpers/format';
import {cpfValidation, isValidEmail} from '../../helpers/validation';

const inputErrorMsgs = {
  email: 'e-mail inválido.',
  cpf: 'CPF inválido.',
  global: {
    empty: 'campo obrigatório.',
  },
};

const UserForm = ({onUserFormCompleted, availableDays, onReturn}) => {
  const [user, setUser] = useState({
    name: '',
    cpf: '', // usado para amazenar cpf ou passport
    email: '',
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: true,
    errorMsg: '',
  });
  const [CPFValidation, setCPFValidation] = useState({
    isValid: true,
    errorMsg: '',
  });
  const [nameValidation, setNameValidation] = useState({
    isValid: true,
    errorMsg: '',
  });
  const [eventDays, setEventDays] = useState(availableDays);
  const [documentType, setDocumentType] = useState('cpf');
  const [passportValidation, setPassportValidation] = useState({
    isValid: true,
    errorMsg: '',
  });

  const {name, cpf, email} = user;

  const maskedCPFInputProps = useMaskedInputProps({
    value: cpf,
    onChangeText: cpfChanged => {
      setUser(prevState => ({...prevState, cpf: cpfChanged}));
      !CPFValidation.isValid && validCPF(cpfChanged);
    },
    mask: [
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
  });

  const validEmail = currentEmail => {
    const isValid = isValidEmail(currentEmail);
    const invalidEmail = () => {
      const errorMsg = currentEmail.length
        ? inputErrorMsgs.email
        : inputErrorMsgs.global.empty;
      setEmailValidation({errorMsg, isValid: false});
    };
    if (!isValid) {
      invalidEmail();
      return false;
    }
    const valid = () => setEmailValidation({isValid: true});
    !emailValidation.isValid && valid();
    return true;
  };

  const validCPF = currentCPF => {
    const isValid = cpfValidation(currentCPF);
    const invalidCPF = () => {
      const errorMsg = currentCPF.length
        ? inputErrorMsgs.cpf
        : inputErrorMsgs.global.empty;
      setCPFValidation({errorMsg, isValid: false});
    };
    if (!isValid) {
      invalidCPF();
      return false;
    }
    const valid = () => setCPFValidation({isValid: true});
    !CPFValidation.isValid && valid();
    return true;
  };

  const validName = name => {
    const isName = name.length >= 3;
    !isName
      ? setNameValidation({
          isValid: false,
          errorMsg: 'Nome deve ter no mínimo 3 caracteres.',
        })
      : setNameValidation({isValid: true});

    return isName;
  };
  const validPassport = (passport = cpf) => {
    if (passport.length === 0) {
      setPassportValidation({
        isValid: false,
        errorMsg: 'campo obrigatório.',
      });
      return false;
    }
    if (passport.length < 4) {
      setPassportValidation({
        isValid: false,
        errorMsg: 'campo deve ter no mínimo 4 caracteres.',
      });
      return false;
    }

    setPassportValidation({
      isValid: true,
    });
    return true;
  };

  const handleEmailChange = emailChanged => {
    !emailValidation.isValid && validEmail(emailChanged);
    setUser(prevState => ({...prevState, email: emailChanged}));
  };

  const handleComplete = () => {
    const validDocument = documentType === 'cpf' ? validCPF : validPassport;
    if (!validDocument(cpf) || !validEmail(email) || !validName(name)) return;
    onUserFormCompleted({
      user: {email: user.email, document: user.cpf, name: user.name},
      eventDays,
    });
  };
 console.log('UserForm')
  return (
    <View>
      <Input
        label="Nome"
        value={name}
        onBlur={() => {
          validName(name);
        }}
        onChangeText={name => {
          setUser(prevState => ({...prevState, name}));
        }}
        errorMessage={!nameValidation.isValid ? nameValidation.errorMsg : ''}
      />
      <Input
        label="E-mail"
        onBlur={() => {
          validEmail(email);
        }}
        keyboardType="email-address"
        onChangeText={handleEmailChange}
        placeholder="Digite o email"
        errorMessage={!emailValidation.isValid ? emailValidation.errorMsg : ''}
      />

      <SelectModal
        label={'Tipo do documento'}
        items={[
          {key: 'cpf', value: 'CPF'},
          {key: 'passport', value: 'Passaporte'},
        ]}
        setValue={value => {
          setDocumentType(value);
          setUser(prev => ({...prev, cpf: ''}));
        }}
        value={documentType}
      />

      {documentType === 'cpf' ? (
        <Input
          label="CPF"
          onBlur={() => {
            validCPF(cpf);
          }}
          keyboardType="numeric"
          // placeholder="999.999.999-99"
          {...maskedCPFInputProps}
          errorMessage={!CPFValidation.isValid ? CPFValidation.errorMsg : ''}
        />
      ) : (
        <Input
          label="Passaporte"
          value={cpf}
          onChangeText={text => setUser(prev => ({...prev, cpf: text}))}
          onBlur={validPassport}
          errorMessage={
            !passportValidation.isValid ? passportValidation.errorMsg : ''
          }
        />
      )}

      <View style={{paddingHorizontal: 10}}>
        <Text style={{fontSize: 17}}>Dias de evento:</Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 16,
            marginTop: 10,
          }}>
          {availableDays.map(availableDay => (
            <CheckBox
              key={availableDay}
              containerStyle={{
                paddingHorizontal: 0,
                paddingVertical: 4,
                margin: 0,
                marginRight: 0,
                marginLeft: 0,
              }}
              textStyle={{paddingLeft: 3}}
              center
              title={formatDate(availableDay)}
              checked={eventDays.includes(availableDay)}
              onPress={() => {
                const checked = eventDays.includes(availableDay);
                const removeDay = () =>
                  setEventDays(prevState =>
                    prevState.length === 1
                      ? prevState
                      : prevState.filter(day => day !== availableDay),
                  );
                checked
                  ? removeDay()
                  : setEventDays(prevState => [...prevState, availableDay]);
              }}
            />
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {!!onReturn && (
          <Button
            type="outline"
            onPress={onReturn}
            containerStyle={{paddingRight: 16}}>
            Voltar
          </Button>
        )}
        <Button
          containerStyle={!!onReturn ? {} : {width: '100%'}}
          onPress={handleComplete}>
          Avançar
        </Button>
      </View>
    </View>
  );
};

export default UserForm;
