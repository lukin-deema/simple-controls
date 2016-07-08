SimpleGrid v1.0.4.

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
	
	v1.0.3 
		1. renames
			removeItemById() -> removeItem
			removeItem -> deleting
			callbackRemove -> callbackDeleting
			sortClick -> sorting
			callbackSort -> callbackSorting
			addRow -> inserting
			callbackAdd -> callbackInserting
			editRow -> editing
			callbackEdit -> callbackEditing
			addColumn -> columnInserting
			callbackAddColumn -> callbackColumnInserting
			removeColumn -> columnDeleting
			callbackRemoveColumn -> callbackColumnDeleting
		2. if callback{action} change default of {action} to true ({action}=> deleting, inserting, sorting, editing, columnInserting, columnDeleting)
		3. when 'headers' not define check all data for object keys and get unique keys
	
	v1.0.4
		1. change callbackInserting -> function(result[, updatedItem]){ } , can redefine 'newItem' if necessary, when 'updatedItem'!=undefined it replace 'newItem'
		2. change callbackEditing -> function(result[, updatedItem]){ } , can redefine 'newItem' if necessary, when 'updatedItem'!=undefined it replace 'newItem'
		3. change callbackColumnInserting -> function(result[, updatedItem]){ } , can redefine 'newColumnName' if necessary, when 'updatedItem'!=undefined it replace 'newColumnName'
		4. change inner option 'sortDescriptors' from array [SortDescriptor,..] to object {header1:SortDescriptor,...}
		5. change callbackSorting -> function(result[, updtedSortName, updatedSortAsc]){ } , can redefine 'updtedSortName' and 'updatedSortAsc' if necessary, when values!=undefined it replace old values
		6. add 'hiddenHeaders', column witch doesnot show, it exists in 'data' but doesnt show on UI

	v1.0.5
		1. change inner headers to structure {show, header, tamplate, value}, where "tamplate", "value" new fields that shows how header will be showing on table. by default template "%data%" and value same as 'header' but start with capital  letter.
		2. array element for options.headers, options.hiddenHeaders can be string ( with default "tamplate", "value" in inner headers) or {header:"header", template:"%data%", value:"Header"} where 'header' required. Template should contains "%data%" 

	options:
		| headers | v1.0.5 | --default=[] | Showing heders can be add new header using columnInserting = true [header[0],...], header can be string in this case {header: header, template: "%data%", value: "{Header}"} or specify all {header: ", template: "", value: ""} but tamplate should contains "%data%" it will be replacing with 'value'
		| data		| v1.0.0 | --default=[] | Showing informations, can be added using method addItems(items) [{header[i]: value,..., header[n]: value},{...}]{v1.0.0}  containerIdName | v1.0.0 | --default='snTable' | It is the container id where grid will render <div id='snTable'></div>
		| tableClass | v1.0.0 | --default=undefined | On some value remove default style on table and set this value as class attrinbute
		| deleting | v1.0.0 | --default=false | On true append button for delete item in additional column
		| sorting | v1.0.0 | --default=false | On true append sorting button in each header of the table
		| callbackDeleting | v1.0.1 | --default=function(item,index,callback){callback(true);} | When callbackDeleting obviously define 'deleting' parameter will redefined as true
		| dataTemplate | v1.0.1 | --default="%data%" | Same tamplate for every column is "%data%". Specify template for each column {header[0]: "%data%",...,header[n]: "%data%"}
		| inserting | v1.0.1 | --default=false | On true append input boxes for adding new item in in additional column,  input boxes id = 'add-{header[i]}'
		| inserting | v1.0.1 | --default=false | On true append input boxes for adding new item in in additional column
		| editing | v1.0.2 | --default=false | On true append button for edit current item. edit item occur in footer
		| callbackEditing | v1.0.2 | --default=function(olditem, newItem, index, callback){ callback(true[, updatedItem]);} | When callbackEditing obviously define 'editing' parameter will redefined as true
		| callbackInserting | v1.0.1 | --default=function(item, callback){callback(true[, updatedItem]);} | When callbackInserting obviously define 'inserting' parameter will redefined as true
		| callbackSorting | v1.0.2 | --default=function(columnName,columnAcs,callback) {callback(true)} | When callbackSorting obviously define 'sorting' parameter will redefined as true
		| columnInserting| v1.0.2| --default=false | On true append button and inputbox for adding new column to additional column in table header
		| callbackColumnInserting | v1.0.2 | --default=function(columnName, callback){callback(true[, updatedItem])} | When callbackColumnInserting obviously define 'columnInserting' parameter will redefined as true	
		| columnDeleting | v1.0.2 | --default=false | On true append button for deleting column in table header
		| callbackColumnDeleting | v1.0.2 | --default=function(columnName, affectedCount, callback){ callback(true)} | When callbackColumnDeleting obviously define 'columnDeleting' parameter will redefined as true
		| hiddenHeaders | v1.0.5 | --default=undefided | This headers doesnt show on UI [header[n+1],...] if data should contains some addition information. If hiddenHeaders does not define obviously, all columns will be visible. For more information see "options:headers" 

	inner options:
		{v1.0.2}  editIndex&oldItem show index and old value for edit item. set in  prepareToEdit method, reset in footerButtonClick/callbackEditing
		{v1.0.2}  sortDescriptors object {header1:SortDescriptor,...} witch show what column sotring
		{v1.0.4}  header change to object {show:true|false, header: old 'header'}
		{v1.0.4}  hidHeaders save values of hiddenHeaders when edit item
		{v1.0.5}  header {show: "", header:"", tamplate: "", value:""}

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


		