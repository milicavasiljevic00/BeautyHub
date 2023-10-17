import React from 'react';
import './Radnik.css';
import {useNavigate} from 'react-router-dom';
import { useState,useEffect } from 'react';
import axiosInstance from './AxiosInstance';
import './Korisnik.css';
import { useUserContext } from '../context/UserContext';

function Radnik() {

  const [ime, setIme]=useState("");
  const [prezime, setPrezime]=useState("");
  const [email, setEmail]=useState("");
  const [tel,setTel]=useState("");
  const [formaAzuriraj,setFormaAzuriraj]=useState(false);
  const[novoIme, setNovoIme]=useState("");
  const[novoPrezime, setNovoPrezime]=useState("");
  const[noviBroj, setNoviBroj]=useState("");
  const [formaSifra,setFormaSifra] = useState(false);
  const [oldpass,setOldPass]=useState("");
  const [newpass,setNewPass]=useState("");
  const [checkpass, setCheckPass] = useState("")
  const {logOut}=useUserContext();

  function prikaziFormuSifra(){
    setFormaSifra(!formaSifra);
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

  useEffect(()=> {
      const ucitaj=async()=>{
        try{
      const res= await axiosInstance.get(`https://localhost:5001/Account/GetUser`);
      setIme(res.data[0].ime);
      setPrezime(res.data[0].prezime);
      setEmail(res.data[0].email);
      setTel(res.data[0].phoneNumber);
      setNovoIme(res.data[0].ime);
      setNovoPrezime(res.data[0].prezime);
      setNoviBroj(res.data[0].phoneNumber);
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

    function azurirajRadnika(){
      novoIme!=="" && novoPrezime!=="" && noviBroj!=="" ? (
      axiosInstance.put(`https://localhost:5001/Radnik/AzurirajLicneInfoRadnik/${novoIme}/${novoPrezime}/${noviBroj}`)
      .then((response)=>{
        setIme(response.data[0].ime);
        setPrezime(response.data[0].prezime);
        setTel(response.data[0].phoneNumber);
        alert("Uspesno ste izmenili informacije!")
        window.location.reload(false);
        //ucitaj();
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
      ): alert("Niste popunili sva polja!");
    }
  const navigate = useNavigate();

  const goToRadnikTermini = () => {
    navigate('/RadnikTermini');
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
                <input className='info_inputTekst' type='text' defaultValue={tel} value={noviBroj} onChange={(e)=>setNoviBroj(e.target.value)}></input>
              </div>
              <button className='info_potvrdiBtn' onClick = {() => {azurirajRadnika()}}>
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
    </div>
  )
}

export default Radnik