import React from 'react';
import KarticaZaposleni from './KarticaZaposleni';
import axios from 'axios'
import {useState, useEffect} from 'react'
import './Zaposleni.css'

function Zaposleni() {
  const [zaposleni,setZaposleni] = useState([])
  const [tipoviUsluga, setTipoviUsluga] = useState ([])
  const [kriterijum, setKriterijum] = useState ("nema")
  const [usluga,setUsluga] = useState (0)
  const [pretraga, setPretraga] = useState("nema")
  const [ime,setIme] = useState("nema")
  const [prezime,setPrezime] = useState("nema")
  

  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  useEffect(()=> {
      axios.get('https://localhost:5001/Radnik/VratiSveRadnike')
      .then(res => {
        setZaposleni(res.data);
      })
      .catch((err) => {
      })

      axios.get('https://localhost:5001/Usluga/PreuzmiTipoveUsluga')
      .then(res => {
        setTipoviUsluga(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  useEffect(()=> {

    ucitaj();

  },[ime,prezime,kriterijum,usluga]);

  let params = [];
    
  function proveri(proba){
    let br=0;
    let niz = [];
    niz = proba.split(" ");
    niz=niz.filter(el=>/\S/. test(el));
    if(niz.length>2)
    {
      alert("Unesite najvise 2 reci");
    }
    if(niz.length==0){
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
          params[index]='nema'
        }
      })
    }
    setIme(params[0]);
    setPrezime(params[1]);   
  }

  const ucitaj=async()=>{
    try{
  const res= await axios.get(`https://localhost:5001/Radnik/PretraziRadnike/${kriterijum}/${ime}/${prezime}/${usluga}`);
  const data = await res.data;
  setZaposleni(res.data);
  }
catch (error) {
  alert(error.response.data)
}
  }


  const prikaziSveRadnike = () => {
    console.log("cao");
    axios.get('https://localhost:5001/Radnik/VratiSveRadnike')
      .then(res => {
        //console.log(res);
        setZaposleni(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
    
  
  return (
    <>
     <div className='zaposleni_zaglavlje'>
        <h1 className='zaposleniNaslov'>Zaposleni</h1>
     </div>
    <div className='glavni-zaposleni'>
          <div className='pretraga'>
              <div className='deo-pretrage1'>
                <input type='text' placeholder=' Pretrazi' className='inputPretrazi'  onChange={e => setPretraga(e.target.value)}></input>
                <i className="fa-solid fa-magnifying-glass fa-1x  lupa" onClick={() => {proveri(`${pretraga}`)}}></i>
              </div>
          
            <div className='deo-pretrage2'>
                <div className='text'>Filter </div>
                <select name='tipUsluge' className='element' onChange={e => setUsluga(e.target.value)}>
                  <option value="nema" selected disabled hidden className='sivo'>Izaberite uslugu</option>
                  <option value='0'></option>
                  {
                    tipoviUsluga.map((usluga) => 
                    <option key={usluga.id} value={usluga.id}>{veliko(usluga.naziv)}</option>)
                  }
                </select> 
             
              <div className='text'>Sortiraj po </div>
                  <select name='tip' className='element' placeholder='izaberi' onChange={e=> setKriterijum(e.target.value)}>
                    <option value="nema" selected disabled hidden className='sivo'>Izaberite kriterijum</option> 
                    <option value='nema'></option>
                    <option value='ime' >Imenu</option>
                    <option value='ocena'>Oceni</option>
                  </select>
            </div>

          </div>
         
      
    </div>
    <div className='zaposleni_spoljni_div'>
      <div className='kartice'>
      {
        zaposleni.map((radnik) => 
          <KarticaZaposleni  key={radnik.id} zaposleni={radnik}></KarticaZaposleni>
          
        )
      }
      </div>
    </div>
    </>
  );
}

export default Zaposleni