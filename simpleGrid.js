/* v1.0.0

	options:
		{v1.0.0}  headers: --default=[], array of string 
		{v1.0.0}  data: --default=[], can be added using addItems method
		{v1.0.0}  containerIdName: --default="snTable"
		{v1.0.0}  tableClass: -- default=undefined, on some value remove default style on table and set this value
		{v1.0.0}  removeButton: --default=false on true add button for delete item
		{v1.0.0}  sortClick: --default=false on true add button for delete item
	methods:
		{v1.0.0}  render 
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  addItems - object or object array with keys similar to options.header of objects
		{v1.0.0}  removeItemById - index of removing item
		{v1.0.0}  sortItems - criteria  {id, sortAsc}
*/
(function SimpleNotification(global) {
	
	function applyStyles(node, styles) {
		Object.keys(styles).forEach(function(key) {
			node.style[key] = styles[key];
		});
	}

	function addClass(element, _class) {
		element.className += element.className ? ' '
			+ _class : _class;
	}

	function createHeader() {
		var header = document.createElement("thead");
		var tr = document.createElement("tr");
		for (var i = 0; i < this.options.headers.length; i++) {
			var th = document.createElement("th");
			th.innerHTML = this.options.headers[i];
			if (this.options.sortClick) {
				th.addEventListener("click", sortItems.bind(this, 
					this.options.headers[i], undefined), false)
			}
			tr.appendChild(th);
		}
		if (this.options.removeButton) {
			tr.appendChild(document.createElement("th"));
		}
		header.appendChild(tr);
		return header;
	}
	function addDefaultStyles(table){
		applyStyles(table, {
			'border-collapse': 'collapse',
			'border-spacing': '0px'
		})
		var style = document.createElement("style");
		style.innerHTML = "table th, table td { padding: 5px; border: 1px solid black }";
		table.appendChild(style);
	}
	function render() {
		var table = this.container.querySelector("table");
		if (!table) {
			// table header
			var table = document.createElement("table");
			if (!this.options.tableClass) {
				addDefaultStyles(table);
			} else {
				addClass(table, this.options.tableClass)
			}
			table.appendChild(createHeader.call(this));

			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			this.container.appendChild(table);

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
				button.addEventListener("click", 
					this.removeItemById.bind(this, undefined), false);
				tdButton.appendChild(button);
				tr.appendChild(tdButton);
			}
			this.container.querySelector("tbody").appendChild(tr);
		}
		if (isAdd) {
			this.options.data = this.options.data.concat(items);
			this.options.sortName = undefined;
			this.options.sortAsc = undefined;
		}
		var thead = this.container.querySelector("thead");
		if (thead) {
			updateSortArrow.call(this);
		}
	}

	function getParentWithTagName(el, name){
		do {
			el = el.parentNode;
		} while (el.tagName != name)
		return el;
	}

	function removeItemById(index, mouseEvent) {
		var tbody = this.container.querySelector("tbody");
		if (!index) {
			if (!mouseEvent) {
				console.warn("define index for deleting item from table");
				return;
			}
			var tr = getParentWithTagName(mouseEvent.target, "TR");
			var index = Array.prototype.indexOf.call(tbody.children, tr);
		}
		if (index >= tbody.children.lenght) {
			console.warn("wrong index number");
			return;
		}
		tbody.removeChild(tbody.childNodes[index]);
		this.options.data.splice(index, 1);
	}

	function sortItems(sortName, sortAsc){
		if (!sortName) {
			sortName = this.options.sortName || this.options.headers[0];
		}
		if (sortName != this.options.sortName){
			this.options.sortName = sortName;
			this.options.sortAsc = true;
		}else{
			this.options.sortAsc = !this.options.sortAsc;
		}
		if (sortAsc == undefined) {
			sortAsc = this.options.sortAsc;
		} else {
			this.options.sortAsc = sortAsc;
		}

		fn = function(a, b){
			return sortAsc ? 
				a[sortName]<b[sortName] : 
				a[sortName]>b[sortName];
		}
		var tbody = this.container.querySelector("tbody");
		if (tbody) {
			while (tbody.firstChild) {
    		tbody.removeChild(tbody.firstChild);
			}
			this.options.data.sort(fn);
			this.addItems(this.options.data, false);
		}
		var thead = this.container.querySelector("thead");
		if (thead) {
			updateSortArrow.call(this);
		}
	}
	function createSortElement(asc) {
		if (asc == undefined){ 
			return undefined; 
		}
		var sortEl = document.createElement("div");
		sortEl.className = "sort";
		sortEl.innerHTML = asc ? "&#9660;" : "&#9650;";
		return sortEl;
	}
	function updateSortArrow() {
		var idx = this.options.headers.indexOf(this.options.sortName);
		var sortEl = this.container.querySelector(".sort");
		if (sortEl) {
			sortEl.parentNode.removeChild(sortEl);
		}
		if (idx == -1) {return;}
		var thead = this.container.querySelector("thead tr");
		sortEl = createSortElement(this.options.sortAsc);
		thead.childNodes[idx].appendChild(sortEl);
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
		this.options.removeButton = opt.removeButton != undefined ? opt.removeButton: false;
		this.options.sortClick = opt.sortClick != undefined ? opt.sortClick: false;
		this.options.tableClass = opt.tableClass;
	}

	function SimpleGrid(opt) { 
		this.optionsSet(opt);
		this.render();
	}
	SimpleGrid.prototype = { 
		render: render,
		addItems: addItems,
		removeItemById: removeItemById,
		optionsGet: optionsGet, 
		optionsSet: optionsSet,
		sortItems: sortItems
	};

	global.SimpleGrid = SimpleGrid;
})(this);
