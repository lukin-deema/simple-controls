SimpleGrid v1.0.2.

	v1.0.0.	
		1. create table in container with id 'containerIdName'.
		2. table with headers and data. data is array of object where keys same as values in header. 
		3. by default table have simple style. 'tableClass' replace default styles to value from options.tableClass. 
		4. removeItem(id) remove item. on removeButton=true can remove one item from UI. 
		5. sortItems({id, sortAsc}) can sort items. on sortClick=true can sort items by clicking on header

	v1.0.1. 
		1. add callbackRemove witch call when removed item. default value = function(item, index, callback){ callback(); }
		2. add data template for table cells can be string(apply to all column) or object(keys should be name of headers, each column will have different template)
		3. add possibility to append items. on 'addRow'=true in table footer  appear fields and button for input new item. you can get new item from outside owerriding 'callbackAdd' . by default 'callbackAdd' = function(item, callback){ callback(); } 

	v1.0.2 
		1. change callbackRemove(result)  to send result if result true remove item from table
		2. change callbackAdd(result)  to send result if result true add item to table
		3. add possibility to 'editRow' append button Edit, by clicking you can edit current item in footer. callbackEdit(result) if result true change item in table
		4. refactor sorting, add sorting icon to header for sort click
		5. add possibility to append new column in table
		6. add callbackSort/callbackAddColumn 
		7. remove column and callbackRemoveColumn
	v1.0.3 renames
		removeItemById() -> removeItem
		removeItem -> deleting
		sortClick -> sorting
		callbackSort -> callbackSorting
		addRow -> inserting
		callbackRemove -> callbackDeleting
		callbackAdd -> callbackInserting
		editRow -> editing
		callbackEdit -> callbackEditing
		addColumn -> columnInserting
		callbackAddColumn -> callbackColumnInserting
		removeColumn -> columnDeleting
		callbackRemoveColumn -> callbackColumnDeleting




	options:
		{v1.0.0}  headers: --default=[], array of string [headers[0],...,headers[n]]
		{v1.0.0}  data: --default=[], can be added using addItems method [{headers[i]: value,..., headers[n]: value},{...}]
		{v1.0.0}  containerIdName: --default="snTable"
		{v1.0.0}  tableClass: --default=undefined, on some value remove default style on table and set this value
		{v1.0.0}  deleting: --default=false on true append button for delete item
		{v1.0.0}  sorting: --default=false on true add button for delete item
		{v1.0.1}	callbackDeleting: --default=function(item, index, callback){ callback(true); }
		{v1.0.1}	dataTemplate: --default="%data%", "%data%" OR {headers[0]: "%data%",...,headers[n]: "%data%"}
		{v1.0.1}	inserting: --default=false on true in table footer will be input boxes for adding new item in table. input boxes id = 'add-{header[i]}'  
		{v1.0.1}	callbackInserting: --default=function(item, callback){ callback(true); 
		{v1.0.2}	editing: --default=false on true append button for edit current item. edit item occur in footer 
		{v1.0.2}	callbackEditing: --default=function(olditem, newItem, index, callback){ callback(true); }
		{v1.0.2}	columnInserting: --default=false, append buttor and inputbox for adding new column to table		
		{v1.0.2}	callbackSorting: --default=function(columnName, columnAcs, callback){callback(true)}
		{v1.0.2}	callbackColumnInserting: --default=function(columnName, callback){callback()}
		{v1.0.2}	callbackColumnDeleting: --default=function(columnName, affectedCount, callback){callback(true)}
		{v1.0.2}	columnDeleting: --default=false, append button and inputbox for remove column from table (looks like cross)
	inner options:
		{v1.0.2}	editIndex&oldItem show index and old value for edit item. set in  prepareToEdit method, reset in footerButtonClick/callbackEditing
		{v1.0.2}	sortDescriptors array of SortDescriptor show whitch column sorting

	methods:
		{v1.0.0}  render 
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  addItems - object or object array with keys similar to options.header of objects
		{v1.0.0}  removeItem(id) - index of removing item
		{v1.0.0}  sortItems(headerName, asc) 


SimpleNotification v1.0.0.
	
	v1.0.0. 
		1. create notification in container with id containerIdName
		2. if exitCross=true closing nitification only by clicking on cross, on false close by clicking on container
		3. notification position can be top or bottom
	
	options:
		{v1.0.0}  containerIdName: --default="msg_message"
		{v1.0.0}  exitCross: --default=true (true/false) on true notify close by clicking on cross, on false notify close by clicking on notify div
		{v1.0.0}  position: --default="top" ('bottom'/'top')
	methods:
		{v1.0.0}  render 
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  destroy - manual remove notification
		{v1.0.0}  renderError - same as render(message, errorColor);
		{v1.0.0}  renderSuccess - same as render(message, successColor);


SimpleToolTip v1.0.0

	v1.0.0. 
		1. tooltip can hook to element with id = 'hookElem'. tooptip contains in container with id containerIdName
		2. text can be static 'toolTipText' or dynamic 'hookAttr'. 'hookAttr' is the attribute name whitch will be showing on tooltip. by default it sync only one time, if 'track' = true tooltip can update in case of updating attribute
		3. hooking tooltip can be postponed and hook by calling .hook()

	options:
		{v1.0.0}  hookElem: --require --default=undefined, dom element	
		{v1.0.0}  containerIdName: --default="toolTip", if of tooltip container in document
		{v1.0.0}  toolTipText: --default=undefined, predefine constant text in tooltip
		{v1.0.0}  hookAttr: --default=undefined, get value from attribute of hookElem
		(!)toolTipText & hookAttr set tooltip text, toolTipText high priority
		{v1.0.0}  track: --default=false, in case of hookAttr listen for changes and update value
		{v1.0.0}  hookOnCreate: --default=true, render tooltip on create new instance (new SimpleToolTip(optins);
	methods:
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  destroy - manual remove notification
		{v1.0.0}  hook		- bind tooltip to element (options.hookElem)


		