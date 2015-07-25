# click-express

Web-based clicker site (written in express)

## Model

The key types are:

```haskell
type Teacher = Teacher { id   :: UniqueId
                       , name :: String
                       }

type Student = Student { id   :: UniqueId
                       , name :: String
                       }

type Problem = Problem { id   :: UniqueId
                       , name :: String
                       }

type Click   = Click  { id      :: UniqueId
                      , user    :: Student
                      , choice  :: Int
                      , time    :: Time
                      , course  :: Course
                      , problem :: Problem
                      }

type Course  = Course { id      :: UniqueId
                      , name    :: String
                      , owner   :: Teacher
                      }

type Enroll  = Enroll { id      :: UniqueId
                      , course  :: Course
                      , student :: Student
                      }
```

For each type `T` below, we have a **set** or **table**:

```haskell
table T = Map UniqueId T
```
