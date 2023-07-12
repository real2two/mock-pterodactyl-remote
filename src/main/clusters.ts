import cluster from 'cluster';
import { availableParallelism } from 'os';
import type { Worker } from 'cluster';

const numCPUs = process.env.CLUSTERS === 'auto' ? availableParallelism() : Number(process.env.CLUSTERS);
const workers: Worker[] = [];

cluster.setupPrimary({ exec: `${__dirname}/web.ts` });

cluster.on('exit', worker => {
  console.warn(`Worker #${worker.process.pid} died`);

  worker.removeAllListeners();

  const index = workers.indexOf(worker);
  if (index !== -1) {
    workers.splice(index, 1);
  }
  
  spawnCluster();
});

for (let i = 0; i < numCPUs; i++) {
  spawnCluster();
}

function spawnCluster() {
  const worker = cluster.fork();
  console.warn(`Worker #${worker.process.pid} spawned`);
  workers.push(worker);
}
