(function SimpleToolTip(global) {
	function applyStyles(node, styles) {
		Object.keys(styles).forEach(function(key) {
			node.style[key] = styles[key];
		});
	}

	function optionsGet() {
		return this.options;
	}
	function optionsSet(opt) {
		this.options = {};
		if (!opt.hookElem) {
			console.error("You should define 'options.hookElem'");
		}		
		this.options.hookElem = opt.hookElem;
		if (!opt.toolTipText && !opt.hookAttr) {
			console.error("You should define 'options.toolTipText' or 'options.hookAttr'");
		}
		this.options.toolTipText = opt.toolTipText;
		this.options.hookAttr = opt.hookAttr;

		this.options.toolTipId = opt.toolTipId || "toolTip";
		this.options.track = opt.track !== undefined ? opt.track : false;
		this.options.hookOnCreate = opt.hookOnCreate !== undefined ? opt.hookOnCreate : true;
		if (options.hookOnCreate) {
			this.hook();
		}
	}

	function onMouseOver(e){
		var elem = document.querySelector("#"+e.target.getAttribute('toolTipId'));
		elem.style.display = "block";
	}
	function onMouseLeave(e){
		var elem = document.querySelector("#"+e.target.getAttribute('toolTipId'));
		elem.style.display = "none";
	}
	function onChange(e){
		e.target.setAttribute('value', e.target.value);
	}
	function onMouseMove(e){
			var elem = document.querySelector("#"+e.target.getAttribute('toolTipId'));
			elem.innerHTML = e.target.getAttribute('value');
			elem.style.top = (e.pageY - 20)+"px";
			elem.style.left = (e.pageX + 5)+"px";
		}
	function SimpleToolTip(options) {
		this.optionsSet(options);
	}
	function hook() {
		if (!this.toolTipContainer) {
			this.toolTipContainer = document.createElement('div');
			this.toolTipContainer.setAttribute('id', this.options.toolTipId);
			this.toolTipContainer.innerHTML = this.options.toolTipText || this.options.hookElem[this.options.hookAttr];
			applyStyles(this.toolTipContainer, {
				"display": "none", 'background-color': '#ffffff', "position": "absolute"
			});

			document.body.appendChild(this.toolTipContainer);
			this.options.hookElem.setAttribute('toolTipId', this.options.toolTipId);
			this.options.hookElem.setAttribute('value', this.toolTipContainer.innerHTML);
			this.options.hookElem.addEventListener('mousemove', onMouseMove);
			this.options.hookElem.addEventListener('mouseover', onMouseOver);
			this.options.hookElem.addEventListener('mouseleave', onMouseLeave);
			if (this.options.track) {
				this.options.hookElem.addEventListener('change', onChange);
			}
		}
	}
	function destroy(){
		this.options.hookElem.removeEventListener('mousemove', onMouseMove);
		this.options.hookElem.removeEventListener("mouseover",onMouseOver);
		this.options.hookElem.removeEventListener("mouseleave",onMouseLeave);
		if (this.options.track) {
			this.options.hookElem.removeEventListener("change",onChange);
		}
		this.options.hookElem.removeAttribute('toolTipId');
		this.options.hookElem.removeAttribute('value');
		this.toolTipContainer.parentNode.removeChild(this.toolTipContainer);
		this.toolTipContainer = undefined;
	}
	SimpleToolTip.prototype = { 
		optionsGet: optionsGet,
		optionsSet: optionsSet,
		hook: hook,
		destroy: destroy,
	};

	global.SimpleToolTip = SimpleToolTip;
})(this);