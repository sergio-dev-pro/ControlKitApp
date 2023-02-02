import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '../components/Button';
import {Text, Input} from '@rneui/themed';
import {isValidEmail} from '../helpers/validation';
import AuthHeader from '../components/AuthHeader';
import GStyles from '../style/global';
import {AuthContext} from '../context/AuthContext';

const inputErrorMsgs = {
  email: 'email inválido.',
  password: {
    minimumQuantity: 'Deve ter mínimo 8 caracteres.',
    spaceNotAllowed: 'Não deve haver espaço em branco.',
  },
  global: {
    empty: 'campo obrigatório.',
  },
};

const LoginScreen = ({navigation}) => {
  const emailInput = React.createRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValidation, setEmailValidation] = useState({
    isValid: true,
    errorMsg: '',
  });
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: true,
    errorMsg: '',
  });

  const auth = React.useContext(AuthContext);

  useEffect(() => {
    emailInput.current.focus();
  }, []);

  const validEmail = currentEmail => {
    const isValid = isValidEmail(currentEmail);
    const invalidEmail = () => {
      const errorMsg = currentEmail.length
        ? inputErrorMsgs.email
        : inputErrorMsgs.global.empty;
      setEmailValidation({errorMsg, isValid: false});
    };
    !isValid && invalidEmail();
    const valid = () => setEmailValidation({isValid: true});
    !emailValidation.isValid && valid();
  };

  const validPassword = valueToValidate => {
    let errorMsg = valueToValidate.length ? null : inputErrorMsgs.global.empty;
    if (!errorMsg && valueToValidate.length < 6)
      errorMsg = inputErrorMsgs.password.minimumQuantity;
    if (!errorMsg && /\s/g.test(valueToValidate))
      errorMsg = inputErrorMsgs.password.spaceNotAllowed;

    const isValid = !errorMsg;
    const invalid = () => {
      setPasswordValidation({errorMsg, isValid: false});
    };
    if (!isValid) {
      invalid();
      return false;
    }
    const valid = () => setPasswordValidation({isValid: true});
    !passwordValidation.isValid && valid();
    return true;
  };

  const handleEmailChange = emailChanged => {
    !emailValidation.isValid && validEmail(emailChanged);
    setEmail(emailChanged);
  };

  const handlePasswordChange = passwordChanged => {
    !passwordValidation.isValid && validPassword(passwordChanged);
    setPassword(passwordChanged);
  };

  const isLoginButtonDisabled =
    !emailValidation.isValid ||
    !passwordValidation.isValid ||
    !email.length ||
    !password.length;

  return (
    <View style={GStyles.view}>
      <AuthHeader />
      <View style={GStyles.container}>
        <View style={styles.formContainer}>
          <Text h4 style={styles.formTitle}>
            Entrar
          </Text>
          <Input
            onBlur={() => {
              validEmail(email);
            }}
            ref={emailInput}
            keyboardType="email-address"
            onChangeText={handleEmailChange}
            placeholder="Digite seu email"
            errorMessage={
              !emailValidation.isValid ? emailValidation.errorMsg : ''
            }
          />
          <Input
            placeholder="Digite sua senha"
            onChangeText={handlePasswordChange}
            onBlur={() => validPassword(password)}
            secureTextEntry={true}
            errorMessage={
              !passwordValidation.isValid ? passwordValidation.errorMsg : ''
            }
          />
          <Button
            size="lg"
            title="ENTRAR"
            disabled={isLoginButtonDisabled}
            loading={auth.isAuthenticating}
            onPress={() => auth.authenticateUser({email, password})}
            containerStyle={{width: '100%', paddingHorizontal: 10}}
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 450,
  },
  formTitle: {
    marginBottom: 4,
  },
});
