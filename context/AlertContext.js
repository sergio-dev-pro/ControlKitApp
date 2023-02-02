import react, {createContext, useContext, useState} from 'react';
import Alert from '../components/Alert';
export const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  return context?.setMessage;
};

export const AlertProvider = ({children}) => {
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  return (
    <AlertContext.Provider
      value={{
        setMessage: (message, color = null) => {
          setMessage(message);
          color && setColor(color);
        },
      }}>
      {children}

      <Alert
        textColor={color}
        message={message}
        isVisible={message.length > 0}
        onOk={() => {
          setMessage('');
          setColor('');
        }}
      />
    </AlertContext.Provider>
  );
};
