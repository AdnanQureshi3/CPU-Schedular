import { useState } from 'react'

export default function ProcessTable() {
  const [processes, setProcesses] = useState([
    { id: 0, arrival: '', burst: '' }
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
          className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700"
        >
          + Add Process
        </button>
        <button
          onClick={deleteProcess}
          className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700"
        >
          - Del Process
        </button>
      </div>
    </div>
  )
}
