function e(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function t(e,t){e.prototype=Object.create(t.prototype);e.prototype.constructor=e;e.__proto__=t}import o from"./Controller";import i from"../dom/dom";import n from"../color/Color";import _ from"../color/interpret";import d from"../utils/common";var r=function(o){t(r,o);function r(t,r){var f;f=o.call(this,t,r)||this;f.__color=new n(f.getValue());f.__temp=new n(0);var a=e(f);f.domElement=document.createElement("div");i.makeSelectable(f.domElement,false);f.__selector=document.createElement("div");f.__selector.className="selector";f.__saturation_field=document.createElement("div");f.__saturation_field.className="saturation-field";f.__field_knob=document.createElement("div");f.__field_knob.className="field-knob";f.__field_knob_border="2px solid ";f.__hue_knob=document.createElement("div");f.__hue_knob.className="hue-knob";f.__hue_field=document.createElement("div");f.__hue_field.className="hue-field";f.__input=document.createElement("input");f.__input.type="text";f.__input_textShadow="0 1px 1px ";i.bind(f.__input,"keydown",function(e){if(e.keyCode===13){m.call(this)}});i.bind(f.__input,"blur",m);i.bind(f.__selector,"mousedown",function(){i.addClass(this,"drag").bind(window,"mouseup",function(){i.removeClass(a.__selector,"drag")})});i.bind(f.__selector,"touchstart",function(){i.addClass(this,"drag").bind(window,"touchend",function(){i.removeClass(a.__selector,"drag")})});var u=document.createElement("div");d.extend(f.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"});d.extend(f.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:f.__field_knob_border+(f.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1});d.extend(f.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1});d.extend(f.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"});d.extend(u.style,{width:"100%",height:"100%",background:"none"});l(u,"top","rgba(0,0,0,0)","#000");d.extend(f.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"});s(f.__hue_field);d.extend(f.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:f.__input_textShadow+"rgba(0,0,0,0.7)"});i.bind(f.__saturation_field,"mousedown",c);i.bind(f.__saturation_field,"touchstart",c);i.bind(f.__field_knob,"mousedown",c);i.bind(f.__field_knob,"touchstart",c);i.bind(f.__hue_field,"mousedown",h);i.bind(f.__hue_field,"touchstart",h);function c(e){g(e);i.bind(window,"mousemove",g);i.bind(window,"touchmove",g);i.bind(window,"mouseup",p);i.bind(window,"touchend",p)}function h(e){w(e);i.bind(window,"mousemove",w);i.bind(window,"touchmove",w);i.bind(window,"mouseup",b);i.bind(window,"touchend",b)}function p(){i.unbind(window,"mousemove",g);i.unbind(window,"touchmove",g);i.unbind(window,"mouseup",p);i.unbind(window,"touchend",p);x()}function b(){i.unbind(window,"mousemove",w);i.unbind(window,"touchmove",w);i.unbind(window,"mouseup",b);i.unbind(window,"touchend",b);x()}function m(){var e=_(this.value);if(e!==false){a.__color.__state=e;a.setValue(a.__color.toOriginal())}else{this.value=a.__color.toString()}}function x(){if(a.__onFinishChange){a.__onFinishChange.call(a,a.__color.toOriginal())}}f.__saturation_field.appendChild(u);f.__selector.appendChild(f.__field_knob);f.__selector.appendChild(f.__saturation_field);f.__selector.appendChild(f.__hue_field);f.__hue_field.appendChild(f.__hue_knob);f.domElement.appendChild(f.__input);f.domElement.appendChild(f.__selector);f.updateDisplay();function g(e){if(e.type.indexOf("touch")===-1){e.preventDefault()}var t=a.__saturation_field.getBoundingClientRect();var o=e.touches&&e.touches[0]||e,i=o.clientX,n=o.clientY;var _=(i-t.left)/(t.right-t.left);var d=1-(n-t.top)/(t.bottom-t.top);if(d>1){d=1}else if(d<0){d=0}if(_>1){_=1}else if(_<0){_=0}a.__color.v=d;a.__color.s=_;a.setValue(a.__color.toOriginal());return false}function w(e){if(e.type.indexOf("touch")===-1){e.preventDefault()}var t=a.__hue_field.getBoundingClientRect();var o=e.touches&&e.touches[0]||e,i=o.clientY;var n=1-(i-t.top)/(t.bottom-t.top);if(n>1){n=1}else if(n<0){n=0}a.__color.h=n*360;a.setValue(a.__color.toOriginal());return false}return f}var f=r.prototype;f.updateDisplay=function e(){var t=_(this.getValue());if(t!==false){var o=false;d.each(n.COMPONENTS,function(e){if(!d.isUndefined(t[e])&&!d.isUndefined(this.__color.__state[e])&&t[e]!==this.__color.__state[e]){o=true;return{}}},this);if(o){d.extend(this.__color.__state,t)}}d.extend(this.__temp.__state,this.__color.__state);this.__temp.a=1;var i=this.__color.v<.5||this.__color.s>.5?255:0;var r=255-i;d.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+i+","+i+","+i+")"});this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px";this.__temp.s=1;this.__temp.v=1;l(this.__saturation_field,"left","#fff",this.__temp.toHexString());this.__input.value=this.__color.toString();d.extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+i+","+i+","+i+")",textShadow:this.__input_textShadow+"rgba("+r+","+r+","+r+",.7)"})};return r}(o);var f=["-moz-","-o-","-webkit-","-ms-",""];function l(e,t,o,i){e.style.background="";d.each(f,function(n){e.style.cssText+="background: "+n+"linear-gradient("+t+", "+o+" 0%, "+i+" 100%); "})}function s(e){e.style.background="";e.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";e.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";e.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";e.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";e.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}export default r;