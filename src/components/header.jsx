import React from 'react'
import { useNavigate , useLocation } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white py-4 shadow-md relative">
      <div className="container mx-auto px-4 md:px-0">
        
        {/* Buttons at top-left */}
       {location.pathname !== '/' && (
         <div className="absolute top-4 left-4 flex space-x-2">
           <button
             onClick={() => navigate(-1)}
             className="bg-white text-indigo-600 font-medium px-3 py-1 rounded hover:bg-indigo-100 transition"
           >
             Back
           </button>
         </div>
       )}

        {/* Centered title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold">
            CPU Scheduler Algorithm & Visualizer
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            Compare, visualize and understand how CPU scheduling works
          </p>
        </div>

      </div>
    </header>
  )
}

export default Header
