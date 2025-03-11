+++
title = "feeds."
description = "what the hell is a feed?"
+++

As the world continues to implode around us, I got increasingly fed up with
having to access my mail through GMail's web interface (and GMail's IMAP
implementation is awful, so reading in a third-party mail client is unpleasant
to say the least). So I signed up for [fastmail](https://fastmail.com), accepted
the monthly fee and started using
[gnus](https://www.gnu.org/software/emacs/manual/html_mono/gnus.html).

I mean what was I going to do? Start using Thunderbird? I wasn't going to do
that. I already like using emacs as a text editor, so it felt like a good fit. I
don't like messing around with mbsync, and if you want IMAP in emacs, gnus is
kinda it.

I actually like gnus a lot. I can't in good conscience recommend it to anyone:
it began life as a newsreader so it's weird and literally most of the protocols
it supports (RSS, IMAP, etc) are younger than it is. There's a lot of technical
debt weighing it down, and many emacs users swear by
[notmuch](https://notmuchmail.org/) and
[elfeed](https://github.com/skeeto/elfeed) instead. There's a lot to say for
those programs, but there are two things about gnus that made me choose it over
them (aside from the fact that notmuch still depends on storing your mail
locally, which I'd really prefer not to do): The fact that it doesn't require
you to use multiple readers, and the fact that it fundamentally treats
everything like *news*.
