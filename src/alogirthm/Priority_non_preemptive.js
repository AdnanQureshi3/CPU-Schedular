// Priority Non-Preemptive - Non-live simulation
export function priorityNonPreemptive(processes) {
  // Create deep copies of processes with priority
  const processesCopy = processes.map(p => ({
    id: p.id,
    arrival_time: p.arrival_time,
    burst_time: p.burst_time,
    priority: p.priority,  // New priority field
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
    
    // PRIORITY: Sort by priority (lower number = higher priority)
    processQueue.sort((a, b) => a.priority - b.priority);
    
    // Get highest priority job
    const current = processQueue.shift();
    
    // Record response time
    if (firstExecution[current.id] === undefined) {
      firstExecution[current.id] = true;
      responseTime[current.id] = time - current.arrival_time;
    }
    
    // Process runs to completion
    time += current.remaining;
    current.remaining = 0;
    
    // Record completion
    completionTime[current.id] = time;
    
    // Add processes that arrived during execution
    moveArrivedProcesses(time);
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
      priority: p.priority,
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

// Priority Non-Preemptive - Live simulation
export function runPriorityNonPreemptiveLive(processes, onUpdate, onFinish) {
  let time = 0;
  let ready = [];
  let queue = processes.map(p => ({ ...p })); // Create copies
  let processQueue = [];
  let gantt = [];
  let running = null;
  let completed = [];
  let remainingBurst = 0;

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

    // Move ready processes to processQueue
    i = 0;
    while (i < ready.length) {
      if (!processQueue.some(p => p.id === ready[i].id)) {
        processQueue.push(ready[i]);
        ready.splice(i, 1);
      } else {
        i++;
      }
    }

    // PRIORITY: Sort by priority (lower number = higher priority)
    processQueue.sort((a, b) => a.priority - b.priority);

    // Start new process if CPU is free
    if (!running && processQueue.length > 0) {
      running = processQueue.shift();
      remainingBurst = running.burst_time;

      // Close previous idle period
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

    // Update observers
    onUpdate({
      time,
      readyQueue: [...processQueue],
      cpu: running,
      gantt: [...gantt]
    });

    // Process current CPU burst
    if (running) {
      remainingBurst--;
      running.burst_time = remainingBurst;

      // Check for completion
      if (remainingBurst === 0) {
        gantt[gantt.length - 1].endTime = time + 1;
        completed.push({ 
          ...running,
          completion_time: time + 1
        });
        running = null;
      }
    }

    // Check for completion
    const allProcessesDone = queue.length === 0 && 
                            processQueue.length === 0 && 
                            ready.length === 0 && 
                            !running;

    if (allProcessesDone) {
      // Close final gantt entry
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