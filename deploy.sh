#!/bin/bash

rm -rf public && zola build -o public && scp -pr public/. web@anubis.bahamut.monster:ptnote.dev && rm -rf public
