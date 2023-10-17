import React from 'react'
import './Dugme.css'

const Dugme = (props) => {
  return (
    <div>
      <button className={props.klasa} onClick={props.fja}>{props.text}</button>
    </div>
  )
}

export default Dugme
