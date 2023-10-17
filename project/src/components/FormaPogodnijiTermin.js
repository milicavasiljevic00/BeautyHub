import React from 'react'
import "./Usluge.css";
import { useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import "./Zaposleni.css";
import { useUserContext } from '../context/UserContext';
import "./FormaPogodnijiTermin.css";

function FormaPogodnijiTermin({proptip,propdatum,propusluga}) {

    const [vremena,setVremena]=useState([]) ;
    const [radnici,setRadnici]=useState([]);
    const [radnik,setRadnik]=useState(null);
    const [pogodnijeVreme, setPogodnijeVreme]=useState(0);
    const {connection}=useUserContext();
    const {logOut}=useUserContext();

    function veliko(string){
      return string.charAt(0).toUpperCase()+string.slice(1);
    }

    useEffect(()=>{
     axiosInstance.get(`https://localhost:5001/Vreme/VratiVremenaZauzetihTerminaTip/${proptip}/${propdatum}`)
    .then(res=>{
      setVremena(res.data);
      console.log("vremena");
      console.log(propdatum)
      console.log(res.data)
    })
    .catch(err=>{
      if(err.response.status==401 || err.response.status==403)
        {   
          logOut();  
        }
    })

    },[])

    useEffect(()=> {
      setRadnici([]);
      pogodnijeVreme>0 && (
        axiosInstance.get(`https://localhost:5001/Radnik/VratiRadnikeSaZakazanimTerminomVreme/${proptip}/${propdatum}/${pogodnijeVreme}`)
        .then(res=>{
          setRadnici(res.data);
        })
        .catch(err=>{
          if(err.response.status==401 || err.response.status==403)
          {   
            logOut();
          }
        })
      )
    
      },[pogodnijeVreme])

      const addToGroup =(idtermin)=>{
        if(connection)
        {
              connection.invoke('JoinGroup',idtermin.toString());
           
           
        }
        
      }

    function dodajPogodnijiTermin(){
        (pogodnijeVreme>0 && radnik>0) ? (
        axiosInstance.post(`https://localhost:5001/Termin/DodajPogodnijiTermin/${radnik}/${pogodnijeVreme}/${propdatum}/${propusluga}`)
        .then(res=>{
          alert("Termin je dodat! Dobicete obavestenje o njegovom eventualnom otkazivanju!")
          setPogodnijeVreme(0);
          setVremena([]);
          setRadnici([]);
          addToGroup(res.data);

        }).then(p=>{
          setVremena([])
          axiosInstance.get(`https://localhost:5001/Vreme/VratiVremenaZauzetihTerminaTip/${proptip}/${propdatum}`)
          .then(res=>{
            setVremena(res.data);
            setPogodnijeVreme(0);
          })
          .catch(err=>{
            console.log(err)
          })
        })
        .catch(err=>{
          console.log(err)
        })
        ) :
        alert("Niste popunili sva polja!")
      
      }
  return (
                    <div className='forma_pogodniji_termin_omotac'>
                      <div className='inputPoljaPogodnijiTermin'>
                            <label className='labelaVreme'>Unesite željeno vreme* :</label>
                            <select className='inputTekstTipUsluge' type='text' onChange={e => setPogodnijeVreme(e.target.value)}  >
                                <option value='0' /*selected disabled hidden*/></option>
                                {
                                    vremena && vremena.length>0 && (
                                    vremena.map((el) => 
                                    <option key={el.id} value={el.id}>{el.vremeOd}</option>)
                                    )
          
                                }
                            </select> 
                            <label className='labelaRadnikk'>Odaberite radnika* :</label>
                            <select className='inputTekstRadnikk' type='text' onChange={e => setRadnik(e.target.value)}  >
                              <option value='0' /*selected disabled hidden*/></option>
                              {
                                  radnici.map((el) => 
                                  <option key={el.id} value={el.id}>{veliko(el.ime)} {veliko(el.prezime)}</option>)
                              }
                            </select> 
                         
                            <button className='dodajPogodnijiTermin' onClick={()=>{dodajPogodnijiTermin()}}>Dodaj pogodniji termin</button>
                    </div> 
                  </div>
  )
}

export default FormaPogodnijiTermin
