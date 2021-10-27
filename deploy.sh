#!/usr/bin/env bash

# abort on errors
set -e

# build
yarn docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

touch .nojekyll

# if you are deploying to a custom domain
echo 'kaguya.polv.cc' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:patarapolw/kaguya.git main:gh-pages

cd -
