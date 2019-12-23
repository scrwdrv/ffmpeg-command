export default class FFmpegCmd {
    private command;
    private cwd;
    private win;
    constructor(options?: {
        cwd?: string;
        loglevel?: string;
    });
    add(cmd: string | string[]): void;
    cmd(cmd?: string): string;
    exec(): Promise<string>;
}
export declare function ffprobe(path: string): Promise<unknown>;
