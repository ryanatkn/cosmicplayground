import{n as P,s as C,e as y,c as T,b as k,g as N,i as b,a as z,d as c,l as E,m as g,I as S,p as w,o as L,J as O,F as V,L as B,x as J,y as R}from"./scheduler.B6ZHjePS.js";import{S as A,i as D,c as I,a as W,m as F,t as U,b as j,d as q}from"./index.D8p8-7y1.js";import{E as Y}from"./CreditsProjectSignature.BCKb9Pui.js";import{g as G}from"./clock.CjzioAVG.js";import{E as K}from"./EarthThumbnail.I1IM3esF.js";function Q(t){let e,s,a,o=`<a href="https://earthobservatory.nasa.gov/features/NightLights">Earth at Night</a> (<a href="https://earthobservatory.nasa.gov/features/NightLights/page3.php">flat maps</a>) by <a href="https://earthobservatory.nasa.gov/about/michael-carlowicz">Michael Carlowicz</a>,
	<a href="https://earthobservatory.nasa.gov">NASA Earth Observatory</a>
	(2017)`,f,h,_=`<a href="/assets/audio/Alexander_Nakarada__Piña_Colada.mp3">&quot;Piña Colada&quot;</a> by Alexander
	Nakarada,
	<a href="https://www.serpentsoundstudios.com">serpentsoundstudios.com</a>,
	<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`,m,u,l=`<a href="/assets/audio/water_trickle.mp3">recording of water trickling</a> by
	<a href="https://freesound.org/people/FractalStudios/sounds/363120/">FractalStudios on freesound.org</a>,
	<a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>`,p;return e=new Y({}),{c(){I(e.$$.fragment),s=C(),a=y("p"),a.innerHTML=o,f=C(),h=y("p"),h.innerHTML=_,m=C(),u=y("p"),u.innerHTML=l},l(n){W(e.$$.fragment,n),s=T(n),a=k(n,"P",{"data-svelte-h":!0}),N(a)!=="svelte-1epv8o8"&&(a.innerHTML=o),f=T(n),h=k(n,"P",{"data-svelte-h":!0}),N(h)!=="svelte-1rhy9mg"&&(h.innerHTML=_),m=T(n),u=k(n,"P",{"data-svelte-h":!0}),N(u)!=="svelte-1cocmrm"&&(u.innerHTML=l)},m(n,i){F(e,n,i),b(n,s,i),b(n,a,i),b(n,f,i),b(n,h,i),b(n,m,i),b(n,u,i),p=!0},p:z,i(n){p||(U(e.$$.fragment,n),p=!0)},o(n){j(e.$$.fragment,n),p=!1},d(n){n&&(c(s),c(a),c(f),c(h),c(m),c(u)),q(e,n)}}}class ne extends A{constructor(e){super(),D(this,e,null,Q,P,{})}}const H=600,ie=13;function M(t){let e,s;return{c(){e=y("div"),s=J("soggy planet"),this.h()},l(a){e=k(a,"DIV",{class:!0,style:!0});var o=E(e);s=R(o,"soggy planet"),o.forEach(c),this.h()},h(){g(e,"class","thumbnail-text svelte-1j8h1a8"),w(e,"transform","scale3d("+t[4]+", "+t[4]+", "+t[4]+")")},m(a,o){b(a,e,o),L(e,s)},p(a,o){o&16&&w(e,"transform","scale3d("+a[4]+", "+a[4]+", "+a[4]+")")},d(a){a&&c(e)}}}function X(t){let e,s,a,o,f,h,_,m=`${t[0]/2}px`,u=`${t[0]/2}px;`,l,p,n;a=new K({props:{width:t[0],height:t[0]/2,animationDuration:"45s",running:t[5].running,image2Url:"/assets/earth/lights.png"}});let i=t[3]&&M(t);return{c(){e=y("div"),s=y("div"),I(a.$$.fragment),o=C(),i&&i.c(),this.h()},l(d){e=k(d,"DIV",{class:!0,role:!0,"aria-label":!0,tabindex:!0});var r=E(e);s=k(r,"DIV",{class:!0});var v=E(s);W(a.$$.fragment,v),v.forEach(c),o=T(r),i&&i.l(r),r.forEach(c),this.h()},h(){g(s,"class","thumbnail-animation-wrapper svelte-1j8h1a8"),g(e,"class","soggy-planet-thumbnail svelte-1j8h1a8"),g(e,"role",f=t[2]?"button":void 0),g(e,"aria-label",h=t[2]?t[1]:void 0),g(e,"tabindex",_=t[2]?0:void 0),S(e,"buttonish",t[2]),w(e,"width",m),w(e,"height",u)},m(d,r){b(d,e,r),L(e,s),F(a,s,null),L(e,o),i&&i.m(e,null),l=!0,p||(n=O(e,"click",function(){V(t[2])&&t[2].apply(this,arguments)}),p=!0)},p(d,[r]){t=d;const v={};r&1&&(v.width=t[0]),r&1&&(v.height=t[0]/2),r&32&&(v.running=t[5].running),a.$set(v),t[3]?i?i.p(t,r):(i=M(t),i.c(),i.m(e,null)):i&&(i.d(1),i=null),(!l||r&4&&f!==(f=t[2]?"button":void 0))&&g(e,"role",f),(!l||r&6&&h!==(h=t[2]?t[1]:void 0))&&g(e,"aria-label",h),(!l||r&4&&_!==(_=t[2]?0:void 0))&&g(e,"tabindex",_),(!l||r&4)&&S(e,"buttonish",t[2]),r&1&&m!==(m=`${t[0]/2}px`)&&w(e,"width",m),r&1&&u!==(u=`${t[0]/2}px;`)&&w(e,"height",u)},i(d){l||(U(a.$$.fragment,d),l=!0)},o(d){j(a.$$.fragment,d),l=!1},d(d){d&&c(e),q(a),i&&i.d(),p=!1,n()}}}function Z(t,e,s){let a,o,{earthWidth:f=H}=e,{label:h="proceed"}=e,{on_click:_=null}=e,{showName:m=!0}=e;const u=G();return B(t,u,l=>s(5,o=l)),t.$$set=l=>{"earthWidth"in l&&s(0,f=l.earthWidth),"label"in l&&s(1,h=l.label),"on_click"in l&&s(2,_=l.on_click),"showName"in l&&s(3,m=l.showName)},t.$$.update=()=>{t.$$.dirty&1&&s(4,a=f/H)},[f,h,_,m,a,o,u]}class se extends A{constructor(e){super(),D(this,e,Z,X,P,{earthWidth:0,label:1,on_click:2,showName:3})}}export{se as S,H as T,ne as a,ie as b};