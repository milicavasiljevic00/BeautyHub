import React from 'react';
import "./Zaposleni.css";
import { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import "./Korisnik.css";
import "./KarticaTermin.css";
import KarticaRadnikZakazivanje from './KarticaRadnikZakazivanje';

function KarticaTermin({proptermin, propradnik, propdatum, propzakazi}) {

const [forma,setForma]=useState(false);
const [uspesno,setUspesno]=useState(false);
const [popust,setPopust]=useState(false);
const [unetiPopust,setUnetiPopust]=useState(0);
const [pop,setPop]=useState(0);


function prikaziFormu(){
  axiosInstance.get(`https://localhost:5001/Account/GetUser`)
  .then(res=>{
    setPop(res.data[0].popust);
  })
  .catch(err=>{
    
  })
    setForma(!forma);
    setPopust(false);
    }

  function prikaziPopust()
  {
    setPopust(!popust);
    unetiPopust>0 && setUnetiPopust(0);
  }
function veliko(string){
  return string.charAt(0).toUpperCase()+string.slice(1);
}
  return (
      <>
    <div className='karticaTermin' onClick={()=>{prikaziFormu()}}>
        <h3 className='vremeOdDo'>{proptermin.vreme.vremeOd} - {proptermin.vreme.vremeDo}</h3>
        <h4 className='ikonica'><i className="fa-solid fa-square-check fa-2x"></i></h4>
    </div>
    {
              forma && (
                            <div className='kartica_termin_zakazi_modal'> 
                              <div className='kartica_termin_zakazi_overlay'></div>
                              <div className='kartica_termin_zakazi_modal_content'> 
                              <i className="fa-solid fa-x close-modal " onClick={()=>{prikaziFormu()}}></i>
                                <div className='poljaTerminZakazivanje'>
                                    <div className='kartica-termin-zakazi-labelaForma'>Odabrali ste termin od:  {proptermin.vreme.vremeOd}</div>
                                    <label className='kartica-termin-zakazi-labelaForma'>Datum: {propdatum}</label>
                                    <label className='kartica-termin-zakazi-labelaForma'>Zaposleni: {veliko(propradnik.ime)} {veliko(propradnik.prezime)}</label>
                                    <div className='kartica-termin-zakazi-labelaForma' >
                                    <label className='kartica-termin-zakazi-labelaForma'>Iskoristi popust?</label>
                                    <input type="checkbox" className='biranje-popusta' onClick={() => prikaziPopust()}/>
                                    </div>
                                    {
                                      popust && (
                                      <div className='divZaPopust'>
                                      <label className='zakazi-labelaPopust0'>Maksimalna mogućnost popusta: {pop} rsd</label>
                                      <input className='zakazi-inputPopust' type='number' placeholder="Unesite zeljeni popust (RSD)" onChange={(e)=>e.target.value!=""?setUnetiPopust(e.target.value):setUnetiPopust(0) }></input>
                                      </div>
                                      )
                                    }
                                    <div className='dugmiciTermin'>
                                      <button className="btnZakaziTermin" onClick={()=>{propzakazi(proptermin.id,unetiPopust)} }>
                                        Zakaži
                                      </button>
                                      
                                    </div>
          
                                </div>
                              </div>
                            </div>
                        )  
                    }   
                     {
                              uspesno && (
                              <div className='modal'> 
                                  <div className='overlay'></div>
                                  <div className='modal-content'> 
                                  <i className="fa-solid fa-x close-modal " onClick={()=>{setUspesno(false)}}></i>
                                  <div>
                                      Uspesno ste zakazali termin!
                                  </div>
                                  
                                  
                                  </div>
                              </div>

                          )
                      }       
    
</>
  )
}

export default KarticaTermin
