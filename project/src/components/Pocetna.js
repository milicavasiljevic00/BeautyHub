import React from 'react';
import './Pocetna.css';
import { Navigate, useNavigate} from 'react-router-dom';
import { useState, useEffect } from "react";
import Footer from './Footer';
import { Register } from './Register';
import Slider from './Slider';
import { useUserContext } from '../context/UserContext';
import axiosInstance from './AxiosInstance';
import PreporukaKartica from './PreporukaKartica';

function Pocetna() {

  const [preporuke,setPreporuke] = useState([])

  useEffect(()=> {
    axiosInstance.get('https://localhost:5001/SalonInfo/PreuzmiPreporuke')
    .then(res => {
      setPreporuke(res.data);
    })
    .catch((err) => {
    })

}, [])

  const navigate = useNavigate();
  const goToZaposleni = () => {
      navigate('/zaposleni');
  }
  const goToUsluge = () => {
      navigate('/usluge');
  }

  return (
    <div className='Pocetna'>
      <div className='divSlajdovi'><Slider /></div>
      <div className='kartice-pocetna'>
        <div className='pocetna-kartica'>
          <img src='../SlikaRadnici.png'></img>
          <p style={{color: "#5C4033", fontSize: "120%"}}>Godine predanog rada i usavršavanja u zemlji i inostranstvu, stalna edukacija osoblja na kongresima, kao i stalno praćenje inovacija u svetu kozmetike, kroz ulaganja u nove aparate i preparate garantuju stručnost u pružanju kozmetičkih usluga. </p>
          <br/>
        <button className='btnn btnn--primary btnn--medium' onClick={goToZaposleni}>ZAPOSLENI</button>
        </div>
        <div className='pocetna-kartica'>
          <img src='../SlikaUsluge.png'></img>
          <p style={{color: "	#5C4033", fontSize: "120%"}}>Konstantna želja za napretkom radi ostvarivanja većeg zadovoljstva naših klijenata, doprinele su tome da ovde možete uživati u uslugama manikira i pedikira, depilacije, kao i u tretmanima najsavremenije aparativne kozmetike.</p>
          <br/>
          <button className='btnn btnn--primary btnn--medium' onClick={goToUsluge}>USLUGE</button>
        </div>
        <div className='pocetna-kartica'>
        <img src='../SlikaRegistracija.png'></img>
        <p style={{color: "	#5C4033", fontSize: "120%"}}>Želite da zakažete neki od tretmana koje nudimo i imate uvid u pogodnosti koje Vam pružamo? Registrujte se i postanite Naš verni član, a ljubazno osoblje BeautyHub salona će Vam izlaziti u susret svakoga dana! </p>
        <br/>
          <Register> REGISTRUJ SE </Register>
        </div>                  
      </div>
      <div className='razdvoji'>
      </div>
      <div className="zadovoljneMusterije">
        Ocene mušterija
      </div>
      <div className="preporuke-pocetna">
          <div className='karticePreporuke'>
          {
            preporuke.map((p) => 
              <PreporukaKartica  key={p.id} preporuka={p}></PreporukaKartica>
            )
          }
          </div>
      </div>
      {/*<Footer />*/}
    </div>
  );
}

export default Pocetna;