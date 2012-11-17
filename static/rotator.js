/*
	A small tool for rotating objects.
	Author: Hakan Akkan,  hkn at hakanakkan dot com
*/



function ROT(interval,doc){
	this.doc = doc || document;
	this.interval = interval || 10; // amount that we will be using in setInterval()
	this.objs = [];
	this.rotating = false;
}

var search = ['transform', 'MozTransform', 'webkitTransform', 'OTransform'];
var tempdiv = document.createElement('div');
for(var s in search) {
	var prop = search[s];
	if(tempdiv.style[prop] !== undefined) {
		ROT.prototype.rotateCW = function(obj, degree) {
			obj.style[prop] = 'rotate(' + (obj.ROT_deg = ((obj.ROT_deg + degree) % 360)) + 'deg)';
		}
		break;
	}
}
if(ROT.prototype.rotateCW === undefined)
	throw "I am afraid you are using an unsupported (pretty old) browser for the animation to work...";


/**
* DPS: Degrees per step
*/
ROT.prototype.add = function(obj,DPS,initDegree){
	if(!DPS) throw "Invalid DPS value!";
	
	var objtoadd = undefined;
	if(typeof obj == "string")
		objtoadd = this.doc.getElementById(obj);
	else if(obj instanceof HTMLElement)
		objtoadd = obj;
	else throw "Input object is not an HTML element";

	objtoadd.ROT_DPS = DPS;
	objtoadd.ROT_deg = 0;
	if(initDegree) this.rotateCW(objtoadd, initDegree);
	
	this.objs.push(objtoadd);
	return this;
}

ROT.prototype.isRotating = function(){
	return this.rotating;
}

ROT.prototype.remove = function(){
	return this;
}

ROT.prototype.step = function(){
	var o;
	for(var obj in this.objs){
		o = this.objs[obj];
		this.rotateCW(o, o.ROT_DPS);
	}
}

ROT.prototype.start = function(){
	if(this.objs.length == 0) throw "No objects added for rotation";
	if(this.isRotating()) return this;
	this.rotating = true;
	var me = this;
	this.intervalID = setInterval(function(){
		me.step();
	}, this.interval);	
	return this;
}

ROT.prototype.stop = function(){
	if(!this.isRotating()) return this;
	this.rotating = false;
	if(this.intervalID != undefined) clearInterval(this.intervalID);
	return this;
}
