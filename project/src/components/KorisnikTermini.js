import React, { useState, useEffect } from 'react';
import "./Korisnik.css";
import "./LoginForm.css";
import { useNavigate } from 'react-router-dom';
import KarticaZakazanTermin from './KarticaZakazanTermin';
import axiosInstance from './AxiosInstance';
import DatePicker from "react-datepicker";
import "./KorisnikTermini.css";
import { useUserContext } from '../context/UserContext';

const KorisnikTermini = () => {

  const navigate = useNavigate();
  const [forma,setForma]=useState(false);
  const [termini,setTermini]=useState([]);

  const [opcija,setOpcija] = useState(null);
  const[dan,setDan] = useState(null);

  const {logOut}=useUserContext();

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function formatDate(value) {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    return day + '-' + month + '-' + year;
  }

  useEffect(()=> {

    var string = `https://localhost:5001/Termin/VratiZakazaneTermineKorisnika`
    if(dan!=null){
        string+=`?dat=${formatDate(dan)}`
    }

    axiosInstance.get(string)
    .then(res=>{
      setTermini(res.data);
    })
    .catch(err=>{

      console.log(err);
      if(err.response.status==401 || err.response.status==403)
        {   
            logOut()
        }
    })
    
  },[dan,opcija])

const otkazi = async (id) => {
  axiosInstance.put(`https://localhost:5001/Termin/OtkaziZakazanTerminKorisnik/${id}`)
  .then(res=>{
    setTermini(termini.filter((t) => t.id !== id))
    alert("Uspesno ste otkazali termin!");
  })
  .catch(err=>{
    if(err.response.status==401 || err.response.status==403)
        {   
            logOut()
        }
        else
        {
          alert(err.response.data);
        }
    
  }) 
}  

  return (
    <div className='korisnikTermini'>
      <div className='korisnik_termini_zaglavlje'>
        <h1 className='mojiTerminiNaslovv'>Pregled zakazanih termina</h1>
        <div className='divTermin'>
        <label className="lblFilter">Filter</label>
        <select className='biranje_opcije' onChange={e=> {setOpcija(e.target.value); setDan(null)}}>
          <option selected disabled hidden>Termin</option>
          <option value='1'>Svi termini</option>
          <option value='2'>Dan</option>
        </select>
        {
          opcija==2 && (
          <>
          <label className="lblDatum">Odaberite datum</label>
          <div className='datum'>
            <DatePicker
            className='datePickerTermini'
            selected={dan}
            minDate={new Date()}
            dateFormat='dd-MMM-yyyy'
            onChange={date => setDan(date)}
            maxDate={addDays(new Date(), 13)}
            
            />
            </div>
          </>

          )
        }
        </div>
      </div>
      <div className='poljeKarticeZakazaniTermini'>
      <ul>
            {
            termini.map((ter,index)=>
            <KarticaZakazanTermin key={index} ter={ter} propotkazi={otkazi}></KarticaZakazanTermin>
            )
            }
        </ul>
      </div>

    </div>
  )
}

export default KorisnikTermini
