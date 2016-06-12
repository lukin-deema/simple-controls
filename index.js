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

var ttOption1 = {
	hookElem: document.querySelector("#ttTest1"),	// require
	toolTipId: "id1",	// default "toolTip"
	//toolTipText: "Show notify",	// default "Default Text"
	hookAttr: "value",	// default undefined
}
var ttOption2 = {
	hookElem: document.querySelector("#ttTest2"),
	toolTipId: "id2",
	//toolTipText: "Hide notify",
	// toolTipText or hookAttr, toolTipText high priority 
	hookAttr: "value",
}
var tt1 = new SimpleToolTip(ttOption1);
var tt2 = new SimpleToolTip(ttOption2);

///////////// TT
var ttOption3 = {
	hookElem: document.querySelector("#ttTextTest1"),
	toolTipId: "id3", 
	hookAttr: "value",
	track: true, 
	hookOnCreate: true,
}
var ttOption4 = {
	hookElem: document.querySelector("#ttTextTest2"), // !! nodefault
	toolTipId: "id4", // default "toolTip"
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

