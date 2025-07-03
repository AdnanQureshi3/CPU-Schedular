import { useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { runFCFSLive, FCFS } from '../alogirthm/fcfs' // adjust path if needed
import ProcessTable from '../components/processInput'
import ProcessOutputTable from '../components/processOutputTable'

function AlgoPage() {

  const resultRef = useRef();
  const stopRef = useRef(null);

  const [liveData, setLiveData] = useState(null)

  useEffect(() => {
    if (liveData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [liveData]);
  const { state } = useLocation()
  const algoName = state?.name

  const [Data, setData] = useState(null)
  const [finished, setFinished] = useState(false);
  const [stop, setStop] = useState(false);


  const handleProcessVisualization = (processes) => {
    setLiveData(null)
    setFinished(false)
    // setStop(false);

    if (algoName === 'FCFS') {
      const stopFn = runFCFSLive(
        processes,
        (data) => setLiveData(data),
        () => setFinished(true)
      )

      stopRef.current = stopFn;
    }

  }
  const handleProcessRun = (processes) => {
    if (algoName === 'FCFS') {
      setData(FCFS(processes));
    }
  }
  const handleReset = () => {
    setLiveData(null);
    setData(null);
    setFinished(false);
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Selected Algorithm: {algoName}
      </h1>

      <ProcessTable onSubmitVisualization={handleProcessVisualization} onSubmitRUN={handleProcessRun} />
      {
        Data &&
        <ProcessOutputTable data={Data} />
      }

      {
        liveData &&
        <h1 className='text-lg font-semibold pl-3 mt-6'> 📊Process Visualization </h1>
      }

      {liveData && (

        <div ref={resultRef} className="mt-3  bg-gray-100 p-4 rounded shadow">

          <p className="text-lg font-semibold">⏱ Time: {liveData.time}</p>

          <p className="mt-2">
            🟡 Ready Queue:{' '}
            {liveData.readyQueue.length > 0
              ? liveData.readyQueue.map((p) => `P${p.id}`).join(', ')
              : 'Empty'}
          </p>

          <p className="mt-2">
            🟢 CPU Running:{' '}
            {liveData.cpu ? `P${liveData.cpu.id}` : 'Idle'}
          </p>

          <div className="mt-4">
            <p className="font-semibold mb-1">📊 Gantt Chart:</p>
            <div className="flex gap-2 flex-wrap">

              {liveData.gantt.map((g, idx) => {

                var duration = g.endTime - g.startTime;
                duration = Math.max(1.5, duration);


                return (
                  <div key={idx} style={{ width: `${duration * 3.5}%` }} className="text-center">

                    <div className={`${g.processId !== null ? 'bg-blue-500' : "bg-red-500"} text-white px-4 py-2 rounded`}>
                      {g.processId !== null ? `P${g.processId}` : 'Idle'}
                    </div>
                    <div className="text-sm">
                      {g.startTime} - {g.endTime}
                    </div>
                  </div>
                )
              }

              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (stopRef.current) stopRef.current();
              setFinished(true);
            }}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            {finished === false ? ('⏹ Stop Simulation'):("⏹ Stopped")}
            
          </button>

        </div>
      )}

      {finished && (
        <p className="mt-4 text-green-700 font-bold">
          ✅ Simulation Complete
        </p>
      )}
      {
        (liveData || Data) && (
          <button
            onClick={()=>{
              handleReset();
              if (stopRef.current) stopRef.current();

            }}

            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            🔄 Reset
          </button>
        )
      }

    </div>
  )
}

export default AlgoPage
