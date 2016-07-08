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
	headers: [{header:"name", template: "<span style='color:red'>%data%</span>", value:"ИМЯ"}, "age"],
	containerIdName: "snTable",
	data: [{"id": 1, "name":"Pit", "age":22},{"id": 2, "name":"Sally", "age":21}],
	// data: [
	// 	{"2015":"December","Chrome":"68.0 %","IE":"6.3 %","Firefox":"19.1 %","Safari":"3.7 %","Opera":"1.5 %" },
	// 	{"2015":"November","Chrome":"67.4 %","IE":"6.8 %","Firefox":"19.2 %","Safari":"3.9 %","Opera":"1.5 %"},
	// 	{"2015":"October","Chrome":"66.5 %","IE":"6.9 %","Firefox":"20.0 %","Safari":"3.8 %","Opera":"1.4 %"},
	// 	{"2015":"September","Chrome":"65.9 %","IE":"7.2 %","Firefox":"20.6 %","Safari":"3.6 %","Opera":"1.4 %"},
	// 	{"2015":"August","Chrome":"64.0 %","IE":"6.6 %","Firefox":"21.2 %","Safari":"4.5 %","Opera":"2.2 %"},
	// 	{"2015":"July","Chrome":"63.3 %","IE":"6.5 %","Firefox":"21.6 %","Safari":"4.9 %","Opera":"2.5 %"},
	// 	{"2015":"June","Chrome":"64.8 %","IE":"7.1 %","Firefox":"21.3 %","Safari":"3.8 %","Opera":"1.8 %"},
	// 	{"2015":"May","Chrome":"64.9 %","IE":"7.1 %","Firefox":"21.5 %","Safari":"3.8 %","Opera":"1.6 %"},
	// 	{"2015":"April","Chrome":"63.9 %","IE":"8.0 %","Firefox":"21.6 %","Safari":"3.8 %","Opera":"1.5 %"},
	// 	{"2015":"March","Chrome":"63.7 %","IE":"7.7 %","Firefox":"22.1 %","Safari":"3.9 %","Opera":"1.5 %"},
	// 	{"2015":"February","Chrome":"62.5 %","IE":"8.0 %","Firefox":"22.9 %","Safari":"3.9 %","Opera":"1.5 %"},
	// 	{"2015":"January","Chrome":"61.9 %","IE":"7.8 %","Firefox":"23.4 %","Safari":"3.8 %","Opera":"1.6 %"}
	// ],
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