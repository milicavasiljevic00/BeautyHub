import React, { useState, useEffect, useRef } from 'react';
import './DropDownMenu.css';


const DropDownMenu = ({ propuloga, handleProfileClick, handleLogoutClick }) => {
  useEffect(()=> {
    console.log(propuloga)
    
  }, []);
  return (
    <div className="dropdown-menu">
      {propuloga!=="Menadzer" && (
          <div className="menu-item" onClick={handleProfileClick}>
          <i class="fa-solid fa-user covek"></i>
            Moj profil
          </div>
      )}
      <div className="menu-item" onClick={handleLogoutClick}>
        Odjavi se
      </div>
    </div>
  );
};

export default DropDownMenu;
