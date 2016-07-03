var optN = {
	containerIdName: "msg_mess",	// default "msg_message"
	exitCross: false,	// default true (true/false)
	position: "top",	// default "top" (bottom/top)
}
var m = new SimpleNotification(optN);
function showNotification() {
	m.renderSuccess('some text');
}
function hideNotification(){
	m.destroy();
}
///////////// TT
var ttOption1 = {
	hookElem: document.querySelector("#ttTest1"),	// require
	containerIdName: "id1",	// default "toolTip"
	//toolTipText: "Show notify",	// default "Default Text"
	hookAttr: "value",	// default undefined
}
///////////// TT
var ttOption2 = {
	hookElem: document.querySelector("#ttTest2"),
	containerIdName: "id2",
	//toolTipText: "Hide notify",
	// toolTipText or hookAttr, toolTipText high priority 
	hookAttr: "value",
}
var tt1 = new SimpleToolTip(ttOption1);
var tt2 = new SimpleToolTip(ttOption2);

///////////// TT
var ttOption3 = {
	hookElem: document.querySelector("#ttTextTest1"),
	containerIdName: "id3", 
	hookAttr: "value",
	track: true, 
	hookOnCreate: true,
}
///////////// TT
var ttOption4 = {
	hookElem: document.querySelector("#ttTextTest2"), // !! nodefault
	containerIdName: "id4", // default "toolTip"
	// !! toolTipText or hookAttr, toolTipText high priority (tooltip text)
	// toolTipText: "Hide notify" // !! nodefault
	hookAttr: "value",	// !! nodefault
	track: true, /// default false (for tracking changes in textbox)
	hookOnCreate: false, /// default true (on false need to call hook())
}

var tt1 = new SimpleToolTip(ttOption3);
var tt2 = new SimpleToolTip(ttOption4);
function addTT() {
	tt2.add();
}
function destroyTT() {
	tt2.destroy();
}
///////////// Table
var callbackDeleting = function(item, index, callback){
	alert("item: "+JSON.stringify(item)+"; index: "+index);
	log();
	callback(true)
}
var callbackInserting = function(item, callback){
	alert("item: "+JSON.stringify(item));
	log();
	var newV = Object.keys(item).reduce(function(obj, x){
		obj[x] = item[x]+"_ins";
		return obj;
	},{})
	callback(true/*, newV*/);
}
var callbackSorting = function(columnName, columnAcs, callback){
	alert("columnName: "+JSON.stringify(columnName) 
		+";columnAcs: "+JSON.stringify(columnAcs));
	log();
	callback(true);
}
var callbackEditing = function(oldItem, newItem, index, callback){
	alert("oldItem: "+JSON.stringify(oldItem)
		+"newItem: "+JSON.stringify(newItem)
		+"index: "+JSON.stringify(index));
	log();
	var newV = Object.keys(newItem).reduce(function(obj, x){
		obj[x] = newItem[x]+"_edit";
		return obj;
	},{})
	callback(true/*, newV*/);
}
var callbackColumnInserting = function(columnName, callback){
	alert("columnName: "+JSON.stringify(columnName));
	log();
	callback(true/*, columnName+"_col"*/);
}
var callbackColumnDeleting = function(columnName, affectedCount, callback){
	alert("columnName: "+JSON.stringify(columnName)
		+"affectedCount: "+JSON.stringify(affectedCount));
	log();
	callback(true);
}
var tableOptions = {
	hiddenHeaders:["id"],
	headers: ["name", "age"],
	containerIdName: "snTable",
	data: [{"id": 1, "name":"Pit", "age":22},{"id": 2, "name":"Sally", "age":21}],
	////inserting: true,
	callbackInserting: callbackInserting,
	////editing: true,
	callbackEditing: callbackEditing,
	////columnInserting: true,
	callbackColumnInserting: callbackColumnInserting,
	////sorting: true,
	callbackSorting: callbackSorting,
	////columnDeleting: true,
	callbackColumnDeleting: callbackColumnDeleting,
	////deleting: true,
	callbackDeleting: callbackDeleting,
	// dataTemplate: "<span style='color:red'>%data%</span>"
	dataTemplate: {"name":"<a href='#%data%'><span style='color:red'>%data%</span></a>", "age":"<span style='color:blue'>%data%</span>"}
}

function log(){
	document.querySelector(".console").innerHTML = JSON.stringify(sTable.options.data) + "." + JSON.stringify(sTable.options.sortName) + "." + JSON.stringify(sTable.options.sortAsc);
}

var sTable = new SimpleGrid(tableOptions);
log();

function addToTable() {
	sTable.addItems({"name": document.querySelector("#tableName").value, 
									 "age": document.querySelector("#tableAge").value})
	log();
}
function sortTable() {
	var checked = document.querySelector("#checkbox").checked;
	sTable.sortItems("name", checked);
	log();
}