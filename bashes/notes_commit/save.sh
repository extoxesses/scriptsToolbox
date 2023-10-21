#!/bin/bash

title="docs: New note(s) added"
msg=''

if ! [ -z "$1" ]
then
  msg=" -m '$1'"
fi

cd 
git add . && git commit -m '$title' $msg

git push
pushStatus=$?
if [ $pushStatus -ne 0]
then
  notify-send "Unable to push commit. No network connection is available";
fi