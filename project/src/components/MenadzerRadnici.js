import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import axiosInstance from './AxiosInstance';
import "./MenadzerRadnici.css";
import { useUserContext } from '../context/UserContext';

import { useRef } from 'react';
const MenadzerRadnici = () => {

  const [ime,setIme]=useState("");
  const [prezime,setPrezime] = useState("");
  const [telefon,setTelefon] = useState("");
  const [tipovi,setTipovi] = useState([]);
  const[tip,setTip]=useState(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")
  const[radnik,setRadnik]=useState(null);
  const[radnici,setRadnici]=useState([]);

  const [prosiriDodavanje,setProsiriDodavanje] = useState(false);
  const [prosiriBrisanje,setProsiriBrisanje] = useState(false);
  const {logOut}=useUserContext();

  const refIme = useRef("");
  const refPrezime = useRef("");
  const refTelefon = useRef("");
  const refMail = useRef("");
  const refLozinka = useRef("");
  const refTip = useRef("")


  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  useEffect(()=> {
    axiosInstance.get('https://localhost:5001/Usluga/PreuzmiTipoveUsluga')
    .then(res=>{
      setTipovi(res.data)
    })
    .catch(err=>{
    })

  },[])

  useEffect(()=> {
    axiosInstance.get('https://localhost:5001/Radnik/VratiSveRadnike')
    .then(res=>{
      setRadnici(res.data)
    })
    .catch(err=>{
    })

  },[])

  function dodajRadnika()
  {
    (email!=="" && password!=="" && ime!=="" && prezime!=="" && telefon!=="" && tip!==null)? (
    axiosInstance.post(`https://localhost:5001/Account/DodajRadnika/${ime}/${prezime}/${telefon}/${tip}/${email}/${password}`)
    .then(res=>{
      
      alert("Uspesno ste dodali radnika!");
      refIme.current.value="";
      refPrezime.current.value="";
      refMail.current.value="";
      refLozinka.current.value="";
      refTelefon.current.value="";
      refTip.current.value="";
      setIme("");
      setPrezime("");
      setTelefon("");
      setEmail("");
      setPassword("");
      setTip(null);
      
    })
    .then(p => {
      axiosInstance.get('https://localhost:5001/Radnik/VratiSveRadnike')
    .then(res=>{
      setRadnici(res.data)
    })
    .catch(err=>{
    })
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
    ) : alert("Niste popunili sva polja!");
    
  }
  function obrisiRadnika()
  {
    if(!radnik){
      alert("Niste izabrali radnika kog zelite da obrisete");
    }
    else{

    axiosInstance.delete(`https://localhost:5001/Radnik/ObrisiRadnika/${radnik}`)
    .then(res=>{
      
     alert("Uspesno ste obrisali radnika");
     setRadnik(0);

    })
    .then(p => {
      axiosInstance.get('https://localhost:5001/Radnik/VratiSveRadnike')
    .then(res=>{
      setRadnici(res.data)
    })
    .catch(err=>{
      
    })
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
    // axiosInstance.get('https://localhost:5001/Radnik/VratiSveRadnike')
    // .then(res=>{
    //   setRadnici(res.data)
    // })
    // .catch(err=>{
    //   console.log(err)
    // })

  }
  }
  return (
    <>
    <div className='usluge_zaglavlje'>
      <h1 className='uslugeNaslov'>Upravljanje zaposlenima</h1>
    </div>
    <div className='divVeliki'>
        
        <div className='divZaSliku'>
          <img className="nekaSlika" src={`../DodavanjeRadnika.jpg`}></img>
        </div>
        <div className='divDesni'>
                  <div className="prosireno"> 
                      <div className='dodavanje_radnika '>
                        
                      <div className="lblDodavanjeRadnika">Dodavanje zaposlenih</div>
                      </div>
                          <div className='divDodajRadnika'>
                          <input className='inputDodajRadnika' type='text' placeholder= {"Ime"} ref={refIme} onChange={(e)=>setIme(e.target.value)}></input>
                          <input className='inputDodajRadnika' type='text' placeholder= {"Prezime"} ref={refPrezime} onChange={(e)=>setPrezime(e.target.value)}></input>
                          <input className='inputDodajRadnika' type='text' placeholder= {"Telefon"} ref={refTelefon} onChange={(e)=>setTelefon(e.target.value)}></input>
                          <input className='inputDodajRadnika' type='text' placeholder= {"E-mail"} ref={refMail} onChange={(e)=>setEmail(e.target.value)}></input>
                          <input className='inputDodajRadnika' type='password' placeholder= {"Lozinka"} ref={refLozinka} onChange={(e)=>setPassword(e.target.value)}></input>
                          <select className='inputDodajRadnika' type='text' ref={refTip} onChange={e => setTip(e.target.value)} >
                              <option value='0' selected disabled hidden>Tip usluge</option>
                              {
                                tipovi.map((el) => 
                                <option key={el.id} value={el.naziv}>{veliko(el.naziv)}</option>)
                              }
                          </select>
                          <button className='btnDodajRadnika' onClick={()=>{dodajRadnika()}}>Dodaj</button>
                        </div>
                  </div>

                  <div className="prosirenoB"> 
                      <div className='brisanje_radnika'>
                        <div className="lblBrisanjeRadnika">Brisanje zaposlenih</div>
                      </div>
                          <div className='divObrisiRadnika'>
                              <select className='inputDodajRadnika' type='text' onChange={e => setRadnik(e.target.value)} >
                                  <option value='0' selected ></option>
                                  {
                                    radnici.map((el) => 
                                    <option key={el.id} value={el.id}>{veliko(el.ime)+" "+veliko(el.prezime)}</option>)
                                  }
                              </select>
                              <button className='btnDodajRadnika' onClick={()=>{obrisiRadnika()}}>Obriši</button>
                          </div>
                    </div>           
        </div>
    </div>
    </>
  )
}

export default MenadzerRadnici
