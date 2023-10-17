import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Usluge.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



const KarticaUsluga = ( {proptip} ) => {
  
 const navigate = useNavigate();
 const goTo = () => {
     navigate(`/${proptip.naziv}`);
}

  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  return (
    <div className='karticaUsluga' onClick={goTo}>
        <img className="imgUsl" src={`../slikeUsluge/${proptip.naziv}.jpg`}></img>
        <div className='uslugaNazivBkg'>
          
        </div>
        <div className='uslugaNazivTxt'>
          {veliko(proptip.naziv)}
        </div>

    </div>
  )
}

export default KarticaUsluga
