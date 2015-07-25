# click-express

Web-based clicker site (written in express)

## Model

The key types are:

```haskell
data Teacher = Teacher { id   :: UniqueId
                       , name :: String
                       }

data Student = Student { id   :: UniqueId
                       , name :: String
                       }

data Problem = Problem { id   :: UniqueId
                       , name :: String
                       }

data Click   = Click  { id      :: UniqueId
                      , user    :: Student
                      , choice  :: Int
                      , time    :: Time
                      , course  :: Course
                      , problem :: Problem
                      }

data Course  = Course { id      :: UniqueId
                      , name    :: String
                      , owner   :: Teacher
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
