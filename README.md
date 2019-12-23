# ffmpeg-command
 A simple ffmpeg and ffprobe child process handler, easy to add commands and execute

## Installation
 In order to be able to use this module, make sure you have FFmpeg installed on your system (including all necessary encoding libraries like libmp3lame or libx264).
 * [FFmpeg binary](https://www.ffmpeg.org/download.html)

```sh
npm i ffmpeg-command
```

## Usage

### ffmpeg
```js
import FFmpegCmd from 'ffmpeg-command';

const ffmpegCmd = new FFmpegCmd({ loglevel: 'info', cwd: './video' });

ffmpegCmd.add(`-i example.mp4 -af volumedetect -vn -sn -dn -f null /dev/null`);

console.log(ffmpegCmd.cmd());
//ffmpeg -threads 0 -hide_banner -y -loglevel info -i example.mp4 -af volumedetect -vn -sn -dn -f null /dev/null

ffmpegCmd.exec().then((stdout) => {
    
    console.log(stdout);
    /*
    Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'example.mp4':
    Metadata:
        major_brand     : mp42
        minor_version   : 0
        compatible_brands: isommp42
        creation_time   : 2018-06-28T20:53:15.000000Z
    Duration: 00:01:45.44, start: 0.000000, bitrate: 571 kb/s
        Stream #0:0(und): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, bt709), 406x720 [SAR 1:1 DAR 203:360], 441 kb/s, 23.98 fps, 23.98 tbr, 90k tbn, 47.95 tbc (default)
        Metadata:
        creation_time   : 2018-06-28T20:53:15.000000Z
        handler_name    : ISO Media file produced by Google Inc. Created on: 06/28/2018.
        Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 125 kb/s (default)
        Metadata:
        creation_time   : 2018-06-28T20:53:15.000000Z
        handler_name    : ISO Media file produced by Google Inc. Created on: 06/28/2018.
    Stream mapping:
    Stream #0:1 -> #0:0 (aac (native) -> pcm_s16le (native))
    Press [q] to stop, [?] for help
    Output #0, null, to 'NUL':
    Metadata:
        major_brand     : mp42
        minor_version   : 0
        compatible_brands: isommp42
        encoder         : Lavf58.29.100
        Stream #0:0(eng): Audio: pcm_s16le, 44100 Hz, stereo, s16, 1411 kb/s (default)
        Metadata:
        creation_time   : 2018-06-28T20:53:15.000000Z
        handler_name    : ISO Media file produced by Google Inc. Created on: 06/28/2018.
        encoder         : Lavc58.54.100 pcm_s16le
    size=N/A time=00:01:45.44 bitrate=N/A speed= 462x
    video:0kB audio:18164kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: unknown
    [Parsed_volumedetect_0 @ 00000236d9632d80] n_samples: 9299968
    [Parsed_volumedetect_0 @ 00000236d9632d80] mean_volume: -22.8 dB
    [Parsed_volumedetect_0 @ 00000236d9632d80] max_volume: -2.7 dB
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_2db: 12
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_3db: 141
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_4db: 367
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_5db: 1027
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_6db: 2215
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_7db: 4398
    [Parsed_volumedetect_0 @ 00000236d9632d80] histogram_8db: 7799 
    */

}).catch((err) => {
    console.log(err);
});
```

### ffprobe
```js
import { ffprobe } from 'ffmpeg-command';

ffprobe('./video/example.mp4').then((json) => {

    console.log(json);
    /* 
    { streams:
    [ { index: 0,
        codec_name: 'h264',
        codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
        profile: 'Main',
        codec_type: 'video',
        codec_time_base: '1001/48000',
        codec_tag_string: 'avc1',
        codec_tag: '0x31637661',
        width: 406,
        height: 720,
        coded_width: 416,
        coded_height: 720,
        has_b_frames: 1,
        sample_aspect_ratio: '1:1',
        display_aspect_ratio: '203:360',
        pix_fmt: 'yuv420p',
        level: 30,
        color_range: 'tv',
        color_space: 'bt709',
        color_transfer: 'bt709',
        color_primaries: 'bt709',
        chroma_location: 'left',
        refs: 1,
        is_avc: 'true',
        nal_length_size: '4',
        r_frame_rate: '24000/1001',
        avg_frame_rate: '24000/1001',
        time_base: '1/90000',
        start_pts: 0,
        start_time: '0.000000',
        duration_ts: 9489480,
        duration: '105.438667',
        bit_rate: '441202',
        bits_per_raw_sample: '8',
        nb_frames: '2528',
        disposition: [Object],
        tags: [Object] },
        { index: 1,
        codec_name: 'aac',
        codec_long_name: 'AAC (Advanced Audio Coding)',
        profile: 'LC',
        codec_type: 'audio',
        codec_time_base: '1/44100',
        codec_tag_string: 'mp4a',
        codec_tag: '0x6134706d',
        sample_fmt: 'fltp',
        sample_rate: '44100',
        channels: 2,
        channel_layout: 'stereo',
        bits_per_sample: 0,
        r_frame_rate: '0/0',
        avg_frame_rate: '0/0',
        time_base: '1/44100',
        start_pts: 0,
        start_time: '0.000000',
        duration_ts: 4649984,
        duration: '105.441814',
        bit_rate: '125605',
        nb_frames: '4541',
        disposition: [Object],
        tags: [Object] } ],
    format:
    { filename: './video/example.mp4',
        nb_streams: 2,
        nb_programs: 0,
        format_name: 'mov,mp4,m4a,3gp,3g2,mj2',
        format_long_name: 'QuickTime / MOV',
        start_time: '0.000000',
        duration: '105.441811',
        size: '7528318',
        bit_rate: '571182',
        probe_score: 100,
        tags:
        { major_brand: 'mp42',
            minor_version: '0',
            compatible_brands: 'isommp42',
            creation_time: '2018-06-28T20:53:15.000000Z' } } } 
    */

}).catch((err) => {
    console.log(err);
});


```