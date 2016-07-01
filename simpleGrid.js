/* SimpleGrid v1.0.1.

	v1.0.0.	1. create table in container with id 'containerIdName'.
	2. table with headers and data. data is array of object where keys same as values in header. 
	3. by default table have simple style. 'tableClass' replace default styles to value from options.tableClass. 
	4. removeItemById(id) remove item. on removeButton=true can remove one item from UI. 
	5. sortItems({id, sortAsc}) can sort items. on sortClick=true can sort items by clicking on header

	v1.0.1. 1. add callbackRemove witch call when removed item. default value = function(item, index, callback){ callback(); }
	2. add data template for table cells can be string(apply to all column) or object(keys should be name of headers, each column will have different template)
	3. add possibility to append items. on 'addRow'=true in table footer  appear fields and button for input new item. you can get new item from outside owerriding 'callbackAdd' . by default 'callbackAdd' = function(item, callback){ callback(); } 

	options:
		{v1.0.0}  headers: --default=[], array of string [headers[0],...,headers[n]]
		{v1.0.0}  data: --default=[], can be added using addItems method 
		[{headers[i]: value,..., headers[n]: value},{...}]
		{v1.0.0}  containerIdName: --default="snTable"
		{v1.0.0}  tableClass: --default=undefined, on some value remove default style on table and set this value
		{v1.0.0}  removeButton: --default=false on true add button for delete item
		{v1.0.0}  sortClick: --default=false on true add button for delete item
		{v1.0.1}	callbackRemove: --default=undefined -> function(item, index, callback){ callback(); }
		{v1.0.1}	dataTemplate: --default="%data%",  
		"%data%" OR {headers[0]: "%data%",...,headers[n]: "%data%"}
		{v1.0.1}	addRow: --default=false on true in table footer will be input boxes for adding new item in table. input boxes id = 'add-{header[i]}'  
		{v1.0.1}	callbackAdd: --default=undefined -> function(item, callback){ callback(); }
	methods:
		{v1.0.0}  render 
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  addItems - object or object array with keys similar to options.header of objects
		{v1.0.0}  removeItemById(id) - index of removing item
		{v1.0.0}  sortItems(criteria) -   {id, sortAsc}
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
		if (isAddExtraColumn(this.options)) {
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
			if (isAddFooter(this.options)){
				table.appendChild(createFooter.call(this));
			}
		}
	}
	function isAddFooter(option){

		return option.addRow;
	}
	function createFooter() {
		var footer = document.createElement("tfoot");
		var tr = document.createElement("tr");
		for (var i = 0; i < this.options.headers.length; i++) {
			var th = document.createElement("td");
			th.innerHTML = "<input type='text' value='' id='add-"+this.options.headers[i]+"'></input>";
			tr.appendChild(th);
		}
		var buttonAdd = document.createElement("input");
		buttonAdd.setAttribute("id",'add-item');
		buttonAdd.setAttribute("type",'button');
		buttonAdd.setAttribute("value",'Add');
		buttonAdd.addEventListener('click', (function(e){
			var tfoot = getParentWithTagName(e.target, "tfoot");
			var newItem = {};
			this.options.headers.forEach(function(el){
				newItem[el] = tfoot.querySelector("#add-"+el).value;
			}, this.options.headers);
			this.options.callbackAdd(newItem, (function(){ 
					this.addItems(newItem);
					this.options.headers.forEach(function(el){
						tfoot.querySelector("#add-"+el).value = "";
					}, this.options.headers);
				}).bind(this))
		}).bind(this));
		var td = document.createElement("td");
		td.appendChild(buttonAdd);
		tr.appendChild(td);
		footer.appendChild(tr);
		return footer;		
	}
	function isAddExtraColumn(option){

		return option.removeButton || option.addRow ;
	}
	function addItems(items, isAdd) {
		isAdd = isAdd == undefined ? true : false;
		if (!(items instanceof Array)) { 
			items = [items];
		}
		for (var i = 0; i < items.length; i++) {
			var tr = document.createElement("tr");
			for (var j = 0; j < this.options.headers.length; j++) {
				var td = replaceTemplate.call(this, items, i, j);
				tr.appendChild(td);
			}
			if (isAddExtraColumn(this.options)) {
				var td = document.createElement("td");
				if (this.options.removeButton) {
					var button = document.createElement("button");
					button.innerHTML = "-";
					button.addEventListener("click", 
						this.removeItemById.bind(this, undefined), false);
					td.appendChild(button);
				}
				tr.appendChild(td);
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
	function replaceTemplate(items, i, j) {
		var inner;
		if (this.options.dataTemplate instanceof Object) {
			inner = this.options.dataTemplate[this.options.headers[j]]
			.replace(/%data%/g, items[i][this.options.headers[j]]);
		} else {
			inner = this.options.dataTemplate
			.replace(/%data%/g, items[i][this.options.headers[j]]);
		}
		var result = document.createElement("td");
		result.innerHTML = inner;
		return result;
	}
	function getParentWithTagName(el, name){
		do {
			el = el.parentNode;
		} while (el.tagName != name.toUpperCase())
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
		var deletingItem = this.options.data.slice(index, index+1);
		this.options.callbackRemove(deletingItem, index
		, function(){
			tbody.removeChild(tbody.childNodes[index]);
			var deletingItem = this.options.data.splice(index, 1);
		});
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
		this.options.removeButton = opt.removeButton || false;
		this.options.sortClick = opt.sortClick || false;
		this.options.tableClass = opt.tableClass;
		this.options.callbackRemove = opt.callbackRemove || function(item, index,callback){ callback(); }
		this.options.dataTemplate = opt.dataTemplate || "%data%"
		this.options.addRow = opt.addRow || false;
		this.options.callbackAdd = opt.callbackAdd || function(item, callback){ callback(); }
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
