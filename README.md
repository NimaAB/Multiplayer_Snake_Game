# Snake_Game

Start by: `npm install`
<br>
Run the server: `npm run dev`
it will refresh the server for you.

Server will run on: `localhost:5000`

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


# Running with ssl: 
`docker-compose -f docker-compose.yml up -d`
<br>
**now check https://localhost:5000**
