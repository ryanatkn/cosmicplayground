import{n as c,e as h,x as p,b as _,l as f,y as d,d as u,m as i,i as g,o as b,A as y,a as m,L as v}from"./scheduler.B6ZHjePS.js";import{S as x,i as A}from"./index.D8p8-7y1.js";import{g as L}from"./portals.S2EpCDve.js";function P(r){let t,s=r[1].name+"",o,n;return{c(){t=h("a"),o=p(s),this.h()},l(a){t=_(a,"A",{href:!0,class:!0});var e=f(t);o=d(e,s),e.forEach(u),this.h()},h(){i(t,"href",n="/"+r[0]),i(t,"class","svelte-1w1lg2t")},m(a,e){g(a,t,e),b(t,o)},p(a,[e]){e&2&&s!==(s=a[1].name+"")&&y(o,s),e&1&&n!==(n="/"+a[0])&&i(t,"href",n)},i:m,o:m,d(a){a&&u(t)}}}function S(r,t,s){let o,n,{slug:a}=t;const e=L();return v(r,e,l=>s(3,n=l)),r.$$set=l=>{"slug"in l&&s(0,a=l.slug)},r.$$.update=()=>{r.$$.dirty&9&&s(1,o=n.data.portals_by_slug.get(a))},[a,o,e,n]}class C extends x{constructor(t){super(),A(this,t,S,P,c,{slug:0})}}export{C as P};