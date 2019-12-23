"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = require("child_process");
const os_1 = require("os");
class FFmpegCmd {
    constructor(options) {
        this.command = 'ffmpeg -threads 0 -hide_banner -y';
        this.cwd = null;
        this.win = false;
        if (options) {
            if (options.cwd)
                this.cwd = options.cwd;
            this.command += ` -loglevel ${options.loglevel || 'error'}`;
        }
        else
            this.command += ' -loglevel error';
        if (os_1.platform() === 'win32')
            this.win = true;
    }
    add(cmd) {
        switch (typeof cmd) {
            case 'string':
                this.command += ' ' + cmd;
                break;
            case 'object':
                this.command += ' ' + cmd.join(' ');
                break;
        }
    }
    cmd(cmd) {
        if (cmd)
            this.command = cmd;
        return this.command;
    }
    exec() {
        return new Promise((resolve, reject) => {
            const ffmpeg = childProcess.exec(this.win ? this.command.replace(/\/dev\/null/g, 'NUL') : this.command, { cwd: this.cwd, maxBuffer: 10485760 }, (err, stdout, stderr) => {
                ffmpeg.kill();
                if (err) {
                    reject(stderr);
                    throw err;
                }
                resolve(stderr);
            });
        });
    }
}
exports.default = FFmpegCmd;
function ffprobe(path) {
    return new Promise((resolve, reject) => {
        let proc = childProcess.spawn('ffprobe', ['-show_format', '-show_streams', '-print_format', 'json', path]), probeData = '', errData = '';
        proc.stdout.setEncoding('utf8').on('data', (data) => { probeData += data; });
        proc.stderr.setEncoding('utf8').on('data', (data) => { errData += data; });
        proc.on('exit', (code, signal) => { if (code || signal)
            reject(errData); })
            .on('error', reject)
            .on('close', () => resolve(JSON.parse(probeData)));
    });
}
exports.ffprobe = ffprobe;
