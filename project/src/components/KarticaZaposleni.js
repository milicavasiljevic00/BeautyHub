import React, { useState } from 'react'
import Dugme from './Dugme.js'
import './Zaposleni.css'
import './KarticaZaposleni.css'
import {FaStar} from "react-icons/fa"

const KarticaZaposleni = ({zaposleni}) => {
    const [detalji, setDetalji] = useState(false);
    const [prosiri,setProsiri] = useState(false);
    function promeniDetalji() {
            setDetalji(!detalji);
            setProsiri(false);
    }

    let i=0;
    let ukupno = zaposleni.recenzije.length;
    function veliko(string){
      return string.charAt(0).toUpperCase()+string.slice(1);
    }
 
  return (
    <div className='kartica'>
        <i className="fa-solid fa-user fa-3x zaposleniIkona"></i>
        <div className='kartica-redIme'> {veliko(zaposleni.ime)}  {veliko(zaposleni.prezime)}  </div> 
        <div className='kartica-red'><i className="fa-solid fa-star"></i>      {zaposleni.ocena}</div>
        <div className='kartica-red'><i className="fa-solid fa-spa"></i>       {veliko(zaposleni.tipUsluge.naziv)}</div>
        <button className='detalji' onClick={()=>{promeniDetalji()}}>Detalji</button>
        {
            detalji && (
                <div className='zaposleni_kartica_detalji_modal'> 
                  <div className='zaposleni_kartica_detalji_overlay'></div>
                  <div className='zaposleni_kartica_detalji_modal-content'> 
                  <i className="fa-solid fa-x close-modal " onClick={()=>{promeniDetalji()}}></i>
                  
                  
                    <div className='slika'>
                      
                    </div>
                    
                      <label className='redime'> {veliko(zaposleni.ime)}  {veliko(zaposleni.prezime)}</label>
                      <label className='red'><i className="fa-solid fa-phone"></i>   {zaposleni.phoneNumber}</label>
                      <label className='red'><i className="fa-solid fa-spa fa-1x"></i>   {veliko(zaposleni.tipUsluge.naziv)}</label>
                      <label className='red'><i className="fa-solid fa-star fa-1x"></i>   {zaposleni.ocena}</label>
                      <label className='red'><i className="fa-solid fa-inbox fa-1x"></i> {zaposleni.email}</label>
                      <div className={prosiri ? "komentar_prosiren1" : "komentar1"}> 
                        <div className='recenzije-red' onClick={()=> setProsiri(!prosiri)}>
                          <i className="fa-solid fa-comment fa-1x"></i>
                          <div>Recenzije</div>
                          <div className='kom_strelica1'>
                          {
                            prosiri ? (<i className="fa-solid fa-arrow-up"></i>) :(<i className="fa-solid fa-arrow-down"></i>)
                          }
                          </div>
                        </div>
                        {
                          prosiri && (
                            <div>
                              {
                                zaposleni.recenzije.length==0?<div className='NemaRecenzije'>Zaposleni nema recenzije</div>:
                                zaposleni.recenzije.map((rec,index) =>{ 
                                    if(index<3){
                                      return(
                                        <div className="pregledRecenzijaZaposleni">
                                          <div className='div_zvezdice-zaposleni'>
                                            {[...Array(5)].map((zvezda, i) => {
                                                const ratingValue = i + 1;
                                                const isYellow = ratingValue <= rec.ocena; // Check if the current star should be yellow

                                                return (
                                                <label>
                                                    <input
                                                    className='ocenjivanje'
                                                    type="radio"
                                                    name="rating"
                                                    value={rec.ocena}
                                                    />
                                                    <FaStar
                                                    className='zvezda'
                                                    color={isYellow ? "#FFD500" : ""} // Set color dynamically
                                                    size={20}
                                                    />
                                                </label>
                                                );
                                            })}
                                        </div>
                                        <div className='komentari1'>
                                          ,, {rec.komentar} ''
                                        </div>
                                      </div>
                                      )
                                    }
                                  }
                                )
                              }
                            </div>
                          )
                        }

                      </div>
                  
                  </div>
                </div>

            )
        }
    </div>
  )
}

export default KarticaZaposleni
