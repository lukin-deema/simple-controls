/* SimpleGrid v1.0.2.

	v1.0.0.	
	1. create table in container with id 'containerIdName'.
	2. table with headers and data. data is array of object where keys same as values in header. 
	3. by default table have simple style. 'tableClass' replace default styles to value from options.tableClass. 
	4. removeItemById(id) remove item. on removeButton=true can remove one item from UI. 
	5. sortItems({id, sortAsc}) can sort items. on sortClick=true can sort items by clicking on header

	v1.0.1. 
	1. add callbackRemove witch call when removed item. default value = function(item, index, callback){ callback(); }
	2. add data template for table cells can be string(apply to all column) or object(keys should be name of headers, each column will have different template)
	3. add possibility to append items. on 'addRow'=true in table footer  appear fields and button for input new item. you can get new item from outside owerriding 'callbackAdd' . by default 'callbackAdd' = function(item, callback){ callback(); } 

	v1.0.2 
	1. change callbackRemove to send result if result true remove item from table
	2. change callbackAdd to send result if result true add item to table
	3. add possibility to 'editRow' append button Edit, by clicking you can edit current item in footer. callbackEdit(result) if result true change item in table

	options:
		{v1.0.0}  headers: --default=[], array of string [headers[0],...,headers[n]]
		{v1.0.0}  data: --default=[], can be added using addItems method [{headers[i]: value,..., headers[n]: value},{...}]
		{v1.0.0}  containerIdName: --default="snTable"
		{v1.0.0}  tableClass: --default=undefined, on some value remove default style on table and set this value
		{v1.0.0}  removeButton: --default=false on true append button for delete item
		{v1.0.0}  sortClick: --default=false on true add button for delete item
		{v1.0.1}	callbackRemove: --default=function(item, index, callback){ callback(true); }
		{v1.0.1}	dataTemplate: --default="%data%", "%data%" OR {headers[0]: "%data%",...,headers[n]: "%data%"}
		{v1.0.1}	addRow: --default=false on true in table footer will be input boxes for adding new item in table. input boxes id = 'add-{header[i]}'  
		{v1.0.1}	callbackAdd: --default=function(item, callback){ callback(true); 
		{v1.0.2}	editRow: --default=false on true append button for edit current item. edit item occur in footer 
		{v1.0.2}	callbackEdit: --default=function(olditem, newItem, index, callback){ callback(true); }
	inner options:
		{v1.0.2}	editIndex, oldItem show index and old value for edit item. set in  prepareToEdit method, reset in footerButtonClick/callbackEdit
		{v1.0.3}	sortDescriptors array of SortDescriptor show whitch column sorting
		!{v1.0.4}	addColumn: --default=false, append buttor and inputbox for adding new column to table
	methods:
		{v1.0.0}  render 
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  addItems - object or object array with keys similar to options.header of objects
		{v1.0.0}  removeItemById(id) - index of removing item
		{v1.0.0}  sortItems(headerName, asc) 
*/
(function SimpleNotification(global) {
	function SortDescriptor(asc){
		this.asc = asc;
	}
	SortDescriptor.prototype.getSymbol = function(){
		switch (this.asc) {
			case true: return "&#9660;";
			case false: return "&#9650;";
			case undefined: return "&#9679;";
		}
	}
	SortDescriptor.prototype.getAsc = function(){

		return this.asc;
	}
	SortDescriptor.prototype.set = function (val) {

		this.asc = val;
	}
	SortDescriptor.prototype.next= function(){
		switch (this.asc) {
			case true: this.asc = false; break;
			case false: this.asc = undefined; break;
			case undefined: this.asc = true; break;
		}
		return this.getSymbol();
	}

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
			var th = createHeaderCell.call(this, i);
			tr.appendChild(th);
		}
		if (isAddExtraColumn(this.options)) {
			if (this.options.addColumn) {
				var th = document.createElement("th");
				var span = document.createElement("span");
				var newColumn = document.createElement("input");
				newColumn.setAttribute("id","new-column");
				newColumn.setAttribute("type","text");
				var newColumnAdd = document.createElement("input");
				newColumnAdd.setAttribute("id","add-new-column");
				newColumnAdd.setAttribute("type","button");
				newColumnAdd.setAttribute("value","Add");
				newColumnAdd.addEventListener("click", headerButtonClick.bind(this));
				span.appendChild(newColumn);
				span.appendChild(newColumnAdd);
				th.appendChild(span);
				tr.appendChild(th);
			} else {
				tr.appendChild(document.createElement("th"));
			}
		}
		header.appendChild(tr);
		return header;
	}
	function createHeaderCell(i) {
		var th = document.createElement("th");
		th.innerHTML = this.options.headers[i];
		if (this.options.sortClick) {
			var sortSpan = document.createElement("span");
			sortSpan.setAttribute("id","sort-" + this.options.headers[i]);
			sortSpan.innerHTML = " "+this.options.sortDescriptors[i].getSymbol();
			sortSpan.addEventListener("click", sortItems.bind(this, 
				this.options.headers[i], undefined), false)
			th.appendChild(sortSpan);
		}
		return th;
	}
	function headerButtonClick(e) {
		var newColumnName = e.target.previousSibling.value;
		if(this.options.headers.some(function(el){ return el == newColumnName; })){
			console.warn("header mast be unique");
			return;
		}

		this.options.headers.push(newColumnName);
		for (var i = 0; i < this.options.data.length; i++) {
			this.options.data[i][newColumnName] = "";
		}		

		var thead = this.container.querySelector("thead");
		this.options.sortDescriptors.push(new SortDescriptor(undefined));
		var th = createHeaderCell.call(this, this.options.headers.length - 1)
		appendNewCell(thead, 0, th);

		var tbody = this.container.querySelector("tbody");
		for (var i = 0; i < this.options.data.length; i++) {
			var item = {};
			item[newColumnName]="";
			var td = replaceTemplate.call(this, item, newColumnName);	
			appendNewCell(tbody, i, td);
		}
		
		var tfoot = this.container.querySelector("tfoot");
		var td = createFooterCell.call(this, newColumnName);
		appendNewCell(tfoot, 0, td);
	}
	function appendNewCell(_parent, i, newCell) {
		var tr = _parent.children[i];

		if (tr.lastChild) {
			tr.insertBefore(newCell, tr.lastChild);
		} else {
			tr.appendChild(newCell);
		}
	}
	function addDefaultStyles(table){
		applyStyles(table, {
			"border-collapse": "collapse",
			"border-spacing": "0px"
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
	function createFooterCell(headerName) {
		var td = document.createElement("td");
		td.innerHTML = "<input type='text' value='' id='add-"+headerName+"'></input>";
		return td;
	}
	function createFooter() {
		var footer = document.createElement("tfoot");
		var tr = document.createElement("tr");
		for (var i = 0; i < this.options.headers.length; i++) {
			var td = createFooterCell(this.options.headers[i])
			tr.appendChild(td);
		}
		var buttonAdd = document.createElement("input");
		buttonAdd.setAttribute("id","footer-button");
		buttonAdd.setAttribute("type","button");
		buttonAdd.setAttribute("value","Add");
		buttonAdd.addEventListener("click", footerButtonClick.bind(this));
		var td = document.createElement("td");
		td.appendChild(buttonAdd);
		tr.appendChild(td);
		footer.appendChild(tr);
		return footer;		
	}
	function footerButtonClick(e) {
		var tfoot = getParentWithTagName(e.target, "tfoot");
		var newItem = {};
		this.options.headers.forEach(function(el){
			newItem[el] = tfoot.querySelector("#add-"+el).value;
		}, this.options.headers);
		if (this.options.editIndex == undefined) { // add
			this.options.callbackAdd(newItem, (function(result){ 
				if(!result){ return; }
				this.addItems(newItem);
				this.options.headers.forEach(function(el){
					tfoot.querySelector("#add-"+el).value = "";
				}, this.options.headers);
			}).bind(this))
		} else { // edit item with index
			this.options.callbackEdit(this.options.oldItem, newItem
			, this.options.editIndex, (function(result){ 
				if(!result){ return; }
				this.options.data[this.options.editIndex] = newItem;
				// update UI: delete old row, append new row
				this.addItems(newItem, false, this.options.editIndex);
				this.options.headers.forEach(function(el){
					tfoot.querySelector("#add-"+el).value = "";
				}, this.options.headers);
				this.options.oldItem = undefined;
				this.options.editIndex = undefined;
				tfoot.querySelector("#footer-button").value = "Add";
			}).bind(this))
		}
	}
	function isAddExtraColumn(option){

		return option.removeButton||option.addRow||option.editRow||option.addColumn;
	}
	function addItems(items, isAdd, replaceIndex) {
		isAdd = isAdd == undefined ? true : false;
		replaceIndex = replaceIndex;
		if (!(items instanceof Array)) { 
			items = [items];
		}
		for (var i = 0; i < items.length; i++) {
			var tr = document.createElement("tr");
			for (var j = 0; j < this.options.headers.length; j++) {
				var td = replaceTemplate.call(this, items[i], this.options.headers[j]);
				tr.appendChild(td);
			}
			if (isAddExtraColumn(this.options)) {
				var td = document.createElement("td");
				if (this.options.removeButton) {
					var button = document.createElement("button");
					button.innerHTML = "Remove";
					button.addEventListener("click", 
						removeItemById.bind(this, undefined), false);
					td.appendChild(button);
				}
				if (this.options.editRow){
					var button = document.createElement("button");
					button.innerHTML = "Edit";
					button.addEventListener("click", 
						prepareToEdit.bind(this), false);
					td.appendChild(button);
				}
				tr.appendChild(td);
			}
			var tbody = this.container.querySelector("tbody")
			if (replaceIndex == undefined) {
				tbody.appendChild(tr);
			} else {
				tbody.replaceChild(tr, tbody.childNodes[replaceIndex]);
			}
		}
		if (isAdd) {
			this.options.data = this.options.data.concat(items);
			var currentSortId = this.options.sortDescriptors.findIndex(function(el){
				return el.asc!=undefined;
			});
			this.options.sortDescriptors[currentSortId].set(undefined);
		}
		var thead = this.container.querySelector("thead");
		if (thead) {
			updateSortArrows.call(this);
		}
	}
	function prepareToEdit(mouseEvent){
		var tbody = this.container.querySelector("tbody");

		var tr = getParentWithTagName(mouseEvent.target, "TR");
		var index = Array.prototype.indexOf.call(tbody.children, tr);

		if (index >= tbody.children.lenght) {
			console.warn("wrong index number");
			return;
		}

		this.options.editIndex = index;
		this.options.oldItem = this.options.data.slice(index, index + 1)[0];
		/// place oldvalue to footer input
		tfoot = this.container.querySelector("tfoot");
		this.options.headers.forEach(function(el){
			tfoot.querySelector("#add-"+el).value = this.options.oldItem[el];
		}, this);
		tfoot.querySelector("#footer-button").value = "Edit";
	}
	function replaceTemplate(item, headerName) {
		var inner;
		if (this.options.dataTemplate instanceof Object) {
			inner = this.options.dataTemplate[headerName]
			.replace(/%data%/g, item[headerName]);
		} else {
			inner = this.options.dataTemplate
			.replace(/%data%/g, item[headerName]);
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
		var deletingItem = this.options.data.slice(index, index + 1);
		this.options.callbackRemove(deletingItem, index
		, function(result){
			if(!result){ return; }
			tbody.removeChild(tbody.childNodes[index]);
			var deletingItem = this.options.data.splice(index, 1);
		});
	}
	function sortItems(sortName, sortAsc){
		var currentSortId = this.options.sortDescriptors.findIndex(function(el){
			return el.asc!=undefined;
		});
		var currentSortName = this.options.headers[currentSortId];
		if (!sortName) {
			console.warn("sortName should exists")
			return;
		}
		if (sortName != currentSortName){
			if (currentSortId!=-1){this.options.sortDescriptors[currentSortId].set(undefined);}
			currentSortId = this.options.headers.findIndex(function(el){return el==sortName;});
			this.options.sortDescriptors[currentSortId].next();
		}else{
			this.options.sortDescriptors[currentSortId].next();
		}
		var sortAsc = this.options.sortDescriptors[currentSortId].getAsc();
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
		updateSortArrows.call(this);
	}
	function updateSortArrows() {
		var thead = this.container.querySelector("thead");
		this.options.headers.forEach(function(el, idx){
			var sortSpan = thead.querySelector("#sort-"+el);
			sortSpan.innerHTML = " "+this.options.sortDescriptors[idx].getSymbol();
		}, this);
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
		this.options.callbackRemove = opt.callbackRemove || function(item, index,callback){ callback(true); }
		this.options.dataTemplate = opt.dataTemplate || "%data%";
		this.options.addRow = opt.addRow || false;
		this.options.callbackAdd = opt.callbackAdd || function(item, callback){ callback(true); }
		this.options.editRow = opt.editRow || false;
		this.options.callbackEdit = opt.callbackEdit || function(olditem, newItem, index, callback){ callback(true); }

		this.options.sortDescriptors=[];
		this.options.headers.forEach(function(el){
			this.options.sortDescriptors.push(new SortDescriptor(undefined));
		}, this);
		this.options.addColumn = opt.addColumn || false;
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
