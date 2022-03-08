#!/bin/bash

# start local mongo
mongod --config /usr/local/etc/mongod.conf

## Put all cust_func in the background and bash 
## would wait until those are completed 
## before displaying all done message
wait
echo "All started ..."
