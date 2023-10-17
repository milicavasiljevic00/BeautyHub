import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from './AxiosInstance';
import Footer from './Footer';
import './TipUsluge.css'
import { useParams } from 'react-router-dom';
import './Usluge.css';
import './IzmeniUsluga.css';
import IzmeniUslugaKartica from './IzmeniUslugaKartica';
import { useUserContext } from '../context/UserContext';

function IzmeniUsluga() {

    const [tip, setTip] = useState([]);
    const [usluge, setUsluge]=useState([]);
    const {naziv} = useParams();
    const [opis,setOpis]=useState("");
    const [opisNovi,setOpisNovi]=useState("");
    const [prom,setProm]=useState(false);
    const [forma,setForma]=useState(false);
    const [nazivNove,setNazivNove]=useState("");
    const [cena, setCena]=useState("");
    const [formaIzmeni,setFormaIzmeni]=useState(false);
    const [obrisiForma,setobrisiForma] = useState(false);
    const {logOut}=useUserContext();

    useEffect(()=> {

        ucitaj();
    
      },[])
    
    
       const ucitaj=async()=>{
          try{
        const res= await axiosInstance.get(`https://localhost:5001/Usluga/PreuzmiTipUsluge/${naziv}`);
          setTip(res.data);
          setOpis(res.data.opis);
          setOpisNovi(res.data.opis);
          ucitaj1()
        }
      catch (error) {
        console.log("error", error);
      }
    }
    
        const ucitaj1=async()=>{
          axiosInstance.get(`https://localhost:5001/Usluga/PreuzmiUsluge/${naziv}`)
      .then((res)=>{
        setUsluge(res.data);
        setProm(true);
      })
      .catch(err=>{
      })

    }

    function veliko1(string) {
      if (string === null) {
        return undefined;
      }
    
      if (typeof string === 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
      } else {
        return undefined;
      }
    }
    

    const sacuvajTip = () => {
        console.log(opis);
        console.log(opisNovi);
      if(opisNovi===opis)
      {
        alert("Niste uneli izmenu!");
      }
      else if(opisNovi==="")
      {
        alert("Morate uneti opis!");
        
      }
      else
      {
        axiosInstance.put(`https://localhost:5001/Usluga/AzurirajTipUsluge/${tip.id}/${opisNovi}`)
      .then((response)=>{
        alert("Uspesno ste azurirali tip usluge");
        setOpis(opisNovi);
      })
      .catch(err=>{
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
      })
      }
     
    }
 

  const brisanjeUsluge = async(id) => {
    axiosInstance.delete(`https://localhost:5001/Usluga/ObrisiUslugu/${id}`)
    .then((response)=>{
      setUsluge(usluge.filter((usluga)=>usluga.id!==id));
      alert("Uspesno obrisana usluga!");
    })
    .catch(err=>{
      if(err.response.status==401 || err.response.status==403)
      {   
          logOut();
      }
      else{
        alert(err.response.data);
      }
    })
  }

  function prikaziObrisiFormu() {
    setobrisiForma(!obrisiForma);
  }

  function prikaziFormu(){
    setForma(!forma);
    setNazivNove("");
    setCena("");
  }
  
  function dodavanjeUsluge(){

    nazivNove!=="" && cena!=="" ? (

    axiosInstance.post(`https://localhost:5001/Usluga/DodajUslugu/${tip.id}/${nazivNove}/${cena}`)
    .then((response)=>{
      setUsluge([...usluge,response.data]);
      prikaziFormu();
    })
    .catch(err=>{
      if(err.response.status==401 || err.response.status==403)
      {   
          logOut();
      }
      else{
        alert(err.response.data);
      }
      
    })
    ) : alert("Popunite sva polja!");
  }

  function izmeniUslugu(id){
    setFormaIzmeni(!formaIzmeni);
  }

  const sacuvajIzmene=async()=>{
    ucitaj1();

  }

  return (
              <>
                <div className='izmeni_uslugu_celastrana'> 
                    <div className='izmeni_usluga_strana'>
                      <div className='izmeni_usluga_zaglavlje'>
                        <div className='slikaUsluga_div'>
                          <img src={`../slikeUsluge/${tip.naziv}.jpg`} className="slikaUsluga"></img>
                        </div>
                        <div className='izmeni_usluga_inputPoljaTipUsluge'>
                          <label className='izmeni_usluga_labelaFormaTipUsluge1'>Naziv: {veliko1(tip.naziv)}</label>
                          <label className='izmeni_usluga_labelaFormaTipUsluge2'>Trajanje (u minutima): {tip.trajanje}</label>
                          <label className='izmeni_usluga_labelaFormaTipUsluge3' >Opis* :</label>
                          <textarea className='opis_izmene' type='text' defaultValue={veliko1(tip.opis)} onChange={(e)=>setOpisNovi(e.target.value)}></textarea>
                          <button className='izmeni_uslugu' onClick={sacuvajTip}>Sacuvaj</button>
                        </div> 
                      </div>
                    </div>
                </div>
              

              <div className='pregledUsluga_zaglavlje'>
                          <h1 className='uslugeNaslov'>Pregled usluga</h1>
              </div>
                    <div className='prikazPregledaUsluga'>
                      <button className='dodajUslugu' onClick={() => { prikaziFormu() }}>+ Dodaj uslugu</button>
                      {
                         forma && (
                            <div className='izmeniTip_dodajUslugu_modal'> 
                              <div className='izmeniTip_dodajUslugu_overlay1'></div>
                              <div className='izmeniTip_dodajUslugu_modal-content'> 
                              <i className="fa-solid fa-x close-modal " onClick={() => { prikaziFormu() }}></i>
                                <div>
                                    <label className='labelaForma'>Naziv nove usluge:</label>
                                    <input className='inputTekst' type='text' onChange={(e)=>setNazivNove(e.target.value)}></input>
                                    <label className='labelaForma'>Cena nove usluge:</label>
                                    <input className='inputTekst' type='number' onChange={(e)=>setCena(e.target.value)}></input>
                                    <div className='dugmeomotac'> 
                                    <button className="izmeni_usluga_dodajUslugu" onClick={() => { dodavanjeUsluge() }}>
                                      Dodaj
                                    </button>
                                    </div>
                                    
                                </div>
                              
                              </div>
                            </div>

                        )
                    }
                    <ul className='izmeni_usluga_lista'>
                              {
                                  usluge.map((usluga)=>
                                  <IzmeniUslugaKartica key={usluga.id} propusluga={usluga} brisanje={brisanjeUsluge} izmeni={sacuvajIzmene} ></IzmeniUslugaKartica>
                                  )
                              }
                     </ul>
                     
                    </div>

              </>
               
  )
}
export default IzmeniUsluga



