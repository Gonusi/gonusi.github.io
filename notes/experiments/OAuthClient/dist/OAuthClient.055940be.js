parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QVnC":[function(require,module,exports) {
var define;
var t,r=function(t){"use strict";var r,e=Object.prototype,n=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{u({},"")}catch(P){u=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var o=r&&r.prototype instanceof d?r:d,i=Object.create(o.prototype),a=new G(n||[]);return i._invoke=function(t,r,e){var n=l;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw i;return F()}for(e.method=o,e.arg=i;;){var a=e.delegate;if(a){var c=j(a,e);if(c){if(c===v)continue;return c}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(n===l)throw n=y,e.arg;e.dispatchException(e.arg)}else"return"===e.method&&e.abrupt("return",e.arg);n=p;var u=f(t,r,e);if("normal"===u.type){if(n=e.done?y:s,u.arg===v)continue;return{value:u.arg,done:e.done}}"throw"===u.type&&(n=y,e.method="throw",e.arg=u.arg)}}}(t,e,a),i}function f(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(P){return{type:"throw",arg:P}}}t.wrap=h;var l="suspendedStart",s="suspendedYield",p="executing",y="completed",v={};function d(){}function g(){}function m(){}var w={};w[i]=function(){return this};var L=Object.getPrototypeOf,x=L&&L(L(N([])));x&&x!==e&&n.call(x,i)&&(w=x);var b=m.prototype=d.prototype=Object.create(w);function E(t){["next","throw","return"].forEach(function(r){u(t,r,function(t){return this._invoke(r,t)})})}function _(t,r){var e;this._invoke=function(o,i){function a(){return new r(function(e,a){!function e(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var h=u.arg,l=h.value;return l&&"object"==typeof l&&n.call(l,"__await")?r.resolve(l.__await).then(function(t){e("next",t,a,c)},function(t){e("throw",t,a,c)}):r.resolve(l).then(function(t){h.value=t,a(h)},function(t){return e("throw",t,a,c)})}c(u.arg)}(o,i,e,a)})}return e=e?e.then(a,a):a()}}function j(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=r,j(t,e),"throw"===e.method))return v;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var o=f(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,v;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,v):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,v)}function O(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function k(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function G(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function N(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function e(){for(;++o<t.length;)if(n.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=r,e.done=!0,e};return a.next=a}}return{next:F}}function F(){return{value:r,done:!0}}return g.prototype=b.constructor=m,m.constructor=g,g.displayName=u(m,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===g||"GeneratorFunction"===(r.displayName||r.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,u(t,c,"GeneratorFunction")),t.prototype=Object.create(b),t},t.awrap=function(t){return{__await:t}},E(_.prototype),_.prototype[a]=function(){return this},t.AsyncIterator=_,t.async=function(r,e,n,o,i){void 0===i&&(i=Promise);var a=new _(h(r,e,n,o),i);return t.isGeneratorFunction(e)?a:a.next().then(function(t){return t.done?t.value:a.next()})},E(b),u(b,c,"Generator"),b[i]=function(){return this},b.toString=function(){return"[object Generator]"},t.keys=function(t){var r=[];for(var e in t)r.push(e);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=N,G.prototype={constructor:G,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(k),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function o(n,o){return c.type="throw",c.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),h=n.call(a,"finallyLoc");if(u&&h){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!h)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),v},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),k(e),v}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;k(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),v}},t}("object"==typeof module?module.exports:{});try{regeneratorRuntime=r}catch(e){Function("r","regeneratorRuntime = r")(r)}
},{}],"EDTP":[function(require,module,exports) {
"use strict";module.exports=function(r,n){return function(){for(var t=new Array(arguments.length),e=0;e<t.length;e++)t[e]=arguments[e];return r.apply(n,t)}};
},{}],"S1cf":[function(require,module,exports) {
"use strict";var r=require("./helpers/bind"),t=Object.prototype.toString;function n(r){return"[object Array]"===t.call(r)}function e(r){return void 0===r}function o(r){return null!==r&&!e(r)&&null!==r.constructor&&!e(r.constructor)&&"function"==typeof r.constructor.isBuffer&&r.constructor.isBuffer(r)}function i(r){return"[object ArrayBuffer]"===t.call(r)}function u(r){return"undefined"!=typeof FormData&&r instanceof FormData}function c(r){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(r):r&&r.buffer&&r.buffer instanceof ArrayBuffer}function f(r){return"string"==typeof r}function a(r){return"number"==typeof r}function l(r){return null!==r&&"object"==typeof r}function s(r){if("[object Object]"!==t.call(r))return!1;var n=Object.getPrototypeOf(r);return null===n||n===Object.prototype}function p(r){return"[object Date]"===t.call(r)}function d(r){return"[object File]"===t.call(r)}function y(r){return"[object Blob]"===t.call(r)}function b(r){return"[object Function]"===t.call(r)}function j(r){return l(r)&&b(r.pipe)}function v(r){return"undefined"!=typeof URLSearchParams&&r instanceof URLSearchParams}function B(r){return r.replace(/^\s*/,"").replace(/\s*$/,"")}function m(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)}function g(r,t){if(null!=r)if("object"!=typeof r&&(r=[r]),n(r))for(var e=0,o=r.length;e<o;e++)t.call(null,r[e],e,r);else for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&t.call(null,r[i],i,r)}function A(){var r={};function t(t,e){s(r[e])&&s(t)?r[e]=A(r[e],t):s(t)?r[e]=A({},t):n(t)?r[e]=t.slice():r[e]=t}for(var e=0,o=arguments.length;e<o;e++)g(arguments[e],t);return r}function O(t,n,e){return g(n,function(n,o){t[o]=e&&"function"==typeof n?r(n,e):n}),t}function h(r){return 65279===r.charCodeAt(0)&&(r=r.slice(1)),r}module.exports={isArray:n,isArrayBuffer:i,isBuffer:o,isFormData:u,isArrayBufferView:c,isString:f,isNumber:a,isObject:l,isPlainObject:s,isUndefined:e,isDate:p,isFile:d,isBlob:y,isFunction:b,isStream:j,isURLSearchParams:v,isStandardBrowserEnv:m,forEach:g,merge:A,extend:O,trim:B,stripBOM:h};
},{"./helpers/bind":"EDTP"}],"H6Qo":[function(require,module,exports) {
"use strict";var e=require("./../utils");function r(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}module.exports=function(i,n,t){if(!n)return i;var a;if(t)a=t(n);else if(e.isURLSearchParams(n))a=n.toString();else{var c=[];e.forEach(n,function(i,n){null!=i&&(e.isArray(i)?n+="[]":i=[i],e.forEach(i,function(i){e.isDate(i)?i=i.toISOString():e.isObject(i)&&(i=JSON.stringify(i)),c.push(r(n)+"="+r(i))}))}),a=c.join("&")}if(a){var o=i.indexOf("#");-1!==o&&(i=i.slice(0,o)),i+=(-1===i.indexOf("?")?"?":"&")+a}return i};
},{"./../utils":"S1cf"}],"rj2i":[function(require,module,exports) {
"use strict";var t=require("./../utils");function e(){this.handlers=[]}e.prototype.use=function(t,e){return this.handlers.push({fulfilled:t,rejected:e}),this.handlers.length-1},e.prototype.eject=function(t){this.handlers[t]&&(this.handlers[t]=null)},e.prototype.forEach=function(e){t.forEach(this.handlers,function(t){null!==t&&e(t)})},module.exports=e;
},{"./../utils":"S1cf"}],"woEt":[function(require,module,exports) {
"use strict";var r=require("./../utils");module.exports=function(t,u,e){return r.forEach(e,function(r){t=r(t,u)}),t};
},{"./../utils":"S1cf"}],"V30M":[function(require,module,exports) {
"use strict";module.exports=function(t){return!(!t||!t.__CANCEL__)};
},{}],"M8l6":[function(require,module,exports) {
"use strict";var e=require("../utils");module.exports=function(t,r){e.forEach(t,function(e,o){o!==r&&o.toUpperCase()===r.toUpperCase()&&(t[r]=e,delete t[o])})};
},{"../utils":"S1cf"}],"YdsM":[function(require,module,exports) {
"use strict";module.exports=function(e,i,s,t,n){return e.config=i,s&&(e.code=s),e.request=t,e.response=n,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e};
},{}],"bIiH":[function(require,module,exports) {
"use strict";var r=require("./enhanceError");module.exports=function(e,n,o,t,u){var a=new Error(e);return r(a,n,o,t,u)};
},{"./enhanceError":"YdsM"}],"aS8y":[function(require,module,exports) {
"use strict";var t=require("./createError");module.exports=function(e,s,u){var a=u.config.validateStatus;u.status&&a&&!a(u.status)?s(t("Request failed with status code "+u.status,u.config,null,u.request,u)):e(u)};
},{"./createError":"bIiH"}],"dn2M":[function(require,module,exports) {
"use strict";var e=require("./../utils");module.exports=e.isStandardBrowserEnv()?{write:function(n,t,o,r,i,u){var s=[];s.push(n+"="+encodeURIComponent(t)),e.isNumber(o)&&s.push("expires="+new Date(o).toGMTString()),e.isString(r)&&s.push("path="+r),e.isString(i)&&s.push("domain="+i),!0===u&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var n=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return n?decodeURIComponent(n[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}};
},{"./../utils":"S1cf"}],"YZjV":[function(require,module,exports) {
"use strict";module.exports=function(t){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(t)};
},{}],"a2Uu":[function(require,module,exports) {
"use strict";module.exports=function(e,r){return r?e.replace(/\/+$/,"")+"/"+r.replace(/^\/+/,""):e};
},{}],"KxkP":[function(require,module,exports) {
"use strict";var e=require("../helpers/isAbsoluteURL"),r=require("../helpers/combineURLs");module.exports=function(s,u){return s&&!e(u)?r(s,u):u};
},{"../helpers/isAbsoluteURL":"YZjV","../helpers/combineURLs":"a2Uu"}],"ZeD7":[function(require,module,exports) {
"use strict";var e=require("./../utils"),t=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];module.exports=function(r){var i,o,n,s={};return r?(e.forEach(r.split("\n"),function(r){if(n=r.indexOf(":"),i=e.trim(r.substr(0,n)).toLowerCase(),o=e.trim(r.substr(n+1)),i){if(s[i]&&t.indexOf(i)>=0)return;s[i]="set-cookie"===i?(s[i]?s[i]:[]).concat([o]):s[i]?s[i]+", "+o:o}}),s):s};
},{"./../utils":"S1cf"}],"w7LF":[function(require,module,exports) {
"use strict";var t=require("./../utils");module.exports=t.isStandardBrowserEnv()?function(){var r,e=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");function a(t){var r=t;return e&&(o.setAttribute("href",r),r=o.href),o.setAttribute("href",r),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}return r=a(window.location.href),function(e){var o=t.isString(e)?a(e):e;return o.protocol===r.protocol&&o.host===r.host}}():function(){return!0};
},{"./../utils":"S1cf"}],"KRuG":[function(require,module,exports) {
"use strict";var e=require("./../utils"),r=require("./../core/settle"),t=require("./../helpers/cookies"),s=require("./../helpers/buildURL"),o=require("../core/buildFullPath"),n=require("./../helpers/parseHeaders"),a=require("./../helpers/isURLSameOrigin"),i=require("../core/createError");module.exports=function(u){return new Promise(function(l,d){var p=u.data,c=u.headers;e.isFormData(p)&&delete c["Content-Type"];var f=new XMLHttpRequest;if(u.auth){var h=u.auth.username||"",m=u.auth.password?unescape(encodeURIComponent(u.auth.password)):"";c.Authorization="Basic "+btoa(h+":"+m)}var w=o(u.baseURL,u.url);if(f.open(u.method.toUpperCase(),s(w,u.params,u.paramsSerializer),!0),f.timeout=u.timeout,f.onreadystatechange=function(){if(f&&4===f.readyState&&(0!==f.status||f.responseURL&&0===f.responseURL.indexOf("file:"))){var e="getAllResponseHeaders"in f?n(f.getAllResponseHeaders()):null,t={data:u.responseType&&"text"!==u.responseType?f.response:f.responseText,status:f.status,statusText:f.statusText,headers:e,config:u,request:f};r(l,d,t),f=null}},f.onabort=function(){f&&(d(i("Request aborted",u,"ECONNABORTED",f)),f=null)},f.onerror=function(){d(i("Network Error",u,null,f)),f=null},f.ontimeout=function(){var e="timeout of "+u.timeout+"ms exceeded";u.timeoutErrorMessage&&(e=u.timeoutErrorMessage),d(i(e,u,"ECONNABORTED",f)),f=null},e.isStandardBrowserEnv()){var R=(u.withCredentials||a(w))&&u.xsrfCookieName?t.read(u.xsrfCookieName):void 0;R&&(c[u.xsrfHeaderName]=R)}if("setRequestHeader"in f&&e.forEach(c,function(e,r){void 0===p&&"content-type"===r.toLowerCase()?delete c[r]:f.setRequestHeader(r,e)}),e.isUndefined(u.withCredentials)||(f.withCredentials=!!u.withCredentials),u.responseType)try{f.responseType=u.responseType}catch(T){if("json"!==u.responseType)throw T}"function"==typeof u.onDownloadProgress&&f.addEventListener("progress",u.onDownloadProgress),"function"==typeof u.onUploadProgress&&f.upload&&f.upload.addEventListener("progress",u.onUploadProgress),u.cancelToken&&u.cancelToken.promise.then(function(e){f&&(f.abort(),d(e),f=null)}),p||(p=null),f.send(p)})};
},{"./../utils":"S1cf","./../core/settle":"aS8y","./../helpers/cookies":"dn2M","./../helpers/buildURL":"H6Qo","../core/buildFullPath":"KxkP","./../helpers/parseHeaders":"ZeD7","./../helpers/isURLSameOrigin":"w7LF","../core/createError":"bIiH"}],"MyHX":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"BXyq":[function(require,module,exports) {
var process = require("process");
var e=require("process"),t=require("./utils"),r=require("./helpers/normalizeHeaderName"),n={"Content-Type":"application/x-www-form-urlencoded"};function a(e,r){!t.isUndefined(e)&&t.isUndefined(e["Content-Type"])&&(e["Content-Type"]=r)}function i(){var t;return"undefined"!=typeof XMLHttpRequest?t=require("./adapters/xhr"):void 0!==e&&"[object process]"===Object.prototype.toString.call(e)&&(t=require("./adapters/http")),t}var o={adapter:i(),transformRequest:[function(e,n){return r(n,"Accept"),r(n,"Content-Type"),t.isFormData(e)||t.isArrayBuffer(e)||t.isBuffer(e)||t.isStream(e)||t.isFile(e)||t.isBlob(e)?e:t.isArrayBufferView(e)?e.buffer:t.isURLSearchParams(e)?(a(n,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):t.isObject(e)?(a(n,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(t){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};t.forEach(["delete","get","head"],function(e){o.headers[e]={}}),t.forEach(["post","put","patch"],function(e){o.headers[e]=t.merge(n)}),module.exports=o;
},{"./utils":"S1cf","./helpers/normalizeHeaderName":"M8l6","./adapters/xhr":"KRuG","./adapters/http":"KRuG","process":"MyHX"}],"uz6X":[function(require,module,exports) {
"use strict";var e=require("./../utils"),r=require("./transformData"),a=require("../cancel/isCancel"),t=require("../defaults");function s(e){e.cancelToken&&e.cancelToken.throwIfRequested()}module.exports=function(n){return s(n),n.headers=n.headers||{},n.data=r(n.data,n.headers,n.transformRequest),n.headers=e.merge(n.headers.common||{},n.headers[n.method]||{},n.headers),e.forEach(["delete","get","head","post","put","patch","common"],function(e){delete n.headers[e]}),(n.adapter||t.adapter)(n).then(function(e){return s(n),e.data=r(e.data,e.headers,n.transformResponse),e},function(e){return a(e)||(s(n),e&&e.response&&(e.response.data=r(e.response.data,e.response.headers,n.transformResponse))),Promise.reject(e)})};
},{"./../utils":"S1cf","./transformData":"woEt","../cancel/isCancel":"V30M","../defaults":"BXyq"}],"OHvn":[function(require,module,exports) {
"use strict";var e=require("../utils");module.exports=function(n,t){t=t||{};var r={},o=["url","method","data"],i=["headers","auth","proxy","params"],a=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],s=["validateStatus"];function c(n,t){return e.isPlainObject(n)&&e.isPlainObject(t)?e.merge(n,t):e.isPlainObject(t)?e.merge({},t):e.isArray(t)?t.slice():t}function d(o){e.isUndefined(t[o])?e.isUndefined(n[o])||(r[o]=c(void 0,n[o])):r[o]=c(n[o],t[o])}e.forEach(o,function(n){e.isUndefined(t[n])||(r[n]=c(void 0,t[n]))}),e.forEach(i,d),e.forEach(a,function(o){e.isUndefined(t[o])?e.isUndefined(n[o])||(r[o]=c(void 0,n[o])):r[o]=c(void 0,t[o])}),e.forEach(s,function(e){e in t?r[e]=c(n[e],t[e]):e in n&&(r[e]=c(void 0,n[e]))});var f=o.concat(i).concat(a).concat(s),u=Object.keys(n).concat(Object.keys(t)).filter(function(e){return-1===f.indexOf(e)});return e.forEach(u,d),r};
},{"../utils":"S1cf"}],"OvAf":[function(require,module,exports) {
"use strict";var e=require("./../utils"),t=require("../helpers/buildURL"),r=require("./InterceptorManager"),o=require("./dispatchRequest"),s=require("./mergeConfig");function i(e){this.defaults=e,this.interceptors={request:new r,response:new r}}i.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=s(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[o,void 0],r=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)r=r.then(t.shift(),t.shift());return r},i.prototype.getUri=function(e){return e=s(this.defaults,e),t(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},e.forEach(["delete","get","head","options"],function(e){i.prototype[e]=function(t,r){return this.request(s(r||{},{method:e,url:t,data:(r||{}).data}))}}),e.forEach(["post","put","patch"],function(e){i.prototype[e]=function(t,r,o){return this.request(s(o||{},{method:e,url:t,data:r}))}}),module.exports=i;
},{"./../utils":"S1cf","../helpers/buildURL":"H6Qo","./InterceptorManager":"rj2i","./dispatchRequest":"uz6X","./mergeConfig":"OHvn"}],"mIKj":[function(require,module,exports) {
"use strict";function t(t){this.message=t}t.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},t.prototype.__CANCEL__=!0,module.exports=t;
},{}],"tsWd":[function(require,module,exports) {
"use strict";var e=require("./Cancel");function n(n){if("function"!=typeof n)throw new TypeError("executor must be a function.");var o;this.promise=new Promise(function(e){o=e});var r=this;n(function(n){r.reason||(r.reason=new e(n),o(r.reason))})}n.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},n.source=function(){var e;return{token:new n(function(n){e=n}),cancel:e}},module.exports=n;
},{"./Cancel":"mIKj"}],"X8jb":[function(require,module,exports) {
"use strict";module.exports=function(n){return function(t){return n.apply(null,t)}};
},{}],"wICU":[function(require,module,exports) {
"use strict";module.exports=function(o){return"object"==typeof o&&!0===o.isAxiosError};
},{}],"nUiQ":[function(require,module,exports) {
"use strict";var e=require("./utils"),r=require("./helpers/bind"),i=require("./core/Axios"),n=require("./core/mergeConfig"),u=require("./defaults");function o(n){var u=new i(n),o=r(i.prototype.request,u);return e.extend(o,i.prototype,u),e.extend(o,u),o}var l=o(u);l.Axios=i,l.create=function(e){return o(n(l.defaults,e))},l.Cancel=require("./cancel/Cancel"),l.CancelToken=require("./cancel/CancelToken"),l.isCancel=require("./cancel/isCancel"),l.all=function(e){return Promise.all(e)},l.spread=require("./helpers/spread"),l.isAxiosError=require("./helpers/isAxiosError"),module.exports=l,module.exports.default=l;
},{"./utils":"S1cf","./helpers/bind":"EDTP","./core/Axios":"OvAf","./core/mergeConfig":"OHvn","./defaults":"BXyq","./cancel/Cancel":"mIKj","./cancel/CancelToken":"tsWd","./cancel/isCancel":"V30M","./helpers/spread":"X8jb","./helpers/isAxiosError":"wICU"}],"dZBD":[function(require,module,exports) {
module.exports=require("./lib/axios");
},{"./lib/axios":"nUiQ"}],"bX5j":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,require("regenerator-runtime/runtime");var e=t(require("axios"));function t(e){return e&&e.__esModule?e:{default:e}}function r(e,t,r,n,o,a,i){try{var c=e[a](i),u=c.value}catch(s){return void r(s)}c.done?t(u):Promise.resolve(u).then(n,o)}function n(e){return function(){var t=this,n=arguments;return new Promise(function(o,a){var i=e.apply(t,n);function c(e){r(i,o,a,c,u,"next",e)}function u(e){r(i,o,a,c,u,"throw",e)}c(void 0)})}}function o(e){return a.apply(this,arguments)}function a(){return(a=n(regeneratorRuntime.mark(function t(r){var o,a,i,c,u,s,p,d,l,f,g,h,w,m,v,y,x;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return x=function(){return(x=n(regeneratorRuntime.mark(function t(r){var n,a,i,c,u,s;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=r.code,a=r.state,i=window.localStorage.getItem(a)){t.next=4;break}throw new Error("State mismatch");case 4:return c={method:"POST",url:l.token_endpoint,headers:{"content-type":"application/x-www-form-urlencoded"},data:{grant_type:"authorization_code",client_id:o,code:n,redirect_uri:p,code_verifier:i}},t.next=7,e.default.request(c);case 7:return u=t.sent,s=u.data,t.abrupt("return",s);case 10:case"end":return t.stop()}},t)}))).apply(this,arguments)},y=function(e){return x.apply(this,arguments)},v=function(){return(v=n(regeneratorRuntime.mark(function e(t){var r,n,a,c,u;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.scopes,e.next=3,h();case 3:n=e.sent,a=n.codeChallenge,c=n.codeVerifier,window.localStorage.setItem(a,c),u="".concat(l.authorization_endpoint,"?")+"response_type=code&"+"scope=".concat(r.join("+"),"&")+"client_id=".concat(o,"&")+"state=".concat(a,"&")+"redirect_uri=".concat(p,"&")+"code_challenge=".concat(a,"&")+"code_challenge_method=".concat(i),console.log("Authorization URI:",u),window.location.assign(u);case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)},m=function(e){return v.apply(this,arguments)},w=function(){return(w=n(regeneratorRuntime.mark(function e(){var t,r,o,a,i,c,u,s,p;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return c=function(){return(c=n(regeneratorRuntime.mark(function e(t){var r,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("verifier:",t),e.next=3,o(t);case 3:return r=e.sent,console.log("hashed:",r),n=a(r),e.abrupt("return",n);case 7:case"end":return e.stop()}},e)}))).apply(this,arguments)},i=function(e){return c.apply(this,arguments)},a=function(e){return btoa(String.fromCharCode.apply(null,new Uint8Array(e))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},o=function(e){var t=(new TextEncoder).encode(e);return window.crypto.subtle.digest("SHA-256",t)},r=function(){var e=new Uint32Array(28);return window.crypto.getRandomValues(e),Array.from(e,t).join("")},t=function(e){return("0"+e.toString(16)).substr(-2)},u=r(),s=u,e.next=10,i(s);case 10:return p=e.sent,e.abrupt("return",{codeVerifier:s,codeChallenge:p});case 12:case"end":return e.stop()}},e)}))).apply(this,arguments)},h=function(){return w.apply(this,arguments)},g=function(){return(g=n(regeneratorRuntime.mark(function t(){var r,n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.default.get(s);case 2:r=t.sent,n=r.data,l=n,window.localStorage.setItem(d,JSON.stringify(l));case 6:case"end":return t.stop()}},t)}))).apply(this,arguments)},f=function(){return g.apply(this,arguments)},o=r.clientId,a=r.encryptionMethod,i=void 0===a?"S256":a,c=r.forceMetadataUpdate,u=void 0!==c&&c,s=r.metadataURL,p=r.redirectURI,d=r.storageKey,(l=JSON.parse(window.localStorage.getItem(d)))&&!u||f(),t.abrupt("return",{updateMetadata:f,signin:m,exchangeCodeToToken:y});case 12:case"end":return t.stop()}},t)}))).apply(this,arguments)}var i=o;exports.default=i;
},{"regenerator-runtime/runtime":"QVnC","axios":"dZBD"}],"Focm":[function(require,module,exports) {
"use strict";require("regenerator-runtime/runtime");var e=t(require("./OAuthClient"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e,t,n,o,r,a,i){try{var c=e[a](i),u=c.value}catch(s){return void n(s)}c.done?t(u):Promise.resolve(u).then(o,r)}function o(e){return function(){var t=this,o=arguments;return new Promise(function(r,a){var i=e.apply(t,o);function c(e){n(i,r,a,c,u,"next",e)}function u(e){n(i,r,a,c,u,"throw",e)}c(void 0)})}}function r(){return a.apply(this,arguments)}function a(){return(a=o(regeneratorRuntime.mark(function t(){var n,o,r,a,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,new e.default({clientId:"0oa1n8fy6dZUEG6M15d7",redirectURI:"https://kasparoauth.local:8000/redirect.html",storageKey:"OAUTH_METADATA",metadataURL:"https://dev-90897551.okta.com/oauth2/default/.well-known/oauth-authorization-server"});case 2:if(n=t.sent,"/index.html"===window.location.pathname&&document.getElementById("signin").addEventListener("click",function(){n.signin({scopes:["openid","photos","profile","email"]})}),"/redirect.html"!==window.location.pathname){t.next=13;break}return console.log("Callback detected, will try to get token"),o=new URLSearchParams(window.location.search),r=o.get("code"),a=o.get("state"),t.next=11,n.exchangeCodeToToken({code:r,state:a});case 11:i=t.sent,console.log("got token, login done:",i);case 13:case"end":return t.stop()}},t)}))).apply(this,arguments)}r();
},{"regenerator-runtime/runtime":"QVnC","./OAuthClient":"bX5j"}]},{},["Focm"], null)
//# sourceMappingURL=/OAuthClient.055940be.js.map