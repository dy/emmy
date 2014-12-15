(function(){function G(a){return s(a)||a&&!t(a)&&!a.nodeType&&("undefined"!=typeof window?a!=window:!0)&&!y(a)&&"number"===typeof a.length}function U(a){return(a+"").toLowerCase()}function H(a,b){if(I)return I.call(a,b);for(var c=a.parentNode.querySelectorAll(b),d=0;d<c.length;d++)if(c[d]==a)return!0;return!1}function l(a,b){var c=u.get(a);return b?c&&c[b]||[]:c||{}}function h(a,b,c,d){var e=a.on||a.addEventListener||a.addListener;c=d?h.wrap(c,d):c;if(e)if(J.freeze(a,"on"+b))e.call(a,b,c),J.a(a,"on"+
b);else return c;V.add(a,b,c,d);return c}function z(a,b,c,d){return W(a,b,z.wrap(a,b,c,d))}function A(a,b,c,d){return K(a,b,A.wrap(a,b,c,d))}function B(a,b,c,d){return L(a,b,B.wrap(a,b,c,d))}function g(a,b,c){var d=b[0],e=b[1],q=b[2],f=b[3];if(e&&e.constructor&&"Object"===e.constructor.name)for(var h in e)g(a,[d,h,e[h]]);else if(M(f)&&!M(q))g(a,[d,e,f,q].concat(r(b,4)));else if(G(q)&&!c)for(b=r(b,3),c=q.length;c--;)g(a,[d,e,q[c]].concat(b));else if(G(e))for(b=r(b,2),c=e.length;c--;)g(a,[d,e[c]].concat(b));
else if(X(d)||"undefined"!==typeof NodeList&&d instanceof NodeList)for(b=r(b,1),c=d.length;c--;)g(a,[d[c]].concat(b));else Y(e)?e.split(/\s+/).forEach(function(c){a.apply(this,[d,c].concat(r(b,2)))}):a.apply(this,b)}function n(a,b,c){if(void 0===c){var d=a.removeAll||a.removeAllListeners;d&&d.call(a,b,c);c=N(a);if(void 0===b)return O(n,[a,c]);if(c[b])return O(n,[a,b,c[b]])}else{if(d=a.off||a.removeEventListener||a.removeListener)if(P.freeze(a,"off"+b))d.call(a,b,c),P.a(a,"off"+b);else return;b=N(a,
b);for(a=0;a<b.length;a++)if(b[a]===c||b[a].fn===c){b.splice(a,1);break}}}function C(a,b,c,d){return Q(a,b,C.wrap(a,b,c,d))}function v(a,b,c){var d=a.once||a.one||a.addOnceEventListener||a.addOnceListener;if(d&&R.freeze(a,"one"+b))return c=d.call(a,b,c),R.a(a,"one"+b),c;c=v.wrap(a,b,c);Z(a,b,c);return c}function f(a){if(a){for(var b in m)a[b]=m[b];return a}}window.Emitter=f;var y,t,p,s,k,w,D;y=function(a){return!(!a||!a.apply)};"use strict";k=Element.prototype;var I=k.matches||k.matchesSelector||
k.webkitMatchesSelector||k.mozMatchesSelector||k.msMatchesSelector||k.b;t=function(a){return"string"===typeof a||a instanceof String};var u=new WeakMap;l.add=function(a,b,c){u.has(a)||u.set(a,{});a=u.get(a);(a[b]=a[b]||[]).push(c)};p={freeze:function(a,b){var c=x.get(a);if(c&&c[b])return!1;c||(c={},x.set(a,c));return c[b]=!0},a:function(a,b){var c=x.get(a);if(!c||!c[b])return!1;c[b]=null;return!0},isFrozen:function(a,b){var c=x.get(a);return c&&c[b]}};var x=new WeakMap;s=function(a){return a instanceof
Array};var E=document,aa=E.documentElement;k=function(a,b){if(a===E)return aa;if(!b||(b instanceof Node?a==b:H(a,b)))return a;for(;(a=a.parentNode)!==E;)if(!b||(b instanceof Node?a==b:H(a,b)))return a};w=w=function(a,b,c){var d=[],e=a.length;if(0===e)return d;b=0>b?Math.max(0,b+e):b||0;for(void 0!==c&&(e=0>c?c+e:c);e-- >b;)d[e-b]=a[e];return d};var J=p,V=l;h.wrap=function(a,b,c,d){function e(){if(d.apply(a,arguments))return c.apply(a,arguments)}e.fn=c;return e};var W=h;z.wrap=function(a,b,c,d){function e(){var a=
arguments,b=this;setTimeout(function(){c.apply(b,a)},d)}e.fn=c;return e};var S=w;D=function(a,b,c,d){var e,f=b;a.nodeType||a===ba||a===ca?(b instanceof Event?f=b:(f=document.createEvent("CustomEvent"),f.initCustomEvent(b,d,!0,c)),e=a.dispatchEvent):F&&a instanceof F?(f=F.Event(b,c),f.detail=c,e=d?targte.trigger:a.triggerHandler):e=a.emit||a.trigger||a.fire||a.dispatchEvent;if(e&&p.freeze(a,"emit"+b))e.call(a,f,c,d),p.a(a,"emit"+b);else{e=l(a,f);e=S(e);for(var f=S(arguments,2),g=0;g<e.length;g++)e[g]&&
e[g].apply(a,f)}};var F="undefined"===typeof jQuery?void 0:jQuery,ba="undefined"===typeof document?void 0:document,ca="undefined"===typeof window?void 0:window,K=h,T="undefined"!==typeof document?k:null;A.wrap=function(a,b,c,d){if(T)return K.wrap(a,b,c,function(a){var b=a.target;if(T(b,d))return a.delegateTarget=b,!0})};var da={"\u2325":18,alt:18,option:18,backspace:8,capslock:20,caps:20,clear:12,context:93,"\u2318":91,cmd:91,command:91,"\u2303":17,ctrl:17,control:17,del:46,"delete":46,down:40,end:35,
"\u2386":13,enter:13,"return":13,esc:27,escape:27,home:36,insert:45,left:37,pagedown:34,"pg-down":34,pageup:33,"pg-up":33,pause:19,right:39,"\u21e7":16,shift:16,space:32,tab:9,up:38,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,leftmouse:1,rightmouse:3,middlemouse:2,"*":106,"+":107,plus:107,"-":109,minus:109,";":186,semicolon:186,"=":187,equals:187,",":188,dash:189,".":190,"/":191,"`":192,"~":192,"[":219,"\\":220,"]":221,"'":222},L=h;B.wrap=function(a,b,c,
d){if(d)return d=s(d)?d:t(d)?d.split(/\s*,\s*/):[d],d=d.map(U),L.wrap(a,b,c,function(a){for(var b=void 0!==a.which?a.which:a.keyCode,c=d.length;c--;)if(a=d[c],b==a||da[a]==b)return!0})};var X=s,Y=t,M=y,r=w,P=p,N=l,O=g,Q=h;C.wrap=function(a,b,c,d){function e(){c.apply(a,arguments);n(a,b,e);setTimeout(function(){Q(a,b,e)},d)}e.fn=c;return e};var R=p,Z=h;v.wrap=function(a,b,c){function d(){n(a,b,d);c.apply(a,arguments)}d.fn=c;return d};var m=f.prototype;m.on=function(a,b){h(this,a,b);return this};m.once=
function(a,b){v(this,a,b);return this};m.off=function(a,b){n(this,a,b);return this};m.emit=function(a,b,c){D(this,a,b,c);return this};m.listeners=function(a){return l(this,a)};m.hasListeners=function(a){return!!l(this,a).length};f.on=function(){g(h,arguments);return f};f.once=function(){g(v,arguments);return f};f.off=function(){g(n,arguments);return f};f.emit=function(){g(D,arguments,!0);return f};f.delegate=function(){g(A,arguments);return f};f.later=function(){g(z,arguments);return f};f.keypass=
function(){g(B,arguments);return f};f.throttle=function(){g(C,arguments);return f};f.listeners=l;f.hasListeners=function(a,b){return!!l(a,b).length}})();
