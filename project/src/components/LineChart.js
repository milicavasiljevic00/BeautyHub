import React from "react";
import {Bar} from 'react-chartjs-2'
import { matchRoutes } from "react-router-dom";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )



const LineChart = () => {
    return (
    <div>
        LineCHART

        <Bar 
            data={{
                labels : ['Januar','Februar',"Mart","April","Maj","Jun","Jul",'Avgust',"Septembar","Oktobar","Novembar","Decembar"],
                datasets: [
                    {
                        label:'Depilacija',
                        data : [4,2,4,5,8,7,1,2,5,6,9,4],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            }}
        
            height={400}
            width= {600}
            options={{
                maintainAspectRatio:false
            }}
        /> 
    </div>
    )
}

export default LineChart