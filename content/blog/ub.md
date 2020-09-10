+++
title = "Undefined Behavior, to make a short story long"
description = "Language Lawyering for newbies"
date = 2020-09-10
+++

I know a number of people who are taking an introductory course in C (not C++,
thank the lord, but normal C) right now, and some of them just failed an exam
question because it invoked undefined behavior. So... here's my explanation of
UB, for recovering Java programmers and other people who may not have
encountered such a concept. Why? Because nobody tells new C programmers about
UB, and *understanding* UB is crucial to understanding C, reasoning about what
the compiler will do to your code, and most crucially and hardest of all,
writing C code that is *safe*. I've also included an explanation of a few
undefined-adjacent behaviors (implementation-defined and unspecified behaviors,
to be exact) because they're important for similar reasons.

Welcome to C, where you're lucky if your program crashes, your compiler is
conspiring against you in the name of benchmark numbers, and being a language
lawyer is a valid survival tactic.

# What is UB?

UB, or Undefined Behavior, is a well-intentioned mistake that X3J11 (the C
standards working group) made in 1989 and we've been living with ever since. But
that's not really a helpful definition. So... here's the real deal.

C (and to a lesser extent C++) were explicitly designed to run on many different
machines, and to do so with pretty good performance. And nowadays, this is no
big deal, really: be honest, how many architectures do we really have in use?
there's x86, there's ARM, and those are the big players. Out around the edges
there are bunch of other platforms, stuff like the AVRs, the RiscVs, and so on,
but most new CPU architectures are iterations on older ones, and have more or
less similar capabilities, behaviors, and instruction sets. We still have issues
with this sort of thing, but differences between architectures are relatively
minor for the most part.

That was *not* true in 1989, and sure as heck not true before that. There were
*weird* CPUs floating around, 8/16 bit CPUs with extreme limitations were still
pretty popular in a lot places, and C had to run just as well there as it did on
VAXen that had dedicated CPU instructions for evaluating polynomials from tables
(yes, really).

So, to benefit implementors, C defined three categories of behavior that the
spec gave compilers leeway on: Implementation-defined Behavior, Unspecified
Behavior, and Undefined Behavior.

Implementation-defined Behavior is the simplest, and the one you probably don't
even think about. This is stuff that could change from implementation to
implementation (within certain limits given by the spec) but the implementation
has to document the behavior and obey its own documentation. This is stuff like
how many bits are in a byte (no really, it can be more than eight: if you study
old CPUs this actually makes sense), how big `int` and other standard data types
are, endianness, and how floats are represented (at this point a few of you
might be saying "hang on, why isn't C guaranteeing IEEE floats like every other
programming language?" The answer is that C predates IEEE floats and while ANSI
C doesn't, it still needed to run on platforms were IEEE floats weren't
guaranteed). If you've worked at a hardware level before none of this stuff is
surprising. The compiler gets license here, but more or less it's just to choose
the most reasonable and performant choice for the given architecture.

Unspecified Behavior is a little trickier. This is stuff that might change based
on your compiler settings or your implementation, or even on where it happens in
your code. The compiler has a set of options that it can choose from for what to
do, defined by the standard, and it can do any one of those things, any time the
behavior is invoked, without documenting it, based on what it feels like doing
at the moment. Once again, a lot about how your type is specifically represented
on the hardware falls into unspecified behavior: Struct padding is a classic
example of this: While the *order* of the data in a struct is defined, the
compiler can put as much padding between two fields as it feels like putting
there (although in practice it will always just pad to the type alignment). The
main place unspecified behavior can trip people up is the evaluation of
sub-expressions: `a(x) + b(x)` isn't guaranteed to be evaluated from left to
right: the compiler could actually call `b` first, which might cause issues for
you if `x` is a pointer. Likewise, `f(a(x),b(x))` guarantees that `f` is called
after `a` and `b`, but doesn't guarantee the order `a` and `b` are called in. Of
course, `a(x) || b(x)` and the other logical operators do have a defined
order, because `a(x) || b(x)` short-circuits, but it's the exception, not the
rule.

Which brings us to *Undefined Behavior*. Undefined Behavior is the most
surprising of C's 3 categories, because the spec imposes no requirements on what
happens in the case of undefined behavior: Your code might terminate, the
compiler might issue a warning, or even refuse to compile the code, the behavior
might be ignored, demons might fly out of your nose, your hard drive could be
wiped (those last two probably won't happen, don't worry...), and whether or not
any of this behavior is documented is entirely left in the hands of the
implementer with absolutely no requirements. Crucially, this doesn't guarantee a
compiler error: it doesn't guarantee *anything*. So the instant your code
invokes undefined behavior, all bets are off. You are left in the hands of the
compiler, and the compiler is not so much a monkey's paw as it is an entire
monkey.

# So... which things invoke undefined behavior, and why does it matter?

Way too many things, I can't list them all. Most of them aren't things that will
ever happen, so I won't bother (stuff like your program not defining a `main`
function), but here are the highlights.

1. Use of uninitialized variables.
2. Signed Integer Overflow
3. Dereferencing pointers to things you don't own (`free`d pointers, pointers to
   random places in RAM, etc) and accessing array elements that are out of
   bounds.
4. Dereferencing NULL
5. Violating Aliasing Rules (which is a while complicated thing unto itself...)

These are the ones you actually have to worry about 99% of the time. I mean,
it's also undefined to shift a 32-bit number by 32+ bits, but in practice it's
either gonna be the number itself, or it will be zero. Also, why would you do
that?

This matters, because undefined behavior can result in weird, unexpected
results. A big part of why is because of how compilers *implement* Undefined
Behavior: namely, they've all more or less decided that since they can do
anything, that includes *assuming that UB won't happen*, and propagating those
assumptions backwards through your code to make it "faster" (and by faster, I
mean *wrong*). This, as well as the other common approach of ignoring UB, can
lead to bewildering program bugs.

# Do you have any examples?

You bet! Let's take them one by one, shall we?

## Uninitialized variables

This is one of the obvious ones. I mean, if you read any integer that you
haven't assigned to, it could be anything, right? Well... no. Uninitialized
variables can be much, much weirder than that. I'm not actually going to write
an example, because I found one so perfect that I just want to share it with
you: I give you [a variable that is both true and false at the same
time](https://markshroyer.com/2012/06/c-both-true-and-false/). Thanks, Mark.

## Signed Integer Overflow

"Wait!" I hear you saying. "Doesn't integer overflow just wrap around?"
Nope. Not according to C anyways. *unsigned* integers are guaranteed to wrap
around, but when it comes to unsigned integers, they never wrap.

Here are a few practical consequences of this. Take a look at this simple code.

```c
for (int i = 0; i < 0; i++) {
    never_knows_best();
}
printf("I'm overflowing!\n")
```

The compiler can look at this and say: "hey, `i` is zero, and we just add to it
forever. It's never gonna be less than zero! I can optimize all this away!" So
it does. In practice, a lot of common compilers will optimize this code to be
this:

```c
while (1) {
    never_knows_best();
}
```

The reason why compiler do this is so they can unroll your loops and because
they can assume that they know how many iterations your normal for loop goes
for. But it can be irritating. It also means that this code:

```c
//return true if x+y overflows/underflows
int test_for_overflow(int x, int y) {
    return (y < 0)? ((x+y) > x) : ((x + y) < x);
}
```

Actually will always return false, because compilers apply algebra and say that
both conditions can never happen. Or maybe it won't: it depends on your compiler
settings and what compiler you use. Isn't UB fun?

(By the way, if you need to check for an overflow, here's a way to do it:
```c
int test_for_overflow(int x, int y) {
    return (y < 0)? (x < (INT_MIN - y)) 
                  : (x > (INT_MAX - y));
}
```
I mean, that's probably right. I haven't tested it so don't trust me. GCC also 
has built-ins for this if you don't care about compatibility).

## A brief side note: Forward Progress

This is not so much undefined behavior as explicitly defined behavior, but it
can come and bite you similarly and the next example reminded me of it, so here
you go: recent C standards have made it explicit that in certain cases C++'s
concept of "Forward progress" applies (previously this was just a way to
interpret the spec). Specifically, if you have a loop that depends on some
variable for its test, but doesn't either

1. Do some kind of I/O
2. Touch a volatile variable
3. Perform atomic or synchronization operations (threading stuff)

The compiler is free to assume that the loop *will eventually* terminate and act
as if it will. Therefore, these two seemingly identical code fragments behave
*very* differently.

```c
int foo = 0
while (foo) {} //this immediately exits after one iteration
while(1) {} // this will loop forever
```

Basically, if you depend on a variable, the compiler assumes you terminate. And
if terminating in one iteration would yield the same result as terminating in
1000 iterations, then as far as the compiler is concerned you terminate in one
iteration.

## Dereferencing random pointers and out-of-bounds access

This is really just here because if you do this on *real hardware*, anything
could happen, from nothing to getting garbage to crashing your code. In
practice, it's relatively uncommon for the compiler to do a ton with this, but
it does happen. As with null pointers (we'll get it), the compiler can use this
to optimize away things that "can't" happen. In particular, it can come to some
pretty wacky logical derivations based on this.

Once again, I won't provide an example here. Instead I'll defer to everyone's
favorite Microsoft employee, Raymond Chen (seriously, The New Old Thing is an
excellent blog) to explain how [Undefined Behavior can result in time
travel](https://devblogs.microsoft.com/oldnewthing/20140627-00/?p=633).

## NULL pointer access

Here's *the* classic UB example that everyone uses. Let's say you've got this
function here:

```c
int do_stuff(int *p) {
    if(p == NULL) return 0;
    int someresult = 0;
    //do some stuff
    return someresult;
}
```

Now, let's say there was a bug, so you unthinkingly insert this debugging
statement:

```c
int do_stuff(int *p) {
    printf("the value of p is %d", *p);
    if(p == NULL) return 0;
    int someresult = 0;
    //do some stuff
    return someresult;
}
```

At this point, the compiler says "hang on, you derferenced `p`. If you
derference it, it can't be NULL, because if it was NULL that would be undefined
behavior."

As a result, this "optimization" happens:

```c
int do_stuff(int *p) {
    printf("the value of p is %d", *p);
    int someresult = 0;
    //do some stuff
    return someresult;
}
```

Woo, NULL checks gone. Live fast and die hard. This isn't so bad, but this code
(based on something from an [LLVM blog
post](https://blog.llvm.org/posts/2011-05-14-what-every-c-programmer-should-know_14/))
also can optimize the same way:

```c
int do_stuff(int *p) {
    int unused = *p;
    if(p == NULL) return 0;
    int someresult = 0;
    //do some stuff
    return someresult;
}
```

...except of course that `unused` itself is optimized away because it's never
used. *But* if `unused` is optimized away first, the check stays in because now
there's no reason to take it out. This can change between compiler versions, and
is based on a real Linux kernel bug.

## Aliasing rules

Aliasing rules are another rich vein of undefined behavior: TL;DR, if you make a
cast between two different pointer types, like between `int*` and `float*`, and
then deference that, it's undefined. You have to use `memcpy` or a `union`, and
pray that the compiler will optimize the extra copies out. Obviously, this is
kind of lame (the compiler won't do what you want it to always). But you might
wonder how often this comes up in real-world C code.

Great question. The answer is, more than you'd think. In fact, in C89, this was
*defined* behavior. It was changed in C99 to open up opportunities for compiler
optimization. Ironically, 1999 was the year of the most famous use of this exact
undefined behavior: Quake 3's `Q_rsqrt`, aka `FastInvSqrt`, which computes
1/sqrt(x) like this:

```c
float Q_rsqrt( float number )
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y  = number;
	i  = * ( long * ) &y;                       // evil floating point bit level hacking
	i  = 0x5f3759df - ( i >> 1 );               // what the fuck? 
	y  = * ( float * ) &i;
	y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//	y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

	return y;
}
```

This is totally valid C89, but god only knows what a C99 compiler would do to
it. (By the way, use built-in inverse sqrt() functions instead of this on modern
computers: they can use hardware instructions that are way faster than this
weird hack. Second note, Carmack didn't write this, it comes from SGI and was
originally written in the 80s. But I digress...). And a lot of low-level code
relies on these kinds of hacks: not for anything so fancy as this, but just for
things like reading binary data off disk and directly into a struct (although
maybe don't do that either...). The point is, it's sometimes hard to avoid and
it's an easy trap to fall into.

# How do I avoid Undefined Behavior?

It can be hard or impossible to avoid UB. There are a lot of traps and pitfalls,
and a lot of examples are difficult to avoid. So... yeah, you can't. But that
doesn't mean you shouldn't *try*. Thankfully, on modern versions of GCC and
Clang, we do have tools that can help: if you compile your code with
`-fsanitize=undefined`, you'll enable the UBSanitzer, which will do compile-time
and runtime checks to make sure your code isn't invoking UB. There are a huge
number of checks available, and while it probably can't catch everything, it's a
useful thing to run on your code.

However, there are other cases where it's impractical or impossible to avoid UB
(see the aliasing stuff above), or you're trying to avoid it but you're writing
security-critical code and want insurance in case you fail. In *those* cases,
there are compiler flags you can feed your compiler to tell it that you want it
to stop making assumptions based on certain types of undefined behavior. In
particular, `-fwrapv` will disable optimizations based on the assumption that
int arithmetic never overflows, and `-fno-strict-aliasing` disables aliasing
rule checks. The second in particular is extremely common in production
codebases, and it's worthwhile to know about.

# Resources

If you have infinite free time, you can read all 500 pages of the C spec for
whatever specific version of C you're writing. I don't really recommend this...

Also, I linked a few different blog posts, but I only linked one part of LLVM's
series [What Every C Programmer Should Know About Undefined
Behavior](https://blog.llvm.org/posts/2011-05-13-what-every-c-programmer-should-know/). I
highly recommend reading more of it. It's very good and I stole a lot from it
writing this.

For more general resources, and other stuff you might like if you like
this... If you want more information about the pitfalls of writing C or more
about low-level work, I highly recommend [Bruce Dawson's
blog](https://randomascii.wordpress.com/) and his series about floating point in
particular. And if you're interested in games programming and found my tangent
about Quake 3 cool, or you're interested in generally learning more about C
programming, check out [Fabien Sanglard's website](https://fabiensanglard.net/),
where you can find code reviews and discussions of not just Quake 3 and id
software's work, but similar writings on lot of other 90s video games with
available source code as well.

<hr class="fancy" />

If you enjoyed this blog post and you don't have anything better to spend your
money on, you can donate to me on Ko-Fi by clicking the dollar sign on the
bottom right. If you want to read whatever I post the next time I write
something, you can click the RSS icon to subscribe to my RSS. And if you have a
comment for me, you can email me by clicking the mail icon. This article is best
viewed with a web browser, but if you're reading these words you probably
already know that. Hopefully, this was helpful, but I'm too insecure to
guarantee that it will be.
