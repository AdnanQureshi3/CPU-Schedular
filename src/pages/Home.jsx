import React from 'react'
import Header from '../components/header'
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
// const fcfsimg = 
import FCFSimg from '../assets/FCFS-image.png'
import RRimg from '../assets/rrImage.png'
import SJF_Non_preemptiveimg from '../assets/SJF-non-preemptive.png'
import PRimg from '../assets/PR_Preemptive.png'
import PRnonPreemtive from '../assets/PR_non_Preemptive.png'
import Ljf_PreemptiveImg from '../assets/Ljf_preemptive.png'
import SJF_preemptiveimg from '../assets/SJF_preemptive.png'
import LJF_NON_PreemptiveImg from '../assets/LJFnonPreemptive.png'

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
      image:SJF_preemptiveimg,
    },
    {
      name:"Priority Non Preemptive",
      image:PRnonPreemtive,
    },
    {
      name:"Priority Preemptive",
      image:PRimg,
    },
    {
      name:"LJF Non Preemptive",
      image:LJF_NON_PreemptiveImg ,
    },
    {
      name:"LJF Preemptive",
      image:Ljf_PreemptiveImg,
    },
  ]

  const handleClick = (algoName) => {
    

    navigate('/algo', { state: { name: algoName } });
  };

 
  return (
  <div className=''>
    <Header/> 
    <div className="flex justify-center">
    <button onClick={() => {navigate('/stats')}}  className="text-2xl cursor-pointer bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl font-bold text-white text-center py-2 px-4 mt-5 shadow-lg hover:scale-105 transform transition-transform duration-300">
    View Stats
    </button>
</div>


    <div className='flex flex-row gap-20 py-5 flex-wrap px-10 justify-center'>

      {
        Algorithms.map((al) =>(
          <div className='w-52 border-2 cursor-pointer gap-4 aspect-square '
          onClick={() => {handleClick(al.name)}}
          >

            <img src={al.image} alt={`${al.name} Image`} />

          </div>
        ))
      }

    </div>



  </div>
  )
}

export default Home