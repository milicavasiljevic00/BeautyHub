import React from 'react';
import "./Usluge.css";
import { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import KarticaRadnikZakazivanje from './KarticaRadnikZakazivanje';
import "./Zaposleni.css";
import FormaPogodnijiTermin from './FormaPogodnijiTermin';
import { useUserContext } from '../context/UserContext';

import "./KorisnikZakazivanje.css";

const KorisnikZakazivanje = () => {

  const [tipoviUsluga,setTipoviUsluga]=useState([]);
  const [tip,setTip]=useState("");
  const [usluge,setUsluge]=useState([]);
  const [selectedDate,setSelectedDate]=useState(null);
  const [tabela,setTabela]=useState(false);
  const [radniciNormalni,setRadniciNormalni]=useState([]);
  const [formaPogodniji,setFormaPogodniji]=useState(false);
  const [usluga,setUsluga]=useState(null);
  const [klik,setKlik]=useState(false);
  const {logOut}=useUserContext();
 
  useEffect(()=> {
    axiosInstance.get('https://localhost:5001/Usluga/PreuzmiTipoveUslugeSaUslugama')
    .then(res=>{
      setTipoviUsluga(res.data)
    })
    .catch(err=>{
      
    })

  },[])
  useEffect(()=> {
    setUsluge([]);
    axiosInstance.get(`https://localhost:5001/Usluga/PreuzmiUsluge/${tip}`)
    .then(res=>{
      setUsluge(res.data);
      setUsluga(0);                                      
      setKlik(false);
      setTabela(false);
      formaPogodniji && setFormaPogodniji(false);
    })
    .catch(err=>{
    })

    axiosInstance.get(`https://localhost:5001/Radnik/VratiRadnikeTipUsluge/${tip}`)
    .then(res=>{
      setRadniciNormalni(res.data)
    })
    .catch(err=>{
      if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
    })

  },[tip])

  useEffect(()=> {
    setKlik(false);
    formaPogodniji && setFormaPogodniji(false);

  },[selectedDate])


  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function prikaziTabelu(){
    setKlik(true);
    selectedDate&&usluga>0&&tip ? (
    setTabela(true)
    )
      : alert("Niste popunili sva polja!");
  }

  function prikaziFormaPogodniji(){ 
    setFormaPogodniji(!formaPogodniji);
  }

  function getFormattedDate(input) {
    var pattern = /(.*?)\/(.*?)\/(.*?)$/;
    var result = input.replace(pattern,function(match,p1,p2,p3){
        var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        return (p2<10?"0"+p2:p2) + "-" + months[(p1-1)] + "-" + p3;
    });

    return result;
}

function formatDate(value) {
  let date = new Date(value);
  const day = date.toLocaleString('default', { day: '2-digit' });
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: 'numeric' });
  return day + '-' + month + '-' + year;
}
  return (
    <div>
        <div> 
            <div className='zakazi_zaglavlje'>
              <h1 className='zakaziNaslov'>Zakažite termin</h1>
            </div>
              <div className='korisnik_zakazivanje_zaglavlje'>
                <div className='uvodni-deo'> 
                  <div className='slikaUsluga_div_Zakazivanje'>
                    <img src={`../SlikaUsluge.png`} className="slikaZakazivanje"></img>
                  </div>
                  <div className='inputPoljaTipUsluge'>
                    <label className='labelaFormaTipUsluge1'>Odaberite tip usluge:</label>
                    <select className='KorisnikZakazivanjeBiranje' type='text' onChange={e => setTip(e.target.value)} >
                      <option value='' selected disabled hidden>Tip usluge</option>
                      {
                        tipoviUsluga.map((el) => 
                        <option key={el.id} value={el.naziv}>{veliko(el.naziv)}</option>)
                      }
                    </select> 
                    <label className='labelaFormaTipUsluge2'>Odaberite uslugu:</label>
                    <select className='KorisnikZakazivanjeBiranje' type='text' onChange={e => setUsluga(e.target.value)} >
                    <option value='0'></option>
                    {
                      usluge.map((el) => 
                      <option key={el.id} value={el.id}>{veliko(el.naziv)}</option>)
                    }
                    </select> 
                    <label className='labelaFormaTipUsluge3' >Odaberite datum:</label>
                    <div className='custom-datepicker'>
                    <DatePicker
                    className='datePickerKorisnikZakazivanje'
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      minDate={new Date()}
                      dateFormat='dd-MMM-yyyy'
                      maxDate={addDays(new Date(), 13)}
                    />
                    </div>
                    <button className='biranje_termina' onClick={ () => { prikaziTabelu() } }>OK</button>
                  </div> 
                  <div>
                    <br/>
                  </div>
                </div>
              </div>
                <>
                {   klik && tabela &&  (
                  <>
                  <ul className='listaZakazivanje'>
                     {
                        
                        radniciNormalni.map((radnik)=>
                        <KarticaRadnikZakazivanje key={radnik.id} propusluga={usluga} propradnik={radnik} datum={formatDate(selectedDate)}></KarticaRadnikZakazivanje>
                        
                        )
                      }
                  </ul>
                  <div className='omotac1'>
                    <div className='divPogodnijiTermin'>
                      <div className="pKorisnikZakazivanje">Ponuđeni termini Vam ne odgovaraju? Odaberite željeni termin, a mi ćemo Vas obavestiti o njegovom eventualnom otkazivanju! </div>
                      <div className='divPogTer'><button className='btnPogodnijiTermin' onClick={()=>{prikaziFormaPogodniji()}}>Odaberi pogodniji termin</button></div>
                    </div>
                  </div>
                  
                  </>
                )}
               {
                    usluga>0 && tabela && formaPogodniji && 
                         <>
                          <FormaPogodnijiTermin  proptip={tip} propusluga={usluga} propdatum={formatDate(selectedDate)}></FormaPogodnijiTermin>
                           
                        
                        </>
                        
                    }
                
                </>
            </div>
        </div>
  )
                  }

export default KorisnikZakazivanje
