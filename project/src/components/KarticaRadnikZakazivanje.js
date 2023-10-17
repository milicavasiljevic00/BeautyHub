import React from 'react';
import { useEffect, useState } from 'react';
import KarticaTermin from './KarticaTermin';
import axiosInstance from './AxiosInstance';
import "./KarticaRadnikZakazivanje.css"
import { useUserContext } from '../context/UserContext';


function KarticaRadnikZakazivanje( {propradnik, datum, propusluga}) {

  const {connection} = useUserContext();
  const {logOut}=useUserContext();
    const [termini,setTermini]=useState([]);
      function veliko(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      
    useEffect(()=> {
        axiosInstance.get(`https://localhost:5001/Termin/VratiSveTermineRadnikDan/${propradnik.id}/${datum}`)
        .then(res=>{
          setTermini(res.data);
        })
        .catch(err=>{
          console.log(err)
          if(err.response.status==401 || err.response.status==403)
          {   
            logOut();
            //window.localStorage.removeItem("jwToken");
            //return <Navigate to="/" replace />;
          }
        })
    
      },[])

      const zakazi = async (id,p) => {
        axiosInstance.put(`https://localhost:5001/Termin/ZakaziTermin/${id}/${propusluga}/${p}`)
        .then(res=>{
        setTermini(termini.filter((t) => t.id !== id))
        alert(`Uspesno ste zakazali termin! Vasa cena je sada: ${res.data.cena}`);
        if(res.data.id!=0)
        {
            connection.invoke('RemoveFromGroup',res.data.id.toString());
        }
        })
        .catch(err=>{
          if(err.response.status==401 || err.response.status==403)
          {   
            logOut();
            //window.localStorage.removeItem("jwToken");
            //return <Navigate to="/" replace />;
          }
          else
          {
            alert(err.response.data);
          }
          
    })
      }  

  return (
    <div className='omotac'>
      <div className='karticaRadnikZakazivanje'>
        <h2 className='radnikIme'>{veliko(propradnik.ime)}  {veliko(propradnik.prezime)}</h2>
          <ul className='kartica_radnik_zakazivanje_spoljni_div'>
              {
                termini.length>0?
              termini.map((ter)=>
              
              <KarticaTermin key={ter.id} propzakazi={zakazi} proptermin={ter} propradnik={propradnik} propdatum={datum}></KarticaTermin>        
              ): <div className='NemaSlobodnih'>Nema dostupnih termina.</div>
              
              }
          </ul>

        
      </div>
    </div>
  )
}

export default KarticaRadnikZakazivanje
