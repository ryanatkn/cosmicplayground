import{n as me,r as K,i as v,d as g,e as N,b as L,l as U,m as y,a as oe,s as F,c as z,_ as ke,o as H,J as Ae,L as we,x as ue,y as _e,p as Q,g as Ue}from"../chunks/scheduler.CGmLp2a4.js";import{S as he,i as pe,t as b,g as ce,b as I,e as fe,c as T,a as A,m as M,d as D}from"../chunks/index.0VfkS216.js";import{r as $e,a as ae}from"../chunks/random.BCioE_zI.js";import{s as Ve}from"../chunks/index.CMTV5NIU.js";import{b as Re}from"../chunks/paths.Ca0tPkHk.js";import{g as Xe}from"../chunks/clock.CLX1guZT.js";import{g as Ye}from"../chunks/dimensions.PpBVpshh.js";import{g as Fe,C as ze,S as qe,a as Be}from"../chunks/pixi.BNw4JtJK.js";import{W as Ge}from"../chunks/WaitingScreen.0SexlRXT.js";import{A as He}from"../chunks/WaitingAnimation.DoFl1XLA.js";import{e as be,u as Je,d as Ke}from"../chunks/each.af2GrV1H.js";import{F as ve}from"../chunks/FloatingTextButton.BDXOu_-Z.js";import{s as P}from"../chunks/images.BCEEXbqT.js";import{I as We}from"../chunks/ImageCreditsCaption.ByUEC_IH.js";import{S as je}from"../chunks/Surface2.ApR7ir3p.js";import{P as Me}from"../chunks/Panel.CVX3dqkQ.js";import{P as Qe}from"../chunks/Preview.CWguNQ8b.js";import{P as Ze}from"../chunks/PortalPreview.C5wcwwNw.js";function ye(i){let e,t;return e=new Ge({props:{status:i[0]}}),{c(){T(e.$$.fragment)},l(r){A(e.$$.fragment,r)},m(r,s){M(e,r,s),t=!0},p(r,s){const a={};s&1&&(a.status=r[0]),e.$set(a)},i(r){t||(b(e.$$.fragment,r),t=!0)},o(r){I(e.$$.fragment,r),t=!1},d(r){D(e,r)}}}function xe(i){let e,t,r=i[0]!=="success"&&ye(i);return{c(){r&&r.c(),e=K()},l(s){r&&r.l(s),e=K()},m(s,a){r&&r.m(s,a),v(s,e,a),t=!0},p(s,[a]){s[0]!=="success"?r?(r.p(s,a),a&1&&b(r,1)):(r=ye(s),r.c(),b(r,1),r.m(e.parentNode,e)):r&&(ce(),I(r,1,1,()=>{r=null}),fe())},i(s){t||(b(r),t=!0)},o(s){I(r),t=!1},d(s){s&&g(e),r&&r.d(s)}}}function et(i,e,t){let{cameraX:r}=e,{cameraY:s}=e,{cameraScale:a}=e,{imageUrl:n}=e,l=null,c=!1;const{scene:m}=Fe({loaded:async()=>{c||await p(n)},destroy:()=>{k(),c=!0}}),f=new ze;m.addChild(f);const p=async u=>{const S=await He.load(u);l&&l.texture===S||w(S)},w=u=>{l&&k(),u.baseTexture.setStyle(qe.LINEAR),t(5,l=new Be(u)),f.addChild(l)},k=()=>{l&&(f.removeChild(l),l.destroy(),t(5,l=null))},V=(u,S,$,C)=>{u.scale.set(C),u.position.set(S,$)};let q;return i.$$set=u=>{"cameraX"in u&&t(1,r=u.cameraX),"cameraY"in u&&t(2,s=u.cameraY),"cameraScale"in u&&t(3,a=u.cameraScale),"imageUrl"in u&&t(4,n=u.imageUrl)},i.$$.update=()=>{i.$$.dirty&16&&p(n),i.$$.dirty&14&&V(f,r,s,a),i.$$.dirty&32&&t(0,q=l?"success":"pending")},[q,r,s,a,n,l]}class tt extends he{constructor(e){super(),pe(this,e,et,xe,me,{cameraX:1,cameraY:2,cameraScale:3,imageUrl:4})}}function Ie(i,e,t){const r=i.slice();return r[3]=e[t],r}function Se(i,e){let t,r,s,a,n,l,c,m,f;function p(){return e[2](e[3])}return{key:i,first:null,c(){t=N("button"),r=N("img"),c=F(),this.h()},l(w){t=L(w,"BUTTON",{class:!0});var k=U(t);r=L(k,"IMG",{src:!0,alt:!0,width:!0,height:!0}),c=z(k),k.forEach(g),this.h()},h(){ke(r.src,s=e[3].thumbnail.url)||y(r,"src",s),y(r,"alt",a=e[3].title),y(r,"width",n=e[3].thumbnail.width),y(r,"height",l=e[3].thumbnail.height),y(t,"class","svelte-1dt3wg7"),this.first=t},m(w,k){v(w,t,k),H(t,r),H(t,c),m||(f=Ae(t,"click",p),m=!0)},p(w,k){e=w,k&1&&!ke(r.src,s=e[3].thumbnail.url)&&y(r,"src",s),k&1&&a!==(a=e[3].title)&&y(r,"alt",a),k&1&&n!==(n=e[3].thumbnail.width)&&y(r,"width",n),k&1&&l!==(l=e[3].thumbnail.height)&&y(r,"height",l)},d(w){w&&g(t),m=!1,f()}}}function rt(i){let e,t=[],r=new Map,s=be(i[0]);const a=n=>n[3].info.url;for(let n=0;n<s.length;n+=1){let l=Ie(i,s,n),c=a(l);r.set(c,t[n]=Se(c,l))}return{c(){e=N("div");for(let n=0;n<t.length;n+=1)t[n].c();this.h()},l(n){e=L(n,"DIV",{class:!0});var l=U(e);for(let c=0;c<t.length;c+=1)t[c].l(l);l.forEach(g),this.h()},h(){y(e,"class","image-picker svelte-1dt3wg7")},m(n,l){v(n,e,l);for(let c=0;c<t.length;c+=1)t[c]&&t[c].m(e,null)},p(n,[l]){l&3&&(s=be(n[0]),t=Je(t,l,a,1,n,s,r,e,Ke,Se,null,Ie))},i:oe,o:oe,d(n){n&&g(e);for(let l=0;l<t.length;l+=1)t[l].d()}}}function st(i,e,t){let{images:r}=e,{pick_image:s}=e;const a=n=>s(n);return i.$$set=n=>{"images"in n&&t(0,r=n.images),"pick_image"in n&&t(1,s=n.pick_image)},[r,s,a]}class at extends he{constructor(e){super(),pe(this,e,st,rt,me,{images:0,pick_image:1})}}function Ee(i){let e;return{c(){e=N("div"),this.h()},l(t){e=L(t,"DIV",{class:!0}),U(e).forEach(g),this.h()},h(){y(e,"class","overlay-bg svelte-y3wocm")},m(t,r){v(t,e,r)},d(t){t&&g(e)}}}function nt(i){let e,t,r;return t=new je({props:{width:i[0],height:i[1],scale:i[4],zoom:i[12],pan:i[13]}}),{c(){e=N("div"),T(t.$$.fragment),this.h()},l(s){e=L(s,"DIV",{class:!0,style:!0});var a=U(e);A(t.$$.fragment,a),a.forEach(g),this.h()},h(){y(e,"class","interaction-surface-wrapper svelte-y3wocm"),Q(e,"width",i[0]+"px"),Q(e,"height",i[1]+"px")},m(s,a){v(s,e,a),M(t,e,null),r=!0},p(s,a){const n={};a[0]&1&&(n.width=s[0]),a[0]&2&&(n.height=s[1]),a[0]&16&&(n.scale=s[4]),t.$set(n),(!r||a[0]&1)&&Q(e,"width",s[0]+"px"),(!r||a[0]&2)&&Q(e,"height",s[1]+"px")},i(s){r||(b(t.$$.fragment,s),r=!0)},o(s){I(t.$$.fragment,s),r=!1},d(s){s&&g(e),D(t)}}}function it(i){let e,t,r,s,a,n,l,c;return t=new at({props:{images:P,pick_image:i[9]}}),a=new Me({props:{$$slots:{default:[lt]},$$scope:{ctx:i}}}),l=new Ze({props:{href:Re+"/about",$$slots:{default:[ot]},$$scope:{ctx:i}}}),{c(){e=N("div"),T(t.$$.fragment),r=F(),s=N("footer"),T(a.$$.fragment),n=F(),T(l.$$.fragment),this.h()},l(m){e=L(m,"DIV",{class:!0});var f=U(e);A(t.$$.fragment,f),r=z(f),s=L(f,"FOOTER",{class:!0});var p=U(s);A(a.$$.fragment,p),n=z(p),A(l.$$.fragment,p),p.forEach(g),f.forEach(g),this.h()},h(){y(s,"class","svelte-y3wocm"),y(e,"class","overlay svelte-y3wocm")},m(m,f){v(m,e,f),M(t,e,null),H(e,r),H(e,s),M(a,s,null),H(s,n),M(l,s,null),c=!0},p(m,f){const p={};f[1]&4&&(p.$$scope={dirty:f,ctx:m}),a.$set(p);const w={};f[1]&4&&(w.$$scope={dirty:f,ctx:m}),l.$set(w)},i(m){c||(b(t.$$.fragment,m),b(a.$$.fragment,m),b(l.$$.fragment,m),c=!0)},o(m){I(t.$$.fragment,m),I(a.$$.fragment,m),I(l.$$.fragment,m),c=!1},d(m){m&&g(e),D(t),D(a),D(l)}}}function lt(i){let e,t='<a href="https://www.spacetelescope.org/copyright/">spacetelescope.org/copyright</a>';return{c(){e=N("div"),e.innerHTML=t,this.h()},l(r){e=L(r,"DIV",{"data-svelte-h":!0}),Ue(e)!=="svelte-e46x49"&&(e.innerHTML=t),this.h()},h(){Q(e,"font-size","var(--size_lg)")},m(r,s){v(r,e,s)},p:oe,d(r){r&&g(e)}}}function ot(i){let e,t;return e=new Qe({}),{c(){T(e.$$.fragment)},l(r){A(e.$$.fragment,r)},m(r,s){M(e,r,s),t=!0},i(r){t||(b(e.$$.fragment,r),t=!0)},o(r){I(e.$$.fragment,r),t=!1},d(r){D(e,r)}}}function ct(i){let e;return{c(){e=ue("random image")},l(t){e=_e(t,"random image")},m(t,r){v(t,e,r)},d(t){t&&g(e)}}}function ft(i){let e;return{c(){e=ue("pick an image")},l(t){e=_e(t,"pick an image")},m(t,r){v(t,e,r)},d(t){t&&g(e)}}}function mt(i){let e;return{c(){e=ue("close image picker")},l(t){e=_e(t,"close image picker")},m(t,r){v(t,e,r)},d(t){t&&g(e)}}}function ut(i){let e;function t(a,n){return a[2]?mt:ft}let r=t(i),s=r(i);return{c(){s.c(),e=K()},l(a){s.l(a),e=K()},m(a,n){s.m(a,n),v(a,e,n)},p(a,n){r!==(r=t(a))&&(s.d(1),s=r(a),s&&(s.c(),s.m(e.parentNode,e)))},d(a){a&&g(e),s.d(a)}}}function Ce(i){let e,t,r,s;return r=new Me({props:{$$slots:{default:[_t]},$$scope:{ctx:i}}}),{c(){e=N("div"),t=N("div"),T(r.$$.fragment),this.h()},l(a){e=L(a,"DIV",{class:!0});var n=U(e);t=L(n,"DIV",{class:!0});var l=U(t);A(r.$$.fragment,l),l.forEach(g),n.forEach(g),this.h()},h(){y(t,"class","width_md"),y(e,"class","credits idle_fade prose svelte-y3wocm")},m(a,n){v(a,e,n),H(e,t),M(r,t,null),s=!0},p(a,n){const l={};n[0]&8|n[1]&4&&(l.$$scope={dirty:n,ctx:a}),r.$set(l)},i(a){s||(b(r.$$.fragment,a),s=!0)},o(a){I(r.$$.fragment,a),s=!1},d(a){a&&g(e),D(r)}}}function _t(i){let e,t;return e=new We({props:{image:i[3]}}),{c(){T(e.$$.fragment)},l(r){A(e.$$.fragment,r)},m(r,s){M(e,r,s),t=!0},p(r,s){const a={};s[0]&8&&(a.image=r[3]),e.$set(a)},i(r){t||(b(e.$$.fragment,r),t=!0)},o(r){I(e.$$.fragment,r),t=!1},d(r){D(e,r)}}}function ht(i){let e,t,r,s,a,n,l,c,m,f,p,w,k,V,q,u=i[2]&&Ee();t=new tt({props:{cameraX:i[6],cameraY:i[5],cameraScale:i[4],imageUrl:i[3].info.url}});const S=[it,nt],$=[];function C(o,_){return o[2]?0:1}s=C(i),a=$[s]=S[s](i),c=new ve({props:{$$slots:{default:[ct]},$$scope:{ctx:i}}}),c.$on("click",i[10]),f=new ve({props:{$$slots:{default:[ut]},$$scope:{ctx:i}}}),f.$on("click",i[18]);let d=!i[2]&&Ce(i);return{c(){u&&u.c(),e=F(),T(t.$$.fragment),r=F(),a.c(),n=F(),l=N("div"),T(c.$$.fragment),m=F(),T(f.$$.fragment),p=F(),d&&d.c(),w=K(),this.h()},l(o){u&&u.l(o),e=z(o),A(t.$$.fragment,o),r=z(o),a.l(o),n=z(o),l=L(o,"DIV",{class:!0});var _=U(l);A(c.$$.fragment,_),m=z(_),A(f.$$.fragment,_),_.forEach(g),p=z(o),d&&d.l(o),w=K(),this.h()},h(){y(l,"class","hud idle_fade svelte-y3wocm")},m(o,_){u&&u.m(o,_),v(o,e,_),M(t,o,_),v(o,r,_),$[s].m(o,_),v(o,n,_),v(o,l,_),M(c,l,null),H(l,m),M(f,l,null),v(o,p,_),d&&d.m(o,_),v(o,w,_),k=!0,V||(q=Ae(window,"keydown",i[11],!0),V=!0)},p(o,_){o[2]?u||(u=Ee(),u.c(),u.m(e.parentNode,e)):u&&(u.d(1),u=null);const O={};_[0]&64&&(O.cameraX=o[6]),_[0]&32&&(O.cameraY=o[5]),_[0]&16&&(O.cameraScale=o[4]),_[0]&8&&(O.imageUrl=o[3].info.url),t.$set(O);let R=s;s=C(o),s===R?$[s].p(o,_):(ce(),I($[R],1,1,()=>{$[R]=null}),fe(),a=$[s],a?a.p(o,_):(a=$[s]=S[s](o),a.c()),b(a,1),a.m(n.parentNode,n));const B={};_[1]&4&&(B.$$scope={dirty:_,ctx:o}),c.$set(B);const X={};_[0]&4|_[1]&4&&(X.$$scope={dirty:_,ctx:o}),f.$set(X),o[2]?d&&(ce(),I(d,1,1,()=>{d=null}),fe()):d?(d.p(o,_),_[0]&4&&b(d,1)):(d=Ce(o),d.c(),b(d,1),d.m(w.parentNode,w))},i(o){k||(b(t.$$.fragment,o),b(a),b(c.$$.fragment,o),b(f.$$.fragment,o),b(d),k=!0)},o(o){I(t.$$.fragment,o),I(a),I(c.$$.fragment,o),I(f.$$.fragment,o),I(d),k=!1},d(o){o&&(g(e),g(r),g(n),g(l),g(p),g(w)),u&&u.d(o),D(t,o),$[s].d(o),D(c),D(f),d&&d.d(o),V=!1,q()}}}const ne=0,ie=2,pt=5,le=6e4,gt=1e3,Te=1.1;function dt(i,e,t){let r,s,a,n;const l=Ye();we(i,l,h=>t(17,n=h));let c=n.width,m=n.height,f=!1,p=$e(P);const w=Xe();we(i,w,h=>t(16,a=h));const k=h=>{t(3,p=h),t(2,f=!1)},V=()=>{if(P.length===1)return;let h;do h=$e(P);while(h===p);k(h)},q=()=>{const h=P.indexOf(p),E=h===0?P.length-1:h-1;k(P[E])},u=()=>{const h=P.indexOf(p),E=h===P.length-1?0:h+1;k(P[E])};let S,$,C,d,o,_,O,R,B,X=0,Z=0;const De=h=>{Z>0&&(Z-=h,Z>0)||(X+=h,X>=le&&(X=0,[d,o,_]=ee(c,m,p.info.width,p.info.height,ne,ie),O=S,R=$,B=C),Ne(X,le))},Ne=(h,E)=>{const Y=Ve(h/E);t(14,S=O+Y*(d-O)),t(15,$=R+Y*(o-R)),t(4,C=B+Y*(_-B))},ge=(h,E)=>{t(14,[S,$,C]=ee(c,m,h,E,ne,ie),S,t(15,$),t(4,C)),O=S,R=$,B=C,[d,o,_]=ee(c,m,h,E,ne,ie)},ee=(h,E,Y,x,W,J)=>{const j=Math.max(W,Math.max(h/Y,E/x)),te=Math.max(J,j*pt),G=ae(j,te),re=ae(h/2/G,Y-h/2/G),se=ae(E/2/G,x-E/2/G);return[re,se,G]},Le=h=>{switch(h.key){case"1":t(2,f=!f);break;case"ArrowLeft":q();break;case"ArrowRight":u();break;case"ArrowUp":case"ArrowDown":V();break;case" ":ge(p.info.width,p.info.height);break}},Oe=(h,E=c/2,Y=m/2)=>{if(h===0)return;const x=h>0?1/Te:Te,W=C,J=W*x;t(4,C=J);const j=(J-W)/W,te=E-c/2,G=Y-m/2,re=te*j/J,se=G*j/J;de(re,se)},de=(h,E)=>{t(14,S+=h),t(15,$+=E),Z=gt,X=le},Pe=()=>t(2,f=!f);return i.$$.update=()=>{i.$$.dirty[0]&131072&&t(0,c=n.width),i.$$.dirty[0]&131072&&t(1,m=n.height),i.$$.dirty[0]&8&&ge(p.info.width,p.info.height),i.$$.dirty[0]&65540&&!f&&De(a.dt),i.$$.dirty[0]&16401&&t(6,r=-S*C+c/2),i.$$.dirty[0]&32786&&t(5,s=-$*C+m/2)},[c,m,f,p,C,s,r,l,w,k,V,Le,Oe,de,S,$,a,n,Pe]}class Ut extends he{constructor(e){super(),pe(this,e,dt,ht,me,{},null,[-1,-1])}}export{Ut as component};