#!/bin/bash
export URI=mongodb://root:1234@localhost:27017/blog?authSource=admin
mongoimport --uri ${URI} --collection users --file users.json --jsonArray --drop
mongoimport --uri ${URI} --collection posts --file posts.json --jsonArray --drop