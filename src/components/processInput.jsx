import { useState } from 'react'

export default function ProcessTable({onSubmitVisualization , onSubmitRUN}) {
  const [processes, setProcesses] = useState([
    { id: 0, arrival: '10', burst: '2' },
    { id: 1, arrival: '3', burst: '1' },
    { id: 2, arrival: '4', burst: '2' },
    { id: 3, arrival: '8', burst: '3' },
  ])

  const addProcess = () => {
    const nextId = processes.length
    setProcesses([...processes, { id: nextId, arrival: '', burst: '' }])
  }

  const deleteProcess = () => {
    if (processes.length > 1)
      setProcesses(processes.slice(0, processes.length - 1))
  }

  const handleChange = (index, field, value) => {
    const updated = [...processes]
    updated[index][field] = value
    setProcesses(updated)
  }

  const handleRun = () => {
  const finalProcesses = processes.map(p => ({
    id: p.id,
    arrival_time: parseInt(p.arrival),
    burst_time: parseInt(p.burst)
  }));
  onSubmitRUN(finalProcesses); // send to AlgoPage
};


  const handleVisualize = () => {
  const finalProcesses = processes.map(p => ({
    id: p.id,
    arrival_time: parseInt(p.arrival),
    burst_time: parseInt(p.burst)
  }));
  onSubmitVisualization(finalProcesses); // send to AlgoPage
};


  return (
    <div className="p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="px-6 py-2">Process</th>
            <th className="px-6 py-2">Arriving Time</th>
            <th className="px-6 py-2">CPU Burst</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, idx) => (
            <tr key={p.id} className="bg-yellow-100 text-center rounded-lg">
              <td className="py-2 font-semibold">P{p.id}</td>
              <td className="py-2 text-blue-500 cursor-pointer">
                <input
                  type="number"
                  placeholder='edit'
                  value={p.arrival}
                  onChange={(e) =>
                    handleChange(idx, 'arrival', e.target.value)
                  }
                  className="bg-transparent  text-center outline-none"
                />
              </td>
              <td className="py-2 text-blue-500 cursor-pointer">
                <input
                  type="number"
                  placeholder='edit'
                  value={p.burst}
                  onChange={(e) => handleChange(idx, 'burst', e.target.value)}
                  className="bg-transparent appearance-none text-center outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-6">
        <button
          onClick={addProcess}
          className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-full font-bold hover:bg-green-700"
        >
          + Add Process
        </button>
        <button
          onClick={deleteProcess}
          className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded-full font-bold hover:bg-red-700"
        >
          - Del Process
        </button>

        <button
  onClick={handleRun}
  className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700"
>
  ▶ Run Algorithm
</button>
        <button
  onClick={handleVisualize}
  className="bg-yellow-400 cursor-pointer text-white px-6 py-2 rounded-full font-bold hover:bg-yellow-600"
>
  ▶ Visualize it
</button>

      </div>
      
    </div>
  )
}
