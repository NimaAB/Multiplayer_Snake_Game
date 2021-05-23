# Snake_Game

Start by: `npm install`
<br>
Run the server: `npm run dev`
it will refresh the server for you.

Server will run on: `localhost:5000`

# Important routes:
`/` the web page
<br>

# Using the Dockerfile:
**step one: install Docker on your machine**
<br>

**Step two: create the image.**<br>
    `$ docker build -t {give-the-img-a-name} .`
<br>

**Step three:**<br>
    `$ docker run -p 5000:5000 -d --name {a-container-name} {the-img-name-from-step2}`
<br>

**now check http://localhost:5000/**


# Running with on https: 
`docker-compose -f docker-compose.yml up -d`
<br>
**now check https://localhost:5000**

# Documentation: 
[<img width="60" alt="docs" src="https://user-images.githubusercontent.com/55274614/118265924-2b66b480-b4ba-11eb-8426-cf284a1a7502.PNG">](https://docs.google.com/document/d/15_R-5iYgSnLNcWtZG0tOPo6oMkvQS6opGS5TFYPeteA/edit)
