/* SimpleNotification v1.0.0.
	
	v1.0.0. 

	options:
		{v1.0.0}  containerIdName: --default="msg_message"
		{v1.0.0}  exitCross: --default=true (true/false) on true notify close by clicking on cross, on false notify close by clicking on notify div
		{v1.0.0}  position: --default="top" ('bottom'/'top')
	methods:
		{v1.0.0}  render 
		{v1.0.0}  optionsGet
		{v1.0.0}  optionsSet
		{v1.0.0}  destroy - manual remove notification
		{v1.0.0}  renderError - same as render(message, errorColor);
		{v1.0.0}  renderSuccess - same as render(message, successColor);
*/
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
		applyStyles(cross, { 'top': '-60px',
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
			'box-sizing':'border-box',	'width':'100%',
			'background-color': color,	'left':'1px',			'height':'60px'}
			);
		if (options.position == 'top') {
			applyStyles(elem, { 'top': '0px' });
		}
		if (options.position == 'bottom') {
			applyStyles(elem, { 'bottom': '0px' });
		}
		return elem;
	}
	function createMessageContext(value) {
		var context = document.createElement('div');
		applyStyles(context, { 'text-align':'center','color':'#fff',
			'line-height': '60px'});
		context.innerHTML = value;
		return context;
	}
	function clickExitCross() {
		this.removeEventListener('click', clickExitCross);
		this.parentNode.parentNode.removeChild(this.parentNode);
	}
	function clickExitContainer() {
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
	function render(value, color){
		if (!this.msgContainer) {
			this.msg = this.msg || createMessageContext(value);
			this.msgContainer = this.msgContainer || createMessageContainer(this.options, color);
			this.msgContainer.appendChild(this.msg);
			addExitClickEvent(this.msgContainer, this.options, true);

			document.body.appendChild(this.msgContainer);
		} else {
			document.body.appendChild(this.msgContainer);
			this.msg.innerHTML = value;
			this.msgContainer.style['background-color'] = color;
			addExitClickEvent(this.msgContainer, this.options);
		}
	}
	function renderError(message) {
		this.render(message, errorColor);
	}
	function renderSuccess(message) {
		this.render(message, successColor);
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
		this.options.containerIdName = opt.containerIdName !== undefined ? opt.containerIdName.trim() : 'msg_message';
		this.options.exitCross = opt.exitCross !== undefined ? opt.exitCross : true;
		this.options.position = opt.position !== undefined ? opt.position : 'top';
	}

	function SimpleNotification(opt) { 
		this.optionsSet(opt);
	}
	SimpleNotification.prototype = { 
		render: render,
		renderError: renderError, 
		renderSuccess: renderSuccess, 
		destroy: destroy,
		optionsGet: optionsGet, 
		optionsSet: optionsSet 
	};

	global.SimpleNotification = SimpleNotification;
})(this);
