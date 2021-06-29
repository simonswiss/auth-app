import Link from 'next/link';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import {useContext, useEffect, useState} from 'react';

import AuthContext from '../../store/auth-context';
import {LogoutUser} from '../../store/auth-context';
import {GetUserStatus} from '../../store/auth-context';

const navigation = [
  {name: 'Solutions', href: '#'},
  {name: 'Pricing', href: '#'},
  {name: 'Docs', href: '#'},
  {name: 'Company', href: '#'},
];

export default function Header() {
  const {formatMessage: fmt} = useIntl();
  const router = useRouter();
  const {locale, locales} = router;
  const home = '/' + locale;
  const auth = home + '/auth';
  const signin = home + '/signin';
  const signup = home + '/signup';
  const dashboard = home + '/dashboard';

  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  let asPath = router.asPath;

  const userStatus = GetUserStatus();
  if (userStatus) {
    const token: any = userStatus.token;
    const displayName: any = userStatus.token;
    const {duration} = userStatus;
    authContext.isLoggedIn = true;
    authContext.token = token;
    authContext.displayName = displayName;
  }

  useEffect(() => {
    setIsLoggedIn(authContext.isLoggedIn);
  }, [isLoggedIn, authContext.isLoggedIn]);

  const logoutHandler = () => {
    LogoutUser();
    authContext.logout();
    authContext.isLoggedIn = false;
    setIsLoggedIn(false);
    router.push(auth);
  };

  const boldClass =
    'inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50';
  const regularClass =
    'inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75';
    let signUpClass = boldClass;
    let signInClass = regularClass;
    const signIn = router.query.singIn;
    if ( asPath === "/auth" && signIn && signIn === 'false') {
      signUpClass = regularClass;
      signInClass = boldClass;
    }
  return (
    <header className="bg-indigo-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                className="h-10 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt=""
              />
            </a>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          {!isLoggedIn && (
            <div className="ml-10 space-x-4">
              <div className={signInClass}>
                <Link
                  href={{pathname: auth, query: {singIn: true}}}
                  as={auth}
                >
                  {fmt({id: 'signIn'})}
                </Link>
              </div>
              <div className={signUpClass}>
               <Link
                  href={{pathname: auth, query: {singIn: false}}}
                  as={auth}
                >
                  {fmt({id: 'signUp'})}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-white hover:text-indigo-50"
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
