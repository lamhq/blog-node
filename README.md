# RESTful API Server

## Introduction

Boilerplate source code for a RESTful API Server using ExpressJs

## Required softwares

- [Node.js](https://nodejs.org/) v10.16.0 or higher
- MongoDB 4.0.0 or higher
- [Yarn](https://yarnpkg.com/)
- [Visual Studio Code](https://code.visualstudio.com/) + [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Postman + [Sample API Collection](https://www.getpostman.com/collections/63427fe223e1665557dc)

## Required knowledges

Read these documents before coding:

- [Git-Flow](https://danielkummer.github.io/git-flow-cheatsheet/index.html)
- [Mongoose](https://mongoosejs.com/docs/guide.html)
- [ExpressJs](https://expressjs.com/)
- [Validate.js](https://validatejs.org/)

## Setup

### 1. Installing dependencies

``` bash
yarn install
```

### 2. Setting environment variables

Copy `.env.example` to `.env`. Open the edited file and change values to fit your development environment.

### 3. Import test data to database

```
cd data/
sh import.sh
```

### 4. Run the app

``` bash
yarn start
```

## Directory Layout

```
.
├── /.vscode/                   # contain workspace visual studio code setting
├── /data/                      # contains sample data and import/export scripts
├── /logs/                      # contains application's log files
├── /modules/                   # list of application's modules
│   ├── /common/                # reusable code for all projects
│   └── /app/                   # code specific for this project
│       ├── /admin/             # code related to admin's feature
│       ├── /models/            # contain mongoose model code files
│       ├── /email/             # contain list of email template files for current module
│       ├── router.js           # expressjs router object
│       ├── handlers.js         # a collection of express middleware functions
│       ├── helpers.js          # custom javascript functions
│       └── ...                 # any files specific to the technology we use
├── /node_modules/              # 3rd-party libraries and utilities
├── /test/                      # contain automation test scripts
├── .env.example                # environment template file
├── .eslintrc.json              # eslint config file
├── .gitignore                  # gitignore file
├── app.js                      # express application object
├── config.js                   # application's configuration object
├── index.js                    # entry point of the project
├── README.md                   # contains installation instruction
├── package.json                # contains 3rd party libraries and utilities
```
