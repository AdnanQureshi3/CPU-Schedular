export function FCFS(processList) {
    let gantt = [];
    let time = 0;
    let turnAround = [];
    let waiting = [];
    let readyQueue = [...processList];
    let processStats = [];

    while (readyQueue.length !== 0) {
        let queue = readyQueue.filter(p => p.arrival_time <= time);

        if (queue.length === 0) {
            if (gantt.length && gantt[gantt.length - 1].processId !== null) {
                gantt[gantt.length - 1].endTime = time;
                gantt.push({ processId: null, startTime: time, endTime: time + 1 });
            } else if (gantt.length === 0) {
                gantt.push({ processId: null, startTime: time, endTime: time + 1 });
            }
            time++;
            continue;
        }

        queue.sort((a, b) => a.arrival_time - b.arrival_time);
        const current = queue[0];
        let prevTime = time;
        time += current.burst_time;

        turnAround[current.id] = time - current.arrival_time;
        waiting[current.id] = turnAround[current.id] - current.burst_time;

        processStats.push({
            id: current.id,
            arrival_time: current.arrival_time,
            burst_time: current.burst_time,
            completion_time: time,
            turnaround_time: turnAround[current.id],
            waiting_time: waiting[current.id],
            response_time: waiting[current.id]
        });

        readyQueue = readyQueue.filter(p => p.id !== current.id);

        if (gantt.length) gantt[gantt.length - 1].endTime = prevTime;
        gantt.push({ processId: current.id, startTime: prevTime, endTime: time });
    }

    const avg = arr => {
        let sum = 0, count = 0;
        for (let t of arr) {
            if (typeof t === "number") {
                sum += t;
                count++;
            }
        }
        return count ? sum / count : 0;
    };

    return {
        processStats,
        avgWT: avg(waiting),
        avgTAT: avg(turnAround),
        avgRT: avg(waiting),
        completionTime: time
    };
}


export function runFCFSLive(processes, onUpdate, onFinish) {
    processes.sort((a, b) => a.arrival_time - b.arrival_time);

    let time = 0;
    let ready = [];
    let gantt = [];
    let running = null;
    let queue = [...processes];
    let completed = [];

    const interval = setInterval(() => {

        for (let i = 0; i < queue.length; i++) {
            if (queue[i].arrival_time <= time) {
                ready.push(queue[i]);
                queue.splice(i, 1);
                i--;
            }
        }

        if (!running && ready.length > 0) {

            running = ready.shift(); // remove the first element and return it
            if(gantt.length > 0){

                let id = gantt[gantt.length - 1].processId;
                if(id === null){
                    gantt[gantt.length-1].endTime = time;
                }
                
            }

            gantt.push({
                processId: running.id,
                startTime: time,
                endTime: time + running.burst_time
            });
            
        }
        else if(!running ){
            if( gantt.length === 0 || gantt[gantt.length-1].processId !== null){
                   
                gantt.push({
                    startTime:time,
                    processId:null
                })
            }
        }

        onUpdate({
            time,
            readyQueue: [...ready],
            cpu: running,
            gantt: [...gantt]
        });

        if (running) {

            running.burst_time -= 1;
            if (running.burst_time === 0) {
                completed.push(running);
                running = null;
            }
            
        }

        if (queue.length === 0 && ready.length === 0 && !running) {

            clearInterval(interval);

            onFinish({ gantt, completed });
            time++;
            onUpdate({
                time,
                readyQueue: [...ready],
                cpu: running,
                gantt: [...gantt]
            });
        }

        time += 1;
        
    }, 1000);
    return () => clearInterval(interval);



}

