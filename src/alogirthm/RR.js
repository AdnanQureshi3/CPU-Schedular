export function roundRobin(processes, timeQuanta) {
  if (!timeQuanta || timeQuanta <= 0) timeQuanta = 90;

  // Create deep copies of processes with remaining burst time
  const processesCopy = processes.map(p => ({
    id: p.id,
    arrival_time: p.arrival_time,
    burst_time: p.burst_time,
    remaining: p.burst_time
  }));

  const readyQueue = [...processesCopy];
  const processQueue = [];
  
  const completionTime = {};
  const responseTime = {};
  const firstExecution = {};

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
    const executionTime = Math.min(timeQuanta, current.remaining);
    current.remaining -= executionTime;
    time += executionTime;
    
    // Move processes that arrived during execution
    moveArrivedProcesses(time);
    
    // Check for completion
    if (current.remaining === 0) {
      completionTime[current.id] = time;
    } else {
      // Return to queue if still has burst time
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
    const rt = responseTime[p.id];
    
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
  let queue = processes.map(p => ({ ...p })); // Create copies to avoid mutation
  let processQueue = [];
  let gantt = [];
  let running = null;
  let completed = [];
  let currentRunTime = 0; // Track continuous CPU time for running process

  const interval = setInterval(() => {
    // Add arriving processes to ready queue
    let i = 0;
    while (i < queue.length) {
      if (queue[i].arrival_time <= time) {
        ready.push(queue[i]);
        queue.splice(i, 1);
      } else {
        i++;
      }
    }

    // Move ready processes to processQueue (avoiding duplicates)
    i = 0;
    while (i < ready.length) {
      if (!processQueue.some(p => p.id === ready[i].id)) {
        processQueue.push(ready[i]);
        ready.splice(i, 1);
      } else {
        i++;
      }
    }

    // Start new process if CPU is free
    if (!running && processQueue.length > 0) {
      running = processQueue.shift();
      currentRunTime = 0; // Reset quantum counter

      // Close previous idle period if needed
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
      // Start new idle period if needed
      if (gantt.length === 0 || gantt[gantt.length - 1].processId !== null) {
        gantt.push({
          processId: null,
          startTime: time,
          endTime: null
        });
      }
    }

    // Update observers with current state
    onUpdate({
      time,
      readyQueue: [...processQueue],
      cpu: running,
      gantt: [...gantt]
    });

    // Process current CPU burst
    if (running) {
      running.burst_time--;
      currentRunTime++;

      const shouldPreempt = currentRunTime >= timeQuanta;
      const shouldComplete = running.burst_time <= 0;

      if (shouldComplete || shouldPreempt) {
        // Close current execution period
        const currentGantt = gantt[gantt.length - 1];
        currentGantt.endTime = time + 1;

        if (shouldComplete) {
          completed.push(running);
        } else {
          processQueue.push(running); // Requeue if not finished
        }

        running = null;
      }
    }

    // Check for simulation completion
    const allProcessesDone = queue.length === 0 && 
                            processQueue.length === 0 && 
                            ready.length === 0 && 
                            !running;

    if (allProcessesDone) {
      // Close final gantt entry if needed
      const lastGantt = gantt[gantt.length - 1];
      if (lastGantt.endTime === null) {
        lastGantt.endTime = time + 1;
      }

      clearInterval(interval);
      onFinish({ gantt, completed });
      return;
    }

    time++;
  }, 1000);
}