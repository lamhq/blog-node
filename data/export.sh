#!/bin/bash
export URI=mongodb://root:1234@localhost:27017/blog?authSource=admin
mongoexport --uri ${URI} -c users --out users.json --jsonArray --pretty
mongoexport --uri ${URI} -c posts --out posts.json --jsonArray --pretty