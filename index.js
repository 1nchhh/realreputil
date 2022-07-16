"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(require("net"));
var worker_threads_1 = __importDefault(require("worker_threads"));
var os_1 = __importDefault(require("os"));
function syn(d) {
    for (var i = 0; i < os_1.default.cpus().length; i++) {
        var worker = new worker_threads_1.default.Worker("".concat(__dirname, "/worker.js"), {
            workerData: {
                payload: d,
                method: 'syn'
            }
        });
        worker.on('message', function (m) {
            console.log(m);
        });
    }
}
var server = {
    host: 'localhost',
    port: 8932
};
var socket;
function connect() {
    socket = new net_1.default.Socket();
    socket.on('data', function (data) {
        var op = data[0];
        var payload = data.slice(1);
        console.log({
            op: op,
            payload: payload.toString()
        });
        switch (op) {
            case 0x01:
                var _a = __read(payload.toString().split(':'), 3), rhost = _a[0], rport = _a[1], rpower = _a[2];
                var host = rhost;
                var port = parseInt(rport);
                var power = parseInt(rpower);
                syn({ host: host, port: port, power: power });
        }
    });
    socket.connect(server);
    socket.once('close', function () {
        console.log('close');
        setTimeout(connect, 1000);
    });
    socket.once('end', function () {
        console.log('end');
        setTimeout(connect, 1000);
    });
    socket.once('error', function (err) {
        console.log('error');
        console.log(err);
        setTimeout(connect, 1000);
    });
}
connect();
//# sourceMappingURL=client.js.map
