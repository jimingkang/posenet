var t=-1;var e=4/3;var n=3;var i=n+1;var o;easyrtc.dontAddCloseButtons(true);function r(t){return"box"+t}function l(t,e){return{left:0,top:0,width:t,height:e}}function s(t,e){return{left:t/4,top:e/4,width:t/2,height:e/4}}function u(t,e){return{width:t-40}}var a=20;function c(t,n){var i,o,r,l;var s=20;if(t<n*e){r=t-s;l=r/e}else{l=n-s;r=l*e}i=(t-r)/2;o=(n-l)/2;return{left:i,top:o,width:r,height:l}}function f(t,n,i,o,r,l){var s,u;if(o<r*e){s=o*t;u=s/l}else{u=r*t;s=u*l}var a;if(n<0){a=o-s}else{a=0}a+=Math.floor(n*o);var c=0;if(i<0){c=r-u}else{c=0}c+=Math.floor(i*r);return{left:a,top:c,width:s,height:u}}function d(t,n,i,o,r){return f(t,n,i,o,r,e)}function y(t,e,n,i,o,r,l){return f(t,e,n,i,o,r/l)}var h=1;var p=1;function m(t,e){if(o=="p"){return{left:(t-h)/2,top:(e-p*2)/3,width:h,height:p}}else{return{left:(t-h*2)/3,top:(e-p)/2,width:h,height:p}}}function g(t,e){if(o=="p"){return{left:(t-h)/2,top:(e-p*2)/3*2+p,width:h,height:p}}else{return{left:(t-h*2)/3*2+h,top:(e-p)/2,width:h,height:p}}}function v(t,e){if(o=="p"){return{left:(t-h)/2,top:(e-p*3)/4,width:h,height:p}}else{return{left:(t-h*2)/3,top:(e-p*2)/3,width:h,height:p}}}function x(t,e){if(o=="p"){return{left:(t-h)/2,top:(e-p*3)/4*2+p,width:h,height:p}}else{return{left:(t-h*2)/3*2+h,top:(e-p*2)/3,width:h,height:p}}}function B(t,e){if(o=="p"){return{left:(t-h)/2,top:(e-p*3)/4*3+p*2,width:h,height:p}}else{return{left:(t-h*2)/3*1.5+h/2,top:(e-p*2)/3*2+p,width:h,height:p}}}function w(t,e){return{left:(t-h*2)/3,top:(e-p*2)/3,width:h,height:p}}function I(t,e){return{left:(t-h*2)/3*2+h,top:(e-p*2)/3,width:h,height:p}}function E(t,e){return{left:(t-h*2)/3,top:(e-p*2)/3*2+p,width:h,height:p}}function b(t,e){return{left:(t-h*2)/3*2+h,top:(e-p*2)/3*2+p,width:h,height:p}}var C=[true,false,false,false];var k=0;function M(t,n){o=t/e<n?"p":"l";var i,r;function l(t,e){return(t-a*(e+1))/e}switch(o+(k+1)){case"p1":case"l1":i=l(t,1);r=l(n,1);break;case"l2":i=l(t,2);r=l(n,1);break;case"p2":i=l(t,1);r=l(n,2);break;case"p4":case"l4":case"l3":i=l(t,2);r=l(n,2);break;case"p3":i=l(t,1);r=l(n,3);break}h=Math.min(i,r*e);p=Math.min(r,i/e)}var T=[function(e,n){if(t>0){return d(.2,.01,.01,e,n)}else{M(e,n);switch(k){case 0:return c(e,n);case 1:return m(e,n);case 2:return v(e,n);case 3:return w(e,n)}}},function(e,n){if(t>=0||!C[1]){return d(.2,.01,-.01,e,n)}else{switch(k){case 1:return g(e,n);case 2:return x(e,n);case 3:return I(e,n)}}},function(e,n){if(t>=0||!C[2]){return d(.2,-.01,.01,e,n)}else{switch(k){case 1:return g(e,n);case 2:if(!C[1]){return x(e,n)}else{return B(e,n)}case 3:return E(e,n)}}},function(e,n){if(t>=0||!C[3]){return d(.2,-.01,-.01,e,n)}else{switch(k){case 1:return g(e,n);case 2:return B(e,n);case 3:return b(e,n)}}}];function N(t,e){var n=128;var i=128;if(t<e){return y(.1,-.51,-.01,t,e,n,i)}else{return y(.1,-.01,-.51,t,e,n,i)}}function L(t,e){var n=32;var i=32;if(t<e){return y(.1,-.51,.01,t,e,n,i)}else{return y(.1,.01,-.51,t,e,n,i)}}function O(t,e){var n=32;var i=32;if(t<e){return y(.1,.51,.01,t,e,n,i)}else{return y(.1,.01,.51,t,e,n,i)}}function z(){var t=document.getElementById("fullpage");t.style.width=window.innerWidth+"px";t.style.height=window.innerHeight+"px";k=easyrtc.getConnectionCount();function e(t,n,i){var o=t.reshapeMe(n,i);if(typeof o.left!=="undefined"){t.style.left=Math.round(o.left)+"px"}if(typeof o.top!=="undefined"){t.style.top=Math.round(o.top)+"px"}if(typeof o.width!=="undefined"){t.style.width=Math.round(o.width)+"px"}if(typeof o.height!=="undefined"){t.style.height=Math.round(o.height)+"px"}var r=t.childNodes.length;for(var l=0;l<r;l++){var s=t.childNodes[l];if(s.reshapeMe){e(s,o.width,o.height)}}}e(t,window.innerWidth,window.innerHeight)}function F(t,e){var n=document.getElementById(t);if(!n){alert("Attempt to apply to reshapeFn to non-existent element "+t)}if(!e){alert("Attempt to apply misnamed reshapeFn to element "+t)}n.reshapeMe=e}function H(){if(t>=0){var e=r(t);document.getElementById(e).style.zIndex=2;F(e,T[t]);document.getElementById("muteButton").style.display="none";document.getElementById("killButton").style.display="none";t=-1}}function A(){H();t=-1;W(false);z()}function W(e){var n=document.getElementById("muteButton");if(t>0){n.style.display="block";var i=document.getElementById(r(t));var o=i.muted?true:false;if(e){o=!o;i.muted=o}n.src=o?"images/button_unmute.png":"images/button_mute.png"}else{n.style.display="none"}}function P(e){var n=t;if(t>=0){H()}if(n!=e){var i=r(e);t=e;F(i,c);document.getElementById(i).style.zIndex=1;if(e>0){document.getElementById("muteButton").style.display="block";W();document.getElementById("killButton").style.display="block"}}W(false);z()}function R(t){var e=r(t);F(e,T[t]);document.getElementById(e).onclick=function(){P(t)}}function S(){if(t>0){var e=easyrtc.getIthCaller(t-1);A();setTimeout(function(){easyrtc.hangup(e)},400)}}function _(){W(true)}function D(t,e){easyrtc.setRoomOccupantListener(null);var i=[];var o=0;for(var r in e){i.push(r)}function l(t){function e(){o++;if(o<n&&t>0){l(t-1)}}function r(e,i){easyrtc.showError(e,i);if(o<n&&t>0){l(t-1)}}easyrtc.call(i[t],e,r)}if(i.length>0){l(i.length-1)}}function j(){P(0)}function q(){document.getElementById("textentryBox").style.display="none";document.getElementById("textEntryButton").style.display="block"}function G(t){document.getElementById("textentryBox").style.display="none";document.getElementById("textEntryButton").style.display="block";var e=document.getElementById("textentryField").value;if(e&&e!=""){for(var i=0;i<n;i++){var o=easyrtc.getIthCaller(i);if(o&&o!=""){easyrtc.sendPeerMessage(o,"im",e)}}}return false}function J(){document.getElementById("textentryField").value="";document.getElementById("textentryBox").style.display="block";document.getElementById("textEntryButton").style.display="none";document.getElementById("textentryField").focus()}function K(t,e,n){var i=document.getElementById("fullpage");var o=parseInt(i.offsetWidth);var r=parseInt(i.offsetHeight);var l=.2*t+.8*o/2;var s=.2*e+.8*r/2;var u=document.createElement("img");u.src="images/cloud.png";u.style.width="1px";u.style.height="1px";u.style.left=t+"px";u.style.top=e+"px";i.appendChild(u);u.onload=function(){u.style.left=t+"px";u.style.top=e+"px";u.style.width="4px";u.style.height="4px";u.style.opacity=.7;u.style.zIndex=5;u.className="transit boxCommon";var a;function c(){if(a){i.removeChild(a);i.removeChild(u)}}setTimeout(function(){u.style.left=l-o/4+"px";u.style.top=s-r/4+"px";u.style.width=o/2+"px";u.style.height=r/2+"px"},10);setTimeout(function(){a=document.createElement("div");a.className="boxCommon";a.style.left=Math.floor(l-o/8)+"px";a.style.top=Math.floor(s)+"px";a.style.fontSize="36pt";a.style.width=o*.4+"px";a.style.height=r*.4+"px";a.style.zIndex=6;a.appendChild(document.createTextNode(n));i.appendChild(a);a.onclick=c;u.onclick=c},1e3);setTimeout(function(){u.style.left=t+"px";u.style.top=e+"px";u.style.width="4px";u.style.height="4px";i.removeChild(a)},9e3);setTimeout(function(){i.removeChild(u)},1e4)}}function Q(t,e,i){for(var o=0;o<n;o++){if(easyrtc.getIthCaller(o)==t){var l=document.getElementById(r(o+1));var s=parseInt(l.offsetLeft)+parseInt(l.offsetWidth)/2;var u=parseInt(l.offsetTop)+parseInt(l.offsetHeight)/2;K(s,u,i)}}}function U(){F("fullpage",l);for(var e=0;e<i;e++){R(e)}F("killButton",N);F("muteButton",L);F("textentryBox",s);F("textentryField",u);F("textEntryButton",O);W(false);window.onresize=z;z();easyrtc.setRoomOccupantListener(D);easyrtc.easyApp("easyrtc.multiparty","box0",["box1","box2","box3"],j);easyrtc.setPeerListener(Q);easyrtc.setDisconnectListener(function(){easyrtc.showError("LOST-CONNECTION","Lost connection to signaling server")});var n=document.getElementById("box0");var o=document.getElementById("canvas0");easyrtc.setOnCall(function(e,n){console.log("getConnection count="+easyrtc.getConnectionCount());C[n+1]=true;if(t==0){A();document.getElementById("textEntryButton").style.display="block"}document.getElementById(r(n+1)).style.visibility="visible";z()});easyrtc.setOnHangup(function(e,n){C[n+1]=false;if(t>0&&n+1==t){A()}setTimeout(function(){document.getElementById(r(n+1)).style.visibility="hidden";if(easyrtc.getConnectionCount()==0){P(0);document.getElementById("textEntryButton").style.display="none";document.getElementById("textentryBox").style.display="none"}z()},20)})}