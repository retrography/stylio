#!/bin/bash

# Assumes the api-key is 32 characters long or more

if ! [[ "$(wc -m api.key | sed -E 's/.*(^| |\t)([0-9]+)( |\t).*/\2/')" -ge 32 ]]; then
	echo 'api.key missing or empty. You need an API Key to run this software. In order to obtain one visit AnyStyle.io website. For more instructions see README.md.'
	exit
fi

marker="YOUR_API_KEY"
apikey=`cat api.key`

sed -i '' -e "s/$marker/$apikey/" './chrome/content/styliozotero/stylio.js'
zip -FSr zotero-stylio.xpi chrome chrome.manifest install.rdf
sed -i '' -e "s/$apikey/$marker/" './chrome/content/styliozotero/stylio.js'
