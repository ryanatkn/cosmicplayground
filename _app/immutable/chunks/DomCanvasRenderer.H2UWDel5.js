var ae=Object.defineProperty;var he=(i,e,t)=>e in i?ae(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var S=(i,e,t)=>(he(i,typeof e!="symbol"?e+"":e,t),t);import{n as I,e as z,b as P,l as V,d as W,m as Y,i as q,o as F,a as D,a4 as oe,E as M,G as x,L as se,M as Q,T as re,s as Z,c as $,p as A,J as H,U as le,V as ce,W as fe,C as ue,K as L}from"./scheduler.CGmLp2a4.js";import{S as R,i as T,t as v,g as ee,b as E,e as te,c as G,a as J,m as N,d as U,f as j}from"./index.0VfkS216.js";import{g as de}from"./clock.CLX1guZT.js";import{s as X}from"./dom.BLTHKhgi.js";import{w as _e}from"./index.DfOygCNJ.js";function ge(i){let e,t;return{c(){e=z("div"),t=z("canvas"),this.h()},l(n){e=P(n,"DIV",{class:!0});var o=V(e);t=P(o,"CANVAS",{}),V(t).forEach(W),o.forEach(W),this.h()},h(){Y(e,"class","canvas svelte-cdatl6")},m(n,o){q(n,e,o),F(e,t),i[11](t)},p:D,i:D,o:D,d(n){n&&W(e),i[11](null)}}}function we(i,e,t){let n,o,c=D,u=()=>(c(),c=M(n,m=>t(9,o=m)),n),a,_=D,d=()=>(_(),_=M(g,m=>t(10,a=m)),g);i.$$.on_destroy.push(()=>c()),i.$$.on_destroy.push(()=>_());let{width:f}=e,{height:h}=e,{domCanvasRenderer:s}=e,{stage:r}=e,{clock:g}=e;d();let y,p,k;const b=(m,C)=>{s==null||s.resize(m,C),t(7,p=m),t(8,k=C)};oe(()=>(s==null||s.setCanvas(y),()=>{s==null||s.unsetCanvas()}));function K(m){x[m?"unshift":"push"](()=>{y=m,t(1,y)})}return i.$$set=m=>{"width"in m&&t(3,f=m.width),"height"in m&&t(4,h=m.height),"domCanvasRenderer"in m&&t(5,s=m.domCanvasRenderer),"stage"in m&&t(6,r=m.stage),"clock"in m&&d(t(0,g=m.clock))},i.$$.update=()=>{i.$$.dirty&410&&y&&(p!==f||k!==h)&&b(f,h),i.$$.dirty&32&&u(t(2,n=s==null?void 0:s.dirty)),i.$$.dirty&1632&&s!=null&&s.ctx&&(a.running||o)&&(s.clear(),s.render(r.sim.entities,r.$camera))},[g,y,n,f,h,s,r,p,k,o,a,K]}class me extends R{constructor(e){super(),T(this,e,we,ge,I,{width:3,height:4,domCanvasRenderer:5,stage:6,clock:0})}}function be(i,e,t){let n,o,c,u=D,a=()=>(u(),u=M(f,r=>t(6,c=r)),f);i.$$.on_destroy.push(()=>u());let{pixi:_}=e,{stage:d}=e,{clock:f}=e;a();const{container:h,camera:s}=d;return se(i,s,r=>t(5,o=r)),_.current_scene.addChild(h),Q(()=>{_.current_scene.removeChild(h)}),Q(()=>{_.app.render(),_.app.start()}),i.$$set=r=>{"pixi"in r&&t(2,_=r.pixi),"stage"in r&&t(3,d=r.stage),"clock"in r&&a(t(0,f=r.clock))},i.$$.update=()=>{i.$$.dirty&64&&t(4,{running:n}=c,n),i.$$.dirty&52&&(n?_.app.start():(_.app.stop(),s.setPosition(o.x,o.y,{hard:!0})))},[f,s,_,d,n,o,c]}class ye extends R{constructor(e){super(),T(this,e,be,null,I,{pixi:2,stage:3,clock:0})}}function ie(i){let e,t;return e=new me({props:{width:i[3],height:i[4],domCanvasRenderer:i[2],stage:i[0],clock:i[6]}}),{c(){G(e.$$.fragment)},l(n){J(e.$$.fragment,n)},m(n,o){N(e,n,o),t=!0},p(n,o){const c={};o&8&&(c.width=n[3]),o&16&&(c.height=n[4]),o&4&&(c.domCanvasRenderer=n[2]),o&1&&(c.stage=n[0]),e.$set(c)},i(n){t||(v(e.$$.fragment,n),t=!0)},o(n){E(e.$$.fragment,n),t=!1},d(n){U(e,n)}}}function ne(i){let e,t;return e=new ye({props:{stage:i[0],pixi:i[1],clock:i[6]}}),{c(){G(e.$$.fragment)},l(n){J(e.$$.fragment,n)},m(n,o){N(e,n,o),t=!0},p(n,o){const c={};o&1&&(c.stage=n[0]),o&2&&(c.pixi=n[1]),e.$set(c)},i(n){t||(v(e.$$.fragment,n),t=!0)},o(n){E(e.$$.fragment,n),t=!1},d(n){U(e,n)}}}function ve(i){let e,t,n,o=`${i[3]}px`,c=`${i[4]}px`,u,a,_,d=i[2]&&ie(i),f=i[1]&&ne(i);const h=i[18].default,s=re(h,i,i[17],null);return{c(){e=z("div"),d&&d.c(),t=Z(),f&&f.c(),n=Z(),s&&s.c(),this.h()},l(r){e=P(r,"DIV",{class:!0});var g=V(e);d&&d.l(g),t=$(g),f&&f.l(g),n=$(g),s&&s.l(g),g.forEach(W),this.h()},h(){Y(e,"class","world svelte-2qhvjl"),A(e,"width",o),A(e,"height",c)},m(r,g){q(r,e,g),d&&d.m(e,null),F(e,t),f&&f.m(e,null),F(e,n),s&&s.m(e,null),u=!0,a||(_=[H(window,"keydown",i[7]),H(window,"keyup",i[8])],a=!0)},p(r,[g]){r[2]?d?(d.p(r,g),g&4&&v(d,1)):(d=ie(r),d.c(),v(d,1),d.m(e,t)):d&&(ee(),E(d,1,1,()=>{d=null}),te()),r[1]?f?(f.p(r,g),g&2&&v(f,1)):(f=ne(r),f.c(),v(f,1),f.m(e,n)):f&&(ee(),E(f,1,1,()=>{f=null}),te()),s&&s.p&&(!u||g&131072)&&le(s,h,r,r[17],u?fe(h,r[17],g,null):ce(r[17]),null),g&8&&o!==(o=`${r[3]}px`)&&A(e,"width",o),g&16&&c!==(c=`${r[4]}px`)&&A(e,"height",c)},i(r){u||(v(d),v(f),v(s,r),u=!0)},o(r){E(d),E(f),E(s,r),u=!1},d(r){r&&W(e),d&&d.d(),f&&f.d(),s&&s.d(r),a=!1,ue(_)}}}function pe(i,e,t){let n,o,c,u,a,_=D,d=()=>(_(),_=M(o,w=>t(16,a=w)),o);i.$$.on_destroy.push(()=>_());let{$$slots:f={},$$scope:h}=e,{stage:s}=e,{pixi:r=null}=e,{domCanvasRenderer:g=null}=e,{worldWidth:y}=e,{worldHeight:p}=e,{viewWidth:k}=e,{viewHeight:b}=e,{viewportWidth:K}=e,{viewportHeight:m}=e;const C=de();se(i,C,w=>t(15,u=w)),oe(()=>{s.update(0),l()});const l=()=>{r==null||r.app.render()},B=w=>{n.handleKeydown(w.key)},O=w=>{n.handleKeyup(w.key)};return i.$$set=w=>{"stage"in w&&t(0,s=w.stage),"pixi"in w&&t(1,r=w.pixi),"domCanvasRenderer"in w&&t(2,g=w.domCanvasRenderer),"worldWidth"in w&&t(3,y=w.worldWidth),"worldHeight"in w&&t(4,p=w.worldHeight),"viewWidth"in w&&t(9,k=w.viewWidth),"viewHeight"in w&&t(10,b=w.viewHeight),"viewportWidth"in w&&t(11,K=w.viewportWidth),"viewportHeight"in w&&t(12,m=w.viewportHeight),"$$scope"in w&&t(17,h=w.$$scope)},i.$$.update=()=>{i.$$.dirty&6&&console.log("pixi, domCanvasRenderer",r,g),i.$$.dirty&1&&t(13,{controller:n}=s,n),i.$$.dirty&8192&&d(t(5,{moving:o}=n,o)),i.$$.dirty&32768&&t(14,{running:c}=u,c),i.$$.dirty&81920&&!c&&a&&C.resume(),i.$$.dirty&49153&&c&&s.update(u.dt),i.$$.dirty&24089&&(s.resize(y,p,k,b,K,m),!c&&l())},[s,r,g,y,p,o,C,B,O,k,b,K,m,n,c,u,a,h,f]}class Ve extends R{constructor(e){super(),T(this,e,pe,ve,I,{stage:0,pixi:1,domCanvasRenderer:2,worldWidth:3,worldHeight:4,viewWidth:9,viewHeight:10,viewportWidth:11,viewportHeight:12})}}function ke(i){let e,t,n,o;const c=i[14].default,u=re(c,i,i[13],null);return{c(){e=z("div"),u&&u.c(),this.h()},l(a){e=P(a,"DIV",{class:!0,tabindex:!0,role:!0});var _=V(e);u&&u.l(_),_.forEach(W),this.h()},h(){Y(e,"class","surface svelte-1ktoghv"),Y(e,"tabindex","0"),Y(e,"role","button")},m(a,_){q(a,e,_),u&&u.m(e,null),i[15](e),t=!0,n||(o=[H(e,"pointerdown",i[1]),H(e,"pointerup",i[2]),H(e,"pointermove",i[3]),H(e,"pointerenter",i[4]),H(e,"pointerleave",i[5]),H(e,"pointercancel",i[6])],n=!0)},p(a,[_]){u&&u.p&&(!t||_&8192)&&le(u,c,a,a[13],t?fe(c,a[13],_,null):ce(a[13]),null)},i(a){t||(v(u,a),t=!0)},o(a){E(u,a),t=!1},d(a){a&&W(e),u&&u.d(a),i[15](null),n=!1,ue(o)}}}function Ee(i,e,t){let{$$slots:n={},$$scope:o}=e,{scale:c=1}=e,{pointing:u=void 0}=e,{pointer_down:a=void 0}=e,{pointer_x:_=void 0}=e,{pointer_y:d=void 0}=e,{cancel_on_leave:f=!0}=e;const h=(l,B)=>{const O=b.getBoundingClientRect();t(9,_=(l-O.left)/c),t(10,d=(B-O.top)/c)},s=l=>{l.shiftKey||l.button>=3||(X(l),h(l.clientX,l.clientY),t(8,a=!0),K())},r=l=>{l.shiftKey||l.button>=3||(X(l),h(l.clientX,l.clientY),t(8,a=!1))},g=l=>{l.shiftKey||(X(l),h(l.clientX,l.clientY))},y=l=>{l.shiftKey||(X(l),h(l.clientX,l.clientY),t(7,u=!0))},p=l=>{l.shiftKey||(X(l),h(l.clientX,l.clientY),t(7,u=!1),f&&a&&(t(8,a=!1),m()))},k=l=>{l.shiftKey||(X(l),a&&(t(8,a=!1),m()))};let b;const K=()=>{document.activeElement!==b&&b.focus()},m=()=>{document.activeElement===b&&b.blur()};function C(l){x[l?"unshift":"push"](()=>{b=l,t(0,b)})}return i.$$set=l=>{"scale"in l&&t(11,c=l.scale),"pointing"in l&&t(7,u=l.pointing),"pointer_down"in l&&t(8,a=l.pointer_down),"pointer_x"in l&&t(9,_=l.pointer_x),"pointer_y"in l&&t(10,d=l.pointer_y),"cancel_on_leave"in l&&t(12,f=l.cancel_on_leave),"$$scope"in l&&t(13,o=l.$$scope)},[b,s,r,g,y,p,k,u,a,_,d,c,f,o,n,C]}class We extends R{constructor(e){super(),T(this,e,Ee,ke,I,{scale:11,pointing:7,pointer_down:8,pointer_x:9,pointer_y:10,cancel_on_leave:12})}}function Ce(i){let e,t,n,o,c,u;function a(h){i[4](h)}function _(h){i[5](h)}function d(h){i[6](h)}let f={};return i[0]!==void 0&&(f.pointer_down=i[0]),i[1]!==void 0&&(f.pointer_x=i[1]),i[2]!==void 0&&(f.pointer_y=i[2]),t=new We({props:f}),x.push(()=>j(t,"pointer_down",a)),x.push(()=>j(t,"pointer_x",_)),x.push(()=>j(t,"pointer_y",d)),{c(){e=z("div"),G(t.$$.fragment),this.h()},l(h){e=P(h,"DIV",{class:!0});var s=V(e);J(t.$$.fragment,s),s.forEach(W),this.h()},h(){Y(e,"class","surface-wrapper svelte-1w41ucz")},m(h,s){q(h,e,s),N(t,e,null),u=!0},p(h,[s]){const r={};!n&&s&1&&(n=!0,r.pointer_down=h[0],L(()=>n=!1)),!o&&s&2&&(o=!0,r.pointer_x=h[1],L(()=>o=!1)),!c&&s&4&&(c=!0,r.pointer_y=h[2],L(()=>c=!1)),t.$set(r)},i(h){u||(v(t.$$.fragment,h),u=!0)},o(h){E(t.$$.fragment,h),u=!1},d(h){h&&W(e),U(t)}}}function He(i,e,t){let{controller:n}=e,o=!1,c,u;function a(f){o=f,t(0,o)}function _(f){c=f,t(1,c)}function d(f){u=f,t(2,u)}return i.$$set=f=>{"controller"in f&&t(3,n=f.controller)},i.$$.update=()=>{i.$$.dirty&14&&c!==void 0&&n.setPointerLocation(c,u),i.$$.dirty&9&&n.pointer_down!==o&&n.setPointerDown(o)},[o,c,u,n,a,_,d]}class Ie extends R{constructor(e){super(),T(this,e,He,Ce,I,{controller:3})}}class Re{constructor(){S(this,"width",-1);S(this,"height",-1);S(this,"canvas",null);S(this,"ctx",null);S(this,"dirty",_e(!1))}setCanvas(e){if(this.canvas=e,!(this.ctx=e.getContext("2d")))throw Error("Failed to get canvas context");this.width!==-1&&this.height!==-1&&(e.width=this.width,e.height=this.height),this.dirty.set(!0)}unsetCanvas(){this.canvas=null,this.ctx=null}resize(e,t){console.log("[renderer] resize, width, height",e,t),this.width=e,this.height=t,this.canvas&&(this.canvas.width=e,this.canvas.height=t),this.dirty.set(!0)}clear(){const{ctx:e,width:t,height:n}=this;if(!e)throw Error("Expected rendering context");if(t===-1||n===-1)throw Error("Expected renderer dimensions");e.clearRect(0,0,t,n)}render(e,t){const{ctx:n}=this;if(!n)throw Error("Expected rendering context");if(this.width===-1||this.height===-1)throw Error("Expected renderer dimensions");this.dirty.set(!1);for(const o of e)if(!o.invisible){if(n.beginPath(),n.strokeStyle=o.colorStr||"#fff",o.body._circle)Ke(n,o.body,t);else throw Error("TODO");n.stroke(),o.text&&De(n,o,t)}}}const Ke=(i,e,t)=>{const{x:n,y:o}=e,c=e.radius*e.scale,u=(n-t.x)*t.scale+t.width/2,a=(o-t.y)*t.scale+t.height/2;i.moveTo(u+c,a),i.arc(u,a,c,0,Math.PI*2)},De=(i,e,t)=>{const n=(e.x-t.x)*t.scale+t.width/2+e.textOffsetX,o=(e.y-t.y)*t.scale+t.height/2+e.textOffsetY;i.textAlign="center",i.textBaseline="middle",i.font=e.font||"30px sans-serif",i.fillText(e.text,n,o)};export{Re as D,Ie as S,Ve as W};