import * as childProcess from 'child_process';
import { platform } from 'os';

export default class FFmpegCmd {
    private command: string = 'ffmpeg -threads 0 -hide_banner -y';
    private cwd: string = null;
    private win: boolean = false;

    constructor(options?: {
        cwd?: string;
        loglevel?: string;
    }) {
        if (options) {
            if (options.cwd) this.cwd = options.cwd;
            this.command += ` -loglevel ${options.loglevel || 'error'}`
        } else this.command += ' -loglevel error';

        if (platform() === 'win32') this.win = true;
    }

    add(cmd: string | string[]) {
        switch (typeof cmd) {
            case 'string':
                this.command += ' ' + cmd;
                break;
            case 'object':
                this.command += ' ' + cmd.join(' ')
                break;
        }
    }

    cmd(cmd?: string) {
        if (cmd) this.command = cmd;
        return this.command;
    }

    exec() {
        return new Promise((resolve: (stdout: string) => void, reject) => {
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

export function ffprobe(path: string) {
    return new Promise((resolve, reject) => {
        let proc = childProcess.spawn('ffprobe', ['-show_format', '-show_streams', '-print_format', 'json', path]),
            probeData = '',
            errData = '';

        proc.stdout.setEncoding('utf8').on('data', (data) => { probeData += data });
        proc.stderr.setEncoding('utf8').on('data', (data) => { errData += data });
        proc.on('exit', (code, signal) => { if (code || signal) reject(errData) })
            .on('error', reject)
            .on('close', () => resolve(JSON.parse(probeData)));
    })
}
