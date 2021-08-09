# Serverless NEXT AUTH

This is a boilerplate when making a service using serverless framework aws and login feature with next auth

## Technology stack

```
 next js
 serverless framework
 dynamodb
 aws lambda
 aws api gateway
```

## setting up

1. run

```
$ yarn dev
```

2. go to packages/serverless and run db migration

```
$ yarn setup
```

3. change packages/frontend/env.dev to packages/frontend/.env
4. set the
   - LINE_CLIENT_ID and LINE_CLIENT_SECRET by making a login api channel in [here](https://developers.line.biz/console/)
   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET by making oauth2 credentials [here](https://console.cloud.google.com/apis/credentials?project=ihsan-pay)

## OAUTH TERM OF USE

### ENGLISH

```
I'm planning to make a web service for obtaining the email address registered in Instagram account if the you allows it at the time of authentication. The obtained e-mail address will not be used for any purpose other than the following. In addition, we will not provide it to third parties except as required by law.

- Used for management as a user's unique ID
- Used for notifications from this service and distribution of e-mail newsletters
- Used for contact when withdrawing from membership, when making inquiries, etc.
```

### JAPAN

```
I'm planning to make a web service for obtaining the email address registered in Instagram account if the you allows it at the time of authentication. The obtained e-mail address will not be used for any purpose other than the following. In addition, we will not provide it to third parties except as required by law.

- Used for management as a user's unique ID
- Used for notifications from this service and distribution of e-mail newsletters
- Used for contact when withdrawing from membership, when making inquiries, etc.
```
