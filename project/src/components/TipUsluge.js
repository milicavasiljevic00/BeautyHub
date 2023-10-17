import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Footer from './Footer';
import './TipUsluge.css'
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import KorisnikZakazivanje from './KorisnikZakazivanje';

function TipUsluge() {
  const [tipUsl, setTipUsl] = useState([])
  const [usluge, setUsluge]=useState([])
  const {naziv} = useParams();
  const [prom,setProm]=useState(false);

  useEffect(()=> {
    const ucitaj=async()=>{
      try{
    const res= await axios.get(`https://localhost:5001/Usluga/PreuzmiTipUsluge/${naziv}`);
    const data = await res.data;
      setTipUsl(data);
      setProm(true);
      
    }
  catch (error) {
    console.log("error", error);
  }
}

ucitaj();

  },[])
  
  useEffect(()=> { 
    const ucitaj1=async()=>{
      try{
      const result= await axios.get(`https://localhost:5001/Usluga/PreuzmiUsluge/${tipUsl.naziv}`);
      const data1 = await result.data;
      setUsluge(data1);
      setProm(false);
    }
    catch(error){
    }
  }
    ucitaj1();
    },[tipUsl])


  const veliko=(string)=>{
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  }

  return (
      
      <div className='glavniDivTipUsluge'>
        <div className="divTip">
            <img className="slike" src={`../slikeUsluge/${tipUsl.naziv}.jpg`}></img>
            <div className='opis'>
                <h1 className='naslovTipa'>{veliko(tipUsl.naziv)}</h1>
                <h3>Trajanje usluge:  {tipUsl.trajanje} minuta</h3>
                <p className='p1'>{veliko(tipUsl.opis)}</p>
            </div>
          
        </div>
        <div className='divListaUsluga'>
          <ul className='listaUsluga'>
          {
              usluge.map((usluga,index)=>
              <div className='usluge' key={index}><div className='naziv'>{veliko(usluga.naziv)}</div><div className='cena'>{usluga.cena} rsd</div></div>
              )
            }

          </ul>
        </div>
        <div className='razdvoji1'>
            <br/>
        </div>
      </div>
    
  )
}

export default TipUsluge
