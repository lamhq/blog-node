#!/bin/bash
export URI=mongodb://localhost:27017/blog
mongoimport --uri ${URI} --collection users --file users.json --jsonArray --drop
mongoimport --uri ${URI} --collection posts --file posts.json --jsonArray --drop