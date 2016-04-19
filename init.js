
var cdb = db.getSiblingDB('click-express-mongoose')

cdb.courses.insert({
    '_id': 'CSE130', 
    'description': 'Introduction to programming languages and paradigms, the components that comprise them, and the principles of language design, all through the analysis and comparison of a variety of languages (e.g., Pascal, Ada, C++, PROLOG, ML). Will involve programming in most languages studied.', 
    'instructor': 'rjhala'
})

cdb.courses.insert({
    '_id': 'CSE230', 
    'description': 'The goal of this class is to expose students to advanced programming language ideas, including high-level programming abstractions, expressive type systems and program analyses. We will develop these ideas in roughly two parts. First, we will study various high-level programming abstractions through the lens of Haskell, a pure functional programming language that has been the incubator for many recent PL advances. In the second part we will see how the lambda calculus can be used to distill essence of computation into a few powerful constructs, and we will use it as a launching pad to study expressive type systems, logics and analyses that can make precise predictions about run-time behavior at compile time. For more details see the lecture plan.',
    'instructor': 'rjhala'
})
