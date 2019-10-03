# marta.io UI

[![Join the chat at https://gitter.im/marta_ui/Lobby](https://badges.gitter.im/marta_ui/Lobby.svg)](https://gitter.im/marta_ui/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The static front-end for marta.io, currently running
on: https://marta.io

![beta_marta_io](https://user-images.githubusercontent.com/137793/36806617-90d660b2-1c8e-11e8-8e38-6e4327a9458a.png)

## Setup

0. Install NodeJS if you haven't.
1. `git clone git@github.com:jakswa/marta_ui.git`
2. `cd marta_ui`
3. `npm install`
4. `npm start`

Typically you need a Marta API key to interact with Marta's API.
To make this UI simple, I have a [separate repo](https://github.com/jakswa/miotwo)
that only serves to proxy API results for us (w/ 10s cache).

## S3 Deployment

0. Setup AWS credentials and CLI if you haven't.
1. `npm run-script build`
2. sync cache-worthy assets: `aws s3 sync build/ s3://your_bucket --exclude service-worker.js,index.html`
2. cp cache-excluded assets:
 - `aws s3 cp build/index.html s3://your_bucket --cache-control max-age=0`
 - `aws s3 cp build/service-worker.js s3://your_bucket --cache-control max-age=0`

### New to S3?

I started this project without having much personal experience
with hosting static websites on S3. I started with [this AWS
tool](https://console.aws.amazon.com/quickstart-website) and
then switched to the CLI when it got cumbersome to zip up the
build directory over and over.

## History/Backstory

marta.io is a tiny, mobile-oriented website that displays
the results of marta's real-time train arrival API.

At one point the goal was to fill a need: My station's sign
was broken and I wanted to know the train arrival estimates.
It grew to be a simple side project that I use, and that
requires very little maintenance.

Years passed. The simple angular website got rewritten into
an ionic app. I put it up for free on the android appstore,
and paid Apple $100 to put it in the iOS store.

More years passed. Angular 2 came out and shook things up.
By this time React had grown in popularity, and I had yet
to use it on anything serious. Browsers also changed, and
were sporting new features around Progressive Web Apps (PWAs).

My company CallRail sent some devs and designers to an offsite
to work on experimental projects, and marta.io was my choice.
Another rewrite was in order!
