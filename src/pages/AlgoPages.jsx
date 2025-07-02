import { useLocation } from 'react-router-dom'
import { useState } from 'react'

import { runFCFSLive } from '../alogirthm/fcfs' // adjust path if needed
import ProcessTable from '../components/processInput'

function AlgoPage() {
  const { state } = useLocation()
  const algoName = state?.name

  const [liveData, setLiveData] = useState(null)
  const [finished, setFinished] = useState(false);
  const [stop, setStop] = useState(false);


  const handleProcessSubmit = (processes) => {
    setLiveData(null)
    setFinished(false)
    setStop(false);

    if (algoName === 'FCFS') {
      runFCFSLive(
        processes,
        (data) => setLiveData(data),
        () => setFinished(true)
      )
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Selected Algorithm: {algoName}
      </h1>

      <ProcessTable onSubmit={handleProcessSubmit} />

      {liveData && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
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

              {liveData.gantt.map((g, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded">
                    {g.processId !== null ? `P${g.processId}` : 'Idle'}
                  </div>
                  <div className="text-sm">
                    {g.startTime} - {g.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {finished && (
        <p className="mt-4 text-green-700 font-bold">
          ✅ Simulation Complete
        </p>
      )}
    </div>
  )
}

export default AlgoPage
