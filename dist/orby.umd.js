!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e["@orby/core"]={})}(this,function(e){"use strict";class t{constructor(e,t={},n=[]){this.tag=e,this.props=Object.assign({},t,{children:n})}clone(e=this.tag,n=this.props,r=this.props.children){return new t(e,n,r)}emit(e,...t){this.prevent||("remove"===e&&(this.prevent=!0),"function"==typeof this.props[e]&&this.props[e](...t))}}function n(e){return"object"==typeof e&&e instanceof t}function r(e){return e.shadowRoot||e}function o(e,t){r(e).removeChild(t)}function i(e,t){r(e).appendChild(t)}const s=1e3/120,c="__master__",f="__remove__",l="__listeners__",p=["children","create","remove","context","state"];function u(e){return e&&e[c]||{}}function a(e,t,n,r,o){let i;return{tag:e,render:function c(l,p,u,a){let h=!0;return p=d(l,p,e(u,{set:e=>{t=e,p[f]||i||h||(i=!0,function(e,t=s){setTimeout(e,s)}(()=>{c(l,p,u,a),i=!1}))},get:()=>t},a),a,n,r+1,o),h=!1,p}}}function d(e,s,f,g={},m,y=0,v={}){f=n(f)?f:new t("",{},[f||""]);let _,b,w=s,{prev:x=new t,components:j=v}=u(w),O=f.props.context;if(g=O?Object.assign({},g,O):g,m="svg"===f.tag||m,x===f)return w;j[y]&&j[y].tag!==f.tag&&delete j[y],"function"==typeof f.tag&&((j[y]||{}).tag!==f.tag&&(j[y]=a(f.tag,f.props.state,m,y,j)),_=j[y],f=f.clone(x.tag||(m?"g":"")));let A=f.props.children;if(f.tag!==x.tag){if(w=function(e,t){return t?document.createElementNS("http://www.w3.org/2000/svg",e):e?document.createElement(e):document.createTextNode("")}(f.tag,m),s){if(!_&&""!==f.tag){let e=A.length;for(;s.firstChild&&e--;)i(w,s.firstChild)}!function(e,t,n){r(e).replaceChild(t,n)}(e,w,s),h(s)}else i(e,w);b=!0,f.emit("create",w)}if(_)return _.render(e,w,f.props,g);if(f.tag){if(b||!1!==f.emit("update",w,x.props,f.props)){!function(e,t,n,r){let o=Object.keys(t),i=Object.keys(n).filter(e=>-1===o.indexOf(e)),s=o.concat(i);for(let o=0;o<s.length;o++){let i=s[o];if(t[i]===n[i]||p.indexOf(i)>-1)continue;let c="function"==typeof t[i],f="function"==typeof n[i];if(c||f)!f&&c&&e.removeEventListener(i,e[l][i][0]),f&&(c||(e[l]=e[l]||{},e[l][i]||(e[l][i]=[t=>{e[l][i][1](t)}]),e.addEventListener(i,e[l][i][0])),e[l][i][1]=n[i]);else if(i in n)if(i in e&&!r||r&&"style"===i)if("style"===i)if("object"==typeof n[i]){let r=t[i]||{},o=n[i];for(let t in o)r[t]!==o[t]&&("-"===t[0]?e.setProperty(t,o[t]):e.style[t]=o[t]);n[i]=Object.assign({},r,o)}else e.style.cssText=n[i];else e[i]=n[i];else r?e.setAttributeNS(null,i,n[i]):e.setAttribute(i,n[i]);else e.removeAttribute(i)}}(w,x.props,f.props,m);let e=Array.from(r(w).childNodes),t=Math.max(e.length,A.length);for(let n=0;n<t;n++)A[n]?d(w,e[n],A[n],g,m):e[n]&&(h(e[n]),o(w,e[n]))}}else x.props.children[0]!==f.props.children[0]&&(w.textContent=String(f.props.children[0]));return w[c]={prev:f,components:j},f.emit(b?"created":"updated",w),w}function h(e){let{prev:n=new t}=u(e),r=e.childNodes;e[f]=!0,n.emit("remove",e);for(let e=0;e<r.length;e++)h(r[e]);n.emit("removed",e)}e.render=function(e,t,n,r,o){return d(t,n,e,r,o)},e.h=function(e,r,...o){return new t(e||"",r,function e(r,o=[]){for(let i=0;i<r.length;i++){let s=r[i];Array.isArray(s)?e(s,o):o.push(n(s)?s:new t("",{},[s||""]))}return o}(o))},e.isVDom=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=orby.umd.js.map
