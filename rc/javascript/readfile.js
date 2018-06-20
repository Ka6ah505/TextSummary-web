var text = document.getElementById('text');
var menu = document.getElementById('menu');

window.onload = window.onresize = function () {
	var padding = 10; // ??????
	var menuHeight = parseInt(menu.offsetHeight);
	
	text.style.padding = padding + 'px';
	text.style.width = window.innerWidth - padding*2 + 'px';
	text.style.height = window.innerHeight - menuHeight - padding*2 + 'px';
};

var openFile = function() {
	var input = document.createElement('input');
	input.type = 'file';
	
	input.onchange = function() {
		var fr = new FileReader();
		
		fr.onload = function(info) {
			text.innerHTML = info.target.result.toString().replace(/\n/g, '<br>').replace(/ /g, '&nbsp; ');
		};
		
		fr.readAsText(this.files[0]);
		console.log(this.files[0].name);
	};
	
	input.click();
};

var loadURL = function(url) {
	var oRequest = new XMLHttpRequest();
	oRequest.open('GET', url, false);
	oRequest.setRequestHeader("User-Agent", navigator.userAgent);
	oRequest.send(null);
	
	return oRequest.responseText;
}
