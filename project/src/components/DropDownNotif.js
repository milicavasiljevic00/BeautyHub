import React, { useState, useEffect, useRef } from 'react';
import './DropDownNotif.css';
import NotifikacijaKartica from './NotifikacijaKartica';
import './Korisnik.css';


const DropDownNotif = ({ propNotifikacije, onDelete, onFilter}) => {
  return (
    <div className="dropdown-menuN">
        {propNotifikacije.length>0 && (
        <ul className='listaNot'>
                
                    {propNotifikacije.map((not)=>
                    <NotifikacijaKartica propnot={not} onDelete={onDelete} onFilter={onFilter}></NotifikacijaKartica>)}
                
            </ul>
        )}
      
    </div>
  )
}

export default DropDownNotif