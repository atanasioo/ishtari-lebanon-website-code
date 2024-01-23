import { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false)
const [errorMessage,setErrorMessage] = useState(false)
  const setGlobalMessage = (newMessage) => {
    setMessage(newMessage);
  };

  setTimeout(() => {
    setSuccessMessage(false)
    setErrorMessage(false)
    setMessage('');
  }, 5000);


  return (
    <MessageContext.Provider value={{ message, setGlobalMessage, setSuccessMessage, successMessage, errorMessage,setErrorMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  return useContext(MessageContext);
};
