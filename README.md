# Awesome Websocket Client

A websocket client that is actually useful for those of us hardcore websocket programmers. 

- Multiple simultaneous connections
- Can add cookies to connections
- All state is stored in the database in real time
- Multiple formats supported, JSON/XML/Plain Text
- JWT authentication
- Simple interface

### Development

---

##### Prerequisites

- [NodeJS v-8.XX](https://nodejs.org/en/download/) 
- [Yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/)

##### Api Keys

- [Github](https://github.com)
- [Sendgrid](https://sendgrid.com) (this is not currently being used)

##### Install dependencies

```
> yarn
```

##### Environment

- Create `.env` file in app root
- Copy contents of `.example.env` into `.env` file
- Update appropriate fields to match your specifications

##### start

```
// dev
> docker-compose -f docker-compose.dev.yml up --build
// production
> docker-compose up --build
```
