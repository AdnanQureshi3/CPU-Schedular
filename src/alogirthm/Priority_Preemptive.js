// Priority Preemptive - Non-live simulation (Event-based)
export function priorityPreemptive(processes) {
  // Create deep copies of processes
  const processesCopy = processes.map(p => ({
    id: p.id,
    arrival_time: p.arrival_time,
    burst_time: p.burst_time,
    priority: p.priority,
    remaining: p.burst_time
  }));

  // Initialize simulation state
  let time = 0;
  const readyQueue = [];
  const eventQueue = processesCopy.map(p => ({ 
    time: p.arrival_time, 
    process: p 
  })).sort((a, b) => a.time - b.time);
  
  let current = null;
  const completionTime = {};
  const responseTime = {};
  const firstExecution = {};
  const gantt = [];

  // Main simulation loop
  while (eventQueue.length > 0 || readyQueue.length > 0 || current !== null) {
    // Calculate next event time
    const nextArrival = eventQueue[0]?.time ?? Infinity;
    const nextCompletion = current ? time + current.remaining : Infinity;
    const nextEventTime = Math.min(nextArrival, nextCompletion);

    // Update current process execution
    if (current) {
      const runtime = nextEventTime - time;
      current.remaining -= runtime;
      gantt.push({
        processId: current.id,
        startTime: time,
        endTime: nextEventTime
      });
    } else if (nextEventTime > time) {
      // Handle idle time
      gantt.push({
        processId: null,
        startTime: time,
        endTime: nextEventTime
      });
    }

    time = nextEventTime;

    // Process all arrivals at this time
    const arrivals = [];
    while (eventQueue.length > 0 && eventQueue[0].time === time) {
      arrivals.push(eventQueue.shift().process);
    }
    
    // Add new arrivals to ready queue
    readyQueue.push(...arrivals);
    readyQueue.sort((a, b) => 
      a.priority - b.priority || 
      a.arrival_time - b.arrival_time || 
      a.id - b.id
    );

    // Check for preemption
    if (current && current.remaining > 0) {
      if (readyQueue.length > 0 && readyQueue[0].priority < current.priority) {
        readyQueue.push(current);
        current = null;
        readyQueue.sort((a, b) => 
          a.priority - b.priority || 
          a.arrival_time - b.arrival_time || 
          a.id - b.id
        );
      }
    }

    // Check for process completion
    if (current && current.remaining === 0) {
      completionTime[current.id] = time;
      current = null;
    }

    // Assign new process if CPU is free
    if (!current && readyQueue.length > 0) {
      current = readyQueue.shift();
      if (firstExecution[current.id] === undefined) {
        firstExecution[current.id] = true;
        responseTime[current.id] = time - current.arrival_time;
      }
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
    const rt = responseTime[p.id] || 0;

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
    gantt,
    avgWT: avg(totalWT),
    avgTAT: avg(totalTAT),
    avgRT: avg(totalRT),
    completionTime: time
  };
}

// Priority Preemptive - Live simulation
export function runPriorityPreemptiveLive(processes, onUpdate, onFinish) {
  let time = 0;
  let queue = processes.map(p => ({ ...p }));
  let readyQueue = [];
  let running = null;
  let gantt = [];
  let completed = [];

  const interval = setInterval(() => {
    // Add arriving processes to ready queue
    let i = 0;
    while (i < queue.length) {
      if (queue[i].arrival_time <= time) {
        const process = queue.splice(i, 1)[0];
        readyQueue.push(process);
      } else {
        i++;
      }
    }

    // Sort ready queue by priority (ascending)
    readyQueue.sort((a, b) => 
      a.priority - b.priority || 
      a.arrival_time - b.arrival_time || 
      a.id - b.id
    );

    // Check for preemption
    if (running) {
      if (readyQueue.length > 0 && readyQueue[0].priority < running.priority) {
        // Preempt the current process
        readyQueue.push(running);
        readyQueue.sort((a, b) => 
          a.priority - b.priority || 
          a.arrival_time - b.arrival_time || 
          a.id - b.id
        );
        
        // Update Gantt chart
        if (gantt.length > 0 && gantt[gantt.length - 1].endTime === null) {
          gantt[gantt.length - 1].endTime = time;
        }
        
        running = null;
      }
    }

    // Assign new process if CPU is free
    if (!running && readyQueue.length > 0) {
      running = readyQueue.shift();
      
      // Update Gantt chart
      if (gantt.length > 0 && gantt[gantt.length - 1].endTime === null) {
        gantt[gantt.length - 1].endTime = time;
      }
      
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

    // Update observers with current state
    onUpdate({
      time,
      readyQueue: [...readyQueue],
      cpu: running,
      gantt: [...gantt]
    });

    // Execute current process for 1 time unit
    if (running) {
      running.burst_time -= 1;
      
      // Check for process completion
      if (running.burst_time === 0) {
        // Update Gantt chart
        gantt[gantt.length - 1].endTime = time + 1;
        
        completed.push({
          ...running,
          completion_time: time + 1
        });
        
        running = null;
      }
    }

    // Check for simulation completion
    const allDone = queue.length === 0 && 
                   readyQueue.length === 0 && 
                   running === null;

    if (allDone) {
      // Finalize last Gantt entry
      if (gantt.length > 0 && gantt[gantt.length - 1].endTime === null) {
        gantt[gantt.length - 1].endTime = time + 1;
      }
      
      clearInterval(interval);
      onFinish({ gantt, completed });
    }

    time++;
  }, 1000);
}