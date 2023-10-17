import React, {useState, useEffect} from 'react'
import axios from 'axios'
import KarticaUsluga from './KarticaUsluga';

function Usluge() {
  
  const [tipovi, setTipovi] = useState ([])
  useEffect(()=> {

    axios.get('https://localhost:5001/Usluga/PreuzmiTipoveUslugeSaUslugama')
    .then(res=>{
      setTipovi(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }, [])
  return (
    <>
     <div className='usluge_zaglavlje'>
        <h1 className='uslugeNaslov'>Usluge</h1>
     </div>
    <div className='sveUslugeDiv'>
      <ul className='sveUsluge'>
        {
          tipovi.map((tip)=>
          <KarticaUsluga key={tip.id} proptip={tip}></KarticaUsluga>
          )
        }
      </ul>
    </div>
    
    </>
  )
}

export default Usluge

