#!/bin/bash
cd "$(dirname "$0")"
export URI=mongodb://root:1234@localhost:27017/rest?authSource=admin
mongoimport --uri ${URI} --collection users --file users.json --jsonArray --drop