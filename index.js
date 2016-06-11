options = {
	"containerIdName": 'msg_message',
	"exitCross": true,
}
var m = new SimpleNotification(options);
function showNotification() {
	m.render('some text');
}
function hideNotification(){
	m.destroy();
}