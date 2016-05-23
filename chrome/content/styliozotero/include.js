// Only create main object once
if (!Zotero.StylioZotero) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://styliozotero/content/stylio.js");
}
