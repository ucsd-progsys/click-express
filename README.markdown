# click-express

Web-based clicker site (written in express)

## Model

The key types are:

```haskell
data User = User { id       :: UniqueId
                 , name     :: String
                 , email    :: String
                 , password :: String
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

## Views

Defined by above.
