#!/bin/bash

rootpath="~/myinstall"
echo "Removing Eclipse from $rootpath"

read -p "Are you sure you want delete Eclipse? [y/N] " confirm

if [ "$confirm" = "y" -o "$confirm" = "Y" ]; then
  # Eclipse config files
  rm -rf ~/.eclipse

  # Hard installation directories
  # Cpp
  rm -rf $(root)/cpp-latest/eclipse/
  # Java Enterprise
  rm -rf $(root)/jee-latest-released

  # .desktop file
  rm ./.local/share/applications/eclipse.desktop 
fi
