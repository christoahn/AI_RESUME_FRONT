#!/bin/bash

npm install

npm run build

mkdir -p public

cp -r build/* public/

echo "Build completed successfully. React app is ready to be served by Flask." 