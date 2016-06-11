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
		elem.setAttribute('id', this.options.containerIdName);
		applyStyles(elem, {
			'z-index':'999',	'position':'fixed',			
			'box-sizing':'border-box',	'top':'0px',			'width':'100%',
			'background-color': color,	'left':'1px',			'height':'60px'}
			);
		return elem;
	}
	function clickExitCross() {
		this.removeEventListener('click', clickExitCross);
		this.parentNode.parentNode.removeChild(this.parentNode);
	}
	function clickExitContainer() {
		this.removeEventListener('click', clickExitContainer);
		this.parentNode.removeChild(this);
	}
	function addExitClickEvent(msgContainer, options, append) {
		if (options.exitCross && append) { 
			msgContainer.appendChild(createExitCross()); 
		}
		if (options.exitCross) {
			msgContainer.querySelector("#msg_close").addEventListener('click', clickExitCross);
		} else {
			msgContainer.addEventListener('click', clickExitContainer);
		}
	}
	function addContextMessage(value) {
		var context = document.createElement('div');
		applyStyles(context, { 'text-align':'center','color':'#fff' });
		context.innerHTML = value;
		return context;
	}
	function render(value){
		if (!this.msgContainer) {
			this.msg = this.msg || addContextMessage(value);
			this.msgContainer = this.msgContainer || createMessageContainer(errorColor);
			addExitClickEvent(this.msgContainer, this.options, true);
			this.msgContainer.appendChild(this.msg);

			document.body.appendChild(this.msgContainer);
		} else {
			document.body.appendChild(this.msgContainer);
			this.msg.innerHTML = value;
			this.msgContainer.style['background-color'] = errorColor;
			addExitClickEvent(this.msgContainer, options);
		}
	}
	function destroy() {
		if (document.querySelector("#"+this.options.containerIdName)) {
			this.msgContainer.parentNode.removeChild(this.msgContainer);
		}
	}

	function SimpleNotification(options) { 
		this.options = {};
		this.options.containerIdName = options.containerIdName.trim() || 'msg_message';
		this.options.exitCross = options.exitCross || true;
	}
	SimpleNotification.prototype = {  render: render, destroy: destroy }

	global.SimpleNotification = SimpleNotification;
})(this);
