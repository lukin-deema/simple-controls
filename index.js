opt = {
	"containerIdName": 'msg_mess',
	"exitCross": false,
}
var m = new SimpleNotification(opt);
function showNotification() {
	m.render('some text');
}
function hideNotification(){
	m.destroy();
}