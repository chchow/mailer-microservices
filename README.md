

# MailerMicroservices

Highly available emailing microservice.

## Getting Started

Basic requirements
1. Nodejs 16+
2. Docker installed
3. Docker compose installed

Steps from setup to deployment:
1. Clone the repository
2. Install npm dependencies:
  `npm install`
3. Build and deploy rest-api service creating a docker image 'rest-api': 
  `npx nx deploy rest-api`
4. Build and deploy mailer service creating a docker image 'mailer': 
  `npx nx deploy mailer`
5. Start the services: 
  `docker-compose up`
6. Execute the call below to send mail:
    - GET http://localhost:8080/ --> this will send a registration confirmation mail
    - POST http://localhost:8080/sendmail body {to: xxx, from: xxx, subject: xxx, text: xxx} --> this will send a custom mail with body input.

## Architecture

The application consists of 3 services / components:
- rest-api
  - facilitate the api layer
  - currently, only 2 calls are created:
    - GET http://localhost:8080/ --> this will send a registration confirmation mail
    - POST http://localhost:8080/sendmail body {to: xxx, from: xxx, subject: xxx, text: xxx} --> this will send a custom mail with body input.
- mailer
  - listens to event queue from rest-api
  - queue mail based on type of mail and execute blocking mail sending operations
  - the test smtp server is currently using mailgun and only 1 user are verfied with the account, namely cchmailer08@gmail.com
  - if you wish to modify the smtp configuration, please make changes to apps/mailer/src/Dockerfile "Email Settings"
- redis
  - redis server is used as  medium of event queue handling via Pub/Sub method and list feature for mail queue sending

## Testing
There are only a few unit test created especially in mailer:
cd apps/mailer; jest

## Improvement points
This repository was created with the following in mind with the short given amount of time:
- high available services
- execute blocking process without failing to accept new mail to be sent
- simple services with function separation
- without audit trailing of email sent except logging

Redis Pub/Sub method was used for simplicity purpose. However, this will contribute to an issue where the event is sent at-most-once, which means that in the event that mailer is down during an event published, mails could be failed to be sent as there are only 1 mailer running at a time.

> Redis stream could be used to address this issue as we could practice a design pattern where we could store the last read event id either in file or in Redis hash. It is possible to pick up from where it was last processed. Redis stream works in an append only manner and keeps the event queue without deleting unless a range is provided.

There is a single point of failure where only one instance of mailer is running at a time + during peak hours email may take ages to clear as queue piles up.

> We could solve this by creating a kubernetes pool of mailers with a load balancer to accept the events and distributes among the pool or mailers. Combining Redis stream's Consumer group and it's PEL could easily be used to distribute and manage events published to the pool of mailers. Consumer groups event processing requests consumer to acknowledge if the event is processed completely. Hence, this will take care of the failure in processing or incorrect shutdown of the mailer.