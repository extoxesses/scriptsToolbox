# AGCOMBO auto-restart

This script was written as a watchdog that automatically restart my TIM router 'AGCOMBO' (DSL version A2pv6F039u.d26a) when network connection goes down.


## Installation
You can run this script easly using node
```
npm i sjcl
node index.js username password <ping-times>
```

Otherwise, you can use docker

```
docker build -t exto/agcomborestart .
docker run exto/agcomborestart
```
