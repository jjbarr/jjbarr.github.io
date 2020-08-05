+++
title = "Aesthetics, Pain, and You"
description = "Making this website look good hurt."
date = 2020-08-05
+++

So after being poked off into *making* this website, the next step was to make
it look good. I may be a proponent of minimalism, but I like
nice-looking things. If I had a bit less restraint this website would be covered
in [fleurons](https://en.wikipedia.org/wiki/Fleuron_(typography)) (there used to
be some, but I removed them. Why? 🙙🙚. If you see boxes there instead of leaves,
then you are why).

Unfortunately, it seems like crummy tradeoffs are just a part of web design. If
there's a cool feature that neatly solves your problem, then most users probably
aren't running browsers that have it. Heck, this site has a minor dependency on
you having SVG support in your browser and relies on modern CSS. So while it may
look like it could have been made in the 90s, Netscape Navigator would choke on
it. And that's a shame, but I don't think many people use Netscape
Navigator anymore. So I'm not overly concerned.

Another pain point was the mercury symbol in the horizontal rules. You know,
this?

<hr class="fancy"/>

It turns out cell phones really want to render that as an emoji, complete
with purple blob border. Which totally ruins the whole aesthetic. I used the
Unicode VS15 modifier, which asks the renderer not to do that. Will it work? I
don't know. It depends on your phone, or as the case may be, your computer.

The final irritation I encountered making this website had to do with
implementing the color scheme. I used
[Solarized](https://ethanschoonover.com/solarized/), which has been my go-to
color scheme for use with almost everything for almost a decade now (look, it
*was* cool at the time, and I'm used to it now...). This was not the annoying
part. The annoying part was that I decided it would be a bright idea to use the
shiny new [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
media query to see whether the user would prefer my website to use a light theme
or a dark theme. Straightfoward enough... until I went to test it, and
discovered that by default firefox provided no way to toggle this setting
without altering your system settings or digging into `about:config`. There
isn't even a developer debug tool yet, which, fair enough, it's still a
draft. But why is there no option in the options menu?

Apparently, it's because Mozilla's been arguing with itself about whether or not
this should be an option for two years and nobody's been motivated enough to
just get up and do it.

Jeez, guys. I get the instinct to do it right, but just get it in already. I
would consider the ability to control an explicitly user-settable option for how
a website should render to be a fairly fundamental thing for a browser to expose
to its users.

So I guess the real moral of this story is that I'm impatient and sick of
waiting for features I want to land in software. Like a decent way to integrate
Rust into a C build. Or `offsetof` for Rust, which is important for interfacing
with external libraries. Or the ability to actually gracefully fail to allocate
memory in Rust...

Look, I like Rust a lot. I'd rather be writing Rust than building this
website. So hopefully, I'll be back to doing that soon.
