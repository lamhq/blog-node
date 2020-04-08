#!/bin/bash
cd "$(dirname "$0")"
export URI=mongodb://root:1234@localhost:27017/rest?authSource=admin
mongoexport --uri ${URI} -c users --out users.json --jsonArray --pretty