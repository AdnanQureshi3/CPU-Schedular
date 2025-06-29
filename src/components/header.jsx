import React from 'react'

function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white py-2 shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold ">
          CPU Scheduler Algorithm & Visualizer
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-200">
          Compare, visualize and understand how CPU scheduling works
        </p>
      </div>
    </header>
  )
}

export default Header
