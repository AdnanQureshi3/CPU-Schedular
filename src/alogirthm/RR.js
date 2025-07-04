export function roundRobin(processes, timeQuanta) {
  if (!timeQuanta || timeQuanta <= 0) timeQuanta = 90;

  // Create deep copies of processes to avoid mutating originals
  const readyQueue = processes.map(p => ({ ...p }));
  const processQueue = [];
  
  // Use objects instead of arrays for better id handling
  const completionTime = {};
  const responseTime = {};
  const firstExecution = {}; // Track first execution for response time

  let time = 0;

  // Helper to move arrived processes to queue
  const moveArrivedProcesses = (currentTime) => {
    let i = 0;
    while (i < readyQueue.length) {
      const proc = readyQueue[i];
      if (proc.arrival_time <= currentTime) {
        processQueue.push(readyQueue.splice(i, 1)[0]);
      } else {
        i++;
      }
    }
  };

  // Main simulation loop
  while (readyQueue.length > 0 || processQueue.length > 0) {
    // Move newly arrived processes
    moveArrivedProcesses(time);
    
    // Handle idle time when no processes are ready
    if (processQueue.length === 0) {
      if (readyQueue.length > 0) {
        // Jump time to next arrival
        time = Math.min(...readyQueue.map(p => p.arrival_time));
        continue;
      }
      break;
    }
    
    // Get next process from queue
    const current = processQueue.shift();
    
    // Record response time if first execution
    if (firstExecution[current.id] === undefined) {
      firstExecution[current.id] = true;
      responseTime[current.id] = time - current.arrival_time;
    }
    
    // Process execution
    const executionTime = Math.min(timeQuanta, current.burst_time);
    current.burst_time -= executionTime;
    time += executionTime;
    
    // Check for completion
    if (current.burst_time === 0) {
      completionTime[current.id] = time;
    } else {
      // Return to queue if still has burst time
      moveArrivedProcesses(time); // Check for new arrivals before requeueing
      processQueue.push(current);
    }
  }

  // Calculate statistics
  const processStats = [];
  let totalWT = 0, totalTAT = 0, totalRT = 0;
  let completedCount = 0;

  for (const p of processes) {
    if (completionTime[p.id] === undefined) continue;
    
    const tat = completionTime[p.id] - p.arrival_time;
    const wt = tat - p.burst_time;
    const rt = responseTime[p.id] || wt; // Fallback to WT if no response time
    
    processStats.push({
      id: p.id,
      arrival_time: p.arrival_time,
      burst_time: p.burst_time,
      completion_time: completionTime[p.id],
      turnaround_time: tat,
      waiting_time: wt,
      response_time: rt
    });
    
    totalWT += wt;
    totalTAT += tat;
    totalRT += rt;
    completedCount++;
  }

  // Calculate averages
  const avg = completedCount > 0 ? value => value / completedCount : () => 0;
  
  return {
    processStats,
    avgWT: avg(totalWT),
    avgTAT: avg(totalTAT),
    avgRT: avg(totalRT),
    completionTime: time
  };
}

export function runRoundRobinLive(processes, timeQuanta, onUpdate, onFinish) {
  let time = 0;
  let ready = [];
  let queue = [...processes];
  let processQueue = [];
  let gantt = [];
  let running = null;
  let completed = [];

  const interval = setInterval(() => {
    // Pull in new arrivals
    for (let i = 0; i < queue.length;) {
      if (queue[i].arrival_time <= time) {
        ready.push(queue[i]);
        queue.splice(i, 1);
      } else {
        i++;
      }
    }

    for (let i = 0; i < ready.length;) {
      if (!processQueue.find(p => p.id === ready[i].id)) {
        processQueue.push({ ...ready[i] }); // push copy with burst_time
        ready.splice(i, 1);
      } else {
        i++;
      }
    }

    if (!running && processQueue.length > 0) {
      running = processQueue.shift();

      if (gantt.length > 0 && gantt[gantt.length - 1].processId === null) {
        gantt[gantt.length - 1].endTime = time;
      }

      gantt.push({
        processId: running.id,
        startTime: time,
        endTime: null // to be filled later
      });
    }

    if (!running) {
      if (gantt.length === 0 || gantt[gantt.length - 1].processId !== null) {
        gantt.push({
          processId: null,
          startTime: time,
          endTime: null
        });
      }
    }

    onUpdate({
      time,
      readyQueue: [...processQueue],
      cpu: running,
      gantt: [...gantt]
    });

    if (running) {
      running.burst_time--;

      if (
        running.burst_time === 0 ||
        gantt[gantt.length - 1].endTime - gantt[gantt.length - 1].startTime + 1 === timeQuanta
      ) {
        gantt[gantt.length - 1].endTime = time + 1;

        if (running.burst_time === 0) {
          completed.push(running);
        } else {
          processQueue.push(running); // requeue if not done
        }

        running = null;
      }
    }

    if (queue.length === 0 && processQueue.length === 0 && !running) {
      if (gantt[gantt.length - 1].endTime === null) {
        gantt[gantt.length - 1].endTime = time + 1;
      }

      clearInterval(interval);
      onFinish({ gantt, completed });
      return;
    }

    time++;
  }, 1000);
}
