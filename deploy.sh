#!/bin/bash

rm -rf public && zola build -o public && rsync -av public/ ptnote:~/public && rm -rf public
