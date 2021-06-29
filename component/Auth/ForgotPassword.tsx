import {useRouter} from 'next/router';
import {useState, useRef, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import AuthContext from '../../store/auth-context';

const debug: boolean = false;

export default function AuthForm() {
  const router = useRouter();
  const loc = router.locale;
  const home = '/' + loc;
  const auth = home + '/auth';
  console.log(router.query);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const signIn = router.query.singIn;
    if (signIn && signIn === 'true') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    let app_id: any = router.query.app_id;
    if (app_id) {
      authContext.appId = app_id;
    }
    let app_secret: any = router.query.app_secret;
    if (app_secret) {
      authContext.appSecret = app_secret;
    }
    let redirect_url: any = router.query.redirect_url;
    if (redirect_url) {
      authContext.redirectUrl = redirect_url;
      let as_Path = router.asPath;
      authContext.asPath = as_Path;
    }
    let app_name: any = router.query.app_name;
    if (app_name) {
      authContext.appName = app_name;
    }
    if ( router.query.enteredEmail ) {
      let email:string = router.query.enteredEmail.toString();
      setEnteredEmail(email);
    }
  
  }, [router.query]);

  if (authContext.isLoggedIn) {
    // router.push(home);
  }

  const {formatMessage: fmt} = useIntl();

  const [forgotPassword, setForgotPassword] = useState<boolean>();

  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);
  const [emailBlur, setEmailBlur] = useState<boolean>(false);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  //===================================================
  //   V A L I D A T I O N
  //===================================================

  //
  // Validate eMail
  //
  const emailChangeHandler = (event: any) => {
    setError(false);
    setEmailIsValid(
      event.target.value.includes('@') && event.target.value.trim().length > 5
    );
    if (emailIsValid && emailBlur) {
      setEmailBlur(false);
    }
    setEnteredEmail(event.target.value);
  };

  //===================================================
  //   O N   B L U R (cursor out of focus)
  //===================================================

  //
  // Validate eMail
  //
  const validateEmailHandler = () => {
    if (
      enteredEmail &&
      enteredEmail.trim().includes('@') &&
      enteredEmail.trim().length > 5
    ) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
    setEmailBlur(true);
    if (debug) {
      console.log(
        'entered value ' + enteredEmail + ' ' + emailIsValid + ' ' + emailBlur
      );
    }
  };

  const closeErrorHandler = () => {
    console.log('CLOSE ERROR HANDLER');
    router.push("/auth");
  };


  //===================================================
  //   F O R G O T   P A S S W O R D
  //===================================================
  const processForgotPasswordHandler = async (event: any) => {
    if (debug) {
      console.log('PROCESS FORGOT HANDLER');
      console.log(enteredEmail);
    }

    let url = '/api/forgotPassword';
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          requestMethod: 'POST',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (debug) {
        console.log('DATA ===> ');
        console.log(data);
      }
      if (data.statusCode !== 200 && data.statusCode !== 201) {
        throw new Error(data.message);
      }
      if (debug) {
        console.log('CLOSE MODAL');
      }
      closeErrorHandler();
    } catch (error) {
      console.log(error);
      {
        closeErrorHandler();
      }
    }
  };
  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
  const errorClass =
    'appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
   
  return (
    <div className="min-h-10  bg-gray-50 flex flex-col justify-center py-12  sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {fmt({id: 'forgotPassword'})}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={processForgotPasswordHandler}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {fmt({id: 'emailAddress'})}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
                  value={enteredEmail}
                  className={`${
                    emailIsValid === false && emailBlur === true
                      ? errorClass
                      : inputClass
                  }`}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {fmt({id: 'sendForgotPassword'})}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
