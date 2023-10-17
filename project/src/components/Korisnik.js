import React from 'react'
import './Korisnik.css'
import {useNavigate} from 'react-router-dom';
import { useState, useEffect, useRef} from "react";
import Footer from './Footer.js';
import axiosInstance from './AxiosInstance';
import NotifikacijaKartica from './NotifikacijaKartica';
import { useUserContext } from '../context/UserContext';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import './KorisnikNovi.css';


function Korisnik() {
 
  const [ime,setIme]=useState("");
  const [prezime,setPrezime] = useState("");
  const [email,setEmail] = useState("");
  const [telefon,setTelefon] = useState("");
  const [pop,setPop]=useState(0);
  const {logOut}=useUserContext();

  const[novoIme, setNovoIme]=useState("");
  const[novoPrezime, setNovoPrezime]=useState("");
  const[noviBroj, setNoviBroj]=useState("");
  const [formaAzuriraj,setFormaAzuriraj]=useState(false);
  const [formaSifra,setFormaSifra]=useState(false);
  const [oldpass,setOldPass]=useState("");
  const [newpass,setNewPass]=useState("");
  const [checkpass, setCheckPass] = useState("")
  const [pritisnuto,setPritisnuto]=useState(false);
  const [notifikacije,setNotifikacije]=useState([]);

  const navigate = useNavigate();


  useEffect(()=> {
      const ucitaj=async()=>{
        try{
      const res= await axiosInstance.get('https://localhost:5001/Account/GetUser');
      
      setIme(res.data[0].ime);
      setPrezime(res.data[0].prezime);
      setEmail(res.data[0].email);
      setTelefon(res.data[0].phoneNumber);
      setNovoIme(res.data[0].ime);
      setNovoPrezime(res.data[0].prezime);
      setNoviBroj(res.data[0].phoneNumber);
      setPop(res.data[0].popust);

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
   
  
    function azurirajKorisnika(){

      if(novoIme==="" || novoPrezime==="" || noviBroj===""){
        alert("Niste uneli sva polja");
      }
      else{
    
      axiosInstance.put(`https://localhost:5001/Korisnik/AzurirajLicneInfoKorisnik/${novoIme}/${novoPrezime}/${noviBroj}`)
      .then((response)=>{
        console.log(response.data);
        setIme(response.data[0].ime);
        setPrezime(response.data[0].prezime);
        setTelefon(response.data[0].phoneNumber);
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

    function azurirajSifru()
    {
          if(oldpass.length===0 || newpass.length===0 || checkpass.length==0)
          {
          if(oldpass.length===0){
            alert("Unesite staru sifru");
          }
          else if(newpass.length===0){
            alert("Unesite novu sifru");
          }
          else if(checkpass.length===0){
            alert("Potvrdite novu sifru");
          }
      }
      else{

        if(newpass===checkpass)
        {
          axiosInstance.put(`https://localhost:5001/Account/ChangePassword/${oldpass}/${newpass}`)
          .then((response)=>{
            alert(response.data);
            setOldPass("");
            setNewPass("");
            window.location.reload(false);
          
          })
          .catch(err=>{
            console.log(err.response.data);
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
        else
        {
          alert("Pogresna potvrda nove sifre!");
        }
         
      }
    }

  return (
    <div className='korisnik'>
        <div className='korisnik-Info'>
            <div className='korisnik-Info-levo'>
                <div className='kvadrat-user'>
                  <i className="fa-solid fa-user fa-7x korisnik-Ikona-covek"></i>
                </div>
            </div>
            <div className='korisnik-Info-desno'>
              <div className='info_red'>
                <label className='info_labelaForma'>Ime* :</label>
                <input className='info_inputTekst' type='text' value={veliko(novoIme)} onChange={(e)=>setNovoIme(e.target.value)}></input>
              </div>

              <div className='info_red'>
              <label className='info_labelaForma'>Prezime* :</label>
              <input className='info_inputTekst' type='text' value={veliko(novoPrezime)} onChange={(e)=>setNovoPrezime(e.target.value)}></input>
              </div>

              <div className='info_red'>
                <label className='info_labelaForma'>E-mail :</label>
                <input className='info_inputTekst' type='text' value={email} ></input>
              </div>

              <div className='info_red'>
                <label className='info_labelaForma'>Telefon* :</label>
                <input className='info_inputTekst' type='text' defaultValue={telefon} value={noviBroj} onChange={(e)=>setNoviBroj(e.target.value)}></input>
              </div>
              <button className='info_potvrdiBtn' onClick = {() => {azurirajKorisnika()}}>
                Potvrdi
              </button>
            </div>
        </div>

        <div className='korisnik-Lozinka'>
          <div className='korisnik-Info-levo'>
                <div className='kvadrat-user'>
                <i class="fa-solid fa-lock fa-7x"></i>
                </div>
          </div>
          <div className='korisnik-Info-desno'>
            <div className='info_red'>
              <label className='lozinka_labelaForma'>Stara lozinka* :</label>
              <input className='lozinka_inputTekst' type='password' onChange={(e)=>setOldPass(e.target.value)}></input>
            </div>

            <div className='info_red'>
                <label className='lozinka_labelaForma'>Nova lozinka* :</label>
                <input className='lozinka_inputTekst' type='password' onChange={(e)=>setNewPass(e.target.value)}></input>
            </div>

            <div className='info_red'>
              <label className='lozinka_labelaForma'>Potvrdite novu lozinku* :</label>
              <input className='lozinka_inputTekst' type='password' onChange={(e)=>setCheckPass(e.target.value)} ></input>
            </div>

            <button className='info_potvrdiBtn' onClick = {() => {azurirajSifru()}}>
                Sačuvaj
            </button>

          </div>
        </div>

        <div className='korisnik-Kasa'>
            <div className='korisnik-Info-levo'>
                <div className='kvadrat-user'>
                  <i class="fa-solid fa-gift fa-7x"></i>
                </div>
            </div>
            <div className='korisnik-Info-desno'>
                <div className='korisnik-Kasa-popust'>
                  <div className='korisnik-text-popust'>Ostvaren popust:</div>
                  <div className='korisnik-popust'>{pop} RSD</div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Korisnik

