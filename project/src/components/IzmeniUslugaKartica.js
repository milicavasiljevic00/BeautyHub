import React from 'react'
import { useState } from 'react';
import axiosInstance from './AxiosInstance';
import { useUserContext } from '../context/UserContext';

function IzmeniUslugaKartica({propusluga, brisanje, izmeni}) {

    const [obrisiForma,setobrisiForma] = useState(false);
    const [cenaIzmenjena, setCenaIzmenjena]=useState("");
    const [formaIzmeni,setFormaIzmeni]=useState(false);
    const {logOut}=useUserContext();

    function veliko(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    function izmeniUslugu(id, cena){
      cena!=="" ? (
        axiosInstance.put(`https://localhost:5001/Usluga/AzurirajUslugu/${id}/${cena}`)
        .then((response)=>{
          izmeni();
          setFormaIzmeni(!formaIzmeni);
          setCenaIzmenjena("")
        })
        .catch(err=>{
          if(err.response.status==401 || err.response.status==403)
          {   
            logOut();
          }
          else
          {
            alert(err.response.data)
          }
          
        })
        ): alert("Unesite cenu!");

    }

    function prikaziObrisiFormu() {
        setobrisiForma(!obrisiForma);
      }

    function brisanjeUsluge(id){
        brisanje(id);
        setobrisiForma(false);
    }


  return (
    <>
    <div className='izmeni_usluga_usluge'>
    <div className='div_info'>
      <div className='usluga_naziv'>{veliko(propusluga.naziv)}</div>
      <div className='usluga_cena'>{propusluga.cena} RSD</div>
    </div>
    <div className='divDugimici'>
      <button className='IzmeniUslugu' onClick={() => { setFormaIzmeni(true) }}>Izmeni</button>
      <button className='ObrisiUslugu' onClick={setobrisiForma}>Obriši</button>
    </div>
  </div>
  {
    formaIzmeni && (
       <div className='izmeni_modal'> 
         <div className='izmeni_overlay1'></div>
         <div className='izmeni_modal-content'> 
         <i className="fa-solid fa-x close-modal " onClick={() => { setFormaIzmeni(false) }}></i>
           <div className='izmeni_modal-content-podaci'>
               <label className='lblNazivUslugee'>{veliko(propusluga.naziv)}</label>
               
               <div>
                <label className='lblUslugaCenaa'>Cena:</label>
                <input className='inputTekstCena' type='number' onChange={(e)=>setCenaIzmenjena(e.target.value)}></input>
               </div>
               <button className="btnDodajUslugu" onClick={() => { izmeniUslugu(propusluga.id, cenaIzmenjena) }}>
                 Sacuvaj
               </button>
           </div>
         
         
         </div>
       </div>

   )
   
  }
    {
        obrisiForma && (
        <div className='obrisi_usluga_admin_modal'> 
        <div className='obrisi_usluga_admin_overlay'></div>
        <div className='obrisi_usluga_admin_modal-content'> 
        <i className="fa-solid fa-x close-modal " onClick={() => {prikaziObrisiFormu()}}></i>
        
        <label className='lblNazivUslugee'>Da li ste sigurni da želite da obrišete uslugu?</label>
        <div className='obrisi_usluga_admin_dugmici'>
            <button className='btnDodajUslugu' onClick={()=>{brisanjeUsluge(propusluga.id) }}>Obriši</button>
            <button className='btnDodajUslugu' onClick={() => {setobrisiForma()}}>Otkaži</button>
        </div>
        
        
        </div>
        </div>


        )
    }
     </>
  )
}

export default IzmeniUslugaKartica
