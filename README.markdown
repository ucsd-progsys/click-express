# click-express

Web-based clicker site (written in express)

+ [authentication][1]
+ [mongodb/mongoose][3]
+ [sessions][4]

## TODO

+ Home Page
   > add click: On (home) page, you send a "click" (and again and again)
   > add route "POST:click" with code to SAVE "POST:click"
   > add route "GET:view" with code that renders with ALL past clicks
   HEREHERE
   > add sockets: to allow instructor to post question
   > add NAVBAR [ home | role | view | logout ]

+ Roles (instructor/student)

+ Classes

+ Enroll

### Sockets

+ server: create socket // with room named: `defaults.courseId`
+ server: add route `app.get('/quiz' /* , auth */ , postQuiz)`
          which `io.emit` (to each socket) the "message: current time"

  HEREHEREHERE

+ client: create socket // with room named: `defaults.courseId`
+ client: on receiving on socket should print out the `message`

+ LATER: refine the socket to add a ["room" for each class][5]


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

## Controls

Pages/Routes

+ register  

+ login

+ role
  * teach   1,2,3,...
  * learn   a,b,c...
  * analyze p,q,r...

+ teach
  * pose problem
  * display graph
  * hide graph

+ learn
  * click

+ analyze
  * list dates
     * list problems
       * show graphs

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
