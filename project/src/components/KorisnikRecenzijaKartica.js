import axios from 'axios';
import React, { useState } from 'react'
import axiosInstance from './AxiosInstance';
import './KorisnikRecenzijaKartica.css'
import {FaStar} from "react-icons/fa"
import { useUserContext } from '../context/UserContext';

const KorisnikRecenzijaKartica = ({radnik}) => {

  const [ocena,setOcena] = useState(0);
  const [komentar,setKomentar] = useState("");
  const [oceni,setOceni] = useState(false);

  const [rating,setRating] = useState(null);
  const [hover,setHover] = useState(null);
  const {logOut}=useUserContext();

  const oceniRadnika = () => {
      setOceni(!oceni);
      setRating(null);
  }
  const slanjeOcene = () => {
    if(rating === null || komentar===""){
      alert("Morate uneti sva polja");
      //setRating(null);
    }
    else{
    axiosInstance.post(`https://localhost:5001/Recenzija/OceniRadnika/${radnik.id}/${rating}/${komentar}`)
      .then(res => {
        console.log(res);
        alert("Dodat komentar");
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
  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  return (
    <div className='korisnik_recenzija_kartica_div'>
      
      <i className="fa-solid fa-user fa-3x"></i>
      <div className='kartica-redIme'>{veliko(radnik.ime)+" "+veliko(radnik.prezime)}</div>
      <div className='kartica-red'><i className="fa-solid fa-phone"></i>{" "+ radnik.phoneNumber}</div>
      <div className='kartica-red'><i className="fa-solid fa-spa"></i>{" "+veliko(radnik.tipUsluge.naziv)}</div>
      <button  className='korisnik_recenzija_oceni kartica-red' onClick={oceniRadnika}>Oceni <i class="fa-solid fa-thumbs-up"></i></button>
      {
        oceni && (
          <div className='korisnik_recenzija_modal'> 
            <div className='korisnik_recenzija_overlay'> 
              <div className='korisnik_recenzija_modal-content'> 
                  <i className="fa-solid fa-x close-modal " onClick={oceniRadnika}></i>
                  <h2 className='popup-redIme'>{veliko(radnik.ime)+" "+veliko(radnik.prezime)}</h2>      
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
                  <textarea type='text' placeholder=' Vaše iskustvo...' className='unos_komentara' onChange={e => setKomentar(e.target.value)}></textarea>
                  <button className='btn_oceni' onClick={slanjeOcene}> Oceni</button>
                
              </div>
            </div>
          </div>
        )

      }
      
      
    </div>
    
  )
}

export default KorisnikRecenzijaKartica
