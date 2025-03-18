+++
title = "90% of everything is a build system"
description = "We're all gonna `make` it?"
date = 2025-03-15
draft = true
+++

I don't write enough, as established by how long it's been since I last posted
to my blog. So here's what I'm thinking about right now: build systems. Why?
Because of this website. Also, Emacs. Let me explain.

In the abstract, a build system (archtypically, `make`, although frankly there
are too many to name, not even counting all the scripts named `build.sh`) maps a
set of *inputs* to a set of *outputs*. These inputs may be explicit or implict:
most Makefiles have explicit dependencies in the form of the source
