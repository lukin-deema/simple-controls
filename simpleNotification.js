(function SimpleNotification(global) {
	var successColor = '#13F101';
	var errorColor ='#f00';

	function applyStyles(node, styles) {
    Object.keys(styles).forEach(function(key) {
        node.style[key] = styles[key];
    });
	}
	function createExitCross(){
		var cross = document.createElement('div');
			cross.setAttribute('id','msg_close');
			cross.innerHTML = '&#x2716;';
			applyStyles(cross, {
				'position':'relative',	'left':'99%',
				'cursor':'default',			'color':'#fff'
			});
		return cross;
	}
	function createMessageContainer(color) {
		var elem = document.createElement('div');
		elem.setAttribute('id','msg_message');
		applyStyles(elem, {
			'z-index':'999',	'position':'fixed',			
			'box-sizing':'border-box',	'top':'0px',			'width':'100%',
			'background-color': color,	'left':'1px',			'height':'60px'}
			);
		return elem;
	}
	function clickCross(e) {
		this.removeEventListener('click', clickCross);
		this.parentNode.removeChild(this);
	}
	function render(value){
		if (!this.msgContainer) {
			this.msg = document.createElement('div');
			applyStyles(this.msg, { 'text-align':'center','color':'#fff' });
			this.msg.innerHTML = value;
			this.msgContainer = this.msgContainer || createMessageContainer(errorColor);
			this.msgContainer.appendChild(createExitCross());
			this.msgContainer.appendChild(this.msg);

			document.body.appendChild(this.msgContainer);
			this.msgContainer.addEventListener('click', clickCross);
		} else {
			document.body.appendChild(this.msgContainer);
			this.msg.innerHTML = value;
			this.msgContainer.style['background-color'] = color;
			this.msgContainer.addEventListener('click', clickCross);
		}
	}
	function destroy() {
		if (document.querySelector('#msg_message')) {
			this.msgContainer.parentNode.removeChild(this.msgContainer);
			this.msgContainer.addEventListener('click', clickCross);
		}
	}

	function SimpleNotification(options) { 
		this.options = options;
	}
	SimpleNotification.prototype = {  render: render, destroy: destroy }

	global.SimpleNotification = SimpleNotification;
})(this);
