opt = {
	"containerIdName": 'msg_mess',
	"exitCross": false,
	"position": "bottom", /// bottom  top
}
var m = new SimpleNotification(opt);
function showNotification() {
	m.renderSuccess('some text');
}
function hideNotification(){
	m.destroy();
}