#!/bin/sh

for i in `grep \- State.md  | grep -v '[*]' | awk '{print $1}' | sort | uniq`; do
echo "self.states.add('$i', function(name) {});"

done
