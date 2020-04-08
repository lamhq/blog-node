# RESTful API Server

Boilerplate source code for a RESTful API Server using ExpressJs


## Requirements

- [Node.js](https://nodejs.org/) v10.16.0 or higher
- [MongoDB 4.2.3](https://docs.mongodb.com/manual/installation/)
- [Yarn](https://yarnpkg.com/)
- [Visual Studio Code](https://code.visualstudio.com/) + [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Postman](https://www.postman.com/downloads/) + [Sample API Collection](https://www.getpostman.com/collections/63427fe223e1665557dc)


## Run the source code

### 1. Update MongoDB root's password

To make the api server able to connect to database, please change the MongoDB root's password to `1234`

### 2. Setting environment variables for development

```shell
cp .env.example .env
```


### 3. Import sample data to mongodb

```shell
scripts/db/import.sh
```


### 4. Start the api server

``` bash
yarn install
yarn start
```

## Running the demo

### Requirements

- [docker](https://www.docker.com/products/docker-desktop)
- [docker-compose](https://docs.docker.com/compose/install/) (17.12.0+)
- Make (optional, wrapper for handy scripts)


### Basic usage

- To install and run the system: `make install`
- To start and stop the system: `make start` and `make stop`
- To stop the system and remove database: `make uninstall`


## Required knowledges

- NodeJs
- MongoDB
- [Mongoose](https://mongoosejs.com/docs/guide.html)
- [ExpressJs](https://expressjs.com/)
- [Validate.js](https://validatejs.org/)
- [Git-Flow](https://danielkummer.github.io/git-flow-cheatsheet/index.html)


## Directory Layout

```
.
├── /.vscode/                   # workspace visual studio code setting
├── /docs/                      # api documentation
├── /node_modules/              # 3rd-party libraries and utilities
├── /scripts/                   # contains linux shell scripts for the system
├── /src/                       # application source code
│   ├── /common/                # reusable code for all projects
│   └── /app/                   # code specific for this project
│       ├── /admin/             # code related to admin's feature
│       ├── /models/            # contain mongoose model code files
│       ├── /email/             # contain list of email template files for current module
│       ├── router.js           # expressjs router object
│       ├── middlewares.js      # a collection of express middleware functions
│       ├── helpers.js          # custom javascript functions
│       └── ...                 # any files specific to the technology we use
├── /test/                      # contain automation test scripts
├── .env.example                # environment template file
├── .eslintrc.json              # eslint config file
├── .gitignore                  # gitignore file
├── README.md                   # contains installation instruction
└── package.json                # contains 3rd party libraries and utilities
```
