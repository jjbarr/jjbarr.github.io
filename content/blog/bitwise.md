+++
title = "Bitwise Basics"
description = "Fundamentally what you need to know"
date = 2021-01-25
+++

> Candidates *do* need to know about bits and bytes, at least at the level that
> I'm outlining here. Otherwise they're prone to having an integer-overflow
> error in their code that brings the website down and costs us millions. Or
> spending a week trying to decode a serialized object they're debugging. Or
> whatever. Computers don't have ten fingers; they have one. So people need to
> know this stuff.
>
> -Steve Yegge, "The Five Essential Phone-Screen Questions"

Well, it was true all the way back in 2004 when this article was published
internally at Amazon, and it's still true today. I'm not a famous ex-google
engineer with a following of cool and attractive people who will happily listen
to me talk all day about how Emacs is the greatest text editor in the known
universe, but I got a UCA job with a university introductory systems course that
doesn't actually teach students bitwise fundamentals. Shine on, you crazy,
unconventional diamonds.

So if my professors won't do it, I will. Class is now in session, I have a giant
bird mask on my head, this is fine. With luck, by the end of this post I'll be
able to give you a handle on:

- Counting in Binary
- Hexadecimal, and hex-to-binary conversion
- Standard Bitwise Operators
- Setting, clearing, and manipulating bits
- Bitmasks, Bitflags, and the like
- Two's Complement

But that's, like, a lot. So I can only promise to do my best and keep up my
charming facade of clownish buffoonery lest you all realize I'm a shameless hack
before the post ends.

# One! Ah Ah Ah!

I learned how to count in binary as a child in the back of a car because my dad
thought it was a neat party trick. If you're not in CS, it's basically just a
neat party trick. If you are in CS, it sorta matters. I don't expect anyone to
be able to just start decoding binary at the drop of a hat, but you need to know
how it's done.

In base ten, the rightmost number is in the ones place, the next number is in
the tens place, then the hundreds, and so on. You passed first grade, so I
probably don't need to tell you that. Base two, binary, also works like this,
but each place increments by powers of two. So the first place is still the
ones, the second place is the twos, the third is the fours, and so on. The *n*th
place is the *2^(n-1)*s place.

Decoding binary is very simple. If there's a one in a given place, add the
number for that place to the total. Otherwise, don't. At the end, that total is
the number. So *1110* is 2+4+8=14. Simple, right?

On paper, we can have as many binary digits as we need to work with. However, in
computers, most of the time we are operating with a fixed number of binary
digits ("bit" stands for binary digit, in case you didn't know...). A *byte*
(usually represented by the *char* type in C) is eight binary digits. Most
computers also have a number of bits that they natively operate on: they usually
support working with numbers with less bits at no cost, but if you go beyond
this native size, you'll start incurring additional expenses when you do
math. This "native size" is known as the *word size*. Most modern computers have
a 64-bit word size, although 32-bit word sizes are not uncommon. If you're
running on x86, and particularly on windows, 32 bit numbers are sometimes known
as "dwords" ("double words"), and 64 bit numbers are sometimes known as "qwords"
("quad words"). This does not accurately reflect the word size of the machine
(which probably *is* either a dword or a qword), and this terminology is only
used for dumb reasons that would take too long to explain.

The largest possible number that can be expression in *n* bits is *(2^n)-1*. The
largest 32 bit number is around 4 billion, and the largest 64 bit number
is... probably big enough. You don't really need to know either of these. You
*should* know that the largest possible number you can fit in a byte is 255, and
the largest number that can fit in 16 bits is 65535.

It can be hard to tell if a number is in binary or just base 10 but only has
ones and zeroes in it. A common convention is to prefix a binary number with
*0b* to signify that it's binary. 10 is 10, *0b10* is 2. (you may also see
binary numbers prefixed with a percent sign, but this is less common).

# Hexed

Binary is cumbersome. Writing in binary is a pain, and you frequently need to
write a lot of zeroes to get the number you want. It's an unnecessary load on
the programmer. More to the point, C doesn't have binary literals. It really,
really should. But it doesn't.

C *does*, however, have hex literals. So let's talk about hexadecimal, sometimes
known as base 16. As you might expect, the first place is the ones, then the
16s, then the... uh... 256es place. Yeah. That. This does, however, mean we need
16 digits, where our standard numerical system has a mere ten (0-9). Thus, we
turn to letters: in hex, A is 10, B is 11, C is 12, and so on up to F, which is
the number 15, and the highest digit.

So as not to confuse decimal with hex, hex numbers are almost always written
with the prefix "0x", which is also the format that C accepts hex numbers in. 10
is 10, 0x10 is 16. You might also see 0x10 written as 10h. This format is
accepted by various assemblers, and if you try to use it in C your code won't
compile. But it's good to know about if you see it around.

The lovely, lovely thing about hexadecimal is that each hex digit corresponds to
*exactly* four bits. Thus, if you see two hex digits, you know you're working
with a byte. Four signify a 16 bit number, and so on. Unlike binary, you can
guarantee that if an number fits in a certain number of hex digits, it will fit
in the corresponding number of bits.

There are a few hex numbers you should know off the top of your head, and most
of them have to do with bits. 0x80 is the number 128, and it's a byte with only
the highest bit set. If you can do subtraction, you can deduce that 0x7F
is 127. This is the largest number that can be expressed in 7 bits, and it's a
byte with every bit *except* the highest bit set.

In the general case, it can be useful to look at a hex number and figure out
what the bit pattern it represents is. Actually, this is a pretty common thing
to want to do, so you should know how to do it. The trick is to look at each
digit individually. The bits are represented by the numbers 1, 2, 4,
and 8. Subtract each in turn from each digit, highest to lowest (starting with
eight, going to one), ignoring any that would result in a negative number. If
you could subtract the number without going negative, than that bit is set. For
example, given the number 0xCF, We can see that 8 can be subtracted from C,
giving 4, and 4 can be subtracted from 4, giving 0. 2 and 1 can't be subtracted
without going negative. Thus, the two highest bits in the nybble (a nybble is
the term for four bits) are set. Then we turn to the F, and we don't even need
to decode this: F is the highest hex digit, so all bits must be set. Thus, we
can determine that 0xCF = 0b11001111.

You might notice I haven't spent a lot of time discussing how to convert hex to
decimal. That's because... well, it really doesn't matter very much. If you're
looking at hex values, the decimal value of the number is probably not super
relevant to you. Hex is the language programmers use to quickly write down bit
patterns, or pointers, or things like that. If I'm talking about how internal
device memory extends from 0x0000 to 0x07FF (a whopping 2 kilobytes!), I don't
care what 0x07FF is in decimal (it's 2047, for reference), I care that it's the
largest value in internal device memory, and if I see a pointer to 0x0800,
that's pointing at something above internal memory (in the case of the random
machine I chose as an example, the NES, device memory is mapped three times and
memory location 0x0800 is equivalent to memory location 0x0000, but that doesn't
matter). If you really need to know the decimal value of a hex number (because
you're looking at a value in a debugger that you think is the size of an array
and you want to see if it's too big, for example), your debugger, programmer's
calculator, or nearest python interpreter has tools to help you. Don't bother
trying to convert by hand.

# Complementary, My Dear Watson

Before we get into bitwise operations, I need to take a diversion, and talk
about two's complement. Thus far, we've dealt entirely with positive number, and
you may wonder how negative numbers are represented by computers. If we wanted
to write -255 on paper, we can just stick a minus sign in front
of 255. Computers do not have that luxury. If a number is eight bits, it's eight
bits, there's nowhere to put a minus sign. Over the years, there have been
various solutions to the problem of representing negative numbers on computers,
and most of them have been truly terrible. The only two you need to know about
are sign-magnitude and two's-complement. Mostly the second one. But I'm talking
about the first one first. Because it's easier. And I'm lazy.

Sign-magnitude representation is the most obvious way to represent negative
numbers: Just have the highest bit signal whether the number is positive or
negative. In order to change the sign, just flip that bit. In order to check
whether the number is positive or negative, just see if the bit is high. This is
the method used for floating point numbers (for reasons too complex to get into
here: floating point is complicated and I don't want to explain it. I may also
lack the capability to do so...). It's obvious and intuitive, but there are a
few problems with it. First off, you now have both positive zero, and negative
zero (yes, positive and negative zero are distinct and not equal in floating
point numbers. This has caused bugs). Secondly, you now need special hardware
because when you subtract 1 from 0 you get 1 with the highest bit set, which is
not what a normal subtraction circuit does in that situation. And that costs
money.

## An aside: Overflow and Underflow

Before I explain why two's complement is the greatest thing since sliced bread,
I need to briefly discuss what *does* happen when you subtract from 0 on a
non-signed number. You probably already know, but in case you don't, it wraps
around. So if you subtract 1 from zero, all the bits in the entire number become
1, and you get the highest possible number you can describe in however many bits
you're using. If you add 1 to that number, you get zero. The reason for this is
a) it's convenient, and b) if you're combining two numbers of the same bit size
to get a larger number because the largest number the CPU can handle natively
isn't big enough, this is the correct behavior and you can just use an
add-with-carry CPU instruction (which most CPUs provide) to finish the
add. Alright, back to our regularly scheduled programming.

## Two's Complement: What God Intended

I'm not sure I can overstate how awesome two's complement is. Why? Because I
never need to *think* about two's complement. Nobody does. It just
works. Silent, and invisible. Truly great engineering is like janitorial staff:
it does its job silently, invisibly, and you never need to think about it. Most
engineering sucks, though, which is why I occasionally need to go swear at
whatever broken piece of crap developers who neither use nor understand UNIX
have foisted upon me this week. For god's sake, do not bundle an ancient version
of a dead fork of ffmpeg with your sources that I need to build in order to run
your piece of garbage. But I digress.

Two's complement works like this: The negative version of the number is zero
minus the number, using unsigned arithmetic (where the number can't be less than
zero). Negative one is just the highest unsigned number. Negative two is that
minus one. And so on. It's that simple.

This has some very real benefits that you might not have noticed. Firstly, no
negative zero: there is only one zero, as god intended. Secondly, arithmetic
just worked. You don't need to do special math to work with numbers that might
be negative, you can use the same addition and subtraction hardware and
operations, no changes necessary. Thirdly, like sign-magnitude representation,
all you need to do to check whether a number is negative is check whether the
highest bit is set (note, please don't be clever and replace `x < 0` in all your
code with a test to see if the highest bit of `x` is set. `x < 0` is faster in
basically all cases because CPU designers know that people do it all the time,
and your compiler might or might not be smart enough to notice the
equivalence). Fourthly, if you add one to the highest number in two's
complement, it will wrap around to the lowest possible number, given the number
of bits you're using. That might sound bad, and it can be (integer overflow bugs
have caused real problems), but at least it's the same *kind* of bad that
happens with unsigned integers. It's *consistent*.

The only difference between two's complement and unsigned numbers comes when
increasing the number of bits: taking an 8-bit number and making it a sixteen
bit number, for example. With an unsigned number, the eight new bits are just
zero. With a *signed* two's complement number, if the highest bit of the
original number is one, all the new bits you're adding must also be set to one
to preserve the value and negativity of the number. This is known as "sign
extension".

As a final note, technically the C standard does not require signed numbers to
be two's complement, because C dates to an era where some machines actually used
different schemes (The Apollo Guidance Computer, which got us to the moon,
actually used *ones* complement arithmetic. Google that later and be
horrified. Yuck). Thus, if you want to write fully standard-compliant portable
C, you technically can't rely on negatives being two's complement. However, only
the most pedantic of spec lawyers would ever complain about this: basically
every computer you'd want to actually run software on uses two's complement, and
it's one of the safest assumptions you can possibly make about a machine.

Right, digression over. Onwards for glory!

# Bitwise Operations (Bitfoolish operations not listed)

Bitwise operations operate directly on bits themselves. They aren't arithmetic
operations: They don't really make sense if you think about numbers as... well,
numbers. Instead, they treat numbers as an array of bits, the size of which is
determined by the size of the number. You might wonder why this is useful, and
the answer is that it's useful all the time, in the world of C. There are a lot
of situations where you need an array of boolean values (C technically has the
`bool` type, but it didn't for well over a decade, and `bool` is just a renamed
`int` or `char`, so you're wasting a ton of space making an array of them...),
or you need to pack multiple elements of different bit extents together to
create a type (more often, a type tag). This comes up when serializing to binary
formats designed for network transmission, where the number of bytes in the
message can make a real impact, and a variety of other techniques.

Before I go into the rest, I should note something: For as much as C's types are
more about representation and size rather than anything (because all of them are
numbers, yes, even characters), they don't have a size. `int` can be 16 bits or
more. `char` needs to be *at least* 8 bits. Sure, `int` is probably 32 bits, and
`char` is *probably* 8, but if it really matters to your program because you're
doing bit manipulations, and everything will go to hell if your data types
aren't the 32 bits or whatever you're expecting, you should be using `stdint.h`,
which provides `intX_t` and `uintX_t` types, where X is most common sizes in
bits (8, 16, 32, 64...). These types are *guaranteed* to be the exact size they
claim to be (the u prefix indicates an unsigned type. As we'll go into, this can
matter).

## Shifts, one way or another

The simplest bitwise operation to describe, and one of the few that makes some
kind of mathematical sense, is the *bit shift.* Bit shifts work they way they
sound like the do. The left shift shifts every bit one place to the left,
inserting a zero at the end. On paper, you can do a left shift by just writing a
zero after the smallest bit (although in a computer, the largest bit is lost
because there's no longer space for it). The right shift shifts every bit to the
right, with the smallest bit "falling off" the end. You can do a right shift on
paper by simply erasing the smallest bit in the number. If you're quick, you
might have realized that a left shift is equivalent to multiplying a number by
two, and a right shift is equivalent to division by two rounding down. Please
don't use left and right shift in your code for these purposes, the compiler is
usually smart enough to do it for you if it would make your code faster, and it
makes your code harder to read. Machines are fast enough now that readability
matters more than performance about 99% of the time.

In C, the left shift is the `<<` operator, and the right shift is the `>>`
operator. Both accept an operand on the right hand that determines how far to
shift: `x << n` shifts `x` `n` places to the left. There are also the `<<=` and
`>>=` operators, which shift and assign. They work just like `+=`, `-=`, `*=`,
and `/=`, so I shouldn't need to explain that.

### Logical, or Arithmetic

There is only one kind of left shift, but there are two kinds of right
shifts. The one I've described is the *logical* shift, and it's what C does when
you shift an unsigned number. However, if you shift a *signed* number, C
performs an *arithmetic* shift. The difference is that if the most significant
bit of the number is one, an arithmetic will shift in *ones*, not zeroes. Given
the 8-bit number `10000000`, a logical right shift yields `01000000`, and an
arithmetic right shift yields `11000000`. Why would you ever want this? Well, if
you're working with a signed negative two's complement number, the arithmetic
right shift correctly divides by two, giving you the negative result you
expect. However, as we've established, most of the time you're probably not
going to be using shifts for math. So make sure to make any number you're
shifting for non-arithmetic purposes `unsigned`, lest you run into unpleasant
bugs.

### What use is shift?

Shifts have a lot of uses. If there's a number embedded into the bits you're
working with that that you need to fish out, bit shifts can bring that number
down to start of the bit pattern so you can treat it normally. For example, if
the low three bits of a 16 bit number indicate the type of the value, and the
top 13 indicate its length, you can shift it three to the right to get that
length information in a convenient format. This sort of thing shows up a
surprising amount.

Another, more common use of shifts is iterating over the bits in a value. For
example:

```c
int ones = 0;
for(uint32_t b = n;b != 0; b >>= 1) {
    ones += b & 0x01; 
}
```

And the end of the loop, `ones` will contain the number of bits that were set to
one in `n`. (We'll talk about what the `&` is doing in just a moment).

So... yeah. Shifts. Bloody useful.

## AND and OR: Bits (un)masked

These are the operations everyone thinks of when they think of bitwise
operations. Bitwise AND and bitwise OR don't have any logical interpretation on
real numbers. Instead, they act on arrays of booleans. Which... well, binary
numbers *are* arrays of booleans. So there you go. But you need to stop thinking
about numbers, and start thinking about bits.

## OR: Setting the bit

Bitwise OR (`|` in C, with assigning variant `|=`) ORs the bits in each place on
both sides. It's easier to see an example. To make it easy, we'll do `0x83 |
0x71`. In binary, that's

```
  1000 0011
| 0111 0001
```

I took the liberty of inserting spaces in between each nybble (4-bit sequence)
to make it easier to read. Anyways, written out like this, you can do an OR by
just ORing each column. Which gives us

```
   1000 0011
|  0111 0001
== 1111 0011
```

Or in hex, `0x83 | 0x71 == 0xF3`.

Bitwise OR is most commonly to ensure a bit is set as true, or (even more often)
to combine bit constants together.

I should probably explain why bit constants exist. A lot of C functions end up
looking like this:

```c
void frobnicate(char *quux, int foo, int flags)
```

That flags field is the relevant part. Arguments named "flags" are almost
*always* a number that is treated as an array of booleans that alter function
behavior, and the library the function is from will invariably provide constants
for each defined flag bit. For example, POSIX's
[open(2)](https://man7.org/linux/man-pages/man2/open.2.html) has a flags field
that you can use to specify how a file might be opened. `O_RDONLY` opens a file
read only, and so on. But there are options that can be *combined*. For example,
if you want to open a file for writing, and also erase whatever's in it before
writing anything, you'll need to set both `O_WRONLY` and `O_TRUNC`. Which you
can do by simply specifying... `O_WRONLY | O_TRUNC`.

By the way, if you want to have a flags argument yourself, you would build the
constants like this:

```c
#define FROB_NOSTRANGERS 0x01
#define FROB_TOLOVE 0x02
#define FROB_YOUKNOW 0x04
#define FROB_THERULES 0x08
#define FROB_ANDSO 0x10
#define FROB_DOI 0x20
```

and so on. 1, 2, 4, and 8 *are* the bits in hex, after all... You can also use
an `enum` instead of `#define`s. Either is fine.

## AND: The powerhouse operator

Bitwise AND (`&` in C, with assigning variant `&=`) works just like bitwise
OR... except it's an and. To use the same example (`0x83 & 0x71`) again:

```
   1000 0011
&  0111 0001
== 0000 0001
```

Very simple.

So, what's bitwise AND used for? The most obvious usage to check for the
presence of flags. When you're inside `frobnicate` and need to check for the
`FROB_NOSTRANGERS` flag to decide whether or not to initiate the NOSTRANGERS
protocol or whatever, you can do this:

```c
if(flags & FROB_NOSTRANGERS) //no strangers!
```

However, bitwise AND has a ton of uses. You can use it to cap the range of a
number to a certain set of bits, for example: `n & 0x0F` yields only the first
four bits of `n`, with all others cleared. This is why the right-hand side
argument to `&` is sometimes known as a "bitmask".

You can also use `&` to clear a bit, like you can use `|` to set it. But you
need another operator...

## I just love complements!

`~`: The bitwise complement, sometimes called bitwise not. This is that rarest
of things, a unary bitwise operator. All it does is flip all the bits in a given
number. `~0b10110000 == 0b01001111` (this isn't legal C, C doesn't have binary
literals). Dead simple.

The most common use of bitwise complement, in combination with bitwise or, is
clearing flags. If you want to clear `FROB_NOSTRANGERS`, you can write `flags &=
~FROB_NOSTRANGERS`, which masks off that specific bit and leaves all other bits
unaltered.

We're almost through with this. There's just one bitwise operator
left. But... oh boy. It's doozy.

## This XOR that

`^`, bitwise XOR (eXclusive OR, pronounced "zoar" by me, and apparently
pronounced "ecks-or" by the rest of the universe), is the most complicated
operator I'll discuss. And I'm not going to be anywhere *close* to
comprehensive. XOR, in short, is "one or the other, but not both". To use our
example one more time:

```
   1000 0011
^  0111 0001
== 1111 0010
```

So... yeah. XOR has a *ton* of properties. If you have the result of XORing two
numbers and feed in one of the numbers you used, you'll get the other
number. This is a key element of some ciphers, like AES. XOR is also commonly
used as part of pseudorandom number generation algorithms, can be used aggregate
numerous random sources to ensure randomness in a system entropy pool (in
hardware random number generators). The xor instruction on CPUs is frequently
used to quickly zero out registers. It's fundamental to implement CRC, a common
and fast checksum algorithm that's used in a lot of networking protocols to
ensure accuracy of transmission. It's *everywhere*. But I don't have a ton of
specific examples like I did before.

# Mission Accomplished

Well, I think that's pretty much everything, anyways. Or enough of it. Of
course, there's more. There's always more. But I can't teach you everything. Go
pick up a book, or get hacking yourself.

Oh, hey, they've updated the curriculum and they're teaching bitwise stuff this
year. Welp!

<hr class="fancy" />

If you feel the inexplicable urge to give me your hard-earned money, you can
click the dollar sign in the bottom right to toss $5 my way. I'm not sure I can
reasonably claim to deserve it, but the option is there.
