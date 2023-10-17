import React from 'react';
import './Korisnik.css';
import { useState,useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import { useUserContext } from '../context/UserContext';

function NotifikacijaKartica({ propnot, onDelete, onFilter}) {
  const [formaZakazi, setFormaZakazi]=useState(false);
  const [termin,setTermin]=useState(null);
  const [pop,setPop]=useState(0);
  const [popust,setPopust]=useState(false);
  const [unetiPopust,setUnetiPopust]=useState(0);
  const [usluga,setUsluga]=useState(0);
  const [usluge,setUsluge]=useState(0);

  const {connection} = useUserContext();
  const {logOut}=useUserContext();
  useEffect(()=> {
    if(propnot.tip===1)
    {
      axiosInstance.get(`https://localhost:5001/Termin/VratiTermin/${propnot.idter}`)
      .then(res=>{
        if(res.data==="nema")
        {
          
        }
        else
        {
          setTermin(res.data);
          console.log(res.data)
        }
        
      })
      .catch(err=>{
        console.log(err)
      })
    }
    

    axiosInstance.get(`https://localhost:5001/Account/GetUser`)
      .then(res=>{
        setPop(res.data[0].popust);
      })
      .catch(err=>{
        console.log(err)
      })

  },[])

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
  
  function zakazi(id,p){
    usluga>0 ? (
    axiosInstance.put(`https://localhost:5001/Termin/ZakaziTermin/${id}/${usluga}/${p}`)
        .then(res=>{
        alert(`Uspesno ste zakazali termin! Vasa cena je sada: ${res.data.cena}`);
        prikaziFormuZakazi();
        onDelete(propnot.id)
        if(res.data.id!=0)
        {
            connection.invoke('RemoveFromGroup',res.data.id.toString());
        }
        
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
    ) : alert("Morate da izaberete uslugu!")

  }

  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  function prikaziFormuZakazi(){
    if(propnot.idter>0 && termin)
    {
      setFormaZakazi(!formaZakazi);
      setUsluga(0);
      setPopust(false)
    }
    
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
    <div className='notifDiv'>
      <div className='notifOpis'>{propnot.opis}</div>
      <div className="brisiNot" onClick={()=>{onDelete(propnot.id)}}><i className="fa-solid fa-circle-minus" style={{ color: '#ac6767' }} ></i></div>
      <div className='divVremeDatumNotif'>{propnot.datumNot}</div>
      {
        propnot.tip==1
        &&
        (
          <div className='notStrelica' onClick={()=>{prikaziFormuZakazi()}}><i className="fa-solid fa-arrow-right-long fa-beat fa-1x"></i></div>
        )
      }
    </div>
    {
      formaZakazi && (
        <div className='kartica_termin_zakazi_modal'> 
                              <div className='kartica_termin_zakazi_overlay'></div>
                              <div className='kartica_termin_zakazi_modal_content'> 
                              <i className="fa-solid fa-x close-modal " onClick={()=>{prikaziFormuZakazi()}}></i>
                                <div className='poljaTerminZakazivanje'>
                                    <div className='kartica-termin-zakazi-labelaForma'>Odabrali ste termin od:  {termin.vremeOd}</div>
                                    <label className='kartica-termin-zakazi-labelaForma'>Datum: {formatDate(termin.datum)}</label>
                                    <label className='kartica-termin-zakazi-labelaForma'>Zaposleni: {veliko(termin.ime)} {veliko(termin.prezime)}</label>
                                    <label className='kartica-termin-zakazi-labelaForma'>Odaberite uslugu:</label>
                                    <select className='KorisnikZakazivanjeBiranje' type='text' onChange={e => setUsluga(e.target.value)} >
                                    <option value='0'></option>
                                    {
                                      termin.usluge.map((el) => 
                                      <option key={el.id} value={el.id}>{veliko(el.naziv)}</option>)
                                    }
                                    </select> 
                                    <div className='kartica-termin-zakazi-labelaForma' >
                                    <label className='kartica-termin-zakazi-labelaForma'>Iskoristi popust?</label>
                                    <input type="checkbox" className='biranje-popusta' onClick={() => setPopust(!popust)}/>
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
                                      <button className="btnZakaziTermin" onClick={()=>{zakazi(propnot.idter,unetiPopust)} }>
                                        Zakaži
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

export default NotifikacijaKartica
