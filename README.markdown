# click-express

Web-based clicker site (written in express)

+ [authentication][1]
+ [mongodb/mongoose][3]
+ [sessions][4]

# Installation and Running

## Installation

### Some dependencies

* [libkrb5-dev](http://packages.ubuntu.com/trusty/libkrb5-dev)
* [MongoDB](https://www.mongodb.org/)
* [Node.js](https://nodejs.org/)
* [TypeScript compiler](http://www.typescriptlang.org/) (`version >= 1.7`)

### Building the server and client

    npm install
    tsd install
    tsc -p ./server
    tsc -p ./client/app

## Running the server

Run index.js:

    node server/index.js

Or, if in development mode:

    npm install nodemon
    nodemon server/index.js
    
## Navigate to page

    http://localhost:3000
    


## TODO

+ Show instructors how many student have answered

+ Students select their answer and can change it until end of quiz

+ Do not allow to change room if test is under way or unsaved draft.

+ FIX: history shows student signed off

+ Show if answer was correct or not in history

+ Classes

+ Enroll


# Application Logistics

## Roles

* **Instructors**: at the moment, just a single instructor 
user with the name 'instructor' is recognized. Only 
this person can:
    
    + only teacher can start/stop quiz
    + create new quiz
    + view entire class click history

    
* **Students** 

    + multiple classes



## Controls

Pages/Routes

+ register

+ login

+ learn
  * click

+ teach

  * Main  : [Start | Stop | Graph ]
  * Graph : [Prev | Next]

+ role
  * teach   1,2,3,...
  * learn   a,b,c...
  * analyze p,q,r...

+ analyze
  * list dates
     * list problems
       * show graphs

### teach: step 1

+ client: [start | stop | graph]
  + start: POST quizstart
  + stop: POST quizstop

+ server: done already

### teach: step 2

@client

+ QUIZ: mode, then periodic (per 2 seconds?) poll POST/quizstat(n)?
        where 'n' is offset from current quiz. so:
        n=0 means NOW,
        n=1 means PREV,
        n=2 means TWO-quizzes back etc.

+ SHOW: graph (d3 etc.?) // for now, just vector. A = ..., B = ..., C = ... etc.

@server

+ ROUTE: POST/quizstat(n), reply with JSON {a:..., b:...}



## Model

The key types are:

```haskell
data User = User { id       :: UniqueId
                 , name     :: String
                 , password :: String
                 , email    :: String
                 }

data Problem = Problem { id     :: UniqueId
                       , name   :: String
                       , user   :: User
                       }

data Click   = Click  { id      :: UniqueId
                      , user    :: User
                      , choice  :: Int
                      , time    :: Time
                      , course  :: Course
                      , problem :: Problem
                      }

data Course  = Course { id      :: UniqueId
                      , name    :: String
                      , user    :: User
                      }

data Enroll  = Enroll { id      :: UniqueId
                      , course  :: Course
                      , student :: Student
                      }
```

For each type `T` below, we have a **set** or **table**:

```haskell
table T = Map UniqueId T
```
## States

    [off]  --- quizstart   ---> [quiz]
    [quiz] --- response(i) ---> [wait]
    [wait] --- ack         ---> [quiz]
    [quiz] --- quizend     ---> [off]

## Links

(1):[https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/]

(3):[http://passportjs.org]

(3):[http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/]

(4):[https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/]

(5):[http://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io/17535099#17535099]
