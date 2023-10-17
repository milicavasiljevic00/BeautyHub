import axios from 'axios';
import axiosInstance from './AxiosInstance';
import React from 'react';
import {useState,useEffect} from 'react';
import AdminRecenzijeKartica from './AdminRecenzijeKartica';
import "./AdminRecenzije.css";
import { useUserContext } from '../context/UserContext';

const AdminRecenzije = () => {

  const [radnici,setRadnici] = useState([]);
  const [recenzije,setRecenzije] = useState([]);
  const [radnik,setRadnik] = useState(0);
  const {logOut}=useUserContext();
  
  function pretraga(){
    console.log(radnik);
  }

  useEffect(()=> {
    axiosInstance.get(`https://localhost:5001/Radnik/VratiSveRadnike`)
      .then(res => {
        setRadnici(res.data);
      })
      .catch(err => {
        console.log(err);
      })

      ucitaj();

  },[])

  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

useEffect(() => {
  ucitaj();
},[radnik])


const ucitaj=async()=>{
  axiosInstance.get(`https://localhost:5001/Recenzija/VratiSveRecenzije/${radnik}`)
  .then(res => {
    setRecenzije(res.data);
  })
  .catch(err => {
    if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
  })
}

const brisanjeRecenzije=async(idRec)=>{
  console.log(idRec);
  axiosInstance.delete(`https://localhost:5001/Recenzija/ObrisiRecenziju/${idRec}`)
      .then((res) => {
          setRecenzije(recenzije.filter((rec)=>rec.id!==idRec));
          alert("Uspesno ste obrisali recenziju");
      })
      .catch(err =>{
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
      }) 
}


  return (
    <>
     <div className='zaposleni_zaglavlje'>
        <h1 className='zaposleniNaslov'>Pregled recenzija</h1>
     </div>
    <div className='glavni-zaposleni'>
          <div className='pretraga'>
              <div className='deo-pretrage1'>
                <select className='element' name='radnik' onChange={e => setRadnik(e.target.value)}>
                    <option value='0' selected disabled hidden>Izaberite radnika</option>
                    <option value='-1'>Svi radnici</option>
                      {
                        radnici.map((radnik) => 
                          <option key={radnik.id} value={radnik.id}>{veliko(radnik.ime)} {veliko(radnik.prezime)}</option>
                        )
                      }
                </select>
              </div>
          </div>
      </div>
      <div className='admin_recenzije_kartice'>
      {
        recenzije.map((recenzija) => 
          <AdminRecenzijeKartica key={recenzija.id} rec={recenzija} onDelete={brisanjeRecenzije}></AdminRecenzijeKartica>
        )
      }
      </div>
    </>
  )
}

export default AdminRecenzije
