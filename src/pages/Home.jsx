import React from 'react'
import Header from '../components/header'
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
// const fcfsimg = 
import FCFSimg from '../assets/FCFS-image.png'
import RRimg from '../assets/rrImage.png'
import SJF_Non_preemptiveimg from '../assets/SJF-non-preemptive.png'
import PRimg from '../assets/priorityImage.png'
function Home() {
    const navigate = useNavigate();
  
  const Algorithms = [
    {
      name:"FCFS",
      id:1,
      image:FCFSimg,
    },
    {
      name:"Round Robin",
      id:2,
      image:RRimg,
    },
    {
      name:"SJF Non Preemptive",
      id:3,
      image:SJF_Non_preemptiveimg,
    },
    {
      name:"SJF Premitive",
      id:4,
      image:PRimg,
    },
    {
      name:"Priority Non Preemptive",
      image:PRimg,
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
   
            <img src={al.image} alt="" />
            
          </div>
        ))
      }

    </div>



  </div>
  )
}

export default Home