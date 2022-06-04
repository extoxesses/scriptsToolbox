#!/bin/bash

######################
# Kaltura downloader #
######################

# Variables definition
if [ -z $4 ]
then
    echo "[ERROR] Invalid command! Correct request is:"
    echo "    downloader.sh <baseUrl> <policy> <signature> <key-pair-id>"
    echo ""
    exit 0
fi

output="merge.mkv"
if [ ! -z $5 ]
then
    output=$5
fi

# Create temporary folder. It will be removed later
mkdir tmpFrames
cd tmpFrames

# Segments download
echo "Download started..."
segment="seg-count-v1-a1.ts"
ph="count"
i=1

(
    while true
    do
        file=${segment/$ph/$i}
        printf -v url "$1/$file?Policy=$2&Signature=$3&Key-Pair-Id=$4"
        httpStatus=`curl --silent --location --request GET $url --output $file -w "%{http_code}\n"`
        if [[ $httpStatus -ne 200 ]]
        then
            ((i--))
            echo "Download completed with $i frames"
            echo "  - Removing latest frame"
            rm $file
            break
        fi
        echo "    File '$file' downloaded..."
        echo "file '$file'" >> mergeList.txt
        ((i++))
    done
    wait
) & all=$!

wait $all
echo "Download completed!"
echo "  - Generated merge list!"

# Merge step
echo "Start frames merge..."
ffmpeg -f concat -i mergeList.txt -loglevel quiet -c copy $output
echo "Frames merge completed!"

# Remove frames
echo "Delete frames"
mv $output ../$output
cd ..
rm -r tmpFrames
echo "Frames deleted!"

echo "Download completed"
