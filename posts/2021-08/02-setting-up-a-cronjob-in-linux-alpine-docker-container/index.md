---
title: Setting up a cronjob in a docker container running alpine linux node image container
layout: layout.html
tags: ["posts", "today I learned", "daily"]
date: 2021-08-18
---

After finishing a NextJS app running in our docker service stack, I had to make it register to our service health dashboard. It accepts a POST request with some data, which is out of the scope of this article. Anyway, all the other services were using  _curl_ to post and report their health every other minute.

Here's the registration script. Nothing fancy, just using curl to make a POST request to an address defined in an environment variable:

```bash
# Docker prefils this with container ID, which can be used to access 
# this container in the network
hostname=$(cat /etc/hostname)
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"name": "some-service-name", "host": '"${hostname}"'}' \
     https://some-dashboard-url.com

echo "cronjob has just finished executing register-to-dashboard script"
```

Here's my `Dockerfile`:

```bash
# Dockerfile
FROM node:alpine AS runner
ENV NODE_ENV production
WORKDIR /
RUN apk add --no-cache curl

# move script to predefined 1min directory, change permissions, schedule it for running
# YES, script needs to NOT have .sh file extension
COPY  /register-to-dashboard.sh /etc/periodic/1min/register-to-dashboard
RUN chmod +x /etc/periodic/1min/register-to-dashboard
RUN echo "* * * * * run-parts /etc/periodic/1min" >> /etc/crontabs/root
ENTRYPOINT [ "startup.sh" ]
```

And here's the `startup.sh` file:

```bash
# startup.sh
# make sure errors stop execution
set -e
# start the cronjob
crond -f -l 8 &
# start nextjs using our own command from package.json...
npm run start:production

```

Alpine linux already comes set up to run cronjobs. It's directory `/etc/periodic` already contain directories **15min**, **daily**, **hourly**, **monthly**, **weekly**.

Putting a shell script, with **.sh extension removed** (weird I know) into one of these directories, and starting the cronjobs using `crond -f -l 8` will execute your script at the specified frequency.

You can run `crontab -l` to check the table specifying this behaviour:

```bash
crontab -l

# do daily/weekly/monthly maintenance
# min	hour	day	    month	weekday	command
*/15	*	    *	    *	    *	    run-parts /etc/periodic/15min
0	    *	    *	    *	    *	    run-parts /etc/periodic/hourly
0	    2	    *	    *	    *	    run-parts /etc/periodic/daily
0	    3	    *	    *	    6	    run-parts /etc/periodic/weekly
0	    5	    1	    *	    *	    run-parts /etc/periodic/monthly

# after our Dockerfile runs:
# RUN echo "* * * * * run-parts /etc/periodic/1min" >> /etc/crontabs/root
# we'll have a non-default line here:
*	    *	    *	    *	    *	    run-parts /etc/periodic/1min

```

From the Dockerfile we create create a new directory, `1min` by `COPY`'ing a script there, and schedule the directories scripts to be ran every minute, expressed in the crontab syntax as seen above. See [CronTabGuru](https://crontab.guru/#*_*_*_*_*) about the syntax.

## Running this stuff

When you have the `Dockerfile`, `register-to-dashboard.sh` files ready, from that same directory we can run this stuff and check out if all is working fine:
```bash
# build a docker image as instructed by the Dockerfile and tag it with "app"
docker build . -t app

# run a container using it
docker run app
# in a terminal, see a list of running containers
docker ps

# if you don't see it, you can check all containers, including stopped ones + get more info with --no-trunc
docker ps -a --no-trunc

# find the id or name of your running container, and open a shell on it
docker exec -it {your container id or name (without brackets)} /bin/sh

# when shell opens, we can check out if our Dockerfile has configured the cronjob:
crontab -l
# ... look for line like this, if you see it - great
# *	    *	    *	    *	    *	    run-parts /etc/periodic/1min

# simulate running of scripts from our folder, the output will tell you which scripts will be run exactly
run-parts --test /etc/periodic/1min

# if you wish, you can actually run the scripts yourself by issuing same command as the cronjob does
run-parts /etc/periodic/1min
```

Your cronjob should already be running every minute now. So, while we were checking all this stuff, some output should have appeared in the first terminal, started the docker container.

To see logs of a container anytime, even if you closed that terminal:
```bash
docker logs {container id or name}
```

If you need to stop the container
```bash
docker stop {container id or name}
```

So much fun, these cronjobs.