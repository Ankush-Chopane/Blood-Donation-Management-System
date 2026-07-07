import { useContext } from 'react';
import AuthContext from '../context/AuthContextCore';

export const useAuth = () => {
  return useContext(AuthContext);
};
export default useAuth;
