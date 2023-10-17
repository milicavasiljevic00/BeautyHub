import React from 'react'
import Chart from "react-apexcharts";
import axios from 'axios';
import './MenadzerStatistika.css';
import { useState,useEffect } from 'react';
import LineChart from './LineChart'
import axiosInstance from './AxiosInstance';
import { useUserContext } from '../context/UserContext';

const MenadzerStatistika = () => {
  const [tipoviUsluga, setTipoviUsluga] = useState ([]);
  const [tipUsluge,setTipUsluge] = useState('0');
  const [godina,setGodina] = useState('0');
  const [mesec,setMesec] = useState('0');
  const [tUsluge2,setTipUsluge2] = useState('0');

  const [prihod,setPrihod] = useState('');

  const [vrednosti1,setVrednosti1] = useState([]);
  const {logOut}=useUserContext();

  function veliko(string){
    return string.charAt(0).toUpperCase()+string.slice(1);
  }


  useEffect(()=> {
    axios.get('https://localhost:5001/Usluga/PreuzmiTipoveUsluga')
      .then(res => {
        setTipoviUsluga(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  useEffect(()=> {
    axiosInstance.get(`https:/localhost:5001/Statistika/PrihodiVrednost/${godina}/${mesec}/${tUsluge2}`)
      .then(res => {
        setPrihod(res.data);
      })
      .catch(err => {
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
        console.log(err);
      })
  },[godina,mesec,tUsluge2])

  useEffect(() => {
    
    axiosInstance.get(`https://localhost:5001/Statistika/PrihodiGrafik/${tipUsluge}`)
      .then(res => {
        const vrednosti = [];
        vrednosti.push(res.data.jan);
        vrednosti.push(res.data.feb);
        vrednosti.push(res.data.mar);
        vrednosti.push(res.data.apr);
        vrednosti.push(res.data.maj);
        vrednosti.push(res.data.jun);
        vrednosti.push(res.data.jul);
        vrednosti.push(res.data.avg);
        vrednosti.push(res.data.sept);
        vrednosti.push(res.data.okt);
        vrednosti.push(res.data.nov);
        vrednosti.push(res.data.dec);
        console.log(vrednosti);
        setVrednosti1(vrednosti);
      })
      .catch(err => {
        if(err.response.status==401 || err.response.status==403)
        {   
            logOut();
        }
        console.log(err);
      })
  },[tipUsluge])

  

  const meseci=["Januar", "Februar", "Mart", "April", "Maj", "Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];
  const brojevi=[15,20,15,10,10,0,20,150,0,0,0,0];

  return (
    <>
      <div className='zaposleni_zaglavlje'>
        <h1 className='zaposleniNaslov'>Statistika prihoda</h1>
     </div>
    <div className='glavni-zaposleni'>
          <div className='pretragaDoprinosi'>
              <div className='deo-pretrageDoprinosi'>
                <div className="tipUslDiv">
                  <h4 className='divTekst'>Tip usluge</h4>
                  <select className='menadzer_doprinos_select' name='radnik' type="text" onChange={e => setTipUsluge(e.target.value)}>
                  <option value='0'>Ukupno</option>
                    {
                      tipoviUsluga.map((tip) => 
                        <option key={tip.id} value={tip.id}>{veliko(tip.naziv)}</option>
                      )
                    }
                  </select>
              </div>
            </div>
          </div>
      </div>
    <div className="kontDivStatistika">
    <div className='stats'>
    <React.Fragment> 
      <div className="divStatistikaa">
      
        <Chart
          type="line"
          width= {850}
          height={600}

          series={[
            {
              name: "Prihod",
              data: vrednosti1,
  
              
            },
          ]}
         
          options={{
            title: {
              text: "Statistika za 2023. godinu",
              style: { fontSize: 30, fontFamily: "Times New Roman", color: "#9d5e5e"},        
              align: 'center'
            },
            plotOptions:{
              bar :{
                dataLabels :{
                  position:'top'
                }
              }
            },

            stroke :{
              curve:'smooth'
            },

            colors: ["#ac6767"],
            theme: { mode: "light" },

            xaxis: {
              tickPlacement: "off",
              categories: meseci,
              
              /*title: {
                text: "Radnici",
                style: { fontSize: 30, fontFamily: "'Times New Roman', Times, serif" },

              },*/
            },

            
            chart:{
              toolbar: {
                show:false
              },
            },

            /*yaxis: {
                labels: {
                  formatter: (val) => {
                  return `${val}`;
                  },
                style: { fontSize: "15", colors: ["#A95C68"] },
              },
                 title: {
                 text: "User In (K)",
                 style: { color: "##A95C68", fontSize: 15 },
              },
            },*/

            /*legend: {
              show: true,
              position: "right",
            },*/

            /*dataLabels: {
              formatter: (val) => {
                return `${val}`;
              },
              style: {
                colors: ["#f4f4f4"],
                fontSize: 15,
              },
            },*/
          }}
        ></Chart>
      </div>
    </React.Fragment>
    </div>
    <div className='formaStatistikaa'>
      <div className='unutrasnja'>
        <div className='grupa'>  
        <select className='Godina' onChange={e => setGodina(e.target.value)}>
          <option value='-1' selected disabled hidden>Godina</option>
          <option value='0'>Ukupno</option>
          <option value='1'>2022</option>
          <option value='2'>2023</option>
        </select>
        </div>
        
        <div className='grupa'>
          
        <select className='Mesec' onChange={e => setMesec(e.target.value)}>
          <option value='-1' selected disabled hidden>Mesec</option>
          <option value='0'>Ukupno</option>
          <option value='1'>Januar</option>
          <option value='2'>Februar</option>
          <option value='3'>Mart</option>
          <option value='4'>April</option>
          <option value='5'>Maj</option>
          <option value='6'>Jun</option>
          <option value='7'>Jul</option>
          <option value='8'>Avgust</option>
          <option value='9'>Septembar</option>
          <option value='10'>Oktobar</option>
          <option value='11'>Novembar</option>
          <option value='12'>Decembar</option>
        </select>
        </div>

        <div className='grupa'>
        <select className='FormUsluga' onChange={e => setTipUsluge2(e.target.value)}>
      <option value='-1' selected disabled hidden>Tip usluge</option>
      <option value='0'>Ukupno</option>
      {
          tipoviUsluga.map((usluga) => 
            <option key={usluga.id} value={usluga.id}>{veliko(usluga.naziv)}</option>
          )
        }
      </select>
      </div>
      
      <div className='prihod'>Prihod : {prihod}</div>
      </div>
    </div>
    </div>
    </>

    )
}

export default MenadzerStatistika
