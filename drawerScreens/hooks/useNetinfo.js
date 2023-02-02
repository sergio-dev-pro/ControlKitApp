import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

const useNetinfo = () => {
  const [isConnected, setisConnected] = useState(null);
  useEffect(() => {
    setInterval(async () => {
      const {isInternetReachable} = await NetInfo.fetch();
      setisConnected(isInternetReachable);
    }, 2000);
  }, []);
  return {isConnected, isLoadingConnectionStatus: isConnected === null};
};

export default useNetinfo;
