import {useRouter} from 'next/router';
import {useState, useRef, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import AuthContext from '../../store/auth-context';
import ErrorModal from '../UI/ErrorModal';
import AppModal  from '../UI/AppModal';
import { getDefaultSettings } from 'http2';

const debug: boolean = false;


export default function AuthForm( props: any) {
  const router = useRouter();
  let loc = props.lang;
  if ( !loc ) {
    loc = router.locale;
  }
  const home = '/' + loc;
  const auth = home + '/auth';
  let oobCode : string | any;
  let lang : string | any;
  let mode : string | any;

  const [resetPassword, setResetPassword ] = useState<boolean>(false);
  const [ verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [ emailSent, setEmailSent] = useState<boolean>(false);
  const [emailError, setEmailError ] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const {formatMessage: fmt} = useIntl();

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
        mode = router.query.mode;
        lang = router.query.lang;
        oobCode = router.query.oobCode
        if ( debug ){
          console.log("Action Form")
          console.log("===========")
          console.log("oobCode: "+oobCode)
          console.log("mode: "+mode)
          console.log("lang: "+lang)
          console.log("USE EFFECT")
          console.log("oobCode: "+props.oobCode)
          console.log(router.asPath);
      }

      if ( mode !== "resetPassword") {
      if ( props.oobCode ) {
          setVerifyEmail(true);
          setIsLoading(true);

          const verifyEmailHandler = async () => {

            let url = '/api/verifyEmail';            
              const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                  oobCode: props.oobCode,
                  requestMethod: 'POST',
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = await response.json();
              if ( debug ) {
                  console.log("DATA")
                  console.log(data);
              }
              if ( !data || data.statusCode !== 200 ) {
                  throw new Error ("E-INVALID-RESPONSE")
              }
            setEmailSent(true);
            setIsLoading(false)
          };    

          verifyEmailHandler().catch((error) => {
            console.log(error);
            setEmailError(true);
            setIsLoading(false)
          });
        }
      }
  }, [props.oobCode, props.mode]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  //===================================================
  //   R E S E T    P A S S W O R D 
  //===================================================
  const submitHandler = async (event: any) => {
    //event.preventDefault();
    router.push(auth+"?singIn=true");
  }
  
  const inputClass =
  'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
const errorClass =
  'appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  return (
    <div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={submitHandler}
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
                  // onChange={emailChangeHandler}
                  // onBlur={validateEmailHandler}
                  // value={enteredEmail}
                  className={inputClass}
                />
              </div>
            </div>

          {verifyEmail === true && emailError === false  && isLoading === false && emailSent === true && (
            <AppModal
            title={fmt({id: 'verifyEmailTitle'})}
            buttonText={fmt({id: 'gobackToSignin'})}
            message={fmt({id: 'verifyEmailMessage'})}
            closeModal={submitHandler}
            cancelButton={false}
          />
          )}

          {verifyEmail === true && emailError === true  && isLoading === false && (
            <ErrorModal
              title={fmt({id: 'verifyEmailErrorTitle'})}
              buttonText={fmt({id: 'gobackToSignin'})}
              message={fmt({id: 'verifyEmailErrorMessage'})}
              closeModal={submitHandler}
            />
          )}
          </form>
          </div>
          </div>
          
      </div>
      
  )
}