import React from 'react'
import "./styles.css"

const Button = ({text, onClick,blue,disabled}) => {
  let className = 'btn';
  if (text === 'Delete') {
    className += ' btn-red';
  } else if (blue) {
    className += ' btn-blue';
  }
  return (
    <div className={className} onClick={onClick} disabled={disabled}>
      {text}
    </div>
  )
}

export default Button
