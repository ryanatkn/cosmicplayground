import{P as ae}from"./Preview.CuSa1dBT.js";import{n as w,r as ee,i as y,a as g,d as u,e as d,b as m,l as $,m as p,q as le,x as oe,y as ce,A as ue,L as O,s as q,g as Q,c as T,p as c,o as h,G as fe,_ as he,$ as de,F as me}from"./scheduler.B6ZHjePS.js";import{S as _,i as x,c as D,a as V,m as E,t as C,b as B,d as S}from"./index.D8p8-7y1.js";import{P as pe}from"./PortalPreview.DjcbpV0W.js";import{e as te}from"./each.DSKrv-cI.js";import{c as ge}from"./crew.BaBakeQM.js";import{g as R}from"./clock.CjzioAVG.js";import{E as ve}from"./EarthThumbnail.I1IM3esF.js";import{P as $e}from"./Preview.BoLhZVZB.js";import{l as we}from"./maths.CghzhYsK.js";import{f as _e}from"./freezeframe.B7Pu_pUV.js";import{F as Y}from"./FreqSpeeds.Dtr5Pin8.js";import{F as ie}from"./FreqSpectacle.Dl9BPrcT.js";const ft={name:"about",slug:"about",showHomeButton:!0,Preview:ae};function se(a,t,s){const e=a.slice();return e[3]=t[s],e}function re(a){let t,s=te(a[0]),e=[];for(let r=0;r<s.length;r+=1)e[r]=ne(se(a,s,r));return{c(){t=d("div");for(let r=0;r<e.length;r+=1)e[r].c();this.h()},l(r){t=m(r,"DIV",{class:!0});var n=$(t);for(let i=0;i<e.length;i+=1)e[i].l(n);n.forEach(u),this.h()},h(){p(t,"class","text svelte-evfjcz")},m(r,n){y(r,t,n);for(let i=0;i<e.length;i+=1)e[i]&&e[i].m(t,null)},p(r,n){if(n&1){s=te(r[0]);let i;for(i=0;i<s.length;i+=1){const l=se(r,s,i);e[i]?e[i].p(l,n):(e[i]=ne(l),e[i].c(),e[i].m(t,null))}for(;i<e.length;i+=1)e[i].d(1);e.length=s.length}},d(r){r&&u(t),le(e,r)}}}function ne(a){let t=a[3]+"",s;return{c(){s=oe(t)},l(e){s=ce(e,t)},m(e,r){y(e,s,r)},p(e,r){r&1&&t!==(t=e[3]+"")&&ue(s,t)},d(e){e&&u(s)}}}function xe(a){let t,s=a[0]&&re(a);return{c(){s&&s.c(),t=ee()},l(e){s&&s.l(e),t=ee()},m(e,r){s&&s.m(e,r),y(e,t,r)},p(e,[r]){e[0]?s?s.p(e,r):(s=re(e),s.c(),s.m(t.parentNode,t)):s&&(s.d(1),s=null)},i:g,o:g,d(e){e&&u(t),s&&s.d(e)}}}function ke(a,t,s){let e,{scores:r}=t,{defaultIcon:n=null}=t;return a.$$set=i=>{"scores"in i&&s(1,r=i.scores),"defaultIcon"in i&&s(2,n=i.defaultIcon)},a.$$.update=()=>{a.$$.dirty&6&&s(0,e=r?r.crew.map((i,l)=>i?ge[l].icon:n).filter(Boolean):void 0)},[e,r,n]}class Pe extends _{constructor(t){super(),x(this,t,ke,xe,w,{scores:1,defaultIcon:2})}}function Ie(a){let t,s;return t=new Pe({props:{scores:a[1],defaultIcon:"❔"}}),{c(){D(t.$$.fragment)},l(e){V(t.$$.fragment,e)},m(e,r){E(t,e,r),s=!0},p(e,r){const n={};r&2&&(n.scores=e[1]),t.$set(n)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){S(t,e)}}}function ze(a){let t,s;return t=new pe({props:{on_click:a[0]?void 0:a[2],href:a[0]?"/unlock":void 0,style:a[0]?"border-color: var(--photon_color)":void 0,$$slots:{default:[Ie]},$$scope:{ctx:a}}}),{c(){D(t.$$.fragment)},l(e){V(t.$$.fragment,e)},m(e,r){E(t,e,r),s=!0},p(e,[r]){const n={};r&5&&(n.on_click=e[0]?void 0:e[2]),r&1&&(n.href=e[0]?"/unlock":void 0),r&1&&(n.style=e[0]?"border-color: var(--photon_color)":void 0),r&10&&(n.$$scope={dirty:r,ctx:e}),t.$set(n)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){S(t,e)}}}function ye(a,t,s){let{unlocked:e}=t,{scores:r}=t,{on_click:n=null}=t;return a.$$set=i=>{"unlocked"in i&&s(0,e=i.unlocked),"scores"in i&&s(1,r=i.scores),"on_click"in i&&s(2,n=i.on_click)},[e,r,n]}let ht=class extends _{constructor(t){super(),x(this,t,ye,ze,w,{unlocked:0,scores:1,on_click:2})}};function He(a){let t,s;return t=new ve({props:{width:320,height:160,animationDuration:"90s",running:a[0].running,text:"soggy planet"}}),{c(){D(t.$$.fragment)},l(e){V(t.$$.fragment,e)},m(e,r){E(t,e,r),s=!0},p(e,[r]){const n={};r&1&&(n.running=e[0].running),t.$set(n)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){S(t,e)}}}function be(a,t,s){let e;const r=R();return O(a,r,n=>s(0,e=n)),[e,r]}let qe=class extends _{constructor(t){super(),x(this,t,be,He,w,{})}};const pt={name:"soggy planet",slug:"soggy-planet",showHomeButton:!1,Preview:qe},gt={name:"starlit hammock",slug:"starlit-hammock",showHomeButton:!0,Preview:$e};function Te(a){let t,s,e="easing function auralizations",r,n,i,l,o,f,k,P,H,b,G,v,M,U,L,X,F;return{c(){t=d("div"),s=d("h2"),s.textContent=e,r=q(),n=d("div"),i=d("canvas"),l=q(),o=d("div"),f=d("div"),k=q(),P=d("div"),H=q(),b=d("div"),G=q(),v=d("div"),M=d("div"),U=q(),L=d("div"),X=q(),F=d("div"),this.h()},l(K){t=m(K,"DIV",{class:!0});var j=$(t);s=m(j,"H2",{"data-svelte-h":!0}),Q(s)!=="svelte-78zozz"&&(s.textContent=e),r=T(j),n=m(j,"DIV",{class:!0});var A=$(n);i=m(A,"CANVAS",{}),$(i).forEach(u),l=T(A),o=m(A,"DIV",{class:!0,style:!0});var N=$(o);f=m(N,"DIV",{class:!0,style:!0}),$(f).forEach(u),k=T(N),P=m(N,"DIV",{class:!0,style:!0}),$(P).forEach(u),H=T(N),b=m(N,"DIV",{style:!0}),$(b).forEach(u),N.forEach(u),G=T(A),v=m(A,"DIV",{class:!0,style:!0});var W=$(v);M=m(W,"DIV",{class:!0,style:!0}),$(M).forEach(u),U=T(W),L=m(W,"DIV",{class:!0,style:!0}),$(L).forEach(u),X=T(W),F=m(W,"DIV",{style:!0}),$(F).forEach(u),W.forEach(u),A.forEach(u),j.forEach(u),this.h()},h(){p(f,"class","mouth svelte-1t6hz7l"),c(f,"width",I+"px"),c(f,"height",I+"px"),p(P,"class","mouth svelte-1t6hz7l"),c(P,"width",I+"px"),c(P,"height",I+"px"),c(b,"width",I+"px"),c(b,"height",I+"px"),c(b,"border-radius","50%"),p(o,"class","mouth-wrapper svelte-1t6hz7l"),c(o,"left",-I/2+"px"),c(o,"top",Z/2-I/2+"px"),c(o,"width",I+"px"),c(o,"height",I+"px"),p(M,"class","tail svelte-1t6hz7l"),c(M,"width",z+"px"),c(M,"height",z+"px"),p(L,"class","tail svelte-1t6hz7l"),c(L,"width",z+"px"),c(L,"height",z+"px"),c(F,"width",z/2+"px"),c(F,"height",z/2+"px"),c(F,"border-radius","50%"),p(v,"class","tail-wrapper svelte-1t6hz7l"),c(v,"right",-z/2+"px"),c(v,"top",8+Z/2-z/2+"px"),c(v,"width",z+"px"),c(v,"height",z+"px"),p(n,"class","wrapper svelte-1t6hz7l"),p(t,"class","preview svelte-1t6hz7l")},m(K,j){y(K,t,j),h(t,s),h(t,r),h(t,n),h(n,i),a[1](i),h(n,l),h(n,o),h(o,f),h(o,k),h(o,P),h(o,H),h(o,b),h(n,G),h(n,v),h(v,M),h(v,U),h(v,L),h(v,X),h(v,F)},p:g,i:g,o:g,d(K){K&&u(t),a[1](null)}}}const De=240,Z=24,I=16,z=10;function Ve(a,t,s){let e=null;const r=i=>{const l=De,o=Z;i.width!==l&&(i.width=l),i.height!==o&&(i.height=o);const f=i.getContext("2d"),k=2,P=o-k*2;f.clearRect(0,0,l,o),f.lineWidth=k,f.strokeStyle="hsla(220deg, 60%, 65%, 0.6)",f.moveTo(0,o/2);for(let H=1;H<l;H++){const b=we(8,3.75,H/l),G=Math.sin(H/b)*P/2+P/2+k;f.lineTo(H,G)}f.stroke()};function n(i){fe[i?"unshift":"push"](()=>{e=i,s(0,e)})}return a.$$.update=()=>{a.$$.dirty&1&&e&&r(e)},[e,n]}let Ee=class extends _{constructor(t){super(),x(this,t,Ve,Te,w,{})}};const $t={name:"easing function auralizations",slug:"easings-2",showHomeButton:!0,Preview:Ee};function Ce(a){let t,s='<h2 class="svelte-1odg17l">paint freqs</h2> <img class="cosmic-kitty svelte-1odg17l" src="/assets/characters/cosmic-kitty.webp" style="width: 192px; height: 192px;" alt="Cosmic Kitty"/>';return{c(){t=d("div"),t.innerHTML=s,this.h()},l(e){t=m(e,"DIV",{class:!0,"data-svelte-h":!0}),Q(t)!=="svelte-pars9g"&&(t.innerHTML=s),this.h()},h(){p(t,"class","preview svelte-1odg17l")},m(e,r){y(e,t,r)},p:g,i:g,o:g,d(e){e&&u(t)}}}let Be=class extends _{constructor(t){super(),x(this,t,null,Ce,w,{})}};const _t={name:"paint freqs",slug:"paint-freqs",showHomeButton:!0,Preview:Be};function Se(a){let t,s='<h2>easing function visualizations</h2> <div class="slider-wrapper svelte-1hfxy7g"><div class="slider-graphic svelte-1hfxy7g"></div></div>';return{c(){t=d("div"),t.innerHTML=s,this.h()},l(e){t=m(e,"DIV",{class:!0,"data-svelte-h":!0}),Q(t)!=="svelte-17eew0z"&&(t.innerHTML=s),this.h()},h(){p(t,"class","preview svelte-1hfxy7g")},m(e,r){y(e,t,r)},p:g,i:g,o:g,d(e){e&&u(t)}}}let Me=class extends _{constructor(t){super(),x(this,t,null,Se,w,{})}};const kt={name:"easing function visualizations",slug:"easings-1",showHomeButton:!0,Preview:Me};function Le(a){let t,s="<h2>🐶 hearing test 🐶</h2>";return{c(){t=d("div"),t.innerHTML=s,this.h()},l(e){t=m(e,"DIV",{class:!0,"data-svelte-h":!0}),Q(t)!=="svelte-14qrgqj"&&(t.innerHTML=s),this.h()},h(){p(t,"class","preview svelte-1a79k33")},m(e,r){y(e,t,r)},p:g,i:g,o:g,d(e){e&&u(t)}}}let Fe=class extends _{constructor(t){super(),x(this,t,null,Le,w,{})}};const It={name:"hearing test",slug:"hearing-test",showHomeButton:!0,Preview:Fe};function je(a){let t,s,e,r,n;return{c(){t=d("img"),this.h()},l(i){t=m(i,"IMG",{src:!0,alt:!0,style:!0,class:!0}),this.h()},h(){he(t.src,s="/assets/construction/person-dig-idea.gif")||p(t,"src",s),p(t,"alt","under construction: person rock"),c(t,"width","96px"),c(t,"height","96px"),p(t,"class","pixelated svelte-1mjb65u")},m(i,l){y(i,t,l),r||(n=de(e=_e.call(null,t,a[0])),r=!0)},p(i,[l]){e&&me(e.update)&&l&1&&e.update.call(null,i[0])},i:g,o:g,d(i){i&&u(t),r=!1,n()}}}function Ae(a,t,s){let e,r;const n=R();return O(a,n,i=>s(2,r=i)),a.$$.update=()=>{a.$$.dirty&4&&s(0,e=!r.running)},[e,n,r]}let Ne=class extends _{constructor(t){super(),x(this,t,Ae,je,w,{})}};const yt={name:"under construction",slug:"under-construction",showHomeButton:!0,Preview:Ne};function We(a){let t,s,e,r;return t=new Y({props:{elapsedTime:a[0].time,width:162,height:61,hzItems:[3],lowestHzItemCount:2}}),e=new Y({props:{elapsedTime:a[0].time,width:162,height:61,hzItems:[3],lowestHzItemCount:2,style:"transform: rotate(180deg);"}}),{c(){D(t.$$.fragment),s=q(),D(e.$$.fragment)},l(n){V(t.$$.fragment,n),s=T(n),V(e.$$.fragment,n)},m(n,i){E(t,n,i),y(n,s,i),E(e,n,i),r=!0},p(n,[i]){const l={};i&1&&(l.elapsedTime=n[0].time),t.$set(l);const o={};i&1&&(o.elapsedTime=n[0].time),e.$set(o)},i(n){r||(C(t.$$.fragment,n),C(e.$$.fragment,n),r=!0)},o(n){B(t.$$.fragment,n),B(e.$$.fragment,n),r=!1},d(n){n&&u(s),S(t,n),S(e,n)}}}function Ge(a,t,s){let e;const r=R();return O(a,r,n=>s(0,e=n)),[e,r]}let Ke=class extends _{constructor(t){super(),x(this,t,Ge,We,w,{})}};const bt={name:"freq speeds",slug:"freq-speeds",showHomeButton:!0,Preview:Ke};function Oe(a){let t,s,e,r,n,i;return e=new Y({props:{elapsedTime:a[0].time/J,width:131,height:16,hzItems:[3],lowestHzValue:500,lowestHzItemCount:2}}),n=new ie({props:{elapsedTime:a[0].time/(J*2),width:131,height:16,hzItems:[3],lowestHzValue:500,lowestHzItemCount:2}}),{c(){t=d("div"),s=d("div"),D(e.$$.fragment),r=q(),D(n.$$.fragment),this.h()},l(l){t=m(l,"DIV",{class:!0});var o=$(t);s=m(o,"DIV",{class:!0});var f=$(s);V(e.$$.fragment,f),f.forEach(u),r=T(o),V(n.$$.fragment,o),o.forEach(u),this.h()},h(){p(s,"class","item svelte-1xpdug8"),p(t,"class","preview svelte-1xpdug8")},m(l,o){y(l,t,o),h(t,s),E(e,s,null),h(t,r),E(n,t,null),i=!0},p(l,[o]){const f={};o&1&&(f.elapsedTime=l[0].time/J),e.$set(f);const k={};o&1&&(k.elapsedTime=l[0].time/(J*2)),n.$set(k)},i(l){i||(C(e.$$.fragment,l),C(n.$$.fragment,l),i=!0)},o(l){B(e.$$.fragment,l),B(n.$$.fragment,l),i=!1},d(l){l&&u(t),S(e),S(n)}}}const J=2;function Re(a,t,s){let e;const r=R();return O(a,r,n=>s(0,e=n)),[e,r]}let Je=class extends _{constructor(t){super(),x(this,t,Re,Oe,w,{})}};const Tt={name:"clocks",slug:"clocks",showHomeButton:!0,Preview:Je};function Qe(a){let t,s;return t=new ie({props:{elapsedTime:a[0].time/2,width:162,height:75,hzItems:[3,4],lowestHzItemCount:1}}),{c(){D(t.$$.fragment)},l(e){V(t.$$.fragment,e)},m(e,r){E(t,e,r),s=!0},p(e,[r]){const n={};r&1&&(n.elapsedTime=e[0].time/2),t.$set(n)},i(e){s||(C(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){S(t,e)}}}function Ue(a,t,s){let e;const r=R();return O(a,r,n=>s(0,e=n)),[e,r]}class Xe extends _{constructor(t){super(),x(this,t,Ue,Qe,w,{})}}const Dt={name:"freq spectacle",slug:"freq-spectacle",showHomeButton:!0,Preview:Xe};export{ht as P,Pe as S,bt as a,Tt as b,Dt as c,ft as d,pt as e,gt as f,$t as g,_t as h,kt as i,It as j,yt as k};