#!/bin/bash

if [[ `uname` == 'Darwin' ]]; then
  echo "Mac OS"
  sed -i "" 's/\"version\":.*/\"version\": \"'$1'\",/g' "package.json"
  sed -i "" 's/\"version\":.*/\"version\": \"'$1'\",/g' "src/manifest.json"
fi

if [[ `uname` == 'Linux' ]]; then
  echo "Linux"
  sed -i 's/\"version\":.*/\"version\": \"'$1'\",/g' "package.json"
  sed -i 's/\"version\":.*/\"version\": \"'$1'\",/g' "src/manifest.json"
fi

echo "bump version to $1"

git add package.json src/manifest.json
git commit -m "bump version to $1"

git tag -a "v$1" -m "v$1"

while true
do
 read -r -p "Are You Push to Github? [Y/n]" input

 case $input in
     [yY][eE][sS]|[yY])
 echo "Yes"
  git push origin master
  git push --tags
 break
 ;;
     [nN][oO]|[nN])
 echo "No"
 break
        ;;
     *)
 echo "Invalid input..."
 ;;
 esac
done

# https://stackoverflow.com/a/50266574/1240067