const range = (start, stop, step = 1) => {
    return [...Array(stop - start).keys()]
        .filter(i => !(i % Math.round(step)))
        .map(v => start + v);
};
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');
const chunkArray = (myArray, chunk_size) =>{
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
        const myChunk = myArray.slice(index, index + chunk_size);
        tempArray.push(myChunk);
    }
    return tempArray;
};
const min = 1;
const max = 711;
const m = range(min, max, 1);
const start = new Date().getTime();
let smallerArrays;
const masterProcess = () => {
    console.log(`Master ${process.pid} is running`);
    smallerArrays = chunkArray(m, Math.floor((max / numCPUs)+1));
    console.log(smallerArrays.length);
    for (let i = 0; i < smallerArrays.length; i++) {
        console.log(`Forking process number ${i}...`);
        const worker = cluster.fork();
        worker.send({arr: smallerArrays[i]});
    }
};
const childProcess = () => {
    process.on('message', data => {
        splitFunc(data.arr);
    });
};
const splitFunc = (arr) => {
    arr.map(w => {
        m.slice().map(x => {
            m.slice().map(y => {
                m.slice().map(z => {
                    if (w * x * y * z == 711 * 100 * 100 * 100 && w + x + y + z == 711) {
                        console.log(`finished in ${(new Date().getTime() - start) / 1000}sec: ${w} ${x} ${y} ${z}`);
                        process.exit(0);
                    }
                });
            });
        });
    });
};


if (cluster.isMaster) {
    masterProcess();
} else {
    childProcess();
}