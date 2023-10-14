# MailMinder

# SPA Full Stack application (MERN)

## Description
   This application stores your Vocabulary you registered and reminds you to review them by sending Email to you. You can add, edit, delete and review your vocabulary. You can also search your vocabulary by word or meaning.
   Easy to stop sending email by clicking the button on the Home page.

# Before Deployment in main.tsx (frontend)
   * Change the uploadLink variable
   
      uri: 'http://localhost:5001'

      to

      uri: 'https://remindapp.onrender.com/' 
      
      so that server can connect to render.com

# start-server.yml 
   This file wakes up the Render.com server since on free plan, it sleeps after 1 hour of inactivity. So we need to wake it up by sending a request to the server before Render.com send messages to registered users.

## Installation
   To install necessary dependencies, run the following command:
   ```
   npm install
   ```
   To start
   ```
   npm run dev
   ```


## To seed the data into MongoDB
  * npm run data:import (Insert)
  * npm run data:destroy (Delete)

## In order to use ES modules, 
we need to add "type": "module" in package.json
  ( EX: import express from "express";　など使える様になるが、
  const express=require("express");　は使えなくなる )

## Usage
   This application is deployed on Heroku. Please click the link below to use it.
   ```
   https://mailminder.herokuapp.com/
   ```
   ![MailMinder](./client/public/images/RemindYou.png)


   This involves the following technologies:
   * React
   * Redux
   * Node.js
   * React-bootstrap
   * Express
   * MongoDB
   * Mongoose
   * Passport
   * JWT
   * Nodemailer
   * Material-UI
   * Heroku
   * Git
   * GitHub


## Table of Contents
   * [Installation](#installation)
   * [Usage](#usage)
   * [License](#license)
   * [Contributing](#contributing)
   * [Tests](#tests)
   * [Questions](#questions)

## License
   This project is licensed under the MIT license.

## Contributing
   Please feel free to contact me. See my email and GitHub username below.

## Tests
   To run tests, run the following command:
   ```
   npm test
   ```
<!-- ## Questions
   If you have any questions about the repo, open an issue or contact me directly at <a href="mailto:      "> -->


   You can find more of my work at [GitHub]( )

### Created by 
   K-Dev 2023

## installed npm packages

   ### Front-end
     <!-- * npm install normalize.css (reset css) -->
     * npm install @apollo/client graphql  
     * npm i react-bootstrap bootstrap
     * npm i react-icons
     * npm i react-router-dom
     * npm i @emotion/styled

     * npm i @emotion/react
     
      In tsconfig.json ↓↓↓

         "compilerOptions": {
         "jsx": "react-jsx",
         "jsxImportSource": "@emotion/react",
         }

      ## Proxy setting (REST API)
         ### "proxy": "http://localhost:5001" in package.json (frontend)
         ### This is for development only, therefore, good for production deployment.

         ###  proxy: {'/api': 'http://localhost:5001', // プロキシの設定(バックエンドのポート番号) }, in vite.config.ts
         

      * npm i apollo-upload-client

      * npm i --save react-helmet

      * npm i --save @types/react-helmet (if you use typescript)

      * npm i zod

      * npm i react-hook-form

      * npm i @hookform/resolvers

      * npm i @emailjs/browser

      * npm i dotenv (To access to .env file which is above the frontend directory) 




   ### Back-end
      ### concurrently
      - npm install concurrently --save-dev

      ### nodemon
      - npm install nodemon --save-dev

      ### express
      - npm install express

      ### dotenv
      - npm install -D dotenv
      - import dotenv from 'dotenv';
      - dotenv.config();

      ### mongoose
      - npm install mongoose

      ### colors.js (This is for console.log color)
      - npm install colors --save-dev

      ### bcryptjs
      - npm install bcryptjs
         To use: bcrypt.hashSync(password, 10); // 10 is salt

      ### cors
      - npm install cors

      ### jsonwebtoken
      - npm install jsonwebtoken

      ### multer
      - npm install multer

      ### express
      - npm install express

      ### graphql-upload
      - npm install graphql-upload

      ### apollo-upload-client (for image upload?)
      npm install apollo-upload-client

      graphql-tools (deprecated)

      ### node mailer
        - npm install nodemailer

      ### node-cron
         - npm install node-cron
      
      ### swap to StandAlone to express server (for Deployment)
      
         npm install express cors body-parser
         

# PRISMA SETUP
Open Prisma Studio -->  http://localhost:5555/
   npx prisma studio

<!-- 一番初め -->
npm init    

npm i @apollo/server

npm i graphql-tag


npm install concurrently --save-dev

npm i colors

 
<!-- Repo から Clone してきた場合これをしないと run dev できない -->
npx prisma init

<!-- Migrate to MySQL DB -->
npx prisma migrate dev --name init 
or 
<!-- 何か schema.prismaを変更の度に実行しないといけない -->
npx prisma db push


<!-- Generate Prisma Client -->
npm i @prisma/client

<!-- Hash password -->
npm i bcryptjs

<!-- トークン -->
npm i jsonwebtoken

npm i dotenv


<!-- npm i apollo-server-express (Deprecated) -->

npm i graphql-ws @graphql-tools/schema

npm i express








