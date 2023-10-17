import React from 'react';
import KarticaUslugaAdmin from './KarticaUslugaAdmin';
import { useState,useEffect } from 'react';
import axios from 'axios';
import "./Usluge.css";
import "./AdminUsluge.css";
import axiosInstance from './AxiosInstance';
import { useUserContext } from '../context/UserContext';

const AdminUsluge = () => {
  
  const [tipovi, setTipovi] = useState ([])
  const [forma,setForma]=useState(false);
  const [trajanje,setTrajanje]=useState("");
  const [naziv,setNaziv]=useState("");
  const [opis,setOpis]=useState("");
  const {logOut}=useUserContext();

  useEffect(()=> {

    axiosInstance.get('https://localhost:5001/Usluga/PreuzmiTipoveUsluga')
    .then(res=>{
      setTipovi(res.data)
    })
    .catch(err=>{
      console.log(err);
        
    })
  }, [])

  function prikaziFormu(){
    setForma(!forma);
    setNaziv("");
    setOpis("");
    setTrajanje("");
  }

  async function dodavanjeTipaUsluge(){
    naziv!=="" && opis!=="" && trajanje!=="" ? (
    axiosInstance.post(`https://localhost:5001/Usluga/DodajTipUsluge/${naziv}/${opis}/${trajanje}`)
    .then((response)=>{
      setTipovi([...tipovi,response.data]);
      prikaziFormu(); 
    })
    .catch(err=>{
      console.log(err);
          if(err.response.status==401 || err.response.status==403)
          {   
              logOut();
          }
          else
          {
            alert(err.response.data);
          }
    })
    ) : alert("Niste popunili sva polja!");

  }
  return (
    <>
    <div className='adminUsluge_zaglavlje'>
        <h1 className='adminUslugeNaslov'>Upravljanje uslugama</h1>
     </div>
    <div>
      <div className='admin_daoaj_uslugu_omotac'>
        <button className='AdmindodajUslugu' onClick={() => { prikaziFormu() }}>+ Dodaj tip usluge</button>
      </div>
      {
                forma && (
                  <div className='admin_usluge_modal'> 
                    <div className='admin_usluge_overlay'></div>
                    <div className='admin_usluge_modal-content'> 
                    <i className="fa-solid fa-x close-modal " onClick={() => { prikaziFormu() }}></i>
                    <div className='admin_usluge_modal_usluga'>
                      <label className='admin_usluge_labelaForma'>Naziv nove usluge* :</label>
                      <input className='inputTekst' type='text' onChange={(e)=>setNaziv(e.target.value)}></input>
                        
                        
                      <label className='admin_usluge_labelaForma'>Trajanje (u minutima)* :</label>
                      <input className='inputTekst' type='number' onChange={(e)=>setTrajanje(e.target.value)}></input>
                          
                      <label className='admin_usluge_labelaForma'>Opis usluge* :</label>
                      <textarea className='inputOpis' type='text' onChange={(e)=>setOpis(e.target.value)}></textarea>

                      <button className="btnDodajUslugu" onClick={() => { dodavanjeTipaUsluge() }}>
                        Dodaj
                      </button>
                        
                    

                    </div>
                    
                    
                    </div>
                  </div>

              )
          }
      <ul className='admin_usluge_lista'>
        {
          tipovi.map((tip)=>
          <KarticaUslugaAdmin key={tip.id} proptip={tip}></KarticaUslugaAdmin>
          
          )
        }
        
        
      </ul>
    </div>
    {/*<Footer />*/}
    
    </>
  )
}

export default AdminUsluge
