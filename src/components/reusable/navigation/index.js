import React from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

const NavigationBars = () => {
  return (
    <>
      {sessionStorage.getItem('accessToken') ?
        <>
          <Navbar />
          <Sidebar />
        </>
        : ""}
    </>
  )
}

export default NavigationBars;