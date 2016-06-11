(function SimpleNotification(global) {
	var successColor = '#13F101';
	var errorColor ='#f00';

	function applyStyles(node, styles) {
    Object.keys(styles).forEach(function(key) {
        node.style[key] = styles[key];
    });
	}
	function createExitCross(options){
		var cross = document.createElement('div');
		cross.setAttribute('id', options.containerIdName+'Close');
		cross.innerHTML = '&#x2716;';
		applyStyles(cross, {
			'position':'relative',	'left':'99%',
			'cursor':'default',			'color':'#fff'
		});
		return cross;
	}
	function createMessageContainer(options, color) {
		var elem = document.createElement('div');
		elem.setAttribute('id', options.containerIdName);
		applyStyles(elem, {
			'z-index':'999',	'position':'fixed',			
			'box-sizing':'border-box',	'top':'0px',			'width':'100%',
			'background-color': color,	'left':'1px',			'height':'60px'}
			);
		return elem;
	}
	function createContextMessage(value) {
		var context = document.createElement('div');
		applyStyles(context, { 'text-align':'center','color':'#fff' });
		context.innerHTML = value;
		return context;
	}
	function clickExitCross(e) {
		this.removeEventListener('click', clickExitCross);
		this.parentNode.parentNode.removeChild(this.parentNode);
	}
	function clickExitContainer(e) {
		this.removeEventListener('click', clickExitContainer);
		this.parentNode.removeChild(this);
	}
	function addExitClickEvent (msgContainer, options, append) {
		if (options.exitCross && append) { 
			msgContainer.appendChild(createExitCross(options)); 
		}
		if (options.exitCross) {
			msgContainer.querySelector("#"+options.containerIdName+"Close").addEventListener('click', clickExitCross);
		} else {
			msgContainer.addEventListener('click', clickExitContainer);
		}
	}
	function render(value){
		if (!this.msgContainer) {
			this.msg = this.msg || createContextMessage(value);
			this.msgContainer = this.msgContainer || createMessageContainer(this.options, errorColor);
			addExitClickEvent(this.msgContainer, this.options, true);
			this.msgContainer.appendChild(this.msg);

			document.body.appendChild(this.msgContainer);
		} else {
			document.body.appendChild(this.msgContainer);
			this.msg.innerHTML = value;
			this.msgContainer.style['background-color'] = errorColor;
			addExitClickEvent(this.msgContainer, this.options);
		}
	}
	function destroy() {
		if (document.querySelector("#"+this.options.containerIdName)) {
			this.msgContainer.parentNode.removeChild(this.msgContainer);
		}
	}
	function optionsGet() {
		return this.options;
	}
	function optionsSet(opt) {
		this.options = {};
		this.options.containerIdName = opt.containerIdName != undefined ? opt.containerIdName.trim() : 'msg_message';
		this.options.exitCross = opt.exitCross != undefined ? opt.exitCross : true;
	}

	function SimpleNotification(opt) { 
		this.optionsSet(opt);
	}
	SimpleNotification.prototype = {  render: render, destroy: destroy,
		optionsGet: optionsGet, optionsSet: optionsSet };

	global.SimpleNotification = SimpleNotification;
})(this);
