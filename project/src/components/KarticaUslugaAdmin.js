import React, { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import './Usluge.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import "./KarticaUslugaAdmin.css";



const KarticaUslugaAdmin = ( {proptip} ) => {

  const navigate = useNavigate();
  const [izmeni, setIzmeni]=useState(false);
  const [forma, setForma]=useState(false);
  const [naziv,setNaziv]=useState("");
  const [trajanje,setTrajanje]=useState("");
  const [opis,setOpis]=useState("");
  const [usluge, setUsluge]=useState([]);

 function izmeniTipUsluge(){
     navigate(`/Izmeni/${proptip.naziv}`);
}

function veliko(string){
  return string.charAt(0).toUpperCase()+string.slice(1);
}

  return (
    <>
    <div className='karticaUslugaAdmin'>
         <label className="lblUslugaAdmin">{veliko(proptip.naziv)}</label>
         <div className='dugmici'>
            <button className='izmeniDugme' onClick={()=>{izmeniTipUsluge()}}>Izmeni</button>
         </div>
    </div>
   
    </>
  )
}
export default KarticaUslugaAdmin;