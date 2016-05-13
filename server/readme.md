## Privacy Properties:

1. Student A can only access his/her 'Account' info.

2. Only the instructor can access the quizzes.


#### Route authentication:

    /course/:course_id/         --> only allow enrolled students

    /course/:course_id/create   --> only allow instructor of class


    /user/:user_id/history/

    /user/:user_id/history/all

    /user/:user_id/history/:course_id

            |
            V

        exposed through req.params



####  State (express.Request):

- require these parts to be Immutable or Unique (and track evolution)

- assume to be invariant throughout execution of routing


    USER_ID := req.user.username   --> invariant

    CLASS_ID := req.params.