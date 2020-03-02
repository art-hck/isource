#!/usr/bin/env bash

cd /home/www
if [ ! -d "node_modules" ]; then
  npm install
fi
forever start --workingDir /home/www /usr/local/bin/ng serve --host 0.0.0.0

bash -l
