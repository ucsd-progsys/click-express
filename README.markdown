# click-express

Web-based clicker site (written in express)

+ [authentication][1]
+ [mongodb/mongoose][3]
+ [sessions][4]

[1]:https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/
[3]:http://passportjs.org
[3]:http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
[4]:https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/

## TODO

1. Users & Authentication
   > add email to /register

2. Home Page
   > Click
     + On (home) page, you send a "click" (and again and again)
   > HEREHEREHEREHERE
   > add route "POST:click" with code to SAVE "POST:click"
   > add route "GET:view" with code that renders with ALL past clicks

3. Roles (instructor/student)

4. Classes

5. Enroll

### Click

+ Model
  - `Click` database  

+ Routes
  - add buttons to `/` page


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

+ create account

+ login

+ pick role
  * teach 1,2,3,...
  * learn a,b,c...
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
