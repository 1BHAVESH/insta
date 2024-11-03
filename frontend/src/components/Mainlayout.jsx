import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function Mainlayout() {
  return (
    <div>
        <LeftSidebar />
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default Mainlayout