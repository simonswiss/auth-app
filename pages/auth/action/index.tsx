import ActionForm from '../../../component/Auth/ActionForm'
import {useRouter} from 'next/router';
import { useEffect } from 'react';


const debug: boolean = false;

const ActionPage =  () => {
  const router = useRouter();
  let oobCode : string | any;
  let lang : string | any;
  let mode : string | any;
  
  mode = router.query.mode;
  lang = router.query.lang;
  oobCode = router.query.oobCode
  if ( debug ){
    console.log("Action Page")
    console.log("===========")
    console.log("oobCode: "+oobCode)
    console.log("mode: "+mode)
    console.log("lang: "+lang)
  }
 
  return <ActionForm oobCode={oobCode} mode={mode} lang={lang} />
}

export default ActionPage;

