---
title: Setting up a cronjob in a docker container running alpine linux node image container
layout: layout.html
tags: ["posts", "today I learned", "daily"]
date: 2021-08-18
---

After finishing a NextJS app running in our docker service stack, I had to make it register to our service health dashboard, [Spring Boot Admin](https://github.com/codecentric/spring-boot-admin). It accepts a POST request. Other services run cronjobs, using _curl_ to post and report their health every other minute.

Here's the registration script. Nothing fancy, just using curl to make a POST request to an address defined in an environment variable:

```bash
#Docker prefils this with container ID, which can be used to access this container in the network
hostname=$(cat /etc/hostname)
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"name": "some-service-name", "host": '"${hostname}"'}' \
     https://dashboard-url.com

echo "cronjob has just finished executing register-to-dashboard script"
```

Here's my `Dockerfile`:

```Dockerfile
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

```
# do daily/weekly/monthly maintenance
# min	hour	day	    month	weekday	command
*/15	*	    *	    *	    *	    run-parts /etc/periodic/15min
0	    *	    *	    *	    *	    run-parts /etc/periodic/hourly
0	    2	    *	    *	    *	    run-parts /etc/periodic/daily
0	    3	    *	    *	    6	    run-parts /etc/periodic/weekly
0	    5	    1	    *	    *	    run-parts /etc/periodic/monthly
```

What we do from the Dockerfile, is create a new directory, `1min` and schedule it's scripts to be ran every minute, expressed in the crontab syntax as `* * * * *` (see [CronTabGuru](https://crontab.guru/#*_*_*_*_*)).

To simulate the cronjob scripts run from, say the 15min dir, you can run `run-parts --test /etc/periodic/15min` - this will tell you which scripts will be run exactly. Alternatively, just run `run-parts /etc/periodic/15min` to actually try out running the scripts.

So, after creating the register-to-dashboard.sh and Dockerfile, from the same directory run `docker build . -t app` - this will build the docker image.

Run `docker run app` to run it.

Your cronjob should run every minute now. You can see the container logs by running `docker logs -f {yourContainerIdOrName}`. There you should see `cronjob has just finished executing register-to-dashboard script` message from our register-to-dashboard script appearing every minute. Btw, don't confuse docker image names with container names when watching the logs.

To see a list of docker containers running, run `docker ps`. Run `docker ps -a` to include stopped containers. Run `docker ps -a --no-trunc` to see a bit more info.

So much fun, these cronjobs.
