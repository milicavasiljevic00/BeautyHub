import React from 'react'
import './Korisnik.css'
import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import "./Menadzer.css";

function Menadzer() {
  const [ime, setIme]=useState("nesto");
  const [prezime, setPrezime]=useState("");
  const [email, setEmail]=useState("");
  const [tel,setTel]=useState("");
  useEffect(()=> {
      const ucitaj=async()=>{
        try{
      const res= await axiosInstance.get('https://localhost:5001/Account/GetUser');
      setIme(res.data[0].ime);
      setPrezime(res.data[0].prezime);
      setEmail(res.data[0].email);
      setTel(res.data[0].phoneNumber);
      }
    catch (error) {
      console.log("error", error);
    }
  }
      ucitaj()
    }, []);
  const navigate = useNavigate();
  
  const goToMenadzerRadnici = () => {
      navigate('/MenadzerRadnici')
  }
  const goToMenadzerDoprinos = () => {
      navigate('/MenadzerDoprinos')
  }
  const goToMenadzerStatistika = () => {
      navigate('/MenadzerStatistika')
  }
  
  return (
    
    <div className='menadzer'>
      <div className='menadzer_content'>
          <div className='menadzer_slika'>
            <i className="fa-solid fa-circle-user fa-10x" ></i>
          </div>
          <div className='menadzer_podaci'>
                <h3 className='menadzer_podaci_desno'>{ime}</h3>
                <h3 className='menadzer_podaci_desno'>{prezime}</h3>
                <label className='menadzer_podaci_desno tamno-sivo'>E-mail : {email}</label>
                <label className='menadzer_podaci_desno tamno-sivo'>Broj telefona : {tel}</label>
          </div>
      </div>
      <div className='menadzer_kartice'>
        <div className='div-kartica-menadzer' onClick={goToMenadzerRadnici}>
            <h2 className='podaci-kartica'><i className="fa-solid fa-user-group fa-4x"></i></h2>
            <h3 className='podaci-kartica'>RADNICI</h3>
            <p className='svetlo-sivo podaci-kartica'>Pregled i upravljanje radnicima</p>
        </div>
        <div className='div-kartica-menadzer' onClick={goToMenadzerDoprinos}>
            <h2 className='podaci-kartica'><i className="fa-solid fa-chart-pie fa-4x"></i></h2>
            <h3 className='podaci-kartica'>INDIVIDUALNI DOPRINOS</h3>
            <p className='svetlo-sivo podaci-kartica'>Pregled doprinosa radnika</p>
        </div>
        <div className='div-kartica-menadzer' onClick={goToMenadzerStatistika}>
            <h2 className='podaci-kartica'><i className="fa-solid fa-chart-line fa-4x"></i></h2>
            <h3 className='podaci-kartica'>STATISTIKA</h3>
            <p className='svetlo-sivo podaci-kartica'>Prihodi i rashodi</p>
        </div>
      </div>
    </div>
  )
}

export default Menadzer
