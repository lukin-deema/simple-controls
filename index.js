var optN = {
	"containerIdName": 'msg_mess',
	"exitCross": false,
	"position": "top", /// bottom  top
}
var m = new SimpleNotification(optN);
function showNotification() {
	m.renderSuccess('some text');
}
function hideNotification(){
	m.destroy();
}

var ttOption1 = {
	hookElem: document.querySelector("#ttTest1"), 
	toolTipId: "id1",
	toolTipText: "Show notify",
}
var ttOption2 = {
	hookElem: document.querySelector("#ttTest2"),
	toolTipId: "id2",
	toolTipText: "Hide notify",
}
var tt1 = new SimpleToolTip(ttOption1);
var tt2 = new SimpleToolTip(ttOption2);
