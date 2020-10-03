+++
title = "Object Oriented Programming: An Introduction"
description = "An introduction to OO"
date = 2020-10-03
+++

Yeah, I know I haven't gotten back to Vulkan. Sorry. Someday soon, I promise.

I hate Java. Like, so much. I understand why it exists, but it's just an
embodiment of what I hate about programming. It's overly complex, and it feels
like it's working against you.

But most of all I resent that, like many young programmers, I was shown Java and
told, "this is what Object Oriented Programming is, and all good object oriented
languages are like this."

I think this is dishonest, and it's not helpful. Object Oriented Programming is
many things to many people, and to describe Java as the be-all-end-all is
misleading at best. So today, I want to talk about a very different vision of
Object Oriented Programming.

Forget everything you know about OOP, and we can begin.

# It's called OO for a reason

Everyone talks about classes. So I won't for now. Classes don't matter. 

This is a lie, by the way. Classes do matter, But they're not so important as
you'd think. In fact, you can have an object-oriented language without
classes. The most popular OO language without classes is Javascript ("But
Javascript has classes!" I hear you cry. No, it doesn't. It has a keyword called
`class` that exists to comfort programmers who are used to classes. Classes in
Javascript are an illusion. But that's a story for another day).

Object Oriented Programming is about Objects, not Classes. So let's take a
moment to understant what an object really is.

When explaining objects, most people reach for real-world objects, like chairs
(no kidding, my first introduction to OO used chairs as an example. Don't ever
do this). This is a bad example. Objects don't behave like objects in the real
world at all. They behave like people. Or maybe like automatons.

An object is a single, *independent* actor. Objects are not acted upon. They
act. They are responsible for themselves. By invoking a method, you are not
acting on an object, you are *requesting* that the object. This is more a
difference in thought from the imperative model (you do a thing to a structure)
than it is a difference in how things work from your end, but it's also more
accurate to what's going on internally, in a sense (we'll talk about it). So get
it through your head.

## A Simple Example

Let's start with the simplest example possible.

```
2.
```

`2` is an object. Its class... doesn't matter. Don't worry about it. If it makes
you feel better, let's say that its class is `Integer`. Integer defines a set of
things you can ask an integer to do. You can't modify integers in place (you
can't turn two into three, that would be silly...), so all you can ask an
integer questions of sort. Case in point:

```
2 + 2.
```

In Java, you might write this as `2.plus(2)`. But that's awfully inconvenient,
so I won't bother. But the affect is the same. We're asking `2` to tell us what
`Integer` it would be if we added the integer `2` to it. And of course, `2` will
tell us that it would be `4`. We'll call this sending `2` the *message* `+`,
with the *argument* `2`. And of course, as any math teacher would tell you:

```
(2 + 2) = 4.
```

(You might ask why I'm ending everything with periods. How else would you end a
sentence? Just because it's a sentence for a computer doesn't mean I should be
rude and stop punctuating...)

Once again, this is just a message. We're asking the result of `(2 + 2)` (`4`)
if it's equal to another integer, also `4`.

Naturally, it will answer us by saying

```
true.
```

`true` is an object, too. Although this presents an interesting conundrum: How
do we figure out that true is true? We can ask it if it's true `true = true`,
but that's not terribly useful, because all it will do is return itself. What
would be more helpful would be asking true to do a thing if it really is
true. Something like...

```
true ifTrue: [2] ifFalse: [3].
```

Naturally, true will respond with the thing in the first brackets, because true
is true, and it will tell you `2`. But what if true was false? 

```
false ifTrue: [2] ifFalse: [3].
```

False also knows how to respond to this request... but it won't respond the same
way `true` does. It will say `3`. Because false is false. This seems
self-evident, but it's more useful as things get more complicated:

```
(1 + 2 * 3 = 7) ifTrue: ['true!'] ifFalse: ['false!'].
``` 

Naturally, this will respond by happily informing us that the answer
is... `'false!'`. You might be confused. But we're not doing arithmetic here:
we're sending messages to objects. And when we're sending messages, we start
with the leftmost object and go to the right, no exceptions. `1 + 2 * 3` is
equal to `(1 + 2 * 3)`: It's `9`. But hey, that's why we asked to do different
things depending on the outcome of that equality test: so we could know the
difference.

You may have already been introduced to the idea of *polymorphism*, but this is
an example of it in action: different objects can respond to the same messages
in different ways. We can ask an object, directly or indirectly, about its
identity, and tell it to do a different thing depending on what it is. By the
same mechanism, we can just ask an object to do something (like figure out if
it's equal to another object) without worrying about *how* that object does
it. We can just trust the object to smart enough to do it, and not worry about
the nitty-gritty. Using this power, we've created what is an essentially an if
statement, just based on letting behavior change depending on what object we're
talking to.

# The Soup of Life

If objects are independent actors that communicate with each other, you can
think of an object oriented program as a sort of... *soup*, maybe a primordial
ocean full of organisms. But with more message passing and less brutal
violence. Amoeba office? Forget it. I think you get the point.

Object Oriented Programming asks us to visualize a program as a living organism,
made up of smaller organisms. As RNA sends requests between the cells in our
bodies, messages send questions and answers and requests to act between objects.

Sooner or later, all programming paradigms are about how to manage complexity,
and this is true of OO as well: The idea is that by making lots of little
organisms, each with their own internal state that they manage, each taking care
of their own concerns, the entire program becomes simpler: each object looks
after itself, and you, the programmer, don't have to hold as much in your
head. Much as a general in the army can send troops out without packing their
lunchboxes or checking their guns for them, larger objects can command smaller
ones without worrying about the details, of, say, how the thing they asked that
database object to store got stored. And like in an army, if that database
object is bad, and needs to be replaced, so long as it can respond to the same
*commands*, the same *messages*, there's no reason why the rest of the program
can't keep chugging onwards. If you get a heart transplant, your blood doesn't
get all surprised that your heart is new and different: it's still a heart, with
the same interface, so it's no big deal (okay, sometimes heart transplants are
rejected: the human body is not a great OO system...).

This is the fundamental OO principle of *encapsulation* in action. The idea that
so long as an object answers the messages it's supposed to in the way it's
supposed, we can replace it, and other objects don't need to be concerned about
how it does its job. In a well-designed OO program, other objects can't even
*know* how it does its job: just that it does it. And through this
encapsulation, we get *abstraction*: since objects don't have to worry about
other objects' internals, they don't have to worry about the nitty-gritty
details, and can think in terms of what they need done, not how those things
happen.

## Another Example

The classic example here is collections. So... let's talk about getting a random
value from a range:

```
r := (1 to: 10).
r atRandom.
```

The `:=` syntax might seem funky to you, but that's how we're assigning
variables values. I already used the `=` sign that you might be used to up
above, so we're stuck with it. We're assigning `r` the result of sending `to:
10` to `1`, which is an `Interval`: a collection that contains all the values
between 1 and 10. It's a range. Not super complicated. But what if we were using
an Array instead?

```
r := Array new: 3.
r at: 1 put: 5.
r at: 2 put: 10.
r at: 3 put: 15.
r atRandom. 
```

This is a little fancier: we're sending a message to the class `Array`, asking
it to make a `new` array, with `3` elements. So for a moment, we can talk about
classes. Classes are objects too, and you can send a message to them, just like
anything else. They're just objects that create other objects from a sort of
blueprint, so creating a new object usually involves talking to one. And yes,
Classes do have a class of their own, it's called `Class`. Don't ask me what
class `Class` has, I don't know. This is all I will say about classes.

Once we have an array, we can ask it to put things inside itself. With
`at:put:`, we're asking it to `put:` certain numbers `at:` various locations
inside the array. In this case, the first three locations (yes, experienced
programmers location numbers start at one. Sorry).

But that final line, `r atRandom.`, is the same, even though getting a random
number from a range and a random element from an array are totally different
operations. This is why I used this example, because this is the abstraction I'm
describing: it doesn't matter what the object is and how it works, and we, the
programmers fishing out a random element, don't have to think about it.

# It's about relationships

I've mostly focused on single objects, but as I said above, Object Oriented
programming is, in a big way, about taking a bunch of objects and having them
all interact to form a greater whole, and how to build a complicated system out
of those objects in a way that makes the whole thing easy to work with and
modify.

This is an art onto itself, and making a good object oriented program is closely
related to how to make a good *program*, something smarter people than I have
been challenged by. Over time, people have noticed that certain common problems
are easily solved by certain types of objects interacting in a certain way. In
1994, four programmers published a book describing 23 of these common scenarios,
and gave the solutions to these kinds of common scenarios a name: *design
patterns*.

People focus on *specific* design patterns too much. I'm not going to talk about
any of them. But what design patterns, in the programming sense, really are are
a set of thought tools: they provide you with useful strategies for dealing with
common situations that come up a lot. As you program, you'll develop your own
strategies of these sorts. And if they work well for you and lead to good code,
they're just as valid as any design patterns you might see online. If it turns
out they work badly... well, that's learning.

In an ideal world, we could strip out all repetition from code, and you'd never
write the same line twice. But in the real world, it's almost impossible to
eliminate all patterns from your code even with the most powerful of tools
(looking at you, Lisp programmers). Patterns in code have existed before OO, and
the concept of design patterns applies just as strongly to every programming
language out there, OO or no. So knowing about patterns that are helpful is
good. By the same token, however, don't think of them as *anything other than
tools*, and the moment they hinder you rather than help you, throw them away. If
you put the name of the pattern you used into the name of your class, you're
probably doing it wrong.


# Closing

If you asked me what OO is all about, I'd say it's about writing simple,
autonomous actors that combine together to build a more complex program that's
easier to understand than a giant, creaking monolith. Everything else is just
fallout from that philosophy: ways of making that goal attainable, and ways that
help to make complicated systems simple and manageable. I didn't talk about
subclasses here, because subclasses aren't a core feature of OO: they're just
another tool for the programmer. A valuable, useful tool, but not the *soul*.

The programming language I used in the examples above isn't some fake
programming language I invented: It's a language called Smalltalk, born at Xerox
in the late 1970s and released in more or less its present form in 1980. While
it wasn't the first OO language, it was the language from which the coin was
termed, and it was Smalltalk and ideas that emerged from the Smalltalk community
that were foundational to the way we understand OO today. It was originally
designed to be so simple that it could be taught to children. It was designed to
have few core concepts, and it was designed around a graphical, visual
environment, navigated with a mouse. Smalltalk's interface would eventually form
the basis for the original Macintosh.

It's hard to explain how revolutionary Smalltalk is to someone who's never used
it. It's a strange, bizarre programming langauge that shaped the present and yet
feels like it came from an alternate future that never came to pass. And I
encourage you to play around with it a bit. Download a copy of of
[Squeak](https://squeak.org/) and just... experiment. It's fun, and it might
give you a new outlook on the programming langauges you use today.

Likewise, I hope this article has given you a new outlook on OO.

<hr class="fancy" />

Writing this blog is just a thing I do in my spare time, but if you have a spare
$5 and you enjoyed it, you can donate to me on Ko-fi by clicking the dollar sign
in bottom right. Don't feel obligated to do this. But it's an option.
