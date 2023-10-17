import React, { useState } from 'react';
import "./Korisnik.css";
import "./LoginForm.css";
import { useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstance';


function KarticaZakazanTermin({ter, propotkazi}) {
  const navigate = useNavigate();
  const [forma,setForma]=useState(false);

    function goTo(){
        navigate(`/korisnikZakazivanje`);
    }
    function otkaziTermin(id){
      propotkazi(id);
      setForma(!forma);
    }
    function promeniTermin(id){
      otkaziTermin(id);
      goTo();                    
    }
    function prikaziFormu(){
        setForma(!forma);
    }

  function formatDate(value) {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    return day + '-' + month + '-' + year;
  }
  function veliko(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className='ZakazaniTermini'>
    <div className='karticaZakazanTermin'>
    <label className='lblForma1'>{veliko(ter.naziv)}</label>
    <div className='divSadrzaj'>
    <label className='lblForma'>Vreme: {ter.vremeOd}</label>
    <label className='lblForma'>Datum: {formatDate(ter.datum)}</label>
    <label className='lblForma'>Radnik: {veliko(ter.ime)} {veliko(ter.prezime)}</label>
    <label className='lblForma'>Cena: {ter.cena}</label>
    </div>
    <div className='dugm'>
    <button className='btnOtkaziZakazan' onClick={()=>{prikaziFormu()}}>Otkaži</button>
    </div> 
    </div> 
    {
        forma && (
            <div className='modal'> 
            <div className='overlay'></div>
            <div className='otkaziZakazan_modal-content'> 
            <i className="fa-solid fa-x close-modal " onClick={prikaziFormu}></i>
            
            <label className='labelaFormaOtkazi'>Da li ste sigurni da želite da otkažete termin?</label>
            <div className='dugm'>
                <button className='btnPromeni' onClick={()=>{otkaziTermin(ter.id)}}>Da</button>
                <button className='btnOtkaziZakazan' onClick={()=>{prikaziFormu()}}>Ne</button>
            </div>
            
            
            </div>
            </div>

        )
        }
  </div>
    
  )
}

export default KarticaZakazanTermin
