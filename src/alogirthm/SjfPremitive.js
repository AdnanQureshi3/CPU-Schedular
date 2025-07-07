// SJF Preemptive (SRTF) - Non-live simulation
export function sjfPreemptive(processes) {
  // Create deep copies of processes with remaining burst time
  const processesCopy = processes.map(p => ({
    id: p.id,
    arrival_time: p.arrival_time,
    burst_time: p.burst_time,
    remaining: p.burst_time
  })).sort((a, b) => a.arrival_time - b.arrival_time);

  let currentTime = 0;
  let nextArrivalIndex = 0;
  const readyQueue = [];
  let running = null;
  const completionTime = {};
  const responseTime = {};
  const firstExecution = {};
  let completedCount = 0;

  // Main simulation loop
  while (completedCount < processes.length) {
    // Add arrived processes to ready queue
    while (nextArrivalIndex < processesCopy.length && 
           processesCopy[nextArrivalIndex].arrival_time <= currentTime) {
      readyQueue.push(processesCopy[nextArrivalIndex]);
      nextArrivalIndex++;
    }

    // Sort by remaining time (SRTF priority)
    readyQueue.sort((a, b) => a.remaining - b.remaining || 
                              a.arrival_time - b.arrival_time || 
                              a.id.localeCompare(b.id));

    // Check for preemption
    if (running) {
      if (readyQueue.length > 0 && 
          readyQueue[0].remaining < running.remaining) {
        // Preempt current process
        readyQueue.push(running);
        running = null;
        readyQueue.sort((a, b) => a.remaining - b.remaining || 
                                  a.arrival_time - b.arrival_time || 
                                  a.id.localeCompare(b.id));
      }
    }

    // Get next process to run
    if (!running && readyQueue.length > 0) {
      running = readyQueue.shift();
      if (firstExecution[running.id] === undefined) {
        firstExecution[running.id] = true;
        responseTime[running.id] = currentTime - running.arrival_time;
      }
    }

    // Execute for 1 time unit
    if (running) {
      running.remaining--;
      
      // Check for completion
      if (running.remaining === 0) {
        completionTime[running.id] = currentTime + 1;
        completedCount++;
        running = null;
      }
    }

    currentTime++;
  }

  // Calculate statistics
  const processStats = processes.map(p => {
    const ct = completionTime[p.id];
    const tat = ct - p.arrival_time;
    const wt = tat - p.burst_time;
    const rt = responseTime[p.id] || 0;

    return {
      id: p.id,
      arrival_time: p.arrival_time,
      burst_time: p.burst_time,
      completion_time: ct,
      turnaround_time: tat,
      waiting_time: wt,
      response_time: rt
    };
  });

  // Calculate averages
  const avg = (sum, count) => count > 0 ? sum / count : 0;
  const totalTAT = processStats.reduce((sum, p) => sum + p.turnaround_time, 0);
  const totalWT = processStats.reduce((sum, p) => sum + p.waiting_time, 0);
  const totalRT = processStats.reduce((sum, p) => sum + p.response_time, 0);

  return {
    processStats,
    avgWT: avg(totalWT, processes.length),
    avgTAT: avg(totalTAT, processes.length),
    avgRT: avg(totalRT, processes.length),
    completionTime: currentTime
  };
}

// SJF Preemptive (SRTF) - Live simulation
export function runSRTFLive(processes, onUpdate, onFinish) {
  let time = 0;
  let ready = [];
  let queue = processes.map(p => ({ ...p, remaining: p.burst_time }));
  let processQueue = [];
  let gantt = [];
  let running = null;
  let completed = [];
  
  const interval = setInterval(() => {
    // Add arriving processes
    let i = 0;
    while (i < queue.length) {
      if (queue[i].arrival_time <= time) {
        ready.push(queue[i]);
        queue.splice(i, 1);
      } else {
        i++;
      }
    }

    // Move to process queue (avoid duplicates)
    i = 0;
    while (i < ready.length) {
      if (!processQueue.some(p => p.id === ready[i].id)) {
        processQueue.push(ready[i]);
        ready.splice(i, 1);
      } else {
        i++;
      }
    }

    // Sort by remaining time (SRTF priority)
    processQueue.sort((a, b) => a.remaining - b.remaining || 
                                a.arrival_time - b.arrival_time || 
                                a.id.localeCompare(b.id));

    // Check for preemption
    if (running) {
      if (processQueue.length > 0 && 
          processQueue[0].remaining < running.remaining) {
        // Preempt running process
        processQueue.push(running);
        running = null;
        processQueue.sort((a, b) => a.remaining - b.remaining || 
                                    a.arrival_time - b.arrival_time || 
                                    a.id.localeCompare(b.id));
      }
    }

    // Start new process if CPU is free
    if (!running && processQueue.length > 0) {
      running = processQueue.shift();
      
      // Close idle period if needed
      if (gantt.length > 0 && gantt[gantt.length - 1].processId === null) {
        gantt[gantt.length - 1].endTime = time;
      }
      
      // Start new execution period
      gantt.push({
        processId: running.id,
        startTime: time,
        endTime: null
      });
    }

    // Handle idle state
    if (!running) {
      if (gantt.length === 0 || gantt[gantt.length - 1].processId !== null) {
        gantt.push({
          processId: null,
          startTime: time,
          endTime: null
        });
      }
    }

    // Execute current process
    if (running) {
      running.remaining--;
      
      // Check for completion
      if (running.remaining === 0) {
        gantt[gantt.length - 1].endTime = time + 1;
        completed.push({ 
          ...running, 
          completion_time: time + 1 
        });
        running = null;
      }
    }

    // Update state
    onUpdate({
      time,
      readyQueue: [...processQueue],
      cpu: running,
      gantt: [...gantt]
    });

    // Check for completion
    if (queue.length === 0 && 
        ready.length === 0 && 
        processQueue.length === 0 && 
        !running) {
      // Close final gantt entry
      const lastGantt = gantt[gantt.length - 1];
      if (lastGantt.endTime === null) {
        lastGantt.endTime = time + 1;
      }
      
      clearInterval(interval);
      onFinish({ gantt, completed });
    }

    time++;
  }, 1000);
}