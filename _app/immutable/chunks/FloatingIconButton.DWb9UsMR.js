import{n as p,T as y,w as _,e as S,b as T,l as k,d as b,Y as m,I as d,i as B,J as F,U as I,V as U,W as q,R as h,S as v,Z as C}from"./scheduler.CGmLp2a4.js";import{S as E,i as J,t as N,b as O}from"./index.0VfkS216.js";import{g as P}from"./spread.CgU5AtxT.js";function R(i){let s,t,o,f;const c=i[6].default,l=y(c,i,i[5],null);let r=[{class:i[3]},{type:i[2]},{"aria-label":i[0]},{"aria-pressed":i[1]},i[4]],u={};for(let e=0;e<r.length;e+=1)u=_(u,r[e]);return{c(){s=S("button"),l&&l.c(),this.h()},l(e){s=T(e,"BUTTON",{class:!0,type:!0,"aria-label":!0,"aria-pressed":!0});var a=k(s);l&&l.l(a),a.forEach(b),this.h()},h(){m(s,u),d(s,"svelte-1gwrcam",!0)},m(e,a){B(e,s,a),l&&l.m(s,null),s.autofocus&&s.focus(),t=!0,o||(f=F(s,"click",i[7]),o=!0)},p(e,[a]){l&&l.p&&(!t||a&32)&&I(l,c,e,e[5],t?q(c,e[5],a,null):U(e[5]),null),m(s,u=P(r,[(!t||a&8)&&{class:e[3]},(!t||a&4)&&{type:e[2]},(!t||a&1)&&{"aria-label":e[0]},(!t||a&2)&&{"aria-pressed":e[1]},a&16&&e[4]])),d(s,"svelte-1gwrcam",!0)},i(e){t||(N(l,e),t=!0)},o(e){O(l,e),t=!1},d(e){e&&b(s),l&&l.d(e),o=!1,f()}}}function V(i,s,t){const o=["label","pressed","type","classes"];let f=h(s,o),{$$slots:c={},$$scope:l}=s,{label:r}=s,{pressed:u=void 0}=s,{type:e="button"}=s,{classes:a=null}=s;function g(n){C.call(this,i,n)}return i.$$set=n=>{s=_(_({},s),v(n)),t(4,f=h(s,o)),"label"in n&&t(0,r=n.label),"pressed"in n&&t(1,u=n.pressed),"type"in n&&t(2,e=n.type),"classes"in n&&t(3,a=n.classes),"$$scope"in n&&t(5,l=n.$$scope)},[r,u,e,a,f,l,c,g]}class j extends E{constructor(s){super(),J(this,s,V,R,p,{label:0,pressed:1,type:2,classes:3})}}export{j as F};