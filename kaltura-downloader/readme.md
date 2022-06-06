# Kaltura downloader
This script was developed to download video uploaded via [Kaltura open platform](https://corp.kaltura.com/).

## Preliminary checks
To use this script, checks if [ffmpeg](https://ffmpeg.org/) libray was already installed.
Minimum version required:
```
ffmpeg version 4.2.4-1ubuntu0.1 Copyright (c) 2000-2020 the FFmpeg developers
  built with gcc 9 (Ubuntu 9.3.0-10ubuntu2)
  ...
  libavutil      56. 31.100 / 56. 31.100
  libavcodec     58. 54.100 / 58. 54.100
  libavformat    58. 29.100 / 58. 29.100
  libavdevice    58.  8.100 / 58.  8.100
  libavfilter     7. 57.100 /  7. 57.100
  libavresample   4.  0.  0 /  4.  0.  0
  libswscale      5.  5.100 /  5.  5.100
  libswresample   3.  5.100 /  3.  5.100
  libpostproc    55.  5.100 / 55.  5.100
```

## How to Use
This script required 4 parameters, plus an optional one:
* `url`: Video download base url, i.e.: `url='https://cfvod.kaltura.com/scf/hls/p/2203921/sp/0/serveFlavor/entryId/.../v/1/ev/2/.../1_dj4cyqnd/name/a.mp4/'`
* `policy`: policy value, retrieved from the `Policy` query string parameter
* `signature`: signature value, retrieved from the `Signare` query string parameter
* `key`: key value, retrieved from the `Key-Pair-Id` query string parameter
* `fileName` (optional): output file name. If not specified, the final file will be named `merge.mkv`

Retrieved all these values (tipically from a segment request. To retrieve it, use a browser network monitor), the scrip must be called as:
```
./downloader.sh $url $policy $signature $key $fileName
```

> **NOTE:** All video segmens, are stored on a temporary folder, created on the root folder where the script was running. At the end of the proccess, all temporary segments will be deleted, and will be kept only the final merge. Please, be sure to have enough space to complete the whole process.
