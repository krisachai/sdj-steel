--Do not remove this if you are using--
Original Author: Remiz Rahnas
Original Author URL: http://www.htmlremix.com
Published date: 2008/09/24

Changes by Nick Fetchak:
- IE8 standards mode compatibility
- VML elements now positioned behind original box rather than inside of it - should be less prone to breakage
Published date : 2009/11/18


<public:attach event="oncontentready" onevent="oncontentready('v08vnSVo78t4JfjH')" />
<script type="text/javascript">

// findPos() borrowed from http://www.quirksmode.org/js/findpos.html
function findPos(obj) {
	var curleft = curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}

	return({
		'x': curleft,
		'y': curtop
	});
}

function oncontentready(classID) {
  if (this.className.match(classID)) { return(false); }

	if (!document.namespaces.v) { document.namespaces.add("v", "urn:schemas-microsoft-com:vml"); }

	this.className = this.className.concat(' ', classID);
	var arcSize = Math.min(parseInt(this.currentStyle['-moz-border-radius'] ||
	                                this.currentStyle['-webkit-border-radius'] ||
	                                this.currentStyle['border-radius'] ||
	                                this.currentStyle['-khtml-border-radius']) /
	                       Math.min(this.offsetWidth, this.offsetHeight), 1);
	var fillColor = this.currentStyle.backgroundColor;
	var fillSrc = this.currentStyle.backgroundImage.replace(/^url\("(.+)"\)$/, '$1');
	var strokeColor = this.currentStyle.borderColor;
	var strokeWeight = parseInt(this.currentStyle.borderWidth);
	var stroked = 'true';
	if (isNaN(strokeWeight)) {
		strokeWeight = 0;
		strokeColor = fillColor;
		stroked = 'false';
	}

	this.style.background = 'transparent';
	this.style.borderColor = 'transparent';

	// Find which element provides position:relative for the target element (default to BODY)
	var el = this;
	var limit = 100, i = 0;
	while ((typeof(el) != 'unknown') && (el.currentStyle.position != 'relative') && (el.tagName != 'BODY')) {
		el = el.parentElement;
		i++;
		if (i >= limit) { return(false); }
	}
	var el_zindex = parseInt(el.currentStyle.zIndex);
	if (isNaN(el_zindex)) { el_zindex = 0; }
	//alert('got tag '+ el.tagName +' with pos '+ el.currentStyle.position);

	var rect_size = {
		'width': this.offsetWidth - strokeWeight,
		'height': this.offsetHeight - strokeWeight
	};
	var el_pos = findPos(el);
	var this_pos = findPos(this);
	this_pos.y = this_pos.y + (0.5 * strokeWeight) - el_pos.y;
	this_pos.x = this_pos.x + (0.5 * strokeWeight) - el_pos.x;

	var rect = document.createElement('v:roundrect');
	rect.arcsize = arcSize +'px';
	rect.strokecolor = strokeColor;
	rect.strokeWeight = strokeWeight +'px';
	rect.stroked = stroked;
	rect.style.display = 'block';
	rect.style.position = 'absolute';
	rect.style.top = this_pos.y +'px';
	rect.style.left = this_pos.x +'px';
	rect.style.width = rect_size.width +'px';
	rect.style.height = rect_size.height +'px';
	rect.style.antialias = true;
	rect.style.zIndex = el_zindex - 1;

	var fill = document.createElement('v:fill');
	fill.color = fillColor;
	fill.src = fillSrc;
	fill.type = 'tile';

	rect.appendChild(fill);
	el.appendChild(rect);

	var css = el.document.createStyleSheet();
	css.addRule("v\\:roundrect", "behavior: url(#default#VML)");
	css.addRule("v\\:fill", "behavior: url(#default#VML)");

	isIE6 = /msie|MSIE 6/.test(navigator.userAgent);
	// IE6 doesn't support transparent borders, use padding to offset original element
	if (isIE6 && (strokeWeight > 0)) {
		this.style.borderStyle = 'none';
		this.style.paddingTop = parseInt(this.currentStyle.paddingTop || 0) + strokeWeight;
		this.style.paddingBottom = parseInt(this.currentStyle.paddingBottom || 0) + strokeWeight;
	}

	if (typeof(window.rounded_elements) == 'undefined') {
		window.rounded_elements = new Array();

		if (typeof(window.onresize) == 'function') { window.previous_onresize = window.onresize; }
		window.onresize = window_resize;
	}
	this.element.vml = rect;
	window.rounded_elements.push(this.element);
}

function window_resize() {
	if (typeof(window.rounded_elements) == 'undefined') { return(false); }

	for (var i in window.rounded_elements) {
		var el = window.rounded_elements[i];

		var strokeWeight = parseInt(el.currentStyle.borderWidth);
		if (isNaN(strokeWeight)) { strokeWeight = 0; }

		var parent_pos = findPos(el.vml.parentNode);
		var pos = findPos(el);
		pos.y = pos.y + (0.5 * strokeWeight) - parent_pos.y;
		pos.x = pos.x + (0.5 * strokeWeight) - parent_pos.x;

		el.vml.style.top = pos.y +'px';
		el.vml.style.left = pos.x +'px';
	}

	if (typeof(window.previous_onresize) == 'function') { window.previous_onresize(); }
}
</script>
