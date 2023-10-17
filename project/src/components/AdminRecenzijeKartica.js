import React, { useState } from 'react';
import axiosInstance from './AxiosInstance';
import {FaStar} from "react-icons/fa"
import axios from 'axios';
import './AdminRecenzijeKartica.css'

const AdminRecenzijeKartica = ({rec, onDelete}) => {
    const [prosiri,setProsiri] = useState(false);

    const [obrisiForma,setobrisiForma] = useState(false);

    function veliko(string){
        return string.charAt(0).toUpperCase()+string.slice(1);
      }


    function brisanjeRecenzije(idRec){
    onDelete(idRec)
    setobrisiForma(!obrisiForma);
    
    }
    return(
        <div className='admin_recenzija_kartica'>
            <div className='ime_prez'>
                <div className='ime'>{veliko(rec.ime)+" "+veliko(rec.prezime)}</div> 
            </div>
            <div className='ocena'>
            <div className='div_zvezdice'>
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
                        color={isYellow ? "#FFD500" : "a16f6f"} // Set color dynamically
                        size={30}
                        />
                    </label>
                    );
                })}
            </div>

            </div>
            <div className={prosiri ? "komentar_prosiren" : "komentar"}>
                <div className='kom_strelica' onClick={()=> setProsiri(!prosiri)}>
                    <div className="kom_kom">Komentari</div>
                {
                    prosiri ? (<i className="fa-solid fa-arrow-up"></i>) :(<i className="fa-solid fa-arrow-down"></i>)
                }
                </div>
                {
                    prosiri && (
                        <div>
                        <textarea disabled className='komentari'>{rec.komentar}</textarea>
                        <div className='kanta'><i className="fa-solid fa-trash kantica" onClick={()=> setobrisiForma(!obrisiForma)}></i></div>
                        {
                            obrisiForma && (
                                <div className='admin_recenzija_obrisi_modal'>
                                    <div className='admin_recenzija_obrisi_overlay'> </div> 
                                    <div className='obrisi_usluga_admin_modal-content'> 
                                    <i className="fa-solid fa-x close-modal " onClick={() => {setobrisiForma(!obrisiForma)}}></i>
                                    <label className='lblNazivUslugee'>Da li ste sigurni da želite da obrišete recenziju?</label>
                                    <div className='admin_recenzija_obrisi_dugmici'>
                                    <button className='btnDodajUslugu' onClick={()=>{brisanjeRecenzije(rec.id)}}>Obriši</button>
                                    <button className='btnDodajUslugu' onClick={() => {setobrisiForma(!obrisiForma)}}>Otkaži</button>
                                    </div>
                                    </div>

                                </div>
                            )
                        }
                        </div>                 
                    )
                }

            </div>
        
            
        </div>
        
    );
}

export default AdminRecenzijeKartica