#!/bin/bash

bashes="ciao"

# --- Script starting point ---------

echo "                 _    _                                      _ "
echo "                |  \/  | _   _  _  _  _  _   ___  _  _   _  | |"
echo "                | |\/| || | | || |/_|| |/_| / _ \| || \ / | |_|"
echo "                | |  | || |_| || |/  | |/  | |_|   | \   /   _ "
echo "You may call me |_|  |_| \___/ |_|   |_|    \___/|_|  |_|   |_|"
echo "I am a powerful demonic force! I am the harbinger of your doom!"
echo "And the forces of darkness will applaud me as I stride through the"
echo "Gates of Hell – carrying your head on a pike!"
echo ""

read -p "You fight like a Dairy Farmer! [Y/n] " confirm
if [ "$confirm" = "n" -o "$confirm" = "N" ]; then
  echo "You run THAT fast?"
  exit
fi

echo "How appropriate! You fight like a cow!"
exit

# --- Enviroment configuration ---------

mkdir workspace
cd workspace
git clone $bashes

# add script to grant permissions to scripts.

# --- DEV Tools ---------

# Tool for JSON manipulation
# sudo apt-get install jq

# Tool for RESTful API calls
# sudo snap install portman

