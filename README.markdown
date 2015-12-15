# click-express

Web-based clicker site (written in express)

+ [authentication][1]
+ [mongodb/mongoose][3]
+ [sessions][4]

## Installation instructions

    sudo apt-get install libkrb5-dev
    sudo apt-get install mongodb

## TODO

+ Only allow one question at a time

+ Home Page
   > add sockets: to allow instructor to post question
   > add NAVBAR [ home | role | view | logout ]

+ Roles (instructor/student)

+ Classes

+ Enroll

## Controls

Pages/Routes

+ register  

+ login

+ learn
  * click

+ teach [HEREHEREHEREHERE]

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

## Roles

+ multiple classes
+ only teacher can start/stop
+ refine the socket to add a ["room" for each class][5]

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

[1]:https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/
[3]:http://passportjs.org
[3]:http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
[4]:https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/
[5]:http://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io/17535099#17535099
