import React from 'react'
import "./Admin.css";
import {useNavigate} from 'react-router-dom'
import { useState, useEffect, useRef} from "react";
import axiosInstance from './AxiosInstance';
import { useUserContext } from '../context/UserContext';


function Admin() {
  const [naziv,setNaziv]=useState("");
  const [vremeOd,setVremeOd] = useState("");
  const [vremeDo,setVremeDo] = useState("");
  const [telefon,setTelefon] = useState("");
  const [adresa,setAdresa]=useState("");

  const [noviNaziv,setNoviNaziv]=useState("");
  const [novoVremeOd,setNovoVremeOd] = useState("");
  const [novoVremeDo,setNovoVremeDo] = useState("");
  const [noviTelefon,setNoviTelefon] = useState("");
  const [novaAdresa,setNovaAdresa]=useState("");

  const navigate = useNavigate();
  const {logOut}=useUserContext();

  useEffect(()=> {
  const ucitaj=async()=>{
    try{
  const res= await axiosInstance.get('https://localhost:5001/SalonInfo/PreuzmiSalonInfo');
  
      setNaziv(res.data[0].naziv);
      setVremeOd(res.data[0].vremeOd);
      setVremeDo(res.data[0].vremeDo);
      setTelefon(res.data[0].telefon);
      setAdresa(res.data[0].adresa);

      setNoviNaziv(res.data[0].naziv);
      setNovoVremeOd(res.data[0].vremeOd);
      setNovoVremeDo(res.data[0].vremeDo);
      setNoviTelefon(res.data[0].telefon);
      setNovaAdresa(res.data[0].adresa);

  }
catch (error) {
  console.log("error", error);
}
}
  ucitaj()
  
}, []);


function veliko(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  const goToAdminRecenzije = () => {
    navigate('/AdminRecenzije');
  }
  const goToAdminUsluge = () => {
    navigate('/AdminUsluge');
  }

  function azurirajInformacije(){

    if(noviNaziv==="" || novaAdresa==="" || noviTelefon==="" || novoVremeOd==="" || novoVremeDo===""){
      alert("Niste uneli sva polja");
    }
    else{
  
    axiosInstance.put(`https://localhost:5001/SalonInfo/IzmeniSalonInfo/${noviNaziv}/${novoVremeOd}/${novoVremeDo}/${novaAdresa}/${noviTelefon}`)
    .then((response)=>{
      console.log(response.data);
      setNaziv(response.data[0].naziv);
      setAdresa(response.data[0].adresa);
      setTelefon(response.data[0].telefon);
      setVremeOd(response.data[0].vremeOd);
      setVremeDo(response.data[0].vremeDo);

      window.location.reload(false);
      alert("Uspesno ste izmenili informacije!");
       
    })
    .catch(err=>{
      console.log(err);
      if(err.response.status==401 || err.response.status==403)
      {   
          logOut();
      
      }
    })
  }
  }
  
  return (
    <div className='admin'>
      <div className='admin-content'>
        <div className='admin_levo'>
          <div className='admin_podaci'>
                <div className='slika_admin'>
                <i class="fa-solid fa-store fa-10x"></i>
                </div>
                <h3 className='admin_licni_podaci1'>{naziv}</h3>
                <h3 className='admin_licni_podaci'>Radno vreme : {vremeOd} - {vremeDo}  </h3>
                <label className='admin_licni_podaci tamno-sivo'>Adresa  : {adresa} </label>
                <label className='admin_licni_podaci tamno-sivo'>Broj telefona : {telefon}</label>
                {/*<button className='podaci-desno dugme-izmeni' onClick={goToAdminIzmeni}>Izmeni informacije</button>*/}
          </div>
        </div>
        <div className='admin_desno'>
        <div className='admin-Info-desno'>
              <div className='admin_info_red'>
                <label className='admin_info_labelaForma'>Naziv* :</label>
                <input className='admin_info_inputTekst' type='text' value={ veliko(noviNaziv)} onChange={(e)=>setNoviNaziv(e.target.value)}></input>
              </div>

              <div className='admin_info_red'>
              <label className='admin_info_labelaForma'>Adresa* :</label>
              <input className='admin_info_inputTekst' type='text' value={ veliko(novaAdresa)} onChange={(e)=>setNovaAdresa(e.target.value)}></input>
              </div>

              <div className='admin_info_red'>
                <label className='admin_info_labelaForma'>Telefon* :</label>
                <input className='admin_info_inputTekst' type='text' value={ veliko(noviTelefon)} onChange={(e)=>setNoviTelefon(e.target.value)}></input>
              </div>

              <div className='admin_info_red'>
                <label className='admin_info_labelaForma'>Početak radnog vremena* :</label>
                <input className='admin_info_inputTekst' type='text' defaultValue={ vremeOd} value={ novoVremeOd} onChange={(e)=>setNovoVremeOd(e.target.value)}></input>
              </div>

              <div className='admin_info_red'>
                <label className='admin_info_labelaForma'>Kraj radnog vremena* :</label>
                <input className='admin_info_inputTekst' type='text' defaultValue={ vremeDo} value={ novoVremeDo} onChange={(e)=>setNovoVremeDo(e.target.value)}></input>
              </div>

              <button className='admin_info_potvrdiBtn' onClick = {() => {azurirajInformacije()}}>
                Potvrdi
              </button>
            </div>
        
      </div>
    </div>
      
  </div>
  )
}

export default Admin
