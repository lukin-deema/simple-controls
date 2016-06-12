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
