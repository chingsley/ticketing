# TICKETING

## An E-Commerce Microservice App

This is a fullstack microservice application.
I am working on this project with the purpose of gaining in-depth understanding of how microservices work

## About the Stack

The application is fullstack built with NodeJS and Typescript for backend and React/NextJS for the frontend

## Topics Covered in this project

- NodeJS
- Typescript
- React
- Server-side rendering with NextJS
- Docker
- Kubernetes
- Event management is microservices
- Tests

## Publishing a new update in the **common** service

- cd into the common service, and run the the following command
- `npm run pub2 --stage='Your commit message here'`
- update the **common** package in all services where it's been used:
  - cd into **tickets** service, run: ` npm update @chingsley_tickets/common`
  - do the same for other services
