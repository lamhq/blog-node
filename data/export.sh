#!/bin/bash
export URI=mongodb://localhost:27017/blog
mongoexport --uri ${URI} -c users --out users.json --jsonArray --pretty
mongoexport --uri ${URI} -c posts --out posts.json --jsonArray --pretty