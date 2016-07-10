(function SimpleToolTip(global) {
	TemplateType = { 
		text: "text",
		buttonsYNC: "buttonsYNC",
		buttonsYC: "buttonsYC",
		buttonsIYC: "buttonsIYC" 
	}
	TemplateDefault = { 
		text: "%data%",
		buttonsYNC: "%data% %buttonY% %buttonN% %buttonC%",
		buttonsYC: "%data% %buttonY% %buttonC%",
		buttonsIYC: "%data% %inputBox% %buttonY% %buttonC%"
	}
	/// helpers
	function getAbsolutePosition(el){ /**/
		var xPos = 0;
  	var yPos = 0;
  	while (el) {
			if (el.tagName == "BODY") {
				// deal with browser quirks with body/window/document and page scroll
				var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
				var yScroll = el.scrollTop || document.documentElement.scrollTop;
				xPos += (el.offsetLeft - xScroll + el.clientLeft);
				yPos += (el.offsetTop - yScroll + el.clientTop);
			} else {
				// for all other non-BODY elements
				xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
				yPos += (el.offsetTop - el.scrollTop + el.clientTop);
			}
			el = el.offsetParent;
		}
		return {
			x: xPos,
			y: yPos
		};
	}
	function applyStyles(node, styles) {
		Object.keys(styles).forEach(function(key) {
			node.style[key] = styles[key];
		});
	}
	function onMouseOver(e){
		var elem = document.querySelector("#"+e.target.getAttribute('containerIdName'));
		elem.style.display = "block";
	}
	function onMouseLeave(e){
		var elem = document.querySelector("#"+e.target.getAttribute('containerIdName'));
		elem.style.display = "none";
	}
	function onChange(e){
		replaceTemplate.call(this)
		debugger;
		if (e.target.value) {
			applyStyles(this.toolTipContainer, {
				"border": "black solid 1px", "padding": "5px"
			});
		} else {
			applyStyles(this.toolTipContainer, {
				"border": "", "padding": "0px"
			});
		}
		e.target.setAttribute('value', e.target.value);
	}
	function onMouseMove(e){
		var elem = document.querySelector("#"+e.target.getAttribute('containerIdName'));
		elem.style.top = (e.pageY - 20)+"px";
		elem.style.left = (e.pageX + 5)+"px";
	}
	function createButton(buttonCharValue) {
		var button = document.createElement("input");
		button.setAttribute("value", buttonCharValue);
		button.setAttribute("type", "button");
		button.addEventListener('click', preTemplateClickEvent.bind(this, buttonCharValue));
		return button;
	}
	function preTemplateClickEvent(buttonCharValue) {
		var input = this.toolTipContainer.querySelector("#tooltip-input-value");
		var inputValue = undefined;
		if (input) {
			inputValue = input.value;
		}
		this.options.templateClickEvent.call(this, buttonCharValue, inputValue, onTooltipButonClick.bind(this));
	}
	function replaceButton(domTemplate, text, selector) {
		var button = createButton.call(this, text);
		dom = domTemplate.querySelector(selector);
		if (dom) {
			dom.parentNode.replaceChild(button, dom);
		}	
	}
	function replaceTemplate(){
		if (this.options.template.indexOf("%data%") != -1) {
			this.options.template = this.options.template.replace(/%data%/g,"<data></data>")
			this.options.template = this.options.template.replace(/%buttonY%/g,"<button-y></button-y>")
			this.options.template = this.options.template.replace(/%buttonN%/g,"<button-n></on-n>")
			this.options.template = this.options.template.replace(/%buttonC%/g,"<button-c></button-c>")
			this.options.template = this.options.template.replace(/%inputBox%/g,"<input-box></input-box>")
			var domTemplate = document.createElement("div");
			domTemplate.innerHTML = this.options.template;
			
			var dom = domTemplate.querySelector("data");
			if (dom) {
				dom.innerHTML = this.options.toolTipText || this.options.hookElem[this.options.hookAttr];
			}
			replaceButton.call(this, domTemplate, "Yes", "button-y")
			replaceButton.call(this, domTemplate, "No", "button-n")
			replaceButton.call(this, domTemplate, "Cancel", "button-c")

			var textBox = document.createElement("input");
			textBox.setAttribute("value", "");
			textBox.setAttribute("id", "tooltip-input-value");
			textBox.setAttribute("type", "text");
			dom = domTemplate.querySelector("input-box");
			if (dom) {
				dom.parentNode.replaceChild(textBox, dom);
			}

			this.toolTipContainer = document.createElement('div');
			this.toolTipContainer.setAttribute('id', this.options.containerIdName);
			this.toolTipContainer.appendChild(domTemplate);

			applyStyles(this.toolTipContainer, {
				"display": "none", 			"background-color": "#ffffff", 
				"position": "absolute"
			});
			if (this.toolTipContainer.innerHTML) {
				applyStyles(this.toolTipContainer, {"border": "black solid 1px", "padding": "5px"});
			}
			document.body.appendChild(this.toolTipContainer);
		} else{  // change event options.track = true
			var dataTag = this.toolTipContainer.querySelector("data");
			dataTag.innerHTML = this.options.toolTipText || this.options.hookElem[this.options.hookAttr];
		}
	}
	function onTooltipButonClick() {
		this.options.hookElem.addEventListener('mousemove', onMouseMove);
		this.options.hookElem.addEventListener('mouseover', onMouseOver);
		this.options.hookElem.addEventListener('mouseleave', onMouseLeave);
		document.querySelector("#"+this.options.hookElem.getAttribute('containerIdName')).style.display = "none";
		this.options.isShown = false;
	}
	function onClickTooltip(e){
		if (!this.options.isShown) {
			var hook = this.options.hookElem;
			hook.removeEventListener('mousemove', onMouseMove);
			hook.removeEventListener('mouseover', onMouseOver);
			hook.removeEventListener('mouseleave', onMouseLeave);
			var elem = document.querySelector("#"+e.target.getAttribute('containerIdName'));
			elem.style.top = (hook.offsetTop+hook.offsetHeight)+"px";
			elem.style.left = (hook.offsetLeft)+"px";	
			this.options.isShown = true;
		}
	}

	function hook() {
		if (!this.toolTipContainer) {
			this.options.hookElem.setAttribute('containerIdName', this.options.containerIdName);
			this.options.hookElem.addEventListener('mousemove', onMouseMove);
			this.options.hookElem.addEventListener('mouseover', onMouseOver);
			this.options.hookElem.addEventListener('mouseleave', onMouseLeave);
			if (this.options.templateType != TemplateType.text) {
				this.options.hookElem.addEventListener('click', onClickTooltip.bind(this));
			}
			replaceTemplate.call(this);
			if (this.options.track) {
				this.options.hookElem.addEventListener('change', onChange.bind(this));
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
		this.options.hookElem.removeAttribute('containerIdName');
		this.options.hookElem.removeAttribute('value');
		this.toolTipContainer.parentNode.removeChild(this.toolTipContainer);
		this.toolTipContainer = undefined;
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

		this.options.containerIdName = opt.containerIdName || "toolTip";
		this.options.track = opt.track || false;
		this.options.hookOnCreate = opt.hookOnCreate !== undefined ? opt.hookOnCreate : true;
		this.options.templateType = opt.templateType || "text";
		// fill this.options.template
		switch(this.options.templateType){
			case TemplateType.buttonsYNC: 
				this.options.template = TemplateDefault.buttonsYNC;
				break;
			case TemplateType.buttonsYC: 
				this.options.template = TemplateDefault.buttonsYC;
				break;
			case TemplateType.buttonsIYC: 
				this.options.template = TemplateDefault.buttonsIYC;
				break;
			case TemplateType.text: 
			default: this.options.template = TemplateDefault.text;
			
		}
		this.options.templateClickEvent = opt.templateClickEvent || function(buttonChar, inputValue, callback, e){ callback(); };
		this.options.isShown = false;
		if (this.options.hookOnCreate) {
			this.hook();
		}
	}
	function SimpleToolTip(options) {

		this.optionsSet(options);
	}
	SimpleToolTip.prototype = { 
		optionsGet: optionsGet,
		optionsSet: optionsSet,
		hook: hook,
		destroy: destroy,
	};

	global.SimpleToolTip = SimpleToolTip;
})(this);