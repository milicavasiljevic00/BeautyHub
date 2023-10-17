import React, { useState, useEffect } from 'react'
import KarticaTerminRadnik from './KarticaTerminRadnik';
import axiosInstance from './AxiosInstance';
import "./KarticaPregledTerminaRadnik.css";
import { useUserContext } from '../context/UserContext';

function KarticaPregledTerminaRadnik({propdatum}) {
     const [termini,setTermini]=useState([]);
     const {logOut}=useUserContext();

     useEffect(()=> {
      //OVDE PREUZMEM ZAUZETE TERMINE RADNIKA 
      axiosInstance.get(`https://localhost:5001/Termin/VratiSveTermineRadnikaDan/${propdatum}`)
      .then(res=>{
        setTermini(res.data);
      })
      .catch(err=>{
        console.log(err)
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
      })
  
    },[propdatum])

    const otkazi = async (id) => {
      axiosInstance.put(`https://localhost:5001/Termin/OtkaziZakazanTerminRadnik/${id}`)
        .then(res=>{
          setTermini(termini.filter((t) => t.id !== id))
          alert("Uspesno ste otkazali termin!")
        })
        .catch(err=>{
          if(err.response.status==401 || err.response.status==403)
          {   
              logOut();
          }
          else
          {
            alert(err.response.data);
          }
          
        })
    }  

    const potvrdi = async (id) => {
      axiosInstance.put(`https://localhost:5001/Termin/PotvrdiOdradjenTermin/${id}`)
      .then(res=>{
        setTermini(termini.filter((t) => t.id !== id))
        alert("Potvrdili ste termin!")
      })
      .catch(err=>{
        if(err.response.status==401 || err.response.status==403)
          {   
              logOut();
          }
          else
          {
            alert(err.response.data);
          }
        
      })
    }  


  return (
    <div className='divDatumRadnik'>
      <h2 className='datumIme'>{propdatum}</h2>
        <ul className='kartica_pregledtermina_radnika_lista'>
            {
            termini.length>0 ? termini.map((ter,index)=>
            <KarticaTerminRadnik key={index} proptermin={ter} propotkazi={otkazi} proppotvrdi={potvrdi}></KarticaTerminRadnik>        
            ) : <div className='NemaZakazanih'>Nema zakazanih termina.</div>
            }
        </ul>

      
    </div>
  )
}

export default KarticaPregledTerminaRadnik
