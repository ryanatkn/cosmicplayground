import{n as Te,e as ke,x as K,s as ne,b as ye,l as Ce,y as X,d as x,c as se,m as ee,i as M,o as Se,A as Re,I as ie,J as ge,a as L,E as F,P as re,G as Ve,L as it,a6 as ut,M as ct,q as ft,g as dt,C as ot,p as qe,r as Ge}from"./scheduler.CGmLp2a4.js";import{S as ve,i as Ie,c as U,a as Z,m as q,t as G,b as J,d as j}from"./index.0VfkS216.js";import{e as He,u as mt,d as ht}from"./each.af2GrV1H.js";import{W as _t,A as we}from"./WaitingAnimation.DoFl1XLA.js";import{w as de}from"./index.DfOygCNJ.js";import{U as Fe}from"./error._vQSOvxE.js";import{g as gt,C as Be,F as bt,d as pt,a as Je,k as wt}from"./pixi.BNw4JtJK.js";import{s as ze}from"./index.CMTV5NIU.js";import{s as kt}from"./dom.BLTHKhgi.js";import{g as yt}from"./settings.DMUTQVnp.js";import{g as Tt,r as vt,T as je}from"./renderStats.CGgdiwto.js";import{t as It}from"./tweened.4ZawRr47.js";import{S as xt}from"./Surface2.ApR7ir3p.js";import{r as Qe}from"./maths.CghzhYsK.js";import{g as St}from"./clock.CLX1guZT.js";import{F as _e}from"./FloatingTextButton.BDXOu_-Z.js";function $e(n,e,t){const s=n.slice();return s[3]=e[t],s}function et(n,e){let t,s,a,r;function i(){return e[2](e[3])}return{key:n,first:null,c(){t=ke("div"),this.h()},l(u){t=ye(u,"DIV",{class:!0,"aria-hidden":!0,title:!0}),Ce(t).forEach(x),this.h()},h(){ee(t,"class","resource svelte-a77dfn"),ee(t,"aria-hidden",""),ee(t,"title",s=e[3].status==="failure"?"click to reload":e[3].status==="success"?"resource loaded":"resource loading"),ie(t,"success",e[3].status==="success"),ie(t,"pending",e[3].status==="pending"),ie(t,"failure",e[3].status==="failure"),this.first=t},m(u,o){M(u,t,o),a||(r=ge(t,"click",i),a=!0)},p(u,o){e=u,o&2&&s!==(s=e[3].status==="failure"?"click to reload":e[3].status==="success"?"resource loaded":"resource loading")&&ee(t,"title",s),o&2&&ie(t,"success",e[3].status==="success"),o&2&&ie(t,"pending",e[3].status==="pending"),o&2&&ie(t,"failure",e[3].status==="failure")},d(u){u&&x(t),a=!1,r()}}}function Ct(n){let e,t,s=Math.round(n[1].progress*100)+"",a,r,i,u,o=[],m=new Map,c,f,v,p,y=He(n[1].resources);const _=h=>h[3].url;for(let h=0;h<y.length;h+=1){let d=$e(n,y,h),w=_(d);m.set(w,o[h]=et(w,d))}return v=new _t({props:{status:n[1].status}}),{c(){e=ke("div"),t=ke("h2"),a=K(s),r=K("%"),i=ne(),u=ke("div");for(let h=0;h<o.length;h+=1)o[h].c();c=ne(),f=ke("div"),U(v.$$.fragment),this.h()},l(h){e=ye(h,"DIV",{class:!0});var d=Ce(e);t=ye(d,"H2",{class:!0});var w=Ce(t);a=X(w,s),r=X(w,"%"),w.forEach(x),i=se(d),u=ye(d,"DIV",{class:!0});var C=Ce(u);for(let P=0;P<o.length;P+=1)o[P].l(C);C.forEach(x),c=se(d),f=ye(d,"DIV",{class:!0});var O=Ce(f);Z(v.$$.fragment,O),O.forEach(x),d.forEach(x),this.h()},h(){ee(t,"class","svelte-a77dfn"),ee(u,"class","resources svelte-a77dfn"),ee(f,"class","waiting-animation-wrapper svelte-a77dfn"),ee(e,"class","resources-loading-progress svelte-a77dfn")},m(h,d){M(h,e,d),Se(e,t),Se(t,a),Se(t,r),Se(e,i),Se(e,u);for(let w=0;w<o.length;w+=1)o[w]&&o[w].m(u,null);Se(e,c),Se(e,f),q(v,f,null),p=!0},p(h,[d]){(!p||d&2)&&s!==(s=Math.round(h[1].progress*100)+"")&&Re(a,s),d&2&&(y=He(h[1].resources),o=mt(o,d,_,1,h,y,m,u,ht,et,null,$e));const w={};d&2&&(w.status=h[1].status),v.$set(w)},i(h){p||(G(v.$$.fragment,h),p=!0)},o(h){J(v.$$.fragment,h),p=!1},d(h){h&&x(e);for(let d=0;d<o.length;d+=1)o[d].d();j(v)}}}function Et(n,e,t){let s,a=L,r=()=>(a(),a=F(i,o=>t(1,s=o)),i);n.$$.on_destroy.push(()=>a());let{resources:i}=e;r();const u=o=>{o.status==="failure"&&window.location.reload()};return n.$$set=o=>{"resources"in o&&r(t(0,i=o.resources))},[i,s,u]}class vn extends ve{constructor(e){super(),Ie(this,e,Et,Ct,Te,{resources:0})}}const In=()=>{let n,e=null;const t=de({status:"initial",progress:0,resources:[],promise:e}),{update:s,subscribe:a}=t,r=u=>{let o=!1;s(m=>{let c=0;const f=m.resources.map(p=>p.url===u?(c++,{...p,status:"success"}):(p.status==="success"&&c++,p)),v=c/f.length;return v===1&&(o=!0),{...m,progress:v,status:m.status==="failure"?"failure":v===1?"success":"pending",resources:f}}),o&&n()},i=u=>{s(o=>{const m=o.resources.map(c=>c.url===u?{...c,status:"failure"}:c);return{...o,status:"failure",resources:m}}),n()};return{subscribe:a,addResource:(u,o)=>{let m;return s(c=>{if(c.status!=="initial")throw Error(`Cannot add resources after loading: ${o}`);if(c.resources.find(f=>f.url===o))throw Error(`Already added resource ${o}`);switch(u){case"image":{m={type:u,url:o,status:"initial",texture:de(null)};break}case"audio":{m={type:u,url:o,status:"initial",audio:null};break}default:throw new Fe(u)}return{...c,resources:c.resources.concat(m)}}),m},load:()=>e||(e=new Promise(u=>n=u),s(u=>{const o=[];for(const m of u.resources)switch(m.type){case"image":{we.load(m.url).then(f=>{r(m.url),m.texture.set(f)},()=>i(m.url)),o.push({...m,status:"pending"});break}case"audio":{const c=new Audio;c.addEventListener("canplaythrough",()=>r(m.url),{once:!0}),c.addEventListener("error",()=>i(m.url),{once:!0}),o.push({...m,status:"pending",audio:c});break}default:throw new Fe(m)}return setTimeout(()=>{for(const m of o)switch(m.type){case"image":break;case"audio":{m.audio.src=m.url;break}default:throw new Fe(m)}}),{...u,status:"pending",resources:o,promise:e}}),e)}},xn=(n,e)=>{const t=n.steps.find(s=>"name"in s&&s.name===e);if(!t)throw Error(`Failed to find tour step with name ${e}`);return t},Pe=(n,e,t=n.length-1)=>{for(let s=t;s>=0;s--){const a=n[s];if(a.type===e)return a}},Sn=(n,e,t,s,a)=>{const r=t-e.startTime,i=n.duration*1e3;r>=0&&r<i?(n.currentTime=r/1e3,a?n.paused||n.pause():n.paused&&s&&n.play()):n.paused||n.pause()},Cn=()=>{let n=0,e=0;const t=[],s=()=>({steps:t,totalDuration:e}),a=new Map,r=_=>{const h={..._,startTime:n+_.startTime,index:t.length},d=a.get(h.type);if(d&&d.startTime+d.duration>h.startTime)throw console.error("Conflicting step",h),Error(`Cannot add conflicting step with type ${h.type} with currentTime ${n} at transform ${t.length}`);t.push(h),a.set(h.type,h),e=Math.max(e,h.startTime+h.duration)},i=_=>{_===void 0?n=e:n+=_},u=(_,h,d,w=ze)=>{r({type:"pan",startTime:0,index:-1,x:_,y:h,duration:d,easing:w})},o=(_,h,d=ze)=>{r({type:"zoom",startTime:0,index:-1,scale:_,duration:h,easing:d})},m=(_,h,d,w=ze)=>{const C=Pe(t,"pan");if(!C)throw Error("Cannot call 'panBy' before at least one 'pan' step.");u(C.x+_,C.y+h,d,w)},c=(_,h,d=ze)=>{const w=Pe(t,"zoom");if(!w)throw Error("Cannot call 'zoomBy' before at least one 'zoom' step.");o(w.scale*_,h,d)},f=new Set;let v=0;return{wait:i,pan:u,zoom:o,panBy:m,zoomBy:c,event:(_,h)=>{r({type:"event",startTime:0,index:-1,duration:0,name:_,data:h});const d=++v;return()=>{if(f.has(d))throw Error(`Already waited for event '${_}' with id ${d}`);r({type:"waitForEvent",startTime:0,index:-1,duration:0,name:_}),f.add(d)}},finalize:s,get_time_diff:()=>e-n}};function Dt(n,e,t){let s,a=L,r=()=>(a(),a=F(m,w=>t(9,s=w)),m),i,u=L,o=()=>(u(),u=F(f,w=>t(6,i=w)),f);n.$$.on_destroy.push(()=>a()),n.$$.on_destroy.push(()=>u());let{value:m}=e;r();let{enabled:c=!0}=e,f,v,p,y=c;const _=w=>{f&&(w?f.set(v,{duration:p}):f.set(i,{duration:0}))},h=(w,C,O=ze)=>(f||o(t(1,f=It(s))),v=w,p=C,f.set(w,{duration:C,easing:O})),d=()=>{o(t(1,f=null))};return n.$$set=w=>{"value"in w&&r(t(0,m=w.value)),"enabled"in w&&t(2,c=w.enabled)},n.$$.update=()=>{n.$$.dirty&70&&f&&c&&re(m,s=i,s),n.$$.dirty&36&&c!==y&&(t(5,y=c),_(c))},[m,f,c,h,d,y,i]}class Ne extends ve{constructor(e){super(),Ie(this,e,Dt,null,Te,{value:0,enabled:2,update:3,reset:4})}get update(){return this.$$.ctx[3]}get reset(){return this.$$.ctx[4]}}function Mt(n){let e,t,s,a,r,i,u={value:n[1],enabled:n[0]};e=new Ne({props:u}),n[11](e);let o={value:n[2],enabled:n[0]};s=new Ne({props:o}),n[12](s);let m={value:n[3],enabled:n[0]};return r=new Ne({props:m}),n[13](r),{c(){U(e.$$.fragment),t=ne(),U(s.$$.fragment),a=ne(),U(r.$$.fragment)},l(c){Z(e.$$.fragment,c),t=se(c),Z(s.$$.fragment,c),a=se(c),Z(r.$$.fragment,c)},m(c,f){q(e,c,f),M(c,t,f),q(s,c,f),M(c,a,f),q(r,c,f),i=!0},p(c,[f]){const v={};f&2&&(v.value=c[1]),f&1&&(v.enabled=c[0]),e.$set(v);const p={};f&4&&(p.value=c[2]),f&1&&(p.enabled=c[0]),s.$set(p);const y={};f&8&&(y.value=c[3]),f&1&&(y.enabled=c[0]),r.$set(y)},i(c){i||(G(e.$$.fragment,c),G(s.$$.fragment,c),G(r.$$.fragment,c),i=!0)},o(c){J(e.$$.fragment,c),J(s.$$.fragment,c),J(r.$$.fragment,c),i=!1},d(c){c&&(x(t),x(a)),n[11](null),j(e,c),n[12](null),j(s,c),n[13](null),j(r,c)}}}function zt(n,e,t){let{camera:s}=e,{enabled:a=!0}=e,{x:r,y:i,scale:u}=s,o,m,c;const f=async(d,w,C,O=ze)=>{await Promise.all([o.update(d,C,O),m.update(w,C,O)])},v=async(d,w,C=ze)=>c.update(d,w,C),p=()=>{o.reset(),m.reset(),c.reset()};function y(d){Ve[d?"unshift":"push"](()=>{o=d,t(4,o)})}function _(d){Ve[d?"unshift":"push"](()=>{m=d,t(5,m)})}function h(d){Ve[d?"unshift":"push"](()=>{c=d,t(6,c)})}return n.$$set=d=>{"camera"in d&&t(7,s=d.camera),"enabled"in d&&t(0,a=d.enabled)},n.$$.update=()=>{n.$$.dirty&128&&t(1,{x:r,y:i,scale:u}=s,r,(t(2,i),t(7,s)),(t(3,u),t(7,s)))},[a,r,i,u,o,m,c,s,f,v,p,y,_,h]}class Ot extends ve{constructor(e){super(),Ie(this,e,zt,Mt,Te,{camera:7,enabled:0,pan:8,zoom:9,resetTweens:10})}get pan(){return this.$$.ctx[8]}get zoom(){return this.$$.ctx[9]}get resetTweens(){return this.$$.ctx[10]}}function Lt(n){let e,t,s,a,r={camera:n[2],enabled:!n[0]};return e=new Ot({props:r}),n[21](e),{c(){U(e.$$.fragment)},l(i){Z(e.$$.fragment,i)},m(i,u){q(e,i,u),t=!0,s||(a=ge(window,"keydown",n[9],!0),s=!0)},p(i,u){const o={};u[0]&4&&(o.camera=i[2]),u[0]&1&&(o.enabled=!i[0]),e.$set(o)},i(i){t||(G(e.$$.fragment,i),t=!0)},o(i){J(e.$$.fragment,i),t=!1},d(i){n[21](null),j(e,i),s=!1,a()}}}function Bt(n,e,t){let s,a,r,i=L,u=()=>(i(),i=F(A,b=>t(18,r=b)),A),o,m=L,c=()=>(m(),m=F(V,b=>t(25,o=b)),V),f,v=L,p=()=>(v(),v=F(Y,b=>t(26,f=b)),Y),y,_=L,h=()=>(_(),_=F(I,b=>t(27,y=b)),I),d,w=L,C=()=>(w(),w=F(R,b=>t(19,d=b)),R),O;n.$$.on_destroy.push(()=>i()),n.$$.on_destroy.push(()=>m()),n.$$.on_destroy.push(()=>v()),n.$$.on_destroy.push(()=>_()),n.$$.on_destroy.push(()=>w());let{camera:P}=e,{clock:R}=e;C();let{hooks:l}=e,{create_tour_data:k}=e,{paused:W=!d.running}=e,{tweenedCamera:E=void 0}=e;const A=de(!1);u();const Y=de(0);p();const V=de(0);c();const I=de(null);h();const Q=()=>{ae(!1)},te=b=>{Ee(b)},oe=b=>{Ee(f+b)},me=b=>{if(!y)throw Error("expected tourData");Ee(y.steps[ce(y.steps,b)].startTime)};let le=!1;const ae=b=>{if(le)throw Error("Called finish twice");le=!0,H.done(b)};let ue=!1;const he=new Map,be=async b=>{if(!ue){if(!y)throw Error("expected tourData");re(Y,f+=b,f);for(let z=o;z<y.steps.length;z++){const T=y.steps[z];if(T.startTime>f)break;const N=T.duration-(f-T.startTime);switch(console.log("tour step and duration",N,T),T.type){case"pan":{H.pan(T.x,T.y,N,T.easing);break}case"zoom":{H.zoom(T.scale,N,T.easing);break}case"event":{const pe=H.event(T.name,T.data);pe&&he.set(T.name,pe);break}case"waitForEvent":{ue=!0,await he.get(T.name),he.delete(T.name),ue=!1;break}default:throw new Fe(T)}z===y.steps.length-1&&ae(!0),re(V,o=o===y.steps.length-1?-1:o+1,o)}}},Ee=b=>{if(!y)throw Error("expected tourData");re(Y,f=Math.min(Math.max(0,b),y.totalDuration),f),re(V,o=fe(y.steps,f),o);const z=Pe(y.steps,"pan",o-1);z&&H.pan(z.x,z.y,0,z.easing);const T=Pe(y.steps,"zoom",o-1);T&&H.zoom(T.scale,0,T.easing),be(0),f!==y.totalDuration&&H.seek(f,o)},ce=(b,z)=>Math.max(0,Math.min(Math.round(z),b.length-1)),fe=(b,z)=>{for(let T=0;T<b.length;T++){const N=b[T];if(N.startTime+N.duration>=z&&(N.type==="pan"||N.type==="zoom"))return T}return-1},H={pan:(b,z,T,N)=>{var pe;return E.pan(b,z,T,N),(pe=l.pan)==null?void 0:pe.call(l,b,z,T,N)},zoom:(b,z,T)=>{var N;return E.zoom(b,z,T),(N=l.zoom)==null?void 0:N.call(l,b,z,T)},event:(b,z)=>{var T;return b.startsWith("debug")&&console.log(b,f),(T=l.event)==null?void 0:T.call(l,b,z)},seek:(b,z)=>{var T;return(T=l.seek)==null?void 0:T.call(l,b,z)},done:b=>{var z;return re(A,r=!1,r),E.resetTweens(),a&&console.log("render stats",Tt()),(z=l.done)==null?void 0:z.call(l,b)}},xe=yt();it(n,xe,b=>t(20,O=b));const De=ut(),Oe=b=>{r&&b.key==="Escape"&&!b.ctrlKey&&(kt(b),Q())},Le=()=>{r&&Q(),d.running||R.resume(),re(I,y=k(),y),re(Y,f=0,f),re(V,o=0,o),le=!1,re(A,r=!0,r),De("begin"),a&&vt()};ct(()=>{r&&Q()});function $(b){Ve[b?"unshift":"push"](()=>{E=b,t(1,E)})}return n.$$set=b=>{"camera"in b&&t(2,P=b.camera),"clock"in b&&C(t(3,R=b.clock)),"hooks"in b&&t(10,l=b.hooks),"create_tour_data"in b&&t(11,k=b.create_tour_data),"paused"in b&&t(0,W=b.paused),"tweenedCamera"in b&&t(1,E=b.tweenedCamera)},n.$$.update=()=>{n.$$.dirty[0]&524288&&t(17,{running:s}=d,s),n.$$.dirty[0]&131073&&W===s&&t(0,W=!s),n.$$.dirty[0]&917504&&s&&r&&d.dt>0&&be(d.dt),n.$$.dirty[0]&1048576&&(a=O.dev_mode)},[W,E,P,R,A,Y,V,I,xe,Oe,l,k,Q,te,oe,me,Le,s,r,d,O,$]}class En extends ve{constructor(e){super(),Ie(this,e,Bt,Lt,Te,{camera:2,clock:3,hooks:10,create_tour_data:11,paused:0,tweenedCamera:1,touring:4,currentTime:5,currentStepIndex:6,tourData:7,cancel:12,seekTimeTo:13,seekTimeBy:14,seekIndexTo:15,begin_tour:16},null,[-1,-1])}get touring(){return this.$$.ctx[4]}get currentTime(){return this.$$.ctx[5]}get currentStepIndex(){return this.$$.ctx[6]}get tourData(){return this.$$.ctx[7]}get cancel(){return this.$$.ctx[12]}get seekTimeTo(){return this.$$.ctx[13]}get seekTimeBy(){return this.$$.ctx[14]}get seekIndexTo(){return this.$$.ctx[15]}get begin_tour(){return this.$$.ctx[16]}}function tt(n,e,t){const s=n.slice();return s[8]=e[t],s[10]=t,s}function nt(n){let e,t=`∙
		`,s,a;function r(){return n[5](n[10])}function i(){return n[6](n[10])}return{c(){e=ke("button"),e.textContent=t,this.h()},l(u){e=ye(u,"BUTTON",{"aria-label":!0,class:!0,"data-svelte-h":!0}),dt(e)!=="svelte-122yt7e"&&(e.textContent=t),this.h()},h(){ee(e,"aria-label","select month "+(n[10]+1)),ee(e,"class","svelte-1sl3nl6"),ie(e,"active",n[10]===n[0]),ie(e,"selected",n[10]===n[1])},m(u,o){M(u,e,o),s||(a=[ge(e,"click",r),ge(e,"mouseenter",i),ge(e,"mouseleave",n[7])],s=!0)},p(u,o){n=u,o&1&&ie(e,"active",n[10]===n[0]),o&2&&ie(e,"selected",n[10]===n[1])},d(u){u&&x(e),s=!1,ot(a)}}}function Vt(n){let e,t=He({length:12}),s=[];for(let a=0;a<t.length;a+=1)s[a]=nt(tt(n,t,a));return{c(){e=ke("div");for(let a=0;a<s.length;a+=1)s[a].c();this.h()},l(a){e=ye(a,"DIV",{class:!0});var r=Ce(e);for(let i=0;i<s.length;i+=1)s[i].l(r);r.forEach(x),this.h()},h(){ee(e,"class","month-hud svelte-1sl3nl6")},m(a,r){M(a,e,r);for(let i=0;i<s.length;i+=1)s[i]&&s[i].m(e,null)},p(a,[r]){if(r&15){t=He({length:12});let i;for(i=0;i<t.length;i+=1){const u=tt(a,t,i);s[i]?s[i].p(u,r):(s[i]=nt(u),s[i].c(),s[i].m(e,null))}for(;i<s.length;i+=1)s[i].d(1);s.length=t.length}},i:L,o:L,d(a){a&&x(e),ft(s,a)}}}function At(n,e,t){let{active_land_index:s}=e,{selected_land_index:a}=e,{select_land_index:r}=e,{hover_land_index:i}=e;const u=f=>{r(a===f?null:f)},o=f=>u(f),m=f=>i(f),c=()=>i(null);return n.$$set=f=>{"active_land_index"in f&&t(0,s=f.active_land_index),"selected_land_index"in f&&t(1,a=f.selected_land_index),"select_land_index"in f&&t(4,r=f.select_land_index),"hover_land_index"in f&&t(2,i=f.hover_land_index)},[s,a,i,u,r,o,m,c]}class Dn extends ve{constructor(e){super(),Ie(this,e,At,Vt,Te,{active_land_index:0,selected_land_index:1,select_land_index:4,hover_land_index:2})}}function Ft(n){let e,t,s,a;return{c(){e=ke("div"),t=ke("div"),this.h()},l(r){e=ye(r,"DIV",{class:!0,"aria-hidden":!0});var i=Ce(e);t=ye(i,"DIV",{class:!0,style:!0}),Ce(t).forEach(x),i.forEach(x),this.h()},h(){ee(t,"class","water-level-fill svelte-ivhs4t"),qe(t,"height",100*n[0]/n[1]+"%"),ee(e,"class","water-level svelte-ivhs4t"),ee(e,"aria-hidden",""),ie(e,"selected",n[2]!==null)},m(r,i){M(r,e,i),Se(e,t),n[7](e),s||(a=[ge(e,"click",n[8]),ge(e,"mouseenter",n[9]),ge(e,"mousemove",n[10]),ge(e,"mouseleave",n[11])],s=!0)},p(r,[i]){i&3&&qe(t,"height",100*r[0]/r[1]+"%"),i&4&&ie(e,"selected",r[2]!==null)},i:L,o:L,d(r){r&&x(e),n[7](null),s=!1,ot(a)}}}function Ht(n,e,t){let{sea_level:s}=e,{sea_index_max:a}=e,{selected_sea_level:r}=e,{select_sea_level:i}=e,{hover_sea_level:u}=e,o;const m=_=>{const h=o.getBoundingClientRect();return(1-(_-h.top)/(h.bottom-h.top))*a};function c(_){Ve[_?"unshift":"push"](()=>{o=_,t(5,o)})}const f=_=>i(r===null?m(_.clientY):null),v=_=>u(m(_.clientY)),p=_=>u(m(_.clientY)),y=()=>u(null);return n.$$set=_=>{"sea_level"in _&&t(0,s=_.sea_level),"sea_index_max"in _&&t(1,a=_.sea_index_max),"selected_sea_level"in _&&t(2,r=_.selected_sea_level),"select_sea_level"in _&&t(3,i=_.select_sea_level),"hover_sea_level"in _&&t(4,u=_.hover_sea_level)},[s,a,r,i,u,o,m,c,f,v,p,y]}class Mn extends ve{constructor(e){super(),Ie(this,e,Ht,Ft,Te,{sea_level:0,sea_index_max:1,selected_sea_level:2,select_sea_level:3,hover_sea_level:4})}}const Pt=(n,e,t=new Array(n))=>{const s=Math.floor(e),a=s===n-1?0:s+1,r=e-s;for(let i=0;i<n;i++){let u=0;i===s?u=1:i===a&&(u=r),t[i]=u}return t},Rt=(n,e,t)=>e+n*(t===1&&e===n-1?1:2),Wt=(n,e,t=new Array(n),s)=>{const a=n-1,r=Math.min(a,Math.max(0,Math.floor(e))),i=r===a?null:r+1,u=i===null?0:e%1;for(let o=0;o<n;o++)t[o]=s===void 0||o>s?o===r?1:o===i?u:0:o===s?1:o===r?1-u:o>r?1:0;return t};function Yt(n){let e,t;return e=new xt({props:{width:n[3],height:n[2],scale:n[4],zoom:n[0].zoom_camera,pan:n[0].move_camera,disabled:!n[1]}}),{c(){U(e.$$.fragment)},l(s){Z(e.$$.fragment,s)},m(s,a){q(e,s,a),t=!0},p(s,a){const r={};a[0]&8&&(r.width=s[3]),a[0]&4&&(r.height=s[2]),a[0]&16&&(r.scale=s[4]),a[0]&1&&(r.zoom=s[0].zoom_camera),a[0]&1&&(r.pan=s[0].move_camera),a[0]&2&&(r.disabled=!s[1]),e.$set(r)},i(s){t||(G(e.$$.fragment,s),t=!0)},o(s){J(e.$$.fragment,s),t=!1},d(s){j(e,s)}}}function Nt(n,e,t){let s,a,r,i,u,o,m,c,f=L,v=()=>(f(),f=F(i,g=>t(2,c=g)),i),p,y=L,_=()=>(y(),y=F(r,g=>t(3,p=g)),r),h,d=L,w=()=>(d(),d=F(u,g=>t(4,h=g)),u),C,O=L,P=()=>(O(),O=F(a,g=>t(28,C=g)),a),R,l=L,k=()=>(l(),l=F(s,g=>t(29,R=g)),s);n.$$.on_destroy.push(()=>f()),n.$$.on_destroy.push(()=>y()),n.$$.on_destroy.push(()=>d()),n.$$.on_destroy.push(()=>O()),n.$$.on_destroy.push(()=>l());let{camera:W}=e,{input_enabled:E=!0}=e,{landImages:A}=e,{seaImages:Y}=e,{shoreImage:V=void 0}=e,{shoreImageCount:I=void 0}=e,{seashoreFloorIndex:Q=void 0}=e,{lightsImage:te=void 0}=e,{lightsOpacity:oe=0}=e,{nightfallOpacity:me=0}=e,{showLights:le=!1}=e,{activeLandValue:ae}=e,{activeSeaLevel:ue}=e,{imageWidth:he}=e,{imageHeight:be}=e;if(V&&I===void 0)throw Error("shoreImageCount is required to be paired with shoreImage");const{pixi:Ee}=gt({load:async()=>{const g=[];for(const S of A)g.push(we.load(S));for(const S of Y)g.push(we.load(S));V&&g.push(we.load(V)),te&&g.push(we.load(te)),await Promise.all(g)},loaded:async g=>{De=new Be,g.addChild(De),Oe=new Be,De.addChild(Oe),Oe.sortableChildren=!0;for(const S of A){const D=Ae(we.get(S));Oe.addChild(D),ce.push(D)}T(ce,o,m,h),Ue(ae),Le=new Be,De.addChild(Le);for(const S of Y){const D=Ae(we.get(S));Le.addChild(D),fe.push(D)}if(V){t(24,H=Ae(we.get(V))),Le.addChild(H);const S=new bt(void 0,lt,pe(I));t(24,H.filters=[S],H)}if(T(fe,o,m,h),Xe(ue),te){t(25,$=new Be),De.addChild($);const S=new je(pt.WHITE,p,c);S.tint=0,S.alpha=0,$.addChild(S),xe.push(S);const D=Ae(we.get(te));D.alpha=0,$.addChild(D),xe.push(D),T(xe,o,m,h)}},destroy:()=>{console.log("destroyed earth")}}),ce=[],fe=[];let H;const xe=[];let De,Oe,Le,$;const b=(g,S,D)=>{for(const B of g)z(B,S,D)},z=(g,S,D)=>{g.width=S,g.height=D},T=(g,S,D,B)=>{for(const Me of g)N(Me,S,D,B)},N=(g,S,D,B)=>{g.tileScale.set(B),g.tilePosition.set(S,D)},pe=(g,S)=>{const D={};for(let B=0;B<g;B++)D["alpha"+B]=S?S[g-1-B]:0;return D},lt=`
		// TODO array of values, this is hacky for lack of knowledge
		uniform float alpha1;
		uniform float alpha2;
		uniform float alpha3;
		uniform float alpha4;
		uniform float alpha5;
		uniform float alpha6;
		uniform float alpha7;
		uniform float alpha8;
		uniform float alpha9;
		uniform float alpha10;
		uniform float alpha11;
		uniform float alpha12;
		uniform float alpha13;

		varying vec2 vTextureCoord;
		uniform sampler2D uSampler;

		void main() {
			vec4 color = texture2D(uSampler, vTextureCoord);
			int r = int(floor(color.r / color.a * 255.0 + 0.5));
			if (r == 218) {
				color *= alpha1;
			} else if (r == 202) {
				color *= alpha2;
			} else if (r == 187) {
				color *= alpha3;
			} else if (r == 171) {
				color *= alpha4;
			} else if (r == 151) {
				color *= alpha5;
			} else if (r == 133) {
				color *= alpha6;
			} else if (r == 118) {
				color *= alpha7;
			} else if (r == 104) {
				color *= alpha8;
			} else if (r == 89) {
				color *= alpha9;
			} else if (r == 76) {
				color *= alpha10;
			} else if (r == 72) {
				color *= alpha11;
			} else if (r == 68) {
				color *= alpha12;
			} else if (r == 65) {
				color *= alpha13;
			} else {
				color *= 0.0;
			}
			gl_FragColor = color;
		}
	`,Ke=Y.length+(V?I:0),We=new Array(Ke),Xe=g=>{Wt(Ke,g,We,Q);for(let S=0;S<fe.length;S++)t(23,fe[S].alpha=We[S+(I||0)],fe);if(H){const S=pe(I,We),{uniforms:D}=H.filters[0];for(const B in S)D[B]=S[B]}},Ye=new Array(A.length),Ue=g=>{Pt(A.length,g,Ye);const S=ce.length;for(let D=0;D<S;D++){const B=ce[D],Me=Ye[D];B.alpha!==Me&&(B.alpha=Me);const Ze=Rt(S,D,Ye[D]);Ze!==B.zIndex&&(B.zIndex=Ze)}},Ae=g=>{const S=new Je(g),D=new Je(g);D.angle=180,D.y=be*2,D.x=he;const B=new Be;B.addChild(S),B.addChild(D);const Me=wt.create({width:he,height:be*2});return Ee.app.renderer.render(B,{renderTexture:Me}),new je(Me,p,c)};return n.$$set=g=>{"camera"in g&&t(0,W=g.camera),"input_enabled"in g&&t(1,E=g.input_enabled),"landImages"in g&&t(10,A=g.landImages),"seaImages"in g&&t(11,Y=g.seaImages),"shoreImage"in g&&t(12,V=g.shoreImage),"shoreImageCount"in g&&t(13,I=g.shoreImageCount),"seashoreFloorIndex"in g&&t(14,Q=g.seashoreFloorIndex),"lightsImage"in g&&t(15,te=g.lightsImage),"lightsOpacity"in g&&t(16,oe=g.lightsOpacity),"nightfallOpacity"in g&&t(17,me=g.nightfallOpacity),"showLights"in g&&t(18,le=g.showLights),"activeLandValue"in g&&t(19,ae=g.activeLandValue),"activeSeaLevel"in g&&t(20,ue=g.activeSeaLevel),"imageWidth"in g&&t(21,he=g.imageWidth),"imageHeight"in g&&t(22,be=g.imageHeight)},n.$$.update=()=>{if(n.$$.dirty[0]&1&&k(t(9,{x:s,y:a,width:r,height:i,scale:u}=W,s,P(t(8,a)),_(t(7,r)),v(t(6,i)),w(t(5,u)))),n.$$.dirty[0]&536870936&&t(27,o=-R*h+p/2),n.$$.dirty[0]&268435476&&t(26,m=-C*h+c/2),n.$$.dirty[0]&34013184&&$){const g=le;t(25,$.visible=g,$),g&&(t(25,$.children[0].alpha=me,$),t(25,$.children[1].alpha=oe,$))}n.$$.dirty[0]&12&&b(ce,p,c),n.$$.dirty[0]&8388620&&b(fe,p,c),n.$$.dirty[0]&16777228&&H&&z(H,p,c),n.$$.dirty[0]&12&&b(xe,p,c),n.$$.dirty[0]&201326608&&T(ce,o,m,h),n.$$.dirty[0]&209715216&&T(fe,o,m,h),n.$$.dirty[0]&218103824&&H&&N(H,o,m,h),n.$$.dirty[0]&201326608&&T(xe,o,m,h),n.$$.dirty[0]&9437184&&fe.length&&Xe(ue),n.$$.dirty[0]&524288&&ce.length&&Ue(ae)},[W,E,c,p,h,u,i,r,a,s,A,Y,V,I,Q,te,oe,me,le,ae,ue,he,be,fe,H,$,m,o,C,R]}class zn extends ve{constructor(e){super(),Ie(this,e,Nt,Yt,Te,{camera:0,input_enabled:1,landImages:10,seaImages:11,shoreImage:12,shoreImageCount:13,seashoreFloorIndex:14,lightsImage:15,lightsOpacity:16,nightfallOpacity:17,showLights:18,activeLandValue:19,activeSeaLevel:20,imageWidth:21,imageHeight:22},null,[-1,-1])}}function Kt(n){let e;return{c(){e=K("play")},l(t){e=X(t,"play")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function Xt(n){let e;return{c(){e=K("pause")},l(t){e=X(t,"pause")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function Ut(n){let e;function t(r,i){return r[2]?Xt:Kt}let s=t(n),a=s(n);return{c(){a.c(),e=Ge()},l(r){a.l(r),e=Ge()},m(r,i){a.m(r,i),M(r,e,i)},p(r,i){s!==(s=t(r))&&(a.d(1),a=s(r),a&&(a.c(),a.m(e.parentNode,e)))},d(r){r&&x(e),a.d(r)}}}function Zt(n){let e,t=Qe(n[5]/1e3,1).toFixed(1)+"",s;return{c(){e=K("time: "),s=K(t)},l(a){e=X(a,"time: "),s=X(a,t)},m(a,r){M(a,e,r),M(a,s,r)},p(a,r){r&32&&t!==(t=Qe(a[5]/1e3,1).toFixed(1)+"")&&Re(s,t)},d(a){a&&(x(e),x(s))}}}function qt(n){let e,t;return{c(){e=K("index: "),t=K(n[6])},l(s){e=X(s,"index: "),t=X(s,n[6])},m(s,a){M(s,e,a),M(s,t,a)},p(s,a){a&64&&Re(t,s[6])},d(s){s&&(x(e),x(t))}}}function Gt(n){let e,t=Math.round(n[1]/1e3)+"",s,a;return{c(){e=K("seek to "),s=K(t),a=K("s")},l(r){e=X(r,"seek to "),s=X(r,t),a=X(r,"s")},m(r,i){M(r,e,i),M(r,s,i),M(r,a,i)},p(r,i){i&2&&t!==(t=Math.round(r[1]/1e3)+"")&&Re(s,t)},d(r){r&&(x(e),x(s),x(a))}}}function Jt(n){let e;return{c(){e=K("seek +1s")},l(t){e=X(t,"seek +1s")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function jt(n){let e;return{c(){e=K("seek -1s")},l(t){e=X(t,"seek -1s")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function Qt(n){let e;return{c(){e=K("seek +10s")},l(t){e=X(t,"seek +10s")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function $t(n){let e;return{c(){e=K("seek -10s")},l(t){e=X(t,"seek -10s")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function en(n){let e;return{c(){e=K("seek +100s")},l(t){e=X(t,"seek +100s")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function tn(n){let e;return{c(){e=K("seek -100s")},l(t){e=X(t,"seek -100s")},m(t,s){M(t,e,s)},d(t){t&&x(e)}}}function nn(n){let e,t,s,a,r,i,u,o,m,c,f,v,p,y,_,h,d,w,C,O,P,R;return e=new _e({props:{$$slots:{default:[Ut]},$$scope:{ctx:n}}}),e.$on("click",n[10]),s=new _e({props:{$$slots:{default:[Zt]},$$scope:{ctx:n}}}),r=new _e({props:{$$slots:{default:[qt]},$$scope:{ctx:n}}}),r.$on("click",n[11]),u=new _e({props:{$$slots:{default:[Gt]},$$scope:{ctx:n}}}),u.$on("click",n[12]),m=new _e({props:{$$slots:{default:[Jt]},$$scope:{ctx:n}}}),m.$on("click",n[13]),f=new _e({props:{$$slots:{default:[jt]},$$scope:{ctx:n}}}),f.$on("click",n[14]),p=new _e({props:{$$slots:{default:[Qt]},$$scope:{ctx:n}}}),p.$on("click",n[15]),_=new _e({props:{$$slots:{default:[$t]},$$scope:{ctx:n}}}),_.$on("click",n[16]),d=new _e({props:{$$slots:{default:[en]},$$scope:{ctx:n}}}),d.$on("click",n[17]),C=new _e({props:{$$slots:{default:[tn]},$$scope:{ctx:n}}}),C.$on("click",n[18]),{c(){U(e.$$.fragment),t=ne(),U(s.$$.fragment),a=ne(),U(r.$$.fragment),i=ne(),U(u.$$.fragment),o=ne(),U(m.$$.fragment),c=ne(),U(f.$$.fragment),v=ne(),U(p.$$.fragment),y=ne(),U(_.$$.fragment),h=ne(),U(d.$$.fragment),w=ne(),U(C.$$.fragment)},l(l){Z(e.$$.fragment,l),t=se(l),Z(s.$$.fragment,l),a=se(l),Z(r.$$.fragment,l),i=se(l),Z(u.$$.fragment,l),o=se(l),Z(m.$$.fragment,l),c=se(l),Z(f.$$.fragment,l),v=se(l),Z(p.$$.fragment,l),y=se(l),Z(_.$$.fragment,l),h=se(l),Z(d.$$.fragment,l),w=se(l),Z(C.$$.fragment,l)},m(l,k){q(e,l,k),M(l,t,k),q(s,l,k),M(l,a,k),q(r,l,k),M(l,i,k),q(u,l,k),M(l,o,k),q(m,l,k),M(l,c,k),q(f,l,k),M(l,v,k),q(p,l,k),M(l,y,k),q(_,l,k),M(l,h,k),q(d,l,k),M(l,w,k),q(C,l,k),O=!0,P||(R=ge(window,"keydown",n[8]),P=!0)},p(l,[k]){const W={};k&524292&&(W.$$scope={dirty:k,ctx:l}),e.$set(W);const E={};k&524320&&(E.$$scope={dirty:k,ctx:l}),s.$set(E);const A={};k&524352&&(A.$$scope={dirty:k,ctx:l}),r.$set(A);const Y={};k&524290&&(Y.$$scope={dirty:k,ctx:l}),u.$set(Y);const V={};k&524288&&(V.$$scope={dirty:k,ctx:l}),m.$set(V);const I={};k&524288&&(I.$$scope={dirty:k,ctx:l}),f.$set(I);const Q={};k&524288&&(Q.$$scope={dirty:k,ctx:l}),p.$set(Q);const te={};k&524288&&(te.$$scope={dirty:k,ctx:l}),_.$set(te);const oe={};k&524288&&(oe.$$scope={dirty:k,ctx:l}),d.$set(oe);const me={};k&524288&&(me.$$scope={dirty:k,ctx:l}),C.$set(me)},i(l){O||(G(e.$$.fragment,l),G(s.$$.fragment,l),G(r.$$.fragment,l),G(u.$$.fragment,l),G(m.$$.fragment,l),G(f.$$.fragment,l),G(p.$$.fragment,l),G(_.$$.fragment,l),G(d.$$.fragment,l),G(C.$$.fragment,l),O=!0)},o(l){J(e.$$.fragment,l),J(s.$$.fragment,l),J(r.$$.fragment,l),J(u.$$.fragment,l),J(m.$$.fragment,l),J(f.$$.fragment,l),J(p.$$.fragment,l),J(_.$$.fragment,l),J(d.$$.fragment,l),J(C.$$.fragment,l),O=!1},d(l){l&&(x(t),x(a),x(i),x(o),x(c),x(v),x(y),x(h),x(w)),j(e,l),j(s,l),j(r,l),j(u,l),j(m,l),j(f,l),j(p,l),j(_,l),j(d,l),j(C,l),P=!1,R()}}}const st=1e3,rt=1e4,at=1e5;function sn(n,e,t){let s,a,r,i,u,o=L,m=()=>(o(),o=F(s,E=>t(5,u=E)),s),c,f=L,v=()=>(f(),f=F(a,E=>t(6,c=E)),a);n.$$.on_destroy.push(()=>o()),n.$$.on_destroy.push(()=>f());let{tour:p}=e,{debug_start_time:y}=e;const _=St();it(n,_,E=>t(9,i=E));const h=E=>{switch(E.key){case"ArrowLeft":{p.seekTimeBy(E.shiftKey?E.ctrlKey?-at:-rt:-st);break}case"ArrowRight":{p.seekTimeBy(E.shiftKey?E.ctrlKey?at:rt:st);break}}},d=()=>_.toggle(),w=()=>{const E=Number(prompt("index?",c+""));Number.isNaN(E)||p.seekIndexTo(E)},C=()=>{p.seekTimeTo(y)},O=()=>{p.seekTimeBy(1e3)},P=()=>{p.seekTimeBy(-1e3)},R=()=>{p.seekTimeBy(1e4)},l=()=>{p.seekTimeBy(-1e4)},k=()=>{p.seekTimeBy(1e5)},W=()=>{p.seekTimeBy(-1e5)};return n.$$set=E=>{"tour"in E&&t(0,p=E.tour),"debug_start_time"in E&&t(1,y=E.debug_start_time)},n.$$.update=()=>{n.$$.dirty&1&&m(t(4,{currentTime:s,currentStepIndex:a}=p,s,v(t(3,a)))),n.$$.dirty&512&&t(2,{running:r}=i,r)},[p,y,r,a,s,u,c,_,h,i,d,w,C,O,P,R,l,k,W]}class On extends ve{constructor(e){super(),Ie(this,e,sn,nn,Te,{tour:0,debug_start_time:1})}}const rn=1.1;function an(n,e,t){let s,a=L,r=()=>(a(),a=F(k,I=>t(12,s=I)),k),i,u=L,o=()=>(u(),u=F(l,I=>t(13,i=I)),l),m,c=L,f=()=>(c(),c=F(E,I=>t(14,m=I)),E),v,p=L,y=()=>(p(),p=F(W,I=>t(15,v=I)),W),_,h=L,d=()=>(h(),h=F(A,I=>t(16,_=I)),A);n.$$.on_destroy.push(()=>a()),n.$$.on_destroy.push(()=>u()),n.$$.on_destroy.push(()=>c()),n.$$.on_destroy.push(()=>p()),n.$$.on_destroy.push(()=>h());let{initialX:w=0}=e,{initialY:C=0}=e,{initialWidth:O=0}=e,{initialHeight:P=0}=e,{initialScale:R=1}=e;const l=de(w);o();const k=de(C);r();const W=de(O);y();const E=de(P);f();const A=de(R);d();const Y=(I,Q=v/2,te=m/2,oe=rn)=>{if(I===0)return;const me=I>0?1/oe:oe,le=_,ae=le*me;re(A,_=ae,_);const ue=(ae-le)/le,he=Q-v/2,be=te-m/2,Ee=he*ue/ae,ce=be*ue/ae;V(Ee,ce)},V=(I,Q)=>{re(l,i+=I,i),re(k,s+=Q,s)};return n.$$set=I=>{"initialX"in I&&t(5,w=I.initialX),"initialY"in I&&t(6,C=I.initialY),"initialWidth"in I&&t(7,O=I.initialWidth),"initialHeight"in I&&t(8,P=I.initialHeight),"initialScale"in I&&t(9,R=I.initialScale)},[l,k,W,E,A,w,C,O,P,R,Y,V]}class Ln extends ve{constructor(e){super(),Ie(this,e,an,null,Te,{initialX:5,initialY:6,initialWidth:7,initialHeight:8,initialScale:9,x:0,y:1,width:2,height:3,scale:4,zoom_camera:10,move_camera:11})}get x(){return this.$$.ctx[0]}get y(){return this.$$.ctx[1]}get width(){return this.$$.ctx[2]}get height(){return this.$$.ctx[3]}get scale(){return this.$$.ctx[4]}get zoom_camera(){return this.$$.ctx[10]}get move_camera(){return this.$$.ctx[11]}}export{Ln as C,zn as E,Dn as M,vn as R,Mn as S,On as T,En as a,In as b,Cn as c,Pt as d,Rt as e,xn as f,Wt as g,Sn as u};