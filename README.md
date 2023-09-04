# Introduction

This is the recruitment assignment for a full stack engineer position. We have created an empty frontend and backend project for you. You are expected to finish the tasks in this assigment and return a working local application along with this repository either as a forked public github repository or a zipped project via email.

If you hit a wall on some task or you're just unable to finish it in time, you can still return whatever code you have with comments why you think it's not working and what would you do with better time.

We expect the tasks to take 4-6h of time.

# Installation

The frontend server is a Node project using typescript and React. It needs node (v18) installed and can be run with

```
cd odin-ui
npm install
npm start
```

The backend is a python FastAPI backend. It needs an empty python 3.11 environment (like conda, pyenv or poetry) and can be set up and started with

```
cd odin-api
pip install -r requirements.txt
uvicorn main:app --reload
```

# The Prequel

It's a foggy afternoon in the archipelago of Turku on the island of Nauvo. You take a sip from your old coffee mug after an very uneventful day on this decades old ice monitoring station. You glance at the huge ice bergs traversing slowly in the distance. You travel back to pre-AI days when this station was important and full of life. You remember your first day on the job, not long after the catastrophic reversal of the Gulf stream and the dramatic drop in temperatures across Northern Europe. You remember the professional work collagues, the exciting work athmosphere and the cutting edge technology you were equipped with - a constellation of SAR satellites and a fleet of microservices. But that's all gone, those were the good days. Now it's just you living on the station. You gulp down the last of your already cold coffee, go back inside and wish you weren't so alone.

After slowly drifting into sleep you suddenly wake up. Seagulls are screaming outside the window. You check the time, it's 1AM.

Why are the seagulls active, wait why is the room still illuminated??

You put on a pair of warm woolen socks and a jacket and head outside. As soon as you open the station's heavy door, you encounter something you've never seen - the northern lights, the aurora borealis so bright it feels like day. At first the beauty makes you gasp but it does not take long for you to realise a solar event this strong will definitely have a destructive effect on electronic devices.

And then you hear the radio crackling from inside

> ----CChhHHRrrZZZ can anyone hear me? --CRRZZZrhhhzZZ
> our ship's AI has went dow---ChhHrzz---- does not respond
> ---CHzzRR help

You run inside and response to the voice from the radio

> Hello? This is ice monitoring station 42. Who is this? What is your location?

> --cHzzRRhh my name is Isla. I'm a mechanical engineer on a 300m long oil tanker.
> Nobody is driving the ship, the AI stopped responding! -hhHZZcczz---
> ----CHhrsszzzz-- ice bergs in the distance

You know exactly what to do. Time to spin up the legacy ice monitoring platform Odin, the one you and your team build all those years ago. That will help you guide the distressed mechanic through the treacherous maze of islands, rocks and ice bergs.

> Listen Isla, just calm down. I'm gonna help you. Just hang in there

You start Odin, it compiles succesfully. Screens start flickering and then you gasp again, for the second time today

```
** ERROR 404 **
ODIN NOT FOUND
** ERROR 404 **
```

The solar event must have wiped Odin's memory banks! You open up the source code of Odin - it's empty. You take a look a the clock. You estimate the tanker has about 4-6 hours until it enters the dangerous waters. You should be able to write enough functionalities back before the tanker is in trouble

You roll up your sleeves and think - it's just programming

# The Tasks

### 1. Create Odin again

Create the Odin frontend again with React and any map library you choose (we recommend Mapbox GL). The map should open up centered in the coordinates `59.8613` latitude and `22.4673` longitude.

### 2. Overlay a SAR image to the map

You were able to task the SAR constellation to take a new image. The image has now downlinked and you can find it from `odin-api/SAR_image_20420212.png`.

The corner coordinates starting from top left are

```
[
    [22.2908182629724, 59.91614254645401],
    [22.578806773313246, 59.947751078236365],
    [22.638044070378744, 59.809992490984754],
    [22.351391574531174, 59.77847599974091],
]
```

Write the functionality to serve this image from the Odin backend to the frontend and overlay it to the map.

### 3. Add the locations of lighthouses to the map

The best way to help the ship navigate is to show the locations of lighthouses on the map. You managed to salvage the old corrupted codebase only a bit, revealing a string related to this data source, it says `seamark:light:range`.

Pull the lighthouse locations with the backend and serve them to the frontend through an endpoint. Visualise them on the map

Also visualise the ship itself. It is currently in coordinates `59.89134, 22.30606`

### 4. Write a short document for the production deployment plan

You remember the magnificently robust way Odin was deployed into production previously. How did it go again?

Write a text document and/or draw a diagram explaining how you would deploy Odin to a production environment. Add it to your repository

### 5. (Optional) Add any other dataset or functionality that could make Odin more useful

If you still have time, visualize any other kind of dataset or add a new functionality that might be useful for Isla when entering the dangerous waters

# SOLUTION
- The solution is now provided based on the specification
- Deployment Strategy.
  - We can use Docker, Ngnix and SSL to deploy the application to production
  - I have already added Docker files to the applicaiton folder. 
    - This will help in building the docker images that can be pushed to image repositories.
  - The docker compose file is also added.
    - It uses the docker files to create the required image
  - For production we will need to setup ngnix with docker compose.
  - A typical ngnix configuration should look as below
```
server { 
    listen                  443 ssl;
    listen                  [::]:443 ssl;
    server_name             localhost;
    ssl_certificate         /root/ssl/cert.pem;
    ssl_certificate_key     /root/ssl/key.pem;

    location / {
        proxy_pass "http://api:8000/";
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    error_page   500 502 503 504  /50x.html;

}
```

  - This ngnix configuration can be used by the docker compose file as shown below
  - A dockercompose file for production will look as below:
  ```
  version: "3.9"
services:
  api:
    image: api:latest
  nginx:
    image: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./key.pem:/root/ssl/key.pem
      - ./cert.pem:/root/ssl/cert.pem
    ports:
      - "443:443"
    depends_on:
      - api
  ```
  - Similar dockercomppose file will be created for the ui aswell.
  - The api image can be built with below command.
    - docker compose build api
  - The web image can be built with below command.
    - docker compose build web
  - The build images of web or api should be pushed to any docker image repository.
  - The production environment should be able to pull the image directly form the docker image repository.
  - Command that can then be used to set the application up is
    - docker componse up -d