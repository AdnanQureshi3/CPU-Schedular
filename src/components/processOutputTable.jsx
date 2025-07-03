import React, { useEffect, useRef } from 'react';

function ProcessOutputTable({ data }) {
  const processes = data.processStats;
  const resultRef = useRef();
  useEffect(()=>{
    if(data && resultRef.current){
      // resultRef.current
       window.scrollBy({ top: 250, behavior: 'smooth' });
    }

  } , [data])

  return (
    <div ref={resultRef} className="p-4">
      <h2  className="text-xl font-semibold mb-2">📋 Process Statistics</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700 text-white text-center">
            <th className="px-4 py-2">Process</th>
            <th className="px-4 py-2">Arrival Time</th>
            <th className="px-4 py-2">Completion Time</th>
            <th className="px-4 py-2">Turnaround Time</th>
            <th className="px-4 py-2">Waiting Time</th>
            <th className="px-4 py-2">Response Time</th>
          </tr>
        </thead>
        <tbody>
          {[...processes].sort((a, b) => a.id - b.id).map((p) => (
            <tr key={p.id} className="bg-yellow-100 text-center">
              <td className="py-2 font-semibold">P{p.id}</td>
              <td className="py-2">{p.arrival_time}</td>
              <td className="py-2">{p.completion_time}</td>
              <td className="py-2">{p.turnaround_time}</td>
              <td className="py-2">{p.waiting_time}</td>
              <td className="py-2">{p.response_time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <span role="img" aria-label="chart">📊</span> Averages and Completion Time
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm sm:text-base text-gray-800">
    <div>
      <div className="font-semibold">Avg Waiting Time:</div>
      <div>{data.avgWT.toFixed(2)}</div>
    </div>
    <div>
      <div className="font-semibold">Avg Turnaround Time:</div>
      <div>{data.avgTAT.toFixed(2)}</div>
    </div>
    <div>
      <div className="font-semibold">Avg Response Time:</div>
      <div>{data.avgRT.toFixed(2)}</div>
    </div>
    <div>
      <div className="font-semibold">Total Completion Time:</div>
      <div>{data.completionTime}</div>
    </div>
  </div>
</div>

    </div>
  );
}

export default ProcessOutputTable;
