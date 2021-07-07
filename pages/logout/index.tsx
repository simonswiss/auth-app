import {LogoutUser} from '../../store/auth-context';
import {useRouter} from 'next/router';
import {useContext} from 'react';
import AuthForm from '../../component/Auth/AuthForm';

import AuthContext from '../../store/auth-context';

const LogoutPage = () => {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    LogoutUser();
    const authContext = useContext(AuthContext);
    authContext.logout();
    authContext.isLoggedIn = false;
    router.replace('/auth?signIn=true', '/auth')
  }
  return <AuthForm  />
};

export default LogoutPage;
