import{n as ve,e as O,s as X,b as N,l as G,d as v,c as K,m,p as xe,i as A,L as Ye,a as Se,E as yt,v as Et,r as ce,o as C,J as Y,C as je,a6 as Tt,a4 as Ct,T as pt,x as re,y as ae,g as oe,N as ee,Q as ie,U as gt,V as bt,W as kt,G as Dt,K as It,I as $e,F as Ot,A as Nt}from"../chunks/scheduler.EKw-xcnK.js";import{S as Oe,i as Ne,c as ue,a as fe,m as de,t as L,b as F,d as me,g as ke,e as we,f as Rt}from"../chunks/index.nrQb7by4.js";import{g as Qe}from"../chunks/clock.8qoZqBH_.js";import{D as wt,a as Ht,S as Ut,d as Wt,E as _e,u as Pt,c as zt,f as Ge}from"../chunks/stage.Aml8gS6Q.js";import{s as Ce}from"../chunks/dom.z-RU6ZBL.js";import{g as At}from"../chunks/dimensions.tILrlVrF.js";import{e as De}from"../chunks/dom.hOmha4Dm.js";import{W as Lt,S as Mt,D as Yt}from"../chunks/DomCanvasRenderer.2zY5nhLI.js";import{b as vt}from"../chunks/pixi.tNwfo43o.js";import{g as Ft}from"../chunks/idle.AHOkxIJN.js";import{a as j}from"../chunks/random.oPe0JuqT.js";import{w as Xt}from"../chunks/index.mvauKzP3.js";import{e as et,u as Kt,o as Vt}from"../chunks/each.JsaE_8Dp.js";import{l as Be,s as qe}from"../chunks/storage.11dQHD0n.js";import{A as Gt}from"../chunks/AppDialog.ApvbW4fH.js";import{A as Bt}from"../chunks/AppControlsTable.WMg0LF_e.js";const St={freezeCamera:!1,playerSpeed:.6,playerStrength:wt,timeDilation:Ht};function qt(l){let e,t,s,n,i;return t=new Lt({props:{worldWidth:l[5],worldHeight:l[6],viewWidth:l[3],viewHeight:l[4],viewportWidth:l[1],viewportHeight:l[2],stage:l[0],pixi:l[12],domCanvasRenderer:l[10]}}),n=new Mt({props:{controller:l[7]}}),{c(){e=O("div"),ue(t.$$.fragment),s=X(),ue(n.$$.fragment),this.h()},l(o){e=N(o,"DIV",{class:!0});var r=G(e);fe(t.$$.fragment,r),r.forEach(v),s=K(o),fe(n.$$.fragment,o),this.h()},h(){m(e,"class","view svelte-1fxwwt5"),xe(e,"transform",l[9])},m(o,r){A(o,e,r),de(t,e,null),A(o,s,r),de(n,o,r),i=!0},p(o,[r]){const a={};r&32&&(a.worldWidth=o[5]),r&64&&(a.worldHeight=o[6]),r&8&&(a.viewWidth=o[3]),r&16&&(a.viewHeight=o[4]),r&2&&(a.viewportWidth=o[1]),r&4&&(a.viewportHeight=o[2]),r&1&&(a.stage=o[0]),r&1024&&(a.domCanvasRenderer=o[10]),t.$set(a),r&512&&xe(e,"transform",o[9]);const f={};r&128&&(f.controller=o[7]),n.$set(f)},i(o){i||(L(t.$$.fragment,o),L(n.$$.fragment,o),i=!0)},o(o){F(t.$$.fragment,o),F(n.$$.fragment,o),i=!1},d(o){o&&(v(e),v(s)),me(t),me(n,o)}}}const Jt=3e4;function jt(l,e,t){let s,n,i,o=Se,r=()=>(o(),o=yt(H,T=>t(21,i=T)),H),a,f;l.$$.on_destroy.push(()=>o());let{viewportWidth:b}=e,{viewportHeight:g}=e,{viewWidth:S}=e,{viewHeight:h}=e,{worldWidth:d}=e,{worldHeight:M}=e,{cameraUnlocked:R=!1}=e,{finish:E}=e,{stage:w}=e,{enableDomCanvasRenderer:u=!1}=e;const c=Qe();Ye(l,c,T=>t(18,a=T));const y=vt(),k=Ft();Ye(l,k,T=>t(19,f=T));let W,H,D,B=!1;const P=()=>{!B&&w.time>Jt&&(B=!0,E(i))},_=(T,q,U,Q)=>{if(T===U&&q===Q)return"";const te=Math.min(T/U,q/Q);return`scale3d(${te}, ${te}, 1)`};return l.$$set=T=>{"viewportWidth"in T&&t(1,b=T.viewportWidth),"viewportHeight"in T&&t(2,g=T.viewportHeight),"viewWidth"in T&&t(3,S=T.viewWidth),"viewHeight"in T&&t(4,h=T.viewHeight),"worldWidth"in T&&t(5,d=T.worldWidth),"worldHeight"in T&&t(6,M=T.worldHeight),"cameraUnlocked"in T&&t(14,R=T.cameraUnlocked),"finish"in T&&t(15,E=T.finish),"stage"in T&&t(0,w=T.stage),"enableDomCanvasRenderer"in T&&t(16,u=T.enableDomCanvasRenderer)},l.$$.update=()=>{l.$$.dirty&16384&&t(0,w.freezeCamera=!R,w),l.$$.dirty&1&&console.log("UnlockStage.svelte stage",w),l.$$.dirty&65536&&t(10,s=u?new Yt:null),l.$$.dirty&524288&&f&&c.pause(),l.$$.dirty&1&&t(17,{camera:W,scores:H,controller:D}=w,W,r(t(8,H)),(t(7,D),t(0,w),t(1,b),t(2,g),t(3,S),t(4,h),t(5,d),t(6,M),t(14,R))),l.$$.dirty&262145&&P(),l.$$.dirty&147457&&R&&W.setPosition(w.player.x,w.player.y),l.$$.dirty&130&&D&&t(7,D.viewportWidth=b,D),l.$$.dirty&132&&D&&t(7,D.viewportHeight=g,D),l.$$.dirty&136&&D&&t(7,D.viewWidth=S,D),l.$$.dirty&144&&D&&t(7,D.viewHeight=h,D),l.$$.dirty&160&&D&&t(7,D.worldWidth=d,D),l.$$.dirty&192&&D&&t(7,D.worldHeight=M,D),l.$$.dirty&120&&t(9,n=_(S,h,d,M))},[w,b,g,S,h,d,M,D,H,n,s,c,y,k,R,E,u,W,a,f]}class Qt extends Oe{constructor(e){super(),Ne(this,e,jt,qt,ve,{viewportWidth:1,viewportHeight:2,viewWidth:3,viewHeight:4,worldWidth:5,worldHeight:6,cameraUnlocked:14,finish:15,stage:0,enableDomCanvasRenderer:16})}}const Zt=[.833,.76,.72],xt=[.611,1,.7],Le=[.389,.8,.6],$t=[.12,.16,.5],tt=[0,1,.5],el="🐢",Ie=["💧","🌱","🌳","🌿","🌲"],tl="🪨",ll=.6,sl=wt*.96,nl=100,Me=.03,ol=.21,il=100,be=l=>l*1.4,lt=l=>({bonus:l.bonus});class rl extends Ut{finished=!1;bonus=0;player;planet;rock;moons=new Set;moonsArray=[];moonFragments=new Set;planetFragments=new Set;rockFragments=new Set;lastPlayerX=0;lastPlayerY=0;scores;updateScores(){const e=lt(this);Wt(e,Et(this.scores))||this.scores.set(e)}constructor(e){super(e);const{data:t}=e,s=850,n=502;this.freezeCamera||this.camera.setPosition(s,n);const{sim:i,collisions:o,controller:r,moons:a}=this;console.log("setup stage, sim, controller",i,r);const f=this.player=new _e(o.create_circle(s,n,nl));f.text=el,f.fontSize=be(f.radius),f.speed=t?.playerSpeed??ll,f.strength=t?.playerStrength??sl,f.color=Zt,this.addEntity(f);const b=1618,g=this.planet=new _e(o.create_circle(-1450+b/2,-1750+b/2,b));g.text=Ie[0],g.textOffsetX=850,g.textOffsetY=1150,g.fontSize=200,g.color=xt,this.addEntity(g);const S=262,h=this.rock=new _e(o.create_circle(2275+S/2,1200+S/2,S));h.speed=ol,h.directionX=-1,h.directionY=-.7,h.text=tl,h.fontSize=be(h.radius),h.color=$t,this.addEntity(h);let d=new _e(o.create_circle(1660,1012,43));d.text=Ie[1],d.fontSize=be(d.radius),d.speed=Me,d.color=Le,this.addEntity(d),a.add(d),d=new _e(o.create_circle(1420,1174,72)),d.text=Ie[2],d.fontSize=be(d.radius),d.speed=Me,d.color=Le,this.addEntity(d),a.add(d),d=new _e(o.create_circle(2010,872,19)),d.text=Ie[3],d.fontSize=be(d.radius),d.speed=Me,d.color=Le,this.addEntity(d),a.add(d),d=new _e(o.create_circle(1870,776,27)),d.text=Ie[4],d.fontSize=be(d.radius),d.speed=Me,d.color=Le,this.addEntity(d),a.add(d),this.moonsArray.push(...a),this.scores=Xt(lt(this))}update(e){const t=this.timeDilation*Math.min(Math.max(e,0),il);super.update(t);const{collisions:s,controller:n,player:i,planet:o,rock:r,moons:a,planetFragments:f,moonFragments:b,rockFragments:g,$camera:S}=this;Pt(n,i,S);let h=null,d=null,M=null,R=!1;this.sim.update(t,(u,c,y)=>{zt(u,c,y);const k=r===u?u:r===c?c:null,W=o===u?u:o===c?c:null,H=a.has(u)?u:a.has(c)?c:null,D=g.has(u)?u:g.has(c)?c:null,B=f.has(u)?u:f.has(c)?c:null,P=b.has(u)?u:b.has(c)?c:null,_=k||D||B||P;if(H&&_){const T=_===k,q=_===P,U=Ge(H,s,12);R=!0,(M||(M=[])).push(...U),this.removeEntity(H);for(const Q of U)Q.speed=T?j(_.speed*1.2,_.speed*2.44):q?j(_.speed/2,_.speed*2):j(_.speed/8,_.speed),Q.directionX=T?j(_.directionX/2,_.directionX*2):q?j(_.directionX/2,_.directionX*2):j(-_.directionX/2,_.directionX),Q.directionY=T?j(_.directionY/2,_.directionY*2):q?j(_.directionY/2,_.directionY*2):j(-_.directionY/2,_.directionY),Q.color=tt}else if(k&&W){this.removeEntity(k),this.removeEntity(W);const T=Ge(W,s,42);R=!0,(d||(d=[])).push(...T);for(const U of T)U.speed=k.speed*.2*j(.5,1),U.directionX=j(-k.directionX/2,k.directionX/2),U.directionY=j(-k.directionY/2,k.directionY/2),U.color=tt;const q=Ge(k,s,210);(h||(h=[])).push(...q);for(const U of q)U.speed=j(k.speed/2,k.speed*2),U.directionX=j(-k.directionX*2,k.directionX*.25),U.directionY=j(-k.directionY*2,k.directionY*.25)}else P&&(W||B||D)&&this.removeEntity(P)},(u,c)=>{const y=u.entity,k=c.entity;if(y.dead||k.dead||y.disableSimulation||k.disableSimulation)return!1;const W=i===y?y:i===k?k:null,H=o===y?y:o===k?k:null,D=a.has(y)?y:a.has(k)?k:null;return!(W&&(H||D))});const{x:E,y:w}=i;if(this.freezeCamera){const u=i.radius+1,c=S.left+u,y=S.right-u;E<c?i.x=c:E>y&&(i.x=y);const k=S.top+u,W=S.bottom-u;w<k?i.y=k:w>W&&(i.y=W)}else(E!==this.lastPlayerX||w!==this.lastPlayerY)&&(this.camera.setPosition(E,w),this.lastPlayerX=E,this.lastPlayerY=w);if(h)for(const u of h)g.add(u),this.addEntity(u);if(d)for(const u of d)f.add(u),this.addEntity(u);if(M)for(const u of M)b.add(u),this.addEntity(u);R&&this.updateScores()}}function st(l){let e,t,s=l[8]&&nt(l);return{c(){e=O("div"),s&&s.c(),this.h()},l(n){e=N(n,"DIV",{class:!0});var i=G(e);s&&s.l(i),i.forEach(v),this.h()},h(){m(e,"class","stage-data-controls-wrapper svelte-18u3mmz")},m(n,i){A(n,e,i),s&&s.m(e,null),t=!0},p(n,i){n[8]?s?(s.p(n,i),i[0]&256&&L(s,1)):(s=nt(n),s.c(),L(s,1),s.m(e,null)):s&&(ke(),F(s,1,1,()=>{s=null}),we())},i(n){t||(L(s),t=!0)},o(n){F(s),t=!1},d(n){n&&v(e),s&&s.d()}}}function nt(l){let e,t,s,n,i,o,r,a,f,b,g,S,h,d,M,R,E,w,u,c,y,k,W,H,D,B,P,_,T="⏮",q,U,Q,te,pe,Z,le="→",ye,x,Re="↠",Ee,$,He="⇶",ge,se,Te,Ue;function We(I,z){return I[12]?cl:al}let p=We(l),V=p(l);const he=l[26].default,J=pt(he,l,l[25],null);return{c(){e=O("div"),t=O("label"),s=O("input"),n=re(" free camera"),i=X(),o=O("div"),r=O("input"),a=X(),f=O("label"),b=O("input"),g=re(" player strength"),S=X(),h=O("div"),d=O("input"),M=X(),R=O("label"),E=O("input"),w=re(" player speed"),u=X(),c=O("div"),y=O("input"),k=X(),W=O("label"),H=O("input"),D=re(" time dilation"),B=X(),P=O("div"),_=O("button"),_.textContent=T,q=X(),U=O("button"),V.c(),pe=X(),Z=O("button"),Z.textContent=le,ye=X(),x=O("button"),x.textContent=Re,Ee=X(),$=O("button"),$.textContent=He,ge=X(),J&&J.c(),this.h()},l(I){e=N(I,"DIV",{class:!0});var z=G(e);t=N(z,"LABEL",{});var Fe=G(t);s=N(Fe,"INPUT",{type:!0}),n=ae(Fe," free camera"),Fe.forEach(v),i=K(z),o=N(z,"DIV",{class:!0});var Pe=G(o);r=N(Pe,"INPUT",{type:!0,min:!0,max:!0,step:!0}),a=K(Pe),f=N(Pe,"LABEL",{});var Xe=G(f);b=N(Xe,"INPUT",{type:!0,step:!0,class:!0}),g=ae(Xe," player strength"),Xe.forEach(v),Pe.forEach(v),S=K(z),h=N(z,"DIV",{class:!0});var ze=G(h);d=N(ze,"INPUT",{type:!0,min:!0,max:!0,step:!0}),M=K(ze),R=N(ze,"LABEL",{});var Ke=G(R);E=N(Ke,"INPUT",{type:!0,step:!0,class:!0}),w=ae(Ke," player speed"),Ke.forEach(v),ze.forEach(v),u=K(z),c=N(z,"DIV",{class:!0});var Ae=G(c);y=N(Ae,"INPUT",{type:!0,min:!0,max:!0,step:!0}),k=K(Ae),W=N(Ae,"LABEL",{});var Ve=G(W);H=N(Ve,"INPUT",{type:!0,step:!0,class:!0}),D=ae(Ve," time dilation"),Ve.forEach(v),Ae.forEach(v),B=K(z),P=N(z,"DIV",{class:!0});var ne=G(P);_=N(ne,"BUTTON",{title:!0,"aria-label":!0,class:!0,"data-svelte-h":!0}),oe(_)!=="svelte-mo0409"&&(_.textContent=T),q=K(ne),U=N(ne,"BUTTON",{title:!0,"aria-label":!0,class:!0});var Ze=G(U);V.l(Ze),Ze.forEach(v),pe=K(ne),Z=N(ne,"BUTTON",{title:!0,"aria-label":!0,class:!0,"data-svelte-h":!0}),oe(Z)!=="svelte-1slrg40"&&(Z.textContent=le),ye=K(ne),x=N(ne,"BUTTON",{title:!0,"aria-label":!0,class:!0,"data-svelte-h":!0}),oe(x)!=="svelte-1r87iqa"&&(x.textContent=Re),Ee=K(ne),$=N(ne,"BUTTON",{title:!0,"aria-label":!0,class:!0,"data-svelte-h":!0}),oe($)!=="svelte-17eaxdx"&&($.textContent=He),ne.forEach(v),z.forEach(v),ge=K(I),J&&J.l(I),this.h()},h(){m(s,"type","checkbox"),m(r,"type","range"),m(r,"min",0),m(r,"max",10),m(r,"step",.1),m(b,"type","number"),m(b,"step",.1),m(b,"class","svelte-18u3mmz"),m(o,"class","control svelte-18u3mmz"),m(d,"type","range"),m(d,"min",0),m(d,"max",10),m(d,"step",.1),m(E,"type","number"),m(E,"step",.1),m(E,"class","svelte-18u3mmz"),m(h,"class","control svelte-18u3mmz"),m(y,"type","range"),m(y,"min",0),m(y,"max",10),m(y,"step",.1),m(H,"type","number"),m(H,"step",.1),m(H,"class","svelte-18u3mmz"),m(c,"class","control svelte-18u3mmz"),m(_,"title","[Spacebar] Reset the simulation"),m(_,"aria-label","Reset the simulation"),m(_,"class","svelte-18u3mmz"),m(U,"title",Q="[Backtick] "+(l[12]?"Pause the simulation":"Play the simulation")),m(U,"aria-label",te=l[12]?"Pause the simulation":"Play the simulation"),m(U,"class","svelte-18u3mmz"),m(Z,"title","[]] Simulate 1 tick"),m(Z,"aria-label","Simulate 1 tick"),m(Z,"class","svelte-18u3mmz"),m(x,"title","[ctrl+]] Simulate 10 ticks"),m(x,"aria-label","Simulate 10 ticks"),m(x,"class","svelte-18u3mmz"),m($,"title","[shift+]] Simulate 100 ticks"),m($,"aria-label","Simulate 100 ticks"),m($,"class","svelte-18u3mmz"),m(P,"class","buttons svelte-18u3mmz"),m(e,"class","stage-data-controls svelte-18u3mmz")},m(I,z){A(I,e,z),C(e,t),C(t,s),s.checked=l[0],C(t,n),C(e,i),C(e,o),C(o,r),ee(r,l[2]),C(o,a),C(o,f),C(f,b),ee(b,l[2]),C(f,g),C(e,S),C(e,h),C(h,d),ee(d,l[1]),C(h,M),C(h,R),C(R,E),ee(E,l[1]),C(R,w),C(e,u),C(e,c),C(c,y),ee(y,l[3]),C(c,k),C(c,W),C(W,H),ee(H,l[3]),C(W,D),C(e,B),C(e,P),C(P,_),C(P,q),C(P,U),V.m(U,null),C(P,pe),C(P,Z),C(P,ye),C(P,x),C(P,Ee),C(P,$),A(I,ge,z),J&&J.m(I,z),se=!0,Te||(Ue=[Y(s,"change",l[27]),Y(r,"change",l[28]),Y(r,"input",l[28]),Y(b,"input",l[29]),Y(d,"change",l[30]),Y(d,"input",l[30]),Y(E,"input",l[31]),Y(y,"change",l[32]),Y(y,"input",l[32]),Y(H,"input",l[33]),Y(_,"click",l[17]),Y(U,"click",l[34]),Y(Z,"click",l[35]),Y(x,"click",l[36]),Y($,"click",l[37])],Te=!0)},p(I,z){z[0]&1&&(s.checked=I[0]),z[0]&4&&ee(r,I[2]),z[0]&4&&ie(b.value)!==I[2]&&ee(b,I[2]),z[0]&2&&ee(d,I[1]),z[0]&2&&ie(E.value)!==I[1]&&ee(E,I[1]),z[0]&8&&ee(y,I[3]),z[0]&8&&ie(H.value)!==I[3]&&ee(H,I[3]),p!==(p=We(I))&&(V.d(1),V=p(I),V&&(V.c(),V.m(U,null))),(!se||z[0]&4096&&Q!==(Q="[Backtick] "+(I[12]?"Pause the simulation":"Play the simulation")))&&m(U,"title",Q),(!se||z[0]&4096&&te!==(te=I[12]?"Pause the simulation":"Play the simulation"))&&m(U,"aria-label",te),J&&J.p&&(!se||z[0]&33554432)&&gt(J,he,I,I[25],se?kt(he,I[25],z,null):bt(I[25]),null)},i(I){se||(L(J,I),se=!0)},o(I){F(J,I),se=!1},d(I){I&&(v(e),v(ge)),V.d(),J&&J.d(I),Te=!1,je(Ue)}}}function al(l){let e;return{c(){e=re("▶️")},l(t){e=ae(t,"▶️")},m(t,s){A(t,e,s)},d(t){t&&v(e)}}}function cl(l){let e;return{c(){e=re("⏸")},l(t){e=ae(t,"⏸")},m(t,s){A(t,e,s)},d(t){t&&v(e)}}}function ul(l){let e;return{c(){e=re("+")},l(t){e=ae(t,"+")},m(t,s){A(t,e,s)},d(t){t&&v(e)}}}function fl(l){let e;return{c(){e=re("-")},l(t){e=ae(t,"-")},m(t,s){A(t,e,s)},d(t){t&&v(e)}}}function ot(l){let e,t="import",s,n,i="save",o,r;return{c(){e=O("button"),e.textContent=t,s=X(),n=O("button"),n.textContent=i,this.h()},l(a){e=N(a,"BUTTON",{title:!0,"data-svelte-h":!0}),oe(e)!=="svelte-1t14zww"&&(e.textContent=t),s=K(a),n=N(a,"BUTTON",{title:!0,"data-svelte-h":!0}),oe(n)!=="svelte-1f9cabs"&&(n.textContent=i),this.h()},h(){m(e,"title","Import JSON data"),m(n,"title","[ctrl+s] Save to localStorage")},m(a,f){A(a,e,f),A(a,s,f),A(a,n,f),o||(r=[Y(e,"click",l[16]),Y(n,"click",l[15])],o=!0)},p:Se,d(a){a&&(v(e),v(s),v(n)),o=!1,je(r)}}}function it(l){let e=l[8],t,s,n=rt(l);return{c(){n.c(),t=ce()},l(i){n.l(i),t=ce()},m(i,o){n.m(i,o),A(i,t,o),s=!0},p(i,o){o[0]&256&&ve(e,e=i[8])?(ke(),F(n,1,1,Se),we(),n=rt(i),n.c(),L(n,1),n.m(t.parentNode,t)):n.p(i,o)},i(i){s||(L(n),s=!0)},o(i){F(n),s=!1},d(i){i&&v(t),n.d(i)}}}function rt(l){let e,t;return e=new Qt({props:{viewportWidth:l[9],viewportHeight:l[10],viewWidth:l[4],viewHeight:l[5],worldWidth:l[6],worldHeight:l[7],cameraUnlocked:l[0],stage:l[8],finish:l[18],enableDomCanvasRenderer:ml}}),{c(){ue(e.$$.fragment)},l(s){fe(e.$$.fragment,s)},m(s,n){de(e,s,n),t=!0},p(s,n){const i={};n[0]&512&&(i.viewportWidth=s[9]),n[0]&1024&&(i.viewportHeight=s[10]),n[0]&16&&(i.viewWidth=s[4]),n[0]&32&&(i.viewHeight=s[5]),n[0]&64&&(i.worldWidth=s[6]),n[0]&128&&(i.worldHeight=s[7]),n[0]&1&&(i.cameraUnlocked=s[0]),n[0]&256&&(i.stage=s[8]),e.$set(i)},i(s){t||(L(e.$$.fragment,s),t=!0)},o(s){F(e.$$.fragment,s),t=!1},d(s){me(e,s)}}}function dl(l){let e,t,s,n,i,o,r,a,f,b,g,S,h=l[11]&&st(l);function d(u,c){return u[11]?fl:ul}let M=d(l),R=M(l),E=l[11]&&ot(l),w=l[8]&&it(l);return{c(){e=O("div"),h&&h.c(),t=X(),s=O("div"),n=O("button"),R.c(),r=X(),E&&E.c(),a=X(),w&&w.c(),f=ce(),this.h()},l(u){e=N(u,"DIV",{class:!0});var c=G(e);h&&h.l(c),t=K(c),s=N(c,"DIV",{class:!0});var y=G(s);n=N(y,"BUTTON",{"aria-label":!0,title:!0});var k=G(n);R.l(k),k.forEach(v),r=K(y),E&&E.l(y),y.forEach(v),c.forEach(v),a=K(u),w&&w.l(u),f=ce(),this.h()},h(){m(n,"aria-label",i=l[11]?"Hide controls":"Show controls"),m(n,"title",o="[Escape] "+(l[11]?"Hide controls":"Show controls")),m(s,"class","main-controls svelte-18u3mmz"),m(e,"class","controls svelte-18u3mmz")},m(u,c){A(u,e,c),h&&h.m(e,null),C(e,t),C(e,s),C(s,n),R.m(n,null),C(s,r),E&&E.m(s,null),A(u,a,c),w&&w.m(u,c),A(u,f,c),b=!0,g||(S=[Y(window,"keydown",l[20]),Y(n,"click",l[19])],g=!0)},p(u,c){u[11]?h?(h.p(u,c),c[0]&2048&&L(h,1)):(h=st(u),h.c(),L(h,1),h.m(e,t)):h&&(ke(),F(h,1,1,()=>{h=null}),we()),M!==(M=d(u))&&(R.d(1),R=M(u),R&&(R.c(),R.m(n,null))),(!b||c[0]&2048&&i!==(i=u[11]?"Hide controls":"Show controls"))&&m(n,"aria-label",i),(!b||c[0]&2048&&o!==(o="[Escape] "+(u[11]?"Hide controls":"Show controls")))&&m(n,"title",o),u[11]?E?E.p(u,c):(E=ot(u),E.c(),E.m(s,null)):E&&(E.d(1),E=null),u[8]?w?(w.p(u,c),c[0]&256&&L(w,1)):(w=it(u),w.c(),L(w,1),w.m(f.parentNode,f)):w&&(ke(),F(w,1,1,()=>{w=null}),we())},i(u){b||(L(h),L(w),b=!0)},o(u){F(h),F(w),b=!1},d(u){u&&(v(e),v(a),v(f)),h&&h.d(),R.d(),E&&E.d(),w&&w.d(u),g=!1,je(S)}}}const ml=!1;function hl(l,e,t){let s,n,i,o,r,{$$slots:a={},$$scope:f}=e,{data:b}=e;const g=At();Ye(l,g,p=>t(24,r=p));const S=Qe();Ye(l,S,p=>t(23,o=p));const h=vt(),d={width:2560,height:1440},M=Tt();let R=b;Ct(()=>{q()});const E=()=>{_&&(R=_.toData(),M("save",R))},w=()=>{let p=prompt("imported data",JSON.stringify(b));if(p!==null)if(p=p.trim(),p)try{t(22,b=JSON.parse(p))}catch{alert("failed to parse");return}else t(22,b=St)},u=p=>{console.log("updateFromData",p),R=p,t(0,c=!p.freezeCamera),t(1,y=p.playerSpeed),t(2,k=p.playerStrength),t(3,W=p.timeDilation),q()};let c=!b.freezeCamera,y=b.playerSpeed,k=b.playerStrength,W=b.timeDilation,H,D,B,P,_=null;const T=()=>{_&&(_.destroy(),t(8,_=null))},q=()=>{_&&T(),t(8,_=new rl({exit:p=>console.log("exited stage",p),viewHeight:D,viewWidth:H,viewportHeight:n,viewportWidth:s,worldHeight:P,worldWidth:B,data:R||b}))},U=()=>{q()},Q=async()=>{console.log("FINISH"),S.pause()};let te=!0;const pe=()=>t(11,te=!te),Z=p=>{p.key==="`"&&p.ctrlKey&&De(p.target)?(Ce(p),pe()):p.key===" "&&!p.ctrlKey&&De(p.target)?(Ce(p),U()):p.key==="s"&&p.ctrlKey&&De(p.target)?(Ce(p),E()):p.key==="}"&&De(p.target)?(Ce(p),le(100)):p.key==="]"&&De(p.target)&&(Ce(p),p.ctrlKey?le(10):le(1))},le=p=>{if(_){for(let V=0;V<p;V++)_.update(1e3/60);i||h.app.render()}};function ye(){c=this.checked,t(0,c)}function x(){k=ie(this.value),t(2,k)}function Re(){k=ie(this.value),t(2,k)}function Ee(){y=ie(this.value),t(1,y)}function $(){y=ie(this.value),t(1,y)}function He(){W=ie(this.value),t(3,W)}function ge(){W=ie(this.value),t(3,W)}const se=()=>S.toggle(),Te=()=>le(1),Ue=()=>le(10),We=()=>le(100);return l.$$set=p=>{"data"in p&&t(22,b=p.data),"$$scope"in p&&t(25,f=p.$$scope)},l.$$.update=()=>{if(l.$$.dirty[0]&16777216&&t(9,{width:s,height:n}=r,s,(t(10,n),t(24,r))),l.$$.dirty[0]&8388608&&t(12,{running:i}=o,i),l.$$.dirty[0]&4194304&&u(b),l.$$.dirty[0]&257&&_&&t(8,_.freezeCamera=c,_),l.$$.dirty[0]&258&&_&&t(8,_.player.speed=y,_),l.$$.dirty[0]&260&&_&&t(8,_.player.strength=k,_),l.$$.dirty[0]&264&&_&&t(8,_.timeDilation=W,_),l.$$.dirty[0]&1777)if(c){t(4,H=s),t(5,D=n);const p=d.width,V=d.height,he=p/H,J=V/D;J>1&&J>he?(t(7,P=V),t(6,B=H*J|0)):he>1?(t(6,B=p),t(7,P=D*he|0)):(t(6,B=H),t(7,P=D))}else{t(6,B=d.width),t(7,P=d.height);const p=B/P,V=s/n;t(4,H=s*Math.min(1,p/V)|0),t(5,D=n*Math.min(1,V/p)|0)}},[c,y,k,W,H,D,B,P,_,s,n,te,i,g,S,E,w,U,Q,pe,Z,le,b,o,r,f,a,ye,x,Re,Ee,$,He,ge,se,Te,Ue,We]}class _l extends Oe{constructor(e){super(),Ne(this,e,hl,dl,ve,{data:22},null,[-1,-1])}}function at(l,e,t){const s=l.slice();return s[4]=e[t],s[6]=t,s}const pl=l=>({item:l&2,selected:l&3,index:l&2}),ct=l=>({item:l[4],selected:l[6]===l[0],index:l[6]});function ut(l,e){let t,s;const n=e[3].default,i=pt(n,e,e[2],ct);return{key:l,first:null,c(){t=ce(),i&&i.c(),this.h()},l(o){t=ce(),i&&i.l(o),this.h()},h(){this.first=t},m(o,r){A(o,t,r),i&&i.m(o,r),s=!0},p(o,r){e=o,i&&i.p&&(!s||r&7)&&gt(i,n,e,e[2],s?kt(n,e[2],r,pl):bt(e[2]),ct)},i(o){s||(L(i,o),s=!0)},o(o){F(i,o),s=!1},d(o){o&&v(t),i&&i.d(o)}}}function gl(l){let e=[],t=new Map,s,n,i=et(l[1]);const o=r=>r[4]||Symbol();for(let r=0;r<i.length;r+=1){let a=at(l,i,r),f=o(a);t.set(f,e[r]=ut(f,a))}return{c(){for(let r=0;r<e.length;r+=1)e[r].c();s=ce()},l(r){for(let a=0;a<e.length;a+=1)e[a].l(r);s=ce()},m(r,a){for(let f=0;f<e.length;f+=1)e[f]&&e[f].m(r,a);A(r,s,a),n=!0},p(r,[a]){a&7&&(i=et(r[1]),ke(),e=Kt(e,a,o,1,r,i,t,s.parentNode,Vt,ut,s,at),we())},i(r){if(!n){for(let a=0;a<i.length;a+=1)L(e[a]);n=!0}},o(r){for(let a=0;a<e.length;a+=1)F(e[a]);n=!1},d(r){r&&v(s);for(let a=0;a<e.length;a+=1)e[a].d(r)}}}function bl(l,e,t){let{$$slots:s={},$$scope:n}=e,{selectedIndex:i}=e,{items:o}=e;return l.$$set=r=>{"selectedIndex"in r&&t(0,i=r.selectedIndex),"items"in r&&t(1,o=r.items),"$$scope"in r&&t(2,n=r.$$scope)},[i,o,n,s]}class kl extends Oe{constructor(e){super(),Ne(this,e,bl,gl,ve,{selectedIndex:0,items:1})}}function wl(l){let e,t="<td><code>[Space]</code></td><td>reset simulation</td>",s,n="<td><code>[ctrl+S]</code></td><td>save to local storage</td>";return{c(){e=O("tr"),e.innerHTML=t,s=O("tr"),s.innerHTML=n},l(i){e=N(i,"TR",{"data-svelte-h":!0}),oe(e)!=="svelte-16qro8p"&&(e.innerHTML=t),s=N(i,"TR",{"data-svelte-h":!0}),oe(s)!=="svelte-1tf7cdn"&&(s.innerHTML=n)},m(i,o){A(i,e,o),A(i,s,o)},p:Se,d(i){i&&(v(e),v(s))}}}function vl(l){let e,t;return e=new Bt({props:{clock:l[0],$$slots:{default:[wl]},$$scope:{ctx:l}}}),{c(){ue(e.$$.fragment)},l(s){fe(e.$$.fragment,s)},m(s,n){de(e,s,n),t=!0},p(s,[n]){const i={};n&1&&(i.clock=s[0]),n&2&&(i.$$scope={dirty:n,ctx:s}),e.$set(i)},i(s){t||(L(e.$$.fragment,s),t=!0)},o(s){F(e.$$.fragment,s),t=!1},d(s){me(e,s)}}}function Sl(l,e,t){let{clock:s}=e;return l.$$set=n=>{"clock"in n&&t(0,s=n.clock)},[s]}class yl extends Oe{constructor(e){super(),Ne(this,e,Sl,vl,ve,{clock:0})}}function ft(l){let e,t="✕",s,n,i,o,r,a;function f(g){l[12](g)}let b={items:l[1],$$slots:{default:[El,({selected:g,index:S})=>({17:g,18:S}),({selected:g,index:S})=>(g?131072:0)|(S?262144:0)]},$$scope:{ctx:l}};return l[0]!==void 0&&(b.selectedIndex=l[0]),n=new kl({props:b}),Dt.push(()=>Rt(n,"selectedIndex",f)),{c(){e=O("button"),e.textContent=t,s=X(),ue(n.$$.fragment),this.h()},l(g){e=N(g,"BUTTON",{title:!0,class:!0,"data-svelte-h":!0}),oe(e)!=="svelte-1w2wjzv"&&(e.textContent=t),s=K(g),fe(n.$$.fragment,g),this.h()},h(){m(e,"title","delete data item"),m(e,"class","svelte-95kbus")},m(g,S){A(g,e,S),A(g,s,S),de(n,g,S),o=!0,r||(a=Y(e,"click",l[10]),r=!0)},p(g,S){const h={};S&2&&(h.items=g[1]),S&917504&&(h.$$scope={dirty:S,ctx:g}),!i&&S&1&&(i=!0,h.selectedIndex=g[0],It(()=>i=!1)),n.$set(h)},i(g){o||(L(n.$$.fragment,g),o=!0)},o(g){F(n.$$.fragment,g),o=!1},d(g){g&&(v(e),v(s)),me(n,g),r=!1,a()}}}function El(l){let e,t=l[18]+1+"",s,n,i,o;function r(){return l[11](l[18])}return{c(){e=O("button"),s=re(t),this.h()},l(a){e=N(a,"BUTTON",{class:!0});var f=G(e);s=ae(f,t),f.forEach(v),this.h()},h(){e.disabled=n=l[17],m(e,"class","svelte-95kbus"),$e(e,"selected",l[17])},m(a,f){A(a,e,f),C(e,s),i||(o=Y(e,"click",function(){Ot(l[17]?void 0:r)&&(l[17]?void 0:r).apply(this,arguments)}),i=!0)},p(a,f){l=a,f&262144&&t!==(t=l[18]+1+"")&&Nt(s,t),f&131072&&n!==(n=l[17])&&(e.disabled=n),f&131072&&$e(e,"selected",l[17])},d(a){a&&v(e),i=!1,o()}}}function dt(l){let e,t="+",s,n;return{c(){e=O("button"),e.textContent=t,this.h()},l(i){e=N(i,"BUTTON",{title:!0,class:!0,"data-svelte-h":!0}),oe(e)!=="svelte-dh370g"&&(e.textContent=t),this.h()},h(){m(e,"title","add data item"),m(e,"class","svelte-95kbus")},m(i,o){A(i,e,o),s||(n=Y(e,"click",l[13]),s=!0)},p:Se,d(i){i&&v(e),s=!1,n()}}}function Tl(l){let e,t,s,n=l[1].length>=2&&ft(l),i=l[1].length<Je&&dt(l);return{c(){e=O("div"),n&&n.c(),t=X(),i&&i.c(),this.h()},l(o){e=N(o,"DIV",{class:!0});var r=G(e);n&&n.l(r),t=K(r),i&&i.l(r),r.forEach(v),this.h()},h(){m(e,"class","controls svelte-95kbus")},m(o,r){A(o,e,r),n&&n.m(e,null),C(e,t),i&&i.m(e,null),s=!0},p(o,r){o[1].length>=2?n?(n.p(o,r),r&2&&L(n,1)):(n=ft(o),n.c(),L(n,1),n.m(e,t)):n&&(ke(),F(n,1,1,()=>{n=null}),we()),o[1].length<Je?i?i.p(o,r):(i=dt(o),i.c(),i.m(e,null)):i&&(i.d(1),i=null)},i(o){s||(L(n),s=!0)},o(o){F(n),s=!1},d(o){o&&v(e),n&&n.d(),i&&i.d()}}}function Cl(l){let e,t;return e=new yl({props:{clock:l[3]}}),{c(){ue(e.$$.fragment)},l(s){fe(e.$$.fragment,s)},m(s,n){de(e,s,n),t=!0},p:Se,i(s){t||(L(e.$$.fragment,s),t=!0)},o(s){F(e.$$.fragment,s),t=!1},d(s){me(e,s)}}}function Dl(l){let e,t,s,n,i;return t=new _l({props:{data:l[2],$$slots:{default:[Tl]},$$scope:{ctx:l}}}),t.$on("save",l[14]),n=new Gt({props:{$$slots:{default:[Cl]},$$scope:{ctx:l}}}),{c(){e=O("div"),ue(t.$$.fragment),s=X(),ue(n.$$.fragment),this.h()},l(o){e=N(o,"DIV",{class:!0});var r=G(e);fe(t.$$.fragment,r),r.forEach(v),s=K(o),fe(n.$$.fragment,o),this.h()},h(){m(e,"class","unlock-studio svelte-95kbus")},m(o,r){A(o,e,r),de(t,e,null),A(o,s,r),de(n,o,r),i=!0},p(o,[r]){const a={};r&4&&(a.data=o[2]),r&524291&&(a.$$scope={dirty:r,ctx:o}),t.$set(a);const f={};r&524288&&(f.$$scope={dirty:r,ctx:o}),n.$set(f)},i(o){i||(L(t.$$.fragment,o),L(n.$$.fragment,o),i=!0)},o(o){F(t.$$.fragment,o),F(n.$$.fragment,o),i=!1},d(o){o&&(v(e),v(s)),me(t),me(n,o)}}}const mt="unlock_stages",ht="unlock_selected_data_index",_t="unlock_data_count",Je=10;function Il(l,e,t){let s,n;const i=Qe();let o=Be(ht,0),r=Be(_t,0),a=Array.from({length:r});const f=c=>{t(0,o=c)},b=c=>{t(1,a=a.slice(0,c).concat(a.slice(c+1))),o>=a.length&&t(0,o--,o)},g=()=>{b(o)},S=c=>{h(o,c)},h=(c,y)=>{t(1,a=a.slice(0,c).concat(y,a.slice(c+1))),qe(`${mt}_${c}`,y)},d=()=>{a.length>=Je||(t(1,a=a.concat(structuredClone(n))),f(a.length-1))},M=()=>g(),R=c=>f(c);function E(c){o=c,t(0,o)}const w=()=>d(),u=c=>S(c.detail);return l.$$.update=()=>{l.$$.dirty&1&&qe(ht,o),l.$$.dirty&1&&t(9,s=`${mt}_${o}`),l.$$.dirty&515&&t(2,n=a[o]||t(1,a[o]=Be(s,structuredClone(St)),a)),l.$$.dirty&2&&t(8,r=a.length),l.$$.dirty&256&&qe(_t,r)},[o,a,n,i,f,g,S,d,r,s,M,R,E,w,u]}class Gl extends Oe{constructor(e){super(),Ne(this,e,Il,Dl,ve,{})}}export{Gl as component};