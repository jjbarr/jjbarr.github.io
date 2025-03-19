#!/bin/bash

rm -rf public && zola build -o public && scp -spr public/. web@anubis.bahamut.monster:ptnote.dev && rm -rf public
