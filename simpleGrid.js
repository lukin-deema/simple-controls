(function SimpleNotification(global) {
	
	function applyStyles(node, styles) {
		Object.keys(styles).forEach(function(key) {
			node.style[key] = styles[key];
		});
	}

	function addClass(element, _class) {
		element.className += element.className ? ' '+ _class : _class;
	}

	function render() {
		var table = this.container.querySelector("table");
		if (!table) {
			// table header
			var tr = document.createElement("tr");
			for (var i = 0; i < this.options.headers.length; i++) {
				var th = document.createElement("th");
				th.innerHTML = this.options.headers[i];
				tr.appendChild(th);
			}

			var header = document.createElement("thead");
			if (this.options.removeButton) {
				tr.appendChild(document.createElement("th"));
			}
			header.appendChild(tr);

			var table = document.createElement("table");
			addClass(table, 'simple-table');
			table.appendChild(header);

			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			this.container.appendChild(table);

			// table data
			if (this.options.data) {
				this.addItems(this.options.data, false);
			}
		}
	}

	function addItems(items, isAdd) {
		isAdd = isAdd == undefined ? true : false;
		if (!(items instanceof Array)) { 
			items = [items];
		}
		for (var i = 0; i < items.length; i++) {
			var tr = document.createElement("tr");
			for (var j = 0; j < this.options.headers.length; j++) {
				var td = document.createElement("td");
				td.innerHTML = items[i][this.options.headers[j]];
				tr.appendChild(td);
			}
			if (this.options.removeButton) {
				var tdButton = document.createElement("td");
				var button = document.createElement("button");
				button.innerHTML = "-";
				button.addEventListener("click", this.removeItemById.bind(this, undefined), false);
				tdButton.appendChild(button);
				tr.appendChild(tdButton);
			}
			this.container.querySelector("tbody").appendChild(tr);
		}
		if (isAdd) {
			this.options.data = this.options.data.concat(items);
		}
	}

	function getParentWithTagName(el, name){
		do {
			el = el.parentNode;
		} while (el.tagName != name)
		return el;
	}

	function removeItemById(index, e) {
		var tbody = this.container.querySelector("tbody");
		if (!index) {
			if (!e) {
				console.warn("define index for deleting item from table");
				return;
			}
			var tr = getParentWithTagName(e.target, "TR");
			var index = Array.prototype.indexOf.call(tbody.children, tr);
		}
		if (index >= tbody.children.lenght) {
			console.warn("wrong index number");
			return;
		}
		tbody.removeChild(tbody.childNodes[index]);
		this.options.data.splice(index, 1);
	}

	function optionsGet() {
		return this.options;
	}
	function optionsSet(opt) {
		this.options = {};
		this.options.containerIdName = opt.containerIdName || "snTable"
		this.container = document.querySelector("#"+this.options.containerIdName);
		if (!opt.headers) {
			console.warn("set headers");
		}
		this.options.headers = opt.headers || [];
		this.options.data = opt.data || [];
		this.options.removeButton = opt.removeButton != undefined ? opt.removeButton:false;
	}
	/*
	options:
		headers: --default=[], array of string 
		containerIdName: --default="snTable"
		data: --default=[], 
		removeButton: --default=false on true add button for delete item
	*/
	function SimpleGrid(opt) { 
		this.optionsSet(opt);
		this.render();
	}
	SimpleGrid.prototype = { 
		render: render,
		addItems: addItems, /// object with keys similar to options.header or array of objects
		removeItemById: removeItemById,	/// index of removing item
		optionsGet: optionsGet, 
		optionsSet: optionsSet 
	};

	global.SimpleGrid = SimpleGrid;
})(this);
