import{n as P,e as X,b as Y,l as z,d as E,m as x,i as M,o as j,a as K,a4 as ne,E as A,G as S,L as re,M as U,T as oe,s as Q,c as Z,p as O,J as R,U as se,V as le,W as ce,C as fe,K as B}from"./scheduler.EKw-xcnK.js";import{S as V,i as I,t as y,g as $,b as C,e as ee,c as F,a as G,m as J,d as N,f as L}from"./index.nrQb7by4.js";import{g as ue}from"./clock.8qoZqBH_.js";import{s as D}from"./dom.z-RU6ZBL.js";import{w as ae}from"./index.mvauKzP3.js";function de(i){let e,t;return{c(){e=X("div"),t=X("canvas"),this.h()},l(n){e=Y(n,"DIV",{class:!0});var r=z(e);t=Y(r,"CANVAS",{}),z(t).forEach(E),r.forEach(E),this.h()},h(){x(e,"class","canvas svelte-cdatl6")},m(n,r){M(n,e,r),j(e,t),i[11](t)},p:K,i:K,o:K,d(n){n&&E(e),i[11](null)}}}function he(i,e,t){let n,r,s=K,f=()=>(s(),s=A(n,m=>t(9,r=m)),n),u,_=K,h=()=>(_(),_=A(g,m=>t(10,u=m)),g);i.$$.on_destroy.push(()=>s()),i.$$.on_destroy.push(()=>_());let{width:c}=e,{height:d}=e,{domCanvasRenderer:a}=e,{stage:l}=e,{clock:g}=e;h();let b,p,k;const v=(m,W)=>{a?.resize(m,W),t(7,p=m),t(8,k=W)};ne(()=>(a?.setCanvas(b),()=>{a?.unsetCanvas()}));function H(m){S[m?"unshift":"push"](()=>{b=m,t(1,b)})}return i.$$set=m=>{"width"in m&&t(3,c=m.width),"height"in m&&t(4,d=m.height),"domCanvasRenderer"in m&&t(5,a=m.domCanvasRenderer),"stage"in m&&t(6,l=m.stage),"clock"in m&&h(t(0,g=m.clock))},i.$$.update=()=>{i.$$.dirty&410&&b&&(p!==c||k!==d)&&v(c,d),i.$$.dirty&32&&f(t(2,n=a?.dirty)),i.$$.dirty&1632&&a?.ctx&&(u.running||r)&&(a.clear(),a.render(l.sim.entities,l.$camera))},[g,b,n,c,d,a,l,p,k,r,u,H]}class _e extends V{constructor(e){super(),I(this,e,he,de,P,{width:3,height:4,domCanvasRenderer:5,stage:6,clock:0})}}function ge(i,e,t){let n,r,s,f=K,u=()=>(f(),f=A(c,l=>t(6,s=l)),c);i.$$.on_destroy.push(()=>f());let{pixi:_}=e,{stage:h}=e,{clock:c}=e;u();const{container:d,camera:a}=h;return re(i,a,l=>t(5,r=l)),_.current_scene.addChild(d),U(()=>{_.current_scene.removeChild(d)}),U(()=>{_.app.render(),_.app.start()}),i.$$set=l=>{"pixi"in l&&t(2,_=l.pixi),"stage"in l&&t(3,h=l.stage),"clock"in l&&u(t(0,c=l.clock))},i.$$.update=()=>{i.$$.dirty&64&&t(4,{running:n}=s,n),i.$$.dirty&52&&(n?_.app.start():(_.app.stop(),a.setPosition(r.x,r.y,{hard:!0})))},[c,a,_,h,n,r,s]}class we extends V{constructor(e){super(),I(this,e,ge,null,P,{pixi:2,stage:3,clock:0})}}function te(i){let e,t;return e=new _e({props:{width:i[3],height:i[4],domCanvasRenderer:i[2],stage:i[0],clock:i[6]}}),{c(){F(e.$$.fragment)},l(n){G(e.$$.fragment,n)},m(n,r){J(e,n,r),t=!0},p(n,r){const s={};r&8&&(s.width=n[3]),r&16&&(s.height=n[4]),r&4&&(s.domCanvasRenderer=n[2]),r&1&&(s.stage=n[0]),e.$set(s)},i(n){t||(y(e.$$.fragment,n),t=!0)},o(n){C(e.$$.fragment,n),t=!1},d(n){N(e,n)}}}function ie(i){let e,t;return e=new we({props:{stage:i[0],pixi:i[1],clock:i[6]}}),{c(){F(e.$$.fragment)},l(n){G(e.$$.fragment,n)},m(n,r){J(e,n,r),t=!0},p(n,r){const s={};r&1&&(s.stage=n[0]),r&2&&(s.pixi=n[1]),e.$set(s)},i(n){t||(y(e.$$.fragment,n),t=!0)},o(n){C(e.$$.fragment,n),t=!1},d(n){N(e,n)}}}function me(i){let e,t,n,r=`${i[3]}px`,s=`${i[4]}px`,f,u,_,h=i[2]&&te(i),c=i[1]&&ie(i);const d=i[18].default,a=oe(d,i,i[17],null);return{c(){e=X("div"),h&&h.c(),t=Q(),c&&c.c(),n=Q(),a&&a.c(),this.h()},l(l){e=Y(l,"DIV",{class:!0});var g=z(e);h&&h.l(g),t=Z(g),c&&c.l(g),n=Z(g),a&&a.l(g),g.forEach(E),this.h()},h(){x(e,"class","world svelte-2qhvjl"),O(e,"width",r),O(e,"height",s)},m(l,g){M(l,e,g),h&&h.m(e,null),j(e,t),c&&c.m(e,null),j(e,n),a&&a.m(e,null),f=!0,u||(_=[R(window,"keydown",i[7]),R(window,"keyup",i[8])],u=!0)},p(l,[g]){l[2]?h?(h.p(l,g),g&4&&y(h,1)):(h=te(l),h.c(),y(h,1),h.m(e,t)):h&&($(),C(h,1,1,()=>{h=null}),ee()),l[1]?c?(c.p(l,g),g&2&&y(c,1)):(c=ie(l),c.c(),y(c,1),c.m(e,n)):c&&($(),C(c,1,1,()=>{c=null}),ee()),a&&a.p&&(!f||g&131072)&&se(a,d,l,l[17],f?ce(d,l[17],g,null):le(l[17]),null),g&8&&r!==(r=`${l[3]}px`)&&O(e,"width",r),g&16&&s!==(s=`${l[4]}px`)&&O(e,"height",s)},i(l){f||(y(h),y(c),y(a,l),f=!0)},o(l){C(h),C(c),C(a,l),f=!1},d(l){l&&E(e),h&&h.d(),c&&c.d(),a&&a.d(l),u=!1,fe(_)}}}function ve(i,e,t){let n,r,s,f,u,_=K,h=()=>(_(),_=A(r,w=>t(16,u=w)),r);i.$$.on_destroy.push(()=>_());let{$$slots:c={},$$scope:d}=e,{stage:a}=e,{pixi:l=null}=e,{domCanvasRenderer:g=null}=e,{worldWidth:b}=e,{worldHeight:p}=e,{viewWidth:k}=e,{viewHeight:v}=e,{viewportWidth:H}=e,{viewportHeight:m}=e;const W=ue();re(i,W,w=>t(15,f=w)),ne(()=>{a.update(0),o()});const o=()=>{l?.app.render()},q=w=>{n.handleKeydown(w.key)},T=w=>{n.handleKeyup(w.key)};return i.$$set=w=>{"stage"in w&&t(0,a=w.stage),"pixi"in w&&t(1,l=w.pixi),"domCanvasRenderer"in w&&t(2,g=w.domCanvasRenderer),"worldWidth"in w&&t(3,b=w.worldWidth),"worldHeight"in w&&t(4,p=w.worldHeight),"viewWidth"in w&&t(9,k=w.viewWidth),"viewHeight"in w&&t(10,v=w.viewHeight),"viewportWidth"in w&&t(11,H=w.viewportWidth),"viewportHeight"in w&&t(12,m=w.viewportHeight),"$$scope"in w&&t(17,d=w.$$scope)},i.$$.update=()=>{i.$$.dirty&6&&console.log("pixi, domCanvasRenderer",l,g),i.$$.dirty&1&&t(13,{controller:n}=a,n),i.$$.dirty&8192&&h(t(5,{moving:r}=n,r)),i.$$.dirty&32768&&t(14,{running:s}=f,s),i.$$.dirty&81920&&!s&&u&&W.resume(),i.$$.dirty&49153&&s&&a.update(f.dt),i.$$.dirty&24089&&(a.resize(b,p,k,v,H,m),!s&&o())},[a,l,g,b,p,r,W,q,T,k,v,H,m,n,s,f,u,d,c]}class Se extends V{constructor(e){super(),I(this,e,ve,me,P,{stage:0,pixi:1,domCanvasRenderer:2,worldWidth:3,worldHeight:4,viewWidth:9,viewHeight:10,viewportWidth:11,viewportHeight:12})}}function be(i){let e,t,n,r;const s=i[14].default,f=oe(s,i,i[13],null);return{c(){e=X("div"),f&&f.c(),this.h()},l(u){e=Y(u,"DIV",{class:!0,tabindex:!0,role:!0});var _=z(e);f&&f.l(_),_.forEach(E),this.h()},h(){x(e,"class","surface svelte-1ktoghv"),x(e,"tabindex","0"),x(e,"role","button")},m(u,_){M(u,e,_),f&&f.m(e,null),i[15](e),t=!0,n||(r=[R(e,"pointerdown",i[1]),R(e,"pointerup",i[2]),R(e,"pointermove",i[3]),R(e,"pointerenter",i[4]),R(e,"pointerleave",i[5]),R(e,"pointercancel",i[6])],n=!0)},p(u,[_]){f&&f.p&&(!t||_&8192)&&se(f,s,u,u[13],t?ce(s,u[13],_,null):le(u[13]),null)},i(u){t||(y(f,u),t=!0)},o(u){C(f,u),t=!1},d(u){u&&E(e),f&&f.d(u),i[15](null),n=!1,fe(r)}}}function ye(i,e,t){let{$$slots:n={},$$scope:r}=e,{scale:s=1}=e,{pointing:f=void 0}=e,{pointer_down:u=void 0}=e,{pointer_x:_=void 0}=e,{pointer_y:h=void 0}=e,{cancel_on_leave:c=!0}=e;const d=(o,q)=>{const T=v.getBoundingClientRect();t(9,_=(o-T.left)/s),t(10,h=(q-T.top)/s)},a=o=>{o.shiftKey||o.button>=3||(D(o),d(o.clientX,o.clientY),t(8,u=!0),H())},l=o=>{o.shiftKey||o.button>=3||(D(o),d(o.clientX,o.clientY),t(8,u=!1))},g=o=>{o.shiftKey||(D(o),d(o.clientX,o.clientY))},b=o=>{o.shiftKey||(D(o),d(o.clientX,o.clientY),t(7,f=!0))},p=o=>{o.shiftKey||(D(o),d(o.clientX,o.clientY),t(7,f=!1),c&&u&&(t(8,u=!1),m()))},k=o=>{o.shiftKey||(D(o),u&&(t(8,u=!1),m()))};let v;const H=()=>{document.activeElement!==v&&v.focus()},m=()=>{document.activeElement===v&&v.blur()};function W(o){S[o?"unshift":"push"](()=>{v=o,t(0,v)})}return i.$$set=o=>{"scale"in o&&t(11,s=o.scale),"pointing"in o&&t(7,f=o.pointing),"pointer_down"in o&&t(8,u=o.pointer_down),"pointer_x"in o&&t(9,_=o.pointer_x),"pointer_y"in o&&t(10,h=o.pointer_y),"cancel_on_leave"in o&&t(12,c=o.cancel_on_leave),"$$scope"in o&&t(13,r=o.$$scope)},[v,a,l,g,b,p,k,f,u,_,h,s,c,r,n,W]}class pe extends V{constructor(e){super(),I(this,e,ye,be,P,{scale:11,pointing:7,pointer_down:8,pointer_x:9,pointer_y:10,cancel_on_leave:12})}}function ke(i){let e,t,n,r,s,f;function u(d){i[4](d)}function _(d){i[5](d)}function h(d){i[6](d)}let c={};return i[0]!==void 0&&(c.pointer_down=i[0]),i[1]!==void 0&&(c.pointer_x=i[1]),i[2]!==void 0&&(c.pointer_y=i[2]),t=new pe({props:c}),S.push(()=>L(t,"pointer_down",u)),S.push(()=>L(t,"pointer_x",_)),S.push(()=>L(t,"pointer_y",h)),{c(){e=X("div"),F(t.$$.fragment),this.h()},l(d){e=Y(d,"DIV",{class:!0});var a=z(e);G(t.$$.fragment,a),a.forEach(E),this.h()},h(){x(e,"class","surface-wrapper svelte-1w41ucz")},m(d,a){M(d,e,a),J(t,e,null),f=!0},p(d,[a]){const l={};!n&&a&1&&(n=!0,l.pointer_down=d[0],B(()=>n=!1)),!r&&a&2&&(r=!0,l.pointer_x=d[1],B(()=>r=!1)),!s&&a&4&&(s=!0,l.pointer_y=d[2],B(()=>s=!1)),t.$set(l)},i(d){f||(y(t.$$.fragment,d),f=!0)},o(d){C(t.$$.fragment,d),f=!1},d(d){d&&E(e),N(t)}}}function Ce(i,e,t){let{controller:n}=e,r=!1,s,f;function u(c){r=c,t(0,r)}function _(c){s=c,t(1,s)}function h(c){f=c,t(2,f)}return i.$$set=c=>{"controller"in c&&t(3,n=c.controller)},i.$$.update=()=>{i.$$.dirty&14&&s!==void 0&&n.setPointerLocation(s,f),i.$$.dirty&9&&n.pointer_down!==r&&n.setPointerDown(r)},[r,s,f,n,u,_,h]}class Xe extends V{constructor(e){super(),I(this,e,Ce,ke,P,{controller:3})}}class Ye{width=-1;height=-1;canvas=null;ctx=null;dirty=ae(!1);setCanvas(e){if(this.canvas=e,!(this.ctx=e.getContext("2d")))throw Error("Failed to get canvas context");this.width!==-1&&this.height!==-1&&(e.width=this.width,e.height=this.height),this.dirty.set(!0)}unsetCanvas(){this.canvas=null,this.ctx=null}resize(e,t){console.log("[renderer] resize, width, height",e,t),this.width=e,this.height=t,this.canvas&&(this.canvas.width=e,this.canvas.height=t),this.dirty.set(!0)}clear(){const{ctx:e,width:t,height:n}=this;if(!e)throw Error("Expected rendering context");if(t===-1||n===-1)throw Error("Expected renderer dimensions");e.clearRect(0,0,t,n)}render(e,t){const{ctx:n}=this;if(!n)throw Error("Expected rendering context");if(this.width===-1||this.height===-1)throw Error("Expected renderer dimensions");this.dirty.set(!1);for(const r of e)if(!r.invisible){if(n.beginPath(),n.strokeStyle=r.colorStr||"#fff",r.body._circle)Ee(n,r.body,t);else throw Error("TODO");n.stroke(),r.text&&We(n,r,t)}}}const Ee=(i,e,t)=>{const{x:n,y:r}=e,s=e.radius*e.scale,f=(n-t.x)*t.scale+t.width/2,u=(r-t.y)*t.scale+t.height/2;i.moveTo(f+s,u),i.arc(f,u,s,0,Math.PI*2)},We=(i,e,t)=>{const n=(e.x-t.x)*t.scale+t.width/2+e.textOffsetX,r=(e.y-t.y)*t.scale+t.height/2+e.textOffsetY;i.textAlign="center",i.textBaseline="middle",i.font=e.font||"30px sans-serif",i.fillText(e.text,n,r)};export{Ye as D,Xe as S,Se as W};