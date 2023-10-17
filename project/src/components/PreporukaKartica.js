import React, { useState } from 'react'
import Dugme from './Dugme.js'
import './PreporukaKartica.css'
import {FaStar} from "react-icons/fa"

const PreporukaKartica = ({preporuka}) => {
    
    function veliko(string){
      return string.charAt(0).toUpperCase()+string.slice(1);
    }
 
  return (
    <div className='preporukaKartica'>
        <div className='ocena-preporuka'>
            <div className='div_zvezdice'>
                {[...Array(5)].map((zvezda, i) => {
                    const ratingValue = i + 1;
                    const isYellow = ratingValue <= preporuka.ocena; // Check if the current star should be yellow

                    return (
                    <label>
                        <input
                        className='ocenjivanje'
                        type="radio"
                        name="rating"
                        value={preporuka.ocena}
                        />
                        <FaStar
                        className='zvezda'
                        color={isYellow ? "#FFD500" : ""} // Set color dynamically
                        size={35}
                        />
                    </label>
                    );
                })}
            </div>

        </div>
        <div className="tekstPreporuke">
            ,,{preporuka.komentar}''

        </div>
        <div className="potpis">
            {veliko(preporuka.ime)}
        </div>
    </div>
  )
}

export default PreporukaKartica
