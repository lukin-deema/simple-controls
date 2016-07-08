# Simple Grid

## Table of Contents

- [Table](#table)
  - [Options](#options)
    - [data](#data)
    - [headers](#headers)
    - [hiddenHeaders](#hiddenheaders)
    - [containerIdName](#containeridname)
    - [tableClass](#tableclass)
    - [dataTemplate](#datatemplate)
    - [deleting](#deleting)
    - [callbackDeleting](#callbackdeleting)
    - [sorting](#sorting)
    - [callbackSorting](#callbacksorting)
    - [inserting](#inserting)
    - [callbackInserting](#callbackinserting)
    - [editing](#editing)
    - [callbackEditing](#callbackediting)
    - [columnInserting](#columninserting)
    - [callbackColumnInserting](#callbackcolumninserting)
    - [columnDeleting](#columndeleting)
    - [callbackColumnDeleting](#callbackcolumndeleting)
	
  - [Methods](#methods)
    - [render](#render)
    - [optionsGet](#optionsget)
    - [optionsSet](#optionsset)
    - [addItems](#additems)
    - [removeItem](#removeitem)
    - [sortItems](#sortitems)

## Table(#table)

### Options

#### data
First you need is define options as object and to the instant of SimpleGrid. then method render() transformdiv on page into table using sending options. data can be added later using METHOD ADDITEM. If not define [headers](#headers) or [hiddenHeaders](#hidden-headers) keys of data become header names. In this case all keys become [headers](#table-options-headers) visible for UI
Default value: []
```js
var options = {data: [{"name":"Pit", "age":22},{"name":"Sally", "age":21}]}
var table = new SimpleGrid(options);
```
[top](#table-of-contents)
#### headers
When on create table no data header will define table columns structure. Headers can be define fully 
```js
var options = { headers: [ 
			{header:"name", template: "<span style='color:red'>%data%</span>", value:"NAME"}, 
			{header:"age", template: "<span style='color:green'>%data%</span>", value:"AGE"}
		] }
```
or in simple way using array of string. In this case 'header' become array value, 'template' become "%data%" and 'value' will equel to array value with first  capital letter
```js
var options = { headers: ["name", "age"] }
```

Default value: [], and filled using keys of [data](#data)

[top](#table-of-contents)
#### hiddenHeaders
Genaraly same as [headers](#headers) but it won't appear in table. It can be usefull when data contains field thet not necessary to UI  but it necessary for logic, like an database table id. 

Default value: []

[top](#table-of-contents)
#### containerIdName
It is a id where will be rendering table 

```js
var options = { containerIdName: "table-div" }
```

```html
	<div id='table-div'></div>
```

Default value: "snTable"

[top](#table-of-contents)
#### tableClass
Add class to table for append additinsl styles, when undefined adding some default styles for append table border and margin 

Default value: undefined

#### dataTemplate
Using for customize all table data cell or each column separately 
When define as string, same template will be applying  to all column 

```js
var options = { dataTemplate: "<div style='color:blue'>%data%</div>" }
```

Or it can be define  for each column 

```js
var options = { dataTemplate: {
		"name": "<a href='/details/%data%'>%data%</a>",
		"age": "<div style='color:blue'>%data%</div>"
}
```

Default value: "%data%"

[top](#table-of-contents)
#### inserting
Add table ability to append new items. On true add into table footer input boxes for append new row in table 

Default value: false

[top](#table-of-contents)
#### callbackInserting
Opportunity to interfere into proccess of inserting item into table. When callback function returns false inserting proccess will be stop. It can be usefull when you send inserting data on server and something went wrong there Also you can edit inserting item from code and send back updatedItem

```js
var callbackInserting = function(item, callback){
	alert("item: "+JSON.stringify(item));
	var newValue = Object.keys(item).reduce(function(obj, x){
		obj[x] = item[x]+"_ins";
		return obj;
	},{})
	callback(true, newValue);
}
var options = { callbackInserting: callbackInserting }
```

On redefine callback automatically [inserting](#inserting) become true

Default value: function(item, callback){callback(true[, updatedItem]);}

[top](#table-of-contents)
#### deleting
Add table ability to remove item from table. On true add on additional column button delete for each table item.

Default value: false

[top](#table-of-contents)
#### callbackDeleting
Opportunity to interfere into proccess of deleting item from table. When callback function returns false deleting proccess will be stop.

```js
var callbackDeleting = function(item, index, callback){
	alert("item: "+JSON.stringify(item)+"; index: "+index);
	callback(true)
}
var options = { callbackDeleting: callbackDeleting }
```

On redefine callback automatically [deleting](#deleting) become true

Default value: function(item,index,callback){callback(true);}

[top](#table-of-contents)
#### sorting
Add ability to sort items on table 

Default value: false

[top](#table-of-contents)
#### callbackSorting
Interfere in sorting process. When callback function returns false sorting proccess will be stop.

```js
var callbackSorting = function(columnName, columnAcs, callback){
	alert("columnName: "+JSON.stringify(columnName) 
		+";columnAcs: "+JSON.stringify(columnAcs));
	callback(true, columnName, columnAcs);
}
var options = { callbackSorting: callbackSorting }
```

On redefine callback automatically [sorting](#sorting) become true

Default value: function(columnName,columnAcs,callback) {callback(true[, updtedSortName, updatedSortAsc])}

[top](#table-of-contents)
#### editing
Make possible to edit table items. On true append edit button on additional column. Edit item is taking place on table footer 
Default value: false

[top](#table-of-contents)
#### callbackEditing
Interfere in edit proccess. When callback function returns false editing proccess will be stop.

```js 
var callbackEditing = function(oldItem, newItem, index, callback){
	alert("oldItem: "+JSON.stringify(oldItem)
		+"newItem: "+JSON.stringify(newItem)
		+"index: "+JSON.stringify(index));
	log();
	var newValue = Object.keys(newItem).reduce(function(obj, x){
		obj[x] = newItem[x]+"_edit";
		return obj;
	},{})
	callback(true, newValue);
}
var options = { callbackEditing: callbackEditing }
```

On redefine callback automatically [editing](#editing) become true

Default value: function(olditem, newItem, index, callback){ callback(true[, updatedItem]);}

[top](#table-of-contents)
#### columnInserting
Add ability to append new column. On true in table header additional column  appere input box with add button.

Default value: false

[top](#table-of-contents)
#### callbackColumnInserting
Interfere in column inserting proccess. When callback function returns false column inserting proccess will be stop.

```js 
var callbackColumnInserting = function(columnName, callback){
	alert("columnName: "+JSON.stringify(columnName));
	log();
	callback(true, columnName+"_newcol");
}
var options = { callbackColumnInserting: callbackColumnInserting }
```

On redefine callback automatically [columnInserting](#columninserting) become true

Default value: function(columnName, callback){callback(true[, updatedItem])}

[top](#table-of-contents)
#### columnDeleting

Default value: false

[top](#table-of-contents)
#### callbackColumnDeleting
Interfere in column deleting proccess. When callback function returns false column deleting proccess will be stop.


```js
var callbackColumnDeleting = function(columnName, affectedCount, callback){
	alert("columnName: "+JSON.stringify(columnName)
		+"affectedCount: "+JSON.stringify(affectedCount));
	log();
	callback(true);
}
var options = { callbackColumnDeleting: callbackColumnDeleting }
```

On redefine callback automatically [callbackColumnDeleting](#callbackcolumndeleting) become true

Default value: function(columnName, affectedCount, callback){ callback(true)}
[top](#table-of-contents)


### Methods

#### render
Method for render table in container with [containerIdName](#containeridname) 

[top](#table-of-contents)
#### optionsGet
Get current instance option

[top](#table-of-contents)
#### optionsSet
Set current instance option

[top](#table-of-contents)
#### addItems
Add new item programmatically

```js 
table.addItems([{"name":"Piter", "age":35},{"name":"Sell", "age":11}])
```

[top](#table-of-contents)
#### removeItem
Remove item by id 

```js 
table.removeItem(2)
```
[top](#table-of-contents)


