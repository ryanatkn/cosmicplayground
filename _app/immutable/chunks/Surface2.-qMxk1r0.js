import{n as q,T as A,e as B,b as F,l as G,d as P,m as J,p as Y,i as U,J as r,F as h,U as W,V as j,W as H,C as K,G as L}from"./scheduler.EKw-xcnK.js";import{S as Q,i as x,t as $,b as nn}from"./index.nrQb7by4.js";import{s as m}from"./dom.z-RU6ZBL.js";function en(n){let i,l=`${n[0]}px`,_=`${n[1]}px`,u,p,w;const c=n[12].default,t=A(c,n,n[11],null);return{c(){i=B("div"),t&&t.c(),this.h()},l(s){i=F(s,"DIV",{class:!0});var a=G(i);t&&t.l(a),a.forEach(P),this.h()},h(){J(i,"class","surface svelte-1a6p81"),Y(i,"width",l),Y(i,"height",_)},m(s,a){U(s,i,a),t&&t.m(i,null),n[13](i),u=!0,p||(w=[r(i,"wheel",function(){h(n[2]?void 0:n[4])&&(n[2]?void 0:n[4]).apply(this,arguments)},{passive:!0}),r(i,"pointerdown",function(){h(n[2]?void 0:n[5])&&(n[2]?void 0:n[5]).apply(this,arguments)}),r(i,"pointermove",function(){h(n[2]?void 0:n[7])&&(n[2]?void 0:n[7]).apply(this,arguments)}),r(i,"pointerup",function(){h(n[2]?void 0:n[6])&&(n[2]?void 0:n[6]).apply(this,arguments)}),r(i,"pointerleave",function(){h(n[2]?void 0:n[6])&&(n[2]?void 0:n[6]).apply(this,arguments)}),r(i,"pointercancel",function(){h(n[2]?void 0:n[6])&&(n[2]?void 0:n[6]).apply(this,arguments)}),r(i,"pointerout",function(){h(n[2]?void 0:n[6])&&(n[2]?void 0:n[6]).apply(this,arguments)}),r(i,"touchstart",function(){h(n[2]?void 0:m)&&(n[2]?void 0:m).apply(this,arguments)},{passive:!1}),r(i,"touchmove",function(){h(n[2]?void 0:m)&&(n[2]?void 0:m).apply(this,arguments)},{passive:!1})],p=!0)},p(s,[a]){n=s,t&&t.p&&(!u||a&2048)&&W(t,c,n,n[11],u?H(c,n[11],a,null):j(n[11]),null),a&1&&l!==(l=`${n[0]}px`)&&Y(i,"width",l),a&2&&_!==(_=`${n[1]}px`)&&Y(i,"height",_)},i(s){u||($(t,s),u=!0)},o(s){nn(t,s),u=!1},d(s){s&&P(i),t&&t.d(s),n[13](null),p=!1,K(w)}}}const tn=1.002;function sn(n,i,l){let{$$slots:_={},$$scope:u}=i,{width:p}=i,{height:w}=i,{scale:c}=i,{zoom:t}=i,{pan:s}=i,{disabled:a=!1}=i,X=!1,b=null,v=null,I;const g=new Map;let z=null;const M=(e,f,o)=>{const d=o.getBoundingClientRect(),y=e-d.left,S=f-d.top;return{x:y,y:S}},T=(e,f)=>{if(b!==null&&v!==null){const d=b-e,y=v-f;s(d/c,y/c)}const o=M(e,f,I);b=o.x,v=o.y},V=e=>{const{x:f,y:o}=M(e.clientX,e.clientY,I),d=e.deltaX+e.deltaY+e.deltaZ;t(d,f,o)},D=e=>{m(e),g.set(e.pointerId,e),b=null,v=null,z=null,e.isPrimary&&g.size===1&&(X=!0,T(e.clientX,e.clientY))},N=e=>{m(e),g.delete(e.pointerId),b=null,v=null,z=null,e.isPrimary&&(X=!1)},R=e=>{m(e),g.set(e.pointerId,e);const f=g.size;if(f===1)X&&T(e.clientX,e.clientY);else if(f===2){const o=Array.from(g.values()),d=o[0].clientX,y=o[0].clientY,S=o[1].clientX,C=o[1].clientY,E=Math.hypot(S-d,C-y);if(z!==null){const O=z-E,k=Math.abs(O/.33)*(tn-1)+1;t(O,(d+S)/2,(y+C)/2,k)}z=E}};function Z(e){L[e?"unshift":"push"](()=>{I=e,l(3,I)})}return n.$$set=e=>{"width"in e&&l(0,p=e.width),"height"in e&&l(1,w=e.height),"scale"in e&&l(8,c=e.scale),"zoom"in e&&l(9,t=e.zoom),"pan"in e&&l(10,s=e.pan),"disabled"in e&&l(2,a=e.disabled),"$$scope"in e&&l(11,u=e.$$scope)},[p,w,a,I,V,D,N,R,c,t,s,u,_,Z]}class fn extends Q{constructor(i){super(),x(this,i,sn,en,q,{width:0,height:1,scale:8,zoom:9,pan:10,disabled:2})}}export{fn as S};