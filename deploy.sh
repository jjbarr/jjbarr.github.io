#!/bin/bash
zola build -o public && rsync -av public/ ptnote:~/public && rm -rf public
