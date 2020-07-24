import React from "react"
import "./background-sunglasses.scss"

const BackgroundSunglasses = ({ children, onClick }) => (
  <div className="background-sunglasses" onClick={onClick}>
    <div
      className="background-sunclasses-child-wrapper"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
)

export default BackgroundSunglasses
