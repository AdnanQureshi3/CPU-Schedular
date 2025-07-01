import React from 'react'
import Header from '../components/header'
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

function Home() {
    const navigate = useNavigate();
  
  const Algorithms = [
    {
      name:"FCFS",
      image:"",
    },
    {
      name:"FCFS",
      image:"",
    },
    {
      name:"FCFS",
      image:"",
    },
    {
      name:"FCFS",
      image:"",
    },
    {
      name:"FCFS",
      image:"",
    },
    {
      name:"FCFS",
      image:"",
    },
    {
      name:"FCFS",
      image:"",
    },
  ]

  const handleClick = (algoName) => {
    navigate('/algo', { state: { name: algoName } });
  };

 
  return (
  <div className=''>
    <Header/> 

    <div className='flex flex-row gap-20 py-5 flex-wrap px-10 justify-center'>

      {
        Algorithms.map((al) =>(
          <div className='w-52 border-2 cursor-pointer gap-4 aspect-square '
          onClick={() => {handleClick(al.name)}}
          >
            <h1>{al.name}</h1>
          </div>
        ))
      }

    </div>



  </div>
  )
}

export default Home