import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosInstance from './AxiosInstance';
import KorisnikRecenzijaKartica from './KorisnikRecenzijaKartica';
import './KorisnikRecenzije.css';
import { useUserContext } from '../context/UserContext';
import {FaStar} from "react-icons/fa";


const KorisnikRecenzije = () => {

  const [ime,setIme] = useState("");
  const [prezime,setPrezime] = useState ([]);
  const [radnici,setRadnici] = useState([]);
  const [pretraga,setPretraga] = useState([]);
  const [radnikIme,setRadnikIme] = useState("nema");
  const [radnikPrezime,setRadnikPrezime] = useState("nema");


  const [komentar,setKomentar] = useState("");
  const [oceni,setOceni] = useState(false);

  const [rating,setRating] = useState(null);
  const [hover,setHover] = useState(null);
  const {logOut}=useUserContext();

  const pretragaRadnika = () => {
    let params = [];
    //console.log(pretraga);
    let niz = [];
    niz = pretraga.split(" ");
    niz=niz.filter(el=>/\S/. test(el));
    if(niz.length>2 /*|| niz.length==0*/)//ako ima vise od dve reci, ili nista
    {
      //alert("Unesite najvise 2 reci");
    }else if(niz.length==0){
      params[0]='nema';
      params[1]='nema';
  }
  else if(niz.length==1){
      params[0] = niz[0];
      params[1] = 'nema';
  }
  else{
    niz.map((el,index) => {
      if(el!=''){
        params[index]=el;
      }
      else{
        params[index]='nema';
      }
    })
  }
  setRadnikIme(params[0]);
  setRadnikPrezime(params[1]);
  console.log(radnikIme+"  "+ radnikPrezime);
  }


  useEffect(() => {
    console.log("tu sam");
    axiosInstance.get('https://localhost:5001/Radnik/VratiSveRadnikeKorisnika/')
    .then(res => {
      setRadnici(res.data);
    })
    .catch(err => {
      console.log(err);
      if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
    })
  },[]);

  useEffect(()=> {
    ucitaj();
  },[radnikIme,radnikPrezime]);


  const ucitaj=async()=>{
    try{
      const res = await axiosInstance.get(`https://localhost:5001/Radnik/PretraziRadnikeKorisnika/${radnikIme}/${radnikPrezime}`);
      setRadnici(res.data);
    }
    catch(err){
      console.log(err);
      if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
    }
  }

  const slanjeOcene = () => {
    if(rating === null || komentar===""){
      alert("Morate uneti sva polja");
      //setRating(null);
    }
    else{
    axiosInstance.post(`https://localhost:5001/SalonInfo/DodajPreporuku/${rating}/${komentar}`)
      .then(res => {
        console.log(res);
        alert("Dodata preporuka!");
        setOceni(false);
        setKomentar("");
      })
      .catch(err => {
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
        console.log(err);
      }) 
      
    }
  }

  return (
    <>
    <div className="ocenjivanje-glavni">
      <div className="divLeviOcenjivanje">
      <div className='ocenjivanje_zaglavlje'>
          <div className='ocenjivanjeNaslov'>Ocenite Vaše iskustvo</div>
      </div>
      <div className='korisnik_recenzije_zaglavlje'>
            <div className='deo-pretrage-recenzije'>
              <input type='text' placeholder=' Radnik' className='inputPretrazi'  onChange={e => setPretraga(e.target.value)}></input>
              <i className="fa-solid fa-magnifying-glass fa-1x  lupa" onClick={pretragaRadnika}></i>
            </div>
      </div>
      <div className='spoljni_div'>
        <div className='korisnik_recenzije_div'>
          {
            radnici.map((radnik) => <KorisnikRecenzijaKartica key={radnik.id} radnik={radnik}></KorisnikRecenzijaKartica>)
          }          
        </div>
      </div>
      </div>
      
      <div className="divDesniOcenjivanje">
        <div className='formaPreporukee'>
          <div className="naslovPreporukee"> Napišite preporuku! </div>
          <div className='div_zvezdice'>
                    {
                      [...Array(5)].map((zvezda,i)=>{
                        const ratingValue = i+1;

                        return (
                          <label>
                            <input
                              className='ocenjivanje'
                              type="radio"
                              name = "rating"
                              value = {ratingValue}
                              onClick={()=> setRating(ratingValue)}
                            />
                            <FaStar
                              className='zvezda'
                              color= {ratingValue <= (hover ||rating) ? "#FFD35C" : "#fff"}
                              size = {35}
                              onMouseEnter= {()=> setHover(ratingValue)}
                              onMouseLeave = {()=> setHover(null)}
                            />

                          </label>
                        )
                      })
                    }
                  </div>

                  <div className="preporuka-text">
                    <textarea className='preporuka-ta' placeholder="Vaši utisci..." onChange={e => setKomentar(e.target.value)}>

                    </textarea>
                  </div>
                  <button className="potvrdiPreporukuBtn" onClick={slanjeOcene}>Potvrdi</button>
        </div>
      </div>
    </div>
    </>
  )
  
}

export default KorisnikRecenzije
