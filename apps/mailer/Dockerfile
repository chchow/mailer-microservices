FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/mailer .
# ENV PORT=3333
# EXPOSE ${PORT}
RUN npm install --omit=dev
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs

# Email Settings
ENV EMAIL_HOST=smtp.mailgun.org
ENV EMAIL_PORT=587
ENV EMAIL_ADDRESS=postmaster@sandbox08350910c1ab4b3da4e6e1e4c6f1d700.mailgun.org
ENV EMAIL_PASSWORD=<password>

# Redis Settings
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

CMD node ./main.js