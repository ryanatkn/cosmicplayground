var V=Object.defineProperty;var j=(o,t,a)=>t in o?V(o,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):o[t]=a;var p=(o,t,a)=>(j(o,typeof t!="symbol"?t+"":t,a),a);import{f as q,h as z,v as h,n as k,T as w,e as G,b as I,l as K,d,m as L,i as C,U as D,V as S,W as A,a6 as M,M as U,G as W,r as g,L as Y}from"./scheduler.B6ZHjePS.js";import{S as E,i as T,t as c,b as u,g as B,e as F,c as H,a as J,m as O,d as P}from"./index.D8p8-7y1.js";import{w as $}from"./index.B134a2AU.js";const y=Symbol("app_dialog");class ie{constructor(t){p(this,"show_app_dialog",$(!1));p(this,"app_dialog_el",$(null));p(this,"paused_on_open",!1);this.clock=t}open(){this.show_app_dialog.set(!0),h(this.clock).running?(this.clock.pause(),this.paused_on_open=!0):this.paused_on_open=!1}close(){this.show_app_dialog.set(!1),this.app_dialog_el.set(null),this.paused_on_open&&this.clock.resume()}toggle(){return h(this.show_app_dialog)?(this.close(),!1):(this.open(),!0)}}const Q=()=>q(y),re=o=>z(y,o);function R(o){let t,a,e;const s=o[4].default,l=w(s,o,o[3],null);return{c(){t=G("div"),l&&l.c(),this.h()},l(n){t=I(n,"DIV",{class:!0});var i=K(t);l&&l.l(i),i.forEach(d),this.h()},h(){L(t,"class","teleport svelte-gjkzv5"),t.hidden=a=!o[1]},m(n,i){C(n,t,i),l&&l.m(t,null),o[5](t),e=!0},p(n,[i]){l&&l.p&&(!e||i&8)&&D(l,s,n,n[3],e?A(s,n[3],i,null):S(n[3]),null),(!e||i&2&&a!==(a=!n[1]))&&(t.hidden=a)},i(n){e||(c(l,n),e=!0)},o(n){u(l,n),e=!1},d(n){n&&d(t),l&&l.d(n),o[5](null)}}}function X(o,t,a){let{$$slots:e={},$$scope:s}=t;const l=M();let{to:n}=t,i,f=!1;const _=(r,m)=>{a(1,f=!0),m.appendChild(r),l("move",{el:r,to:m})};U(()=>{var r;(r=i==null?void 0:i.parentNode)==null||r.removeChild(i)});function N(r){W[r?"unshift":"push"](()=>{i=r,a(0,i)})}return o.$$set=r=>{"to"in r&&a(2,n=r.to),"$$scope"in r&&a(3,s=r.$$scope)},o.$$.update=()=>{o.$$.dirty&5&&i&&n&&_(i,n)},[i,f,n,s,e,N]}class Z extends E{constructor(t){super(),T(this,t,X,R,k,{to:2})}}const x=o=>({}),b=o=>({exit:o[4]});function v(o){let t,a;return t=new Z({props:{to:o[0],$$slots:{default:[ee]},$$scope:{ctx:o}}}),{c(){H(t.$$.fragment)},l(e){J(t.$$.fragment,e)},m(e,s){O(t,e,s),a=!0},p(e,s){const l={};s&1&&(l.to=e[0]),s&32&&(l.$$scope={dirty:s,ctx:e}),t.$set(l)},i(e){a||(c(t.$$.fragment,e),a=!0)},o(e){u(t.$$.fragment,e),a=!1},d(e){P(t,e)}}}function ee(o){let t;const a=o[3].default,e=w(a,o,o[5],b);return{c(){e&&e.c()},l(s){e&&e.l(s)},m(s,l){e&&e.m(s,l),t=!0},p(s,l){e&&e.p&&(!t||l&32)&&D(e,a,s,s[5],t?A(a,s[5],l,x):S(s[5]),b)},i(s){t||(c(e,s),t=!0)},o(s){u(e,s),t=!1},d(s){e&&e.d(s)}}}function te(o){let t,a,e=o[0]&&v(o);return{c(){e&&e.c(),t=g()},l(s){e&&e.l(s),t=g()},m(s,l){e&&e.m(s,l),C(s,t,l),a=!0},p(s,[l]){s[0]?e?(e.p(s,l),l&1&&c(e,1)):(e=v(s),e.c(),c(e,1),e.m(t.parentNode,t)):e&&(B(),u(e,1,1,()=>{e=null}),F())},i(s){a||(c(e),a=!0)},o(s){u(e),a=!1},d(s){s&&d(t),e&&e.d(s)}}}function se(o,t,a){let e,{$$slots:s={},$$scope:l}=t;const n=Q(),{app_dialog_el:i}=n;Y(o,i,_=>a(0,e=_));const f=()=>n.close();return o.$$set=_=>{"$$scope"in _&&a(5,l=_.$$scope)},[e,n,i,s,f,l]}class _e extends E{constructor(t){super(),T(this,t,se,te,k,{})}}export{_e as A,Z as T,ie as a,Q as g,re as s};