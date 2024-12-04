# Shared To-Do List Web App - Frontend

This is the frontend for the Shared To-Do List web application.

## Quickstart
1. `git clone https://github.com/techdude101/shared-todo-list-frontend.git`  
2. `cd shared-todo-list-frontend`  
3. `npm install`  

4. Edit API_URL in package.json to point to the backend (data-service)
5. `npm start`  

## Unit Tests
`docker run -it --rm --name unit-tests -v "$PWD":/usr/src/app -w /usr/src/app node:lts npm i && npm run test`
