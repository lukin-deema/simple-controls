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
var callbackMethod = function(item, index, callback){
	alert("item: "+JSON.stringify(item)+"; index: "+index);
	callback()
}
var tableOptions = {
	headers: ["name", "age"],
	containerIdName: "snTable",
	data: [{"name":"Pit", "age":22},{"name":"Sally", "age":21}],
	removeButton: true,
	sortClick: true,
	removeCallback: callbackMethod,
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