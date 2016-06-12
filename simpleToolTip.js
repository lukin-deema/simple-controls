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
		this.options.toolTipId = opt.toolTipId || "toolTip";
		if (!opt.toolTipText && !opt.hookAttr) {
			console.error("You should define 'options.toolTipText' or 'options.hookAttr'");
		}
		this.options.toolTipText = opt.toolTipText;
		this.options.hookAttr = opt.hookAttr;
	}

	function SimpleToolTip(options) {
		this.optionsSet(options);
		this.toolTipContainer = document.createElement('div');
		this.toolTipContainer.setAttribute('id', this.options.toolTipId);
		this.toolTipContainer.innerHTML = options.toolTipText || options.hookElem[options.hookAttr];
		applyStyles(this.toolTipContainer, {
			"display": "none", 'background-color': '#ffffff', "position": "absolute"
		})

		document.body.appendChild(this.toolTipContainer);

		this.options.hookElem.setAttribute('toolTipId', this.options.toolTipId);
		this.options.hookElem.addEventListener('mousemove', function(e){
			var elem = document.querySelector("#"+e.target.getAttribute('toolTipId'));
			elem.style.top = (e.pageY-20)+"px";
			elem.style.left = (e.pageX)+"px";
		});
		this.options.hookElem.addEventListener('mouseover', function(e){
			var elem = document.querySelector("#"+e.target.getAttribute('toolTipId'));
			elem.style.display = "block";
		});
		this.options.hookElem.addEventListener('mouseleave', function(e){
			var elem = document.querySelector("#"+e.target.getAttribute('toolTipId'));
			elem.style.display = "none";
		});
	}
	SimpleToolTip.prototype = { 
		optionsGet: optionsGet,
		optionsSet: optionsSet,
	};

	global.SimpleToolTip = SimpleToolTip;
})(this);