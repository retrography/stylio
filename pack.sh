#!/bin/bash

rm -f zotero-hello-world.xpi
apikey=`cat api.key`
marker="YOUR_API_KEY"

sed -i -e "s/$marker/$apikey/" './chrome/content/helloworldzotero/hello.js'
zip -r zotero-hello-world.xpi chrome chrome.manifest install.rdf
sed -i -e "s/$apikey/$marker/" './chrome/content/helloworldzotero/hello.js'
