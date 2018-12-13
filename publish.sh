#!/usr/bin/env sh

if git diff --exit-code --quiet; then
  echo 'Clean working tree'
else
  echo 'Dirty working tree'
  exit 1
fi
