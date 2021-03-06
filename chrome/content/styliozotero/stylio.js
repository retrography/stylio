Zotero.StylioZotero = {
	DB: null,

	init: function () {
		// Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
		this.DB = new Zotero.DBConnection('stylio');

		if (!this.DB.tableExists('changes')) {
			this.DB.query("CREATE TABLE changes (num INT)");
			this.DB.query("INSERT INTO changes VALUES (0)");
		}

		// Register the callback in Zotero as an item observer
		var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);

		// Unregister callback when the window closes (important to avoid a memory leak)
		window.addEventListener('unload', function(e) {
				Zotero.Notifier.unregisterObserver(notifierID);
		}, false);
	},

	insertStylio: function() {
		var httpRequest;
		var url = "https://anystyle.io/parse/references.bib"
		var data = Zotero.Utilities.Internal.getClipboard("text/unicode").replace(/^\s*[\r\n]/gm, "").split("\n");

		function makeRequest(url, data) {

			httpRequest = new XMLHttpRequest();
			if (!httpRequest) {
				alert('Can not creare server request.');
				return false;
			}

			var params = {
				"access_token": "YOUR_API_KEY",
				"references": data
			}
			httpRequest.onreadystatechange = alertContents;
			httpRequest.open('POST', url, true);
			httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			httpRequest.send(JSON.stringify(params));
		}
		/* Maybe a confirmation screen?! */

		function alertContents() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					var xmldoc = httpRequest.responseText;
					Zotero.Utilities.Internal.copyTextToClipboard(xmldoc);
					Zotero_File_Interface.importFromClipboard();
					Zotero.Utilities.Internal.copyTextToClipboard(data.join("\n"));
				} else {
					alert('Request failed.');
				}
			}
		}

		makeRequest(url, data);

	},

	// Callback implementing the notify() method to pass to the Notifier
	notifierCallback: {
		notify: function(event, type, ids, extraData) {
			if (event == 'add' || event == 'modify' || event == 'delete') {
				// Increment a counter every time an item is changed
				Zotero.StylioZotero.DB.query("UPDATE changes SET num = num + 1");

				if (event != 'delete') {
					// Retrieve the added/modified items as Item objects
					var items = Zotero.Items.get(ids);
				}
				else {
					var items = extraData;
				}

				// Loop through array of items and grab titles
				var titles = [];
				for each(var item in items) {
					// For deleted items, get title from passed data
					if (event == 'delete') {
						titles.push(item.old.title ? item.old.title : '[No title]');
					}
					else {
						titles.push(item.getField('title'));
					}
				}

				if (!titles.length) {
					return;
				}

				// Get the localized string for the notification message and
				// append the titles of the changed items
				var stringName = 'notification.item' + (titles.length==1 ? '' : 's');
				switch (event) {
					case 'add':
						stringName += "Added";
						break;

					case 'modify':
						stringName += "Modified";
						break;

					case 'delete':
						stringName += "Deleted";
						break;
				}

				var str = document.getElementById('stylio-zotero-strings').
					getFormattedString(stringName, [titles.length]) + ":\n\n" +
					titles.join("\n");
			}

			var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
			ps.alert(null, "", str);
		}
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.StylioZotero.init(); }, false);
