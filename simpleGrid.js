/// SimpleGrid v1.0.4
(function SimpleNotification(global) {
	/// sortDescriptor
	function SortColumnDescriptor(asc){
		
		this.asc = asc;
	}
	SortColumnDescriptor.prototype.getSortSymbol = function(){
		switch (this.asc) {
			case true: return "&#9660;";
			case false: return "&#9650;";
			case undefined: return "&#9679;";
		}
	};
	SortColumnDescriptor.prototype.next = function(){
		switch (this.asc) {
			case true: this.asc = false; break;
			case false: this.asc = undefined; break;
			case undefined: this.asc = true; break;
		}
	};
	function SortDescriptors(){

		this.descriptors = {};
	}
	SortDescriptors.prototype.add = function(header, value){
		if (this.descriptors.hasOwnProperty(header)) { 
			console.log("SortDescriptors alrady has descriptor named " + header);
			return; 
		}
		this.descriptors[header] = new SortColumnDescriptor(value);
	};
	SortDescriptors.prototype.remove = function(header){

		delete this.descriptors[header];
	};
	SortDescriptors.prototype.reset = function(){
		this.descriptors = Object.keys(this.descriptors).reduce(
			function(result, val){ 
				result[val] = new SortColumnDescriptor(undefined); return result; 
			}, {});
	};
	SortDescriptors.prototype.setNext = function(header){
		if (!this.descriptors.hasOwnProperty(header)) { 
			console.log("SortDescriptors has not descriptor named " + header);
			return; 
		}
		this.descriptors[header].next();
	};
	SortDescriptors.prototype.getSortSymbol = function(header){
		if (!this.descriptors.hasOwnProperty(header)) { 
			console.log("SortDescriptors has not descriptor named " + header);
			return; 
		}
		return this.descriptors[header].getSortSymbol();
	};
	SortDescriptors.prototype.getActiveDescriptor = function(){
		var key;
		Object.keys(this.descriptors).forEach(function(el){
			if (this.descriptors[el].asc !== undefined) { key = el; }
		}, this);
		if (!key) {
			return { header: undefined, acs: undefined };
		}
		return { header: key, acs: this.descriptors[key].asc };
	};

	/// small helpers
	function applyStyles(node, styles) {
		Object.keys(styles).forEach(function(key) {
			node.style[key] = styles[key];
		});
	}
	function addClass(element, _class) {

		element.className += element.className ? ' ' + _class : _class;
	}
	function isAddFooter(option){

		return option.inserting;
	}
	function isAddExtraColumn(option){

		return option.deleting||option.inserting||option.editing||option.columnInserting;
	}
	function getParentWithTagName(el, name){
		do {
			el = el.parentNode;
		} while (el.tagName != name.toUpperCase());
		return el;
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

	/// header
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
			sortSpan.innerHTML = " "+this.options.sortDescriptors.getSortSymbol(this.options.headers[i]);
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
	function sortItems(sortName){
		if (!sortName) {
			console.warn("sortName should exists");
			return;
		}
		var currentSortName = this.options.sortDescriptors.getActiveDescriptor().header;
		if (sortName != currentSortName){
			this.options.sortDescriptors.reset();
			this.options.sortDescriptors.setNext(sortName);
		}else{
			this.options.sortDescriptors.setNext(sortName);
		}
		var descriptor = this.options.sortDescriptors.getActiveDescriptor();
		var sortAsc = descriptor.acs;
		sortName = descriptor.header;

		this.options.callbackSorting(sortName, sortAsc, (function(result, updtedSortName, updatedSortAsc){
			if (!result) { return; }
			sortAsc = updatedSortAsc || sortAsc;
			sortName = updtedSortName || sortName;
			fn = function(a, b){
				return sortAsc ? a[sortName]<b[sortName] : a[sortName]>b[sortName];
			};

			var tbody = this.container.querySelector("tbody");
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
			sortSpan.innerHTML = " "+this.options.sortDescriptors.getSortSymbol(el);
		}, this);
	}
	
	/// column manipulation 
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
			this.options.sortDescriptors.remove(this.options.headers[columnId]);
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
		this.options.callbackColumnInserting(newColumnName, (function(result, updatedItem){
			if (!result) { return; }
			newColumnName = updatedItem || newColumnName;
			this.options.headers.push(newColumnName);

			for (var i = 0; i < this.options.data.length; i++) {
				this.options.data[i][newColumnName] = "";
			}

			var thead = this.container.querySelector("thead");
			this.options.sortDescriptors .add(newColumnName, undefined);
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
			thead.querySelector("#new-column").value = "";
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

	/// footer
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
	function createFooterCell(headerName) {
		var td = document.createElement("td");
		td.innerHTML = "<input type='text' value='' id='add-"+headerName+"'></input>";
		return td;
	}
	function footerButtonClick(e) {
		var tfoot = getParentWithTagName(e.target, "tfoot");
		var newItem = {};
		this.options.headers.forEach(function(el){
			newItem[el] = tfoot.querySelector("#add-"+el).value;
		}, this.options.headers);
		if (this.options.editIndex === undefined) { // add
			this.options.callbackInserting(newItem, (function(result, updatedItem){ 
				if(!result){ return; }
				newItem = updatedItem || newItem;
				this.addItems(newItem);
				this.options.headers.forEach(function(el){
					tfoot.querySelector("#add-"+el).value = "";
				}, this.options.headers);
			}).bind(this));
		} else { // edit item with index
			this.options.callbackEditing(this.options.oldItem, newItem, this.options.editIndex, (function(result, updatedItem){ 
				if(!result){ return; }
				newItem = updatedItem || newItem;
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

	/// body
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
				var currentSortId = this.options.sortDescriptors.reset();
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

	/// options
	function optionsGet() {

		return this.options;
	}
	function optionsSet(opt) {
		this.options = {};
		this.options.containerIdName = opt.containerIdName || "snTable";
		this.container = document.querySelector("#"+this.options.containerIdName);
		this.options.tableClass = opt.tableClass;
		this.options.dataTemplate = opt.dataTemplate || "%data%";

		this.options.headers = opt.headers || [];
		this.options.data = opt.data || [];
		if (this.options.headers.length === 0){
			this.options.data.forEach(function(el){
				Object.keys(el).forEach(function(x){
					if (this.options.headers.indexOf(x) == -1) {
						this.options.headers.push(x);
					}
				}, this);
			}, this);
		}

		this.options.sortDescriptors = new SortDescriptors();
		this.options.headers.forEach(function(el){
			this.options.sortDescriptors.add(el, undefined);
		}, this);
		
		this.options.deleting = opt.deleting || false;
		if (opt.callbackDeleting) {
			this.options.callbackDeleting = opt.callbackDeleting;
			this.options.deleting = true;
		} else{
		 this.options.callbackDeleting = function(item, index, callback){ callback(true); };
		}

		this.options.sorting = opt.sorting || false;
		if (opt.callbackSorting) {
			this.options.callbackSorting = opt.callbackSorting;
			this.options.sorting = true;
		} else{
		 this.options.callbackSorting = function(columnName, columnAcs, callback){ callback(true); };
		}

		this.options.inserting = opt.inserting || false;
		if (opt.callbackInserting) {
			this.options.callbackInserting = opt.callbackInserting;
			this.options.inserting = true;
		} else{
		 this.options.callbackInserting = function(item, callback){ callback(true); };
		}

		this.options.editing = opt.editing || false;
		if (opt.callbackEditing) {
			this.options.callbackEditing = opt.callbackEditing;
			this.options.editing = true;
		} else{
		 this.options.callbackEditing = function(olditem, newItem, index, callback){ callback(true); };
		}

		this.options.columnInserting = opt.columnInserting || false;
		if (opt.callbackColumnInserting) {
			this.options.callbackColumnInserting = opt.callbackColumnInserting;
			this.options.columnInserting = true;
		} else{
		 this.options.callbackColumnInserting = function(columnName, callback){ callback(true); };
		}

		this.options.columnDeleting = opt.columnDeleting || false;
		if (opt.callbackColumnDeleting) {
			this.options.callbackColumnDeleting = opt.callbackColumnDeleting;
			this.options.columnDeleting = true;
		} else{
		 this.options.callbackColumnDeleting = function(columnName, affectedCount, callback){ callback(true); };
		}
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
