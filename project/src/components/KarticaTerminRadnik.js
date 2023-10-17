import React from 'react'
import './Radnik.css'
import { useState } from 'react';
import axiosInstance from './AxiosInstance';
import "./KarticaTerminRadnik.css";

function KarticaTerminRadnik({proptermin, propotkazi, proppotvrdi}) {

    const [forma,setForma]=useState(false);
    const [forma1,setForma1]=useState(false);
    const prikaziFormu=()=>{
        setForma(!forma);
        }
    const prikaziFormu1=()=>{
        setForma1(!forma1);
        }
        
    function uspesnoOtkazivanje(id){
        propotkazi(id);
        prikaziFormu();
    }

    function potvrdiOdradjen(id){
        proppotvrdi(id);
        prikaziFormu1()
    }

    function veliko(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

  return (
      <>
    <div className="karticaTerminRadnik">
         <h3 className='vremeOdDo'>{proptermin.vremeOd} - {proptermin.vremeDo}</h3>
         <h3 className='nazivUsluga1'>{veliko(proptermin.naziv)}</h3>
        <h4 className='ikonicaX'><i className="fa-solid fa-calendar-xmark fa-2x"></i></h4>
        <h4 className='klijentImePrezime'>{veliko(proptermin.ime)} {veliko(proptermin.prezime)}</h4>
        <h4 className='klijentImePrezime'>{proptermin.phoneNumber} </h4>
        <button className='btnOdradjen' onClick={prikaziFormu1}>Odrađen</button>
        <button className='btnOtkazi' onClick={prikaziFormu}>Otkaži</button>
    </div>
    {
              forma && (
                            <div className='termin_radnik_odradjen_modal'> 
                              <div className='termin_radnik_odradjen_overlay'></div>
                              <div className='termin_radnik_odradjen_modal-content'> 
                              <i className="fa-solid fa-x close-modal " onClick={prikaziFormu}></i>
                                <div className='poljaTerminRadnik'>
                                    <label className='lblFormaOdradjen'>Odabrali ste termin od: {proptermin.vremeOd}</label>
                                    <div className='dugmiciTermin'>
                                      <button className="btnZakaziTermin" onClick={()=>{uspesnoOtkazivanje(proptermin.id)} }>
                                        Otkaži
                                      </button>
                                      <button className="btnNeHvala" onClick={prikaziFormu} >
                                        Odustani
                                      </button>
                                    </div>
          
                                </div>
                              </div>
                            </div>
                        )
                    }    
     {
              forma1 && (
                            <div className='termin_radnik_odradjen_modal'> 
                              <div className='termin_radnik_odradjen_overlay'></div>
                              <div className='termin_radnik_odradjen_modal-content'> 
                              <i className="fa-solid fa-x close-modal " onClick={prikaziFormu1}></i>
                                <div className='poljaTerminRadnik'>
                                    <label className='lblFormaOdradjen'>Odabrali ste termin od: {proptermin.vremeOd}</label>
                                    <div className='dugmiciTermin'>
                                      <button className="btnZakaziTermin" onClick={()=>{potvrdiOdradjen(proptermin.id)} }>
                                        Odrađen
                                      </button>
                                      <button className="btnNeHvala" onClick={prikaziFormu1} >
                                        Odustani
                                      </button>
                                    </div>
          
                                </div>
                              </div>
                            </div>
                        )

                        
                    }                
    </>

  )
}

export default KarticaTerminRadnik
