import {useRouter} from 'next/router';
import {useState, useRef, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import ErrorModal from '../UI/ErrorModal';
import AppModal  from '../UI/AppModal';

const debug: boolean = true;

export default function VerifyEmailForm() {
  const router = useRouter();
  const loc = router.locale;
  const home = '/' + loc;
  const auth = home + '/auth';

  const { oobCode, lang } = router.query;
  const [ verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [ emailSent, setEmailSent] = useState<boolean>(false);
  const [emailError, setEmailError ] = useState<boolean>(false);
  const {formatMessage: fmt} = useIntl();


  useEffect(() => {
    const verifyEmailHandler = async (oobCode: any) => {

        console.log("VERIFYEMAIL");
        let url = '/api/verifyEmail';
        // emailError = false;
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              oobCode: oobCode,
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
          console.log("1. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)
    
        } catch (error) {
          console.log(error);
          setEmailError(true);
          console.log("2. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)
        }
        console.log("3. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)
      };

      verifyEmailHandler(oobCode).catch((error) => {
        console.log(error);
        setEmailError(true);
        // setIsLoading(false)
        console.log("2. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)
        // setIsLoading(false);
        // setHttpError(error.message);
      });

  }, []);


  const closeErrorHandler = () => {
    console.log('CLOSE ERROR HANDLER');
    if ( emailError ) {
        router.push(auth+"?singIn=true&mode=verifyEmail"+"&status="+emailError);
        } else {
            router.push(auth+"?singIn=true", `${auth}`)
        }
      };

      /*
  //===================================================
  //   V E R I F Y   E M A I L
  //===================================================
  const verifyEmailHandler = async (oobCode: any) => {

    console.log("VERIFYEMAIL");
    let url = '/api/verifyEmail';
    // emailError = false;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          oobCode: oobCode,
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
          // setEmailError(true);
          // emailError = true;
          throw new Error ("E-INVALID-RESPONSE")
      }
      console.log("1. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)

    } catch (error) {
      console.log(error);
      emailError = true;
      // setEmailError(true);
      console.log("2. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)
    }
    console.log("3. eMail Error: "+emailError+ " emailSent: "+ emailSent+ " verifyEmail: " + verifyEmail)
  };
  */

  //===================================================
  //   R E S E T    P A S S W O R D 
  //===================================================
  const submitHandler = async (event: any) => {
    event.preventDefault();
  }

  

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
          {verifyEmail === true && emailError === true && (
            <ErrorModal
              title={fmt({id: 'verifyEmailErrorTitle'})}
              buttonText={fmt({id: 'gobackToSignin'})}
              message={fmt({id: 'verifyEmailErrorMessage'})}
              closeModal={closeErrorHandler}
            />
          )}
          {verifyEmail === true && emailError === false && (
            <AppModal
            title={fmt({id: 'verifyEmailTitle'})}
            buttonText={fmt({id: 'gobackToSignin'})}
            message={fmt({id: 'verifyEmailMessage'})}
            closeModal={closeErrorHandler}
            cancelButton={false}
          />
          )}
          </form>
          </div>
          </div>
          
      </div>
      
  )
}