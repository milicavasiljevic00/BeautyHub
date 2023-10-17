import React from "react";
import {Link} from 'react-router-dom';
import './Footer.css';
import axiosInstance from './AxiosInstance';
import { useUserContext } from '../context/UserContext';
import {useNavigate} from 'react-router-dom'
import { useState, useEffect, useRef} from "react";
  
const Footer = () => {

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

  }
catch (error) {
  console.log("error", error);
}
}
  ucitaj()
  
}, []);

  return (
    
    <div className="box">
      <div className="container1">
        <div className="row">
          <div className="column">
            <p className="heading">{naziv}</p>
            <p style={{color:"#FFFF"}}>Ime moje lepote. Veliki, moderan prostor koji odise svezinom i pruza osecaj mira ravnoteze i perfekcionizma.</p>
            <br/>
            <Link to="/Pocetna" className="alink">O nama</Link>
          </div>
          <div className="column">
            <p className="heading">Usluge</p>
            <p style={{color:"#FFFF"}}>Stalno praćenje inovacija, kroz ulaganja u nove preparate garantuje stručnost u pružanju kozmetičkih usluga.</p>
            <br/>
            
            <Link to="/Usluge" className="alink">Pregled usluga</Link>
          </div>
          <div className="column">
            <p className="heading">Kontakt</p>
            <p style={{color:"#FFFF"}}>{adresa}</p>
            <br/>
            <p style={{color:"#FFFF"}}>{telefon}</p>
            <br/>
            <br/>
            <Link to="/Kontakt" className="alink">Kontaktirajte nas</Link>

          </div>
          <div className="column">
            <p className="heading">Radno vreme</p>
            <p style={{color:"#FFFF"}}>Ponedeljak - Nedelja: {vremeOd} - {vremeDo}</p>
          </div>
          <div className="column">
            <img className="logo-footer" src="../bhlogoveliki.png"/>
          </div>
        </div>
      </div>
    </div>
    
  );
};
export default Footer;