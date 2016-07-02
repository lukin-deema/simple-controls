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
	};
	SortDescriptor.prototype.getAsc = function(){

		return this.asc;
	};
	SortDescriptor.prototype.set = function (val) {

		this.asc = val;
	};
	SortDescriptor.prototype.next= function(){
		switch (this.asc) {
			case true: this.asc = false; break;
			case false: this.asc = undefined; break;
			case undefined: this.asc = true; break;
		}
		return this.getSymbol();
	};

	function applyStyles(node, styles) {
		Object.keys(styles).forEach(function(key) {
			node.style[key] = styles[key];
		});
	}
	function addClass(element, _class) {

		element.className += element.className ? ' ' + _class : _class;
	}
	function createHeader() {
		var header = document.createElement("thead");
		var tr = document.createElement("tr");
		for (var i = 0; i < this.options.headers.length; i++) {
			tr.appendChild(createHeaderCell.call(this, i));
		}
		if (isAddExtraColumn(this.options)) {
			if (this.options.columnInserting) {
				var th = document.createElement("th");
				var span = document.createElement("span");
				var newColumn = document.createElement("input");
				newColumn.setAttribute("id","new-column");
				newColumn.setAttribute("type","text");
				var newColumnAdd = document.createElement("input");
				newColumnAdd.setAttribute("id","add-new-column");
				newColumnAdd.setAttribute("type","button");
				newColumnAdd.setAttribute("value","Add");
				newColumnAdd.addEventListener("click", appendNewColumnClick.bind(this));
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
		if (this.options.sorting) {
			var sortSpan = document.createElement("span");
			sortSpan.setAttribute("id","sort-" + this.options.headers[i]);
			sortSpan.innerHTML = " "+this.options.sortDescriptors[i].getSymbol();
			sortSpan.addEventListener("click", sortItems.bind(this, 
				this.options.headers[i]), false);
			th.appendChild(sortSpan);
		}
		if (this.options.columnDeleting) {
			var removeSpan = document.createElement("span");
			removeSpan.innerHTML = " &#215;";
			removeSpan.addEventListener("click", removeTableColumn.bind(this, 
				this.options.headers[i]), false);
			th.appendChild(removeSpan);
		}
		return th;
	}
	function removeTableColumn(columnName) {
		var affectedCount = 0;
		this.options.data.forEach(function(el){
			if (el[columnName]) {
				affectedCount++;
			}
		});
		this.options.callbackColumnDeleting(columnName, affectedCount, (function(result){
			if (!result) { return; }
			columnId = this.options.headers.indexOf(columnName);

			var trHead = this.container.querySelector("thead tr");
			trHead.removeChild(trHead.childNodes[columnId]);  
			this.options.headers.splice(columnId, 1);

			trBody = this.container.querySelector("tbody");
			for (var i = 0; i < trBody.children.length; i++) {
				trBody.children[i].removeChild(trBody.children[i].childNodes[columnId]); 
				delete this.options.data[i][columnName];
			}

			trFoot = this.container.querySelector("tfoot tr");
			trFoot.removeChild(trFoot.childNodes[columnId]);    
		}).bind(this));
	}
	function appendNewColumnClick(e) {
		var newColumnName = e.target.previousSibling.value;
		if(this.options.headers.some(function(el){ return el == newColumnName; })){
			console.warn("header mast be unique");
			return;
		}
		this.options.callbackColumnInserting(newColumnName, (function(result){
			if (!result) { return; }
			this.options.headers.push(newColumnName);

			for (var i = 0; i < this.options.data.length; i++) {
				this.options.data[i][newColumnName] = "";
			}

			var thead = this.container.querySelector("thead");
			this.options.sortDescriptors.push(new SortDescriptor(undefined));
			if (this.options.dataTemplate instanceof Object) {
				this.options.dataTemplate[newColumnName] = "%data%";
			}
			var th = createHeaderCell.call(this, this.options.headers.length - 1);
			appendNewColumnCell(thead, 0, th);

			var tbody = this.container.querySelector("tbody");
			for (i = 0; i < this.options.data.length; i++) {
				var item = {};
				item[newColumnName]="";
				appendNewColumnCell(tbody, i, replaceTemplate.call(this, item, newColumnName));
			}
			
			var tfoot = this.container.querySelector("tfoot");
			var td = createFooterCell.call(this, newColumnName);
			appendNewColumnCell(tfoot, 0, td);
		}).bind(this));
	}
	function appendNewColumnCell(_parent, i, newCell) {
		var tr = _parent.children[i];

		if (tr.lastChild) {
			tr.insertBefore(newCell, tr.lastChild);
		} else {
			tr.appendChild(newCell);
		}
	}
	function addTableDefaultStyles(table){
		applyStyles(table, {
			"border-collapse": "collapse",
			"border-spacing": "0px"
		});
		var style = document.createElement("style");
		style.innerHTML = "table th, table td { padding: 5px; border: 1px solid black }";
		table.appendChild(style);
	}
	function render() {
		var table = this.container.querySelector("table");
		if (!table) {
			// table header
			table = document.createElement("table");
			if (!this.options.tableClass) {
				addTableDefaultStyles(table);
			} else {
				addClass(table, this.options.tableClass);
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

		return option.inserting;
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
			tr.appendChild(createFooterCell(this.options.headers[i]));
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
		if (this.options.editIndex === undefined) { // add
			this.options.callbackInserting(newItem, (function(result){ 
				if(!result){ return; }
				this.addItems(newItem);
				this.options.headers.forEach(function(el){
					tfoot.querySelector("#add-"+el).value = "";
				}, this.options.headers);
			}).bind(this));
		} else { // edit item with index
			this.options.callbackEditing(this.options.oldItem, newItem, this.options.editIndex, (function(result){ 
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
			}).bind(this));
		}
	}
	function isAddExtraColumn(option){

		return option.deleting||option.inserting||option.editing||option.columnInserting;
	}
	function addItems(items, isAdd, replaceIndex) {
		isAdd = isAdd === undefined ? true : false;
		replaceIndex = replaceIndex;
		if (!(items instanceof Array)) { 
			items = [items];
		}
		for (var i = 0; i < items.length; i++) {
			var tr = document.createElement("tr");
			for (var j = 0; j < this.options.headers.length; j++) {
				tr.appendChild(replaceTemplate.call(this, items[i], this.options.headers[j]));
			}
			if (isAddExtraColumn(this.options)) {
				var td = document.createElement("td");
				var button;
				if (this.options.deleting) {
					button = document.createElement("button");
					button.innerHTML = "Remove";
					button.addEventListener("click", 
						removeItem.bind(this, undefined), false);
					td.appendChild(button);
				}
				if (this.options.editing){
					button = document.createElement("button");
					button.innerHTML = "Edit";
					button.addEventListener("click", 
						prepareToEdit.bind(this), false);
					td.appendChild(button);
				}
				tr.appendChild(td);
			}
			var tbody = this.container.querySelector("tbody");
			if (replaceIndex === undefined) {
				tbody.appendChild(tr);
			} else {
				tbody.replaceChild(tr, tbody.childNodes[replaceIndex]);
			}
		}
		if (isAdd) {
			this.options.data = this.options.data.concat(items);
			if(this.options.sorting){
				var currentSortId = this.options.sortDescriptors.findIndex(function(el){
					return el.asc !== undefined;
				});
				if (currentSortId > -1) {
					this.options.sortDescriptors[currentSortId].set(undefined);
				}
			}
		}
		if (this.options.sorting) {
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
			inner = this.options.dataTemplate[headerName].replace(/%data%/g, item[headerName]);
		} else {
			inner = this.options.dataTemplate.replace(/%data%/g, item[headerName]);
		}
		var result = document.createElement("td");
		result.innerHTML = inner;
		return result;
	}
	function getParentWithTagName(el, name){
		do {
			el = el.parentNode;
		} while (el.tagName != name.toUpperCase());
		return el;
	}
	function removeItem(index, mouseEvent) {
		var tbody = this.container.querySelector("tbody");
		if (!index) {
			if (!mouseEvent) {
				console.warn("define index for deleting item from table");
				return;
			}
			var tr = getParentWithTagName(mouseEvent.target, "TR");
			index = Array.prototype.indexOf.call(tbody.children, tr);
		}
		if (index >= tbody.children.lenght) {
			console.warn("wrong index number");
			return;
		}
		var deletingItem = this.options.data.slice(index, index + 1);
		this.options.callbackDeleting(deletingItem, index, (function(result){
			if(!result){ return; }
			tbody.removeChild(tbody.childNodes[index]);
			var deletingItem = this.options.data.splice(index, 1);
		}).bind(this));
	}
	function sortItems(sortName){
		var currentSortId = this.options.sortDescriptors.findIndex(function(el){
			return el.asc !== undefined;
		});
		var currentSortName = this.options.headers[currentSortId];
		if (!sortName) {
			console.warn("sortName should exists");
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
		};

		var tbody = this.container.querySelector("tbody");
		this.options.callbackSorting(this.options.headers[currentSortId], sortAsc, (function(result){
			if (!result) { return; }
			if (tbody) {
				while (tbody.firstChild) {
					tbody.removeChild(tbody.firstChild);
				}
				this.options.data.sort(fn);
				this.addItems(this.options.data, false);
			}
			updateSortArrows.call(this);
		}).bind(this));
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
		this.options.containerIdName = opt.containerIdName || "snTable";
		this.container = document.querySelector("#"+this.options.containerIdName);
		if (!opt.headers) {
			console.warn("set headers");
		}
		this.options.headers = opt.headers || [];
		this.options.data = opt.data || [];
		this.options.deleting = opt.deleting || false;
		this.options.sorting = opt.sorting || false;
		this.options.tableClass = opt.tableClass;
		this.options.callbackDeleting = opt.callbackDeleting || function(item, index,callback){ callback(true); };
		this.options.dataTemplate = opt.dataTemplate || "%data%";
		this.options.inserting = opt.inserting || false;
		this.options.callbackInserting = opt.callbackInserting || function(item, callback){ callback(true); };
		this.options.editing = opt.editing || false;
		this.options.callbackEditing = opt.callbackEditing || function(olditem, newItem, index, callback){ callback(true); };
		this.options.sortDescriptors=[];
		this.options.headers.forEach(function(el){
			this.options.sortDescriptors.push(new SortDescriptor(undefined));
		}, this);
		this.options.columnInserting = opt.columnInserting || false;
		this.options.callbackSorting	= opt.callbackSorting || function(columnName, columnAcs, callback){ callback(true); };
		this.options.callbackColumnInserting = opt.callbackColumnInserting || function(columnName, callback){ callback(true); };
		this.options.columnDeleting = opt.columnDeleting || false;
		this.options.callbackColumnDeleting = opt.callbackColumnDeleting || function(columnName, affectedCount, callback){ callback(true); };
	}

	function SimpleGrid(opt) { 
		this.optionsSet(opt);
		this.render();
	}
	SimpleGrid.prototype = { 
		render: render,
		addItems: addItems,
		removeItem: removeItem,
		optionsGet: optionsGet, 
		optionsSet: optionsSet,
		sortItems: sortItems
	};

	global.SimpleGrid = SimpleGrid;
})(this);
