#!/bin/bash

rm -f zotero-stylio.xpi
apikey=`cat api.key`
marker="YOUR_API_KEY"

sed -i -e "s/$marker/$apikey/" './chrome/content/styliozotero/stylio.js'
zip -r zotero-stylio.xpi chrome chrome.manifest install.rdf
sed -i -e "s/$apikey/$marker/" './chrome/content/styliozotero/stylio.js'
rm -f './chrome/content/styliozotero/stylio.js-e'
