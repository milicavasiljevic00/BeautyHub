import React from 'react'
import "./Radnik.css"
import "./Korisnik.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import KarticaTerminRadnik from './KarticaTerminRadnik';
import KarticaPregledTerminaRadnik from './KarticaPregledTerminaRadnik';
import "./RadnikTermini.css";


const RadnikTermini = () => {
  const [datum,setDatum]=useState(formatDate(new Date()));

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

  return (
    <>
     <div className='radnikTermini_zaglavlje'>
        <h1 className='radnikTerminiNaslov'>Pregled termina</h1>
        <div className='deo-pretrage-radnikTermini'>
                <label className='labelaOdaberiDatum'>Odaberite datum</label>
                <div>
                <DatePicker
                          className='datePickerRadnik'
                              selected= { (datum===formatDate(new Date())) ? new Date() : new Date(datum)}
                              onChange={date => setDatum(formatDate(date))}
                              minDate={new Date()}
                              dateFormat='dd-MMM-yyyy'
                              maxDate={addDays(new Date(), 13)}
              />
              </div>
              </div>
     </div>

    <div className='radnik_termini_cont'>
      
       <KarticaPregledTerminaRadnik propdatum={datum}></KarticaPregledTerminaRadnik>
     </div>
     </>
    
             
    


   
  )
}

export default RadnikTermini
