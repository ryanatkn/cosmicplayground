import{w as j}from"./index.mvauKzP3.js";import{w,u as C}from"./scheduler.EKw-xcnK.js";import{n as O,l as P}from"./index.nrQb7by4.js";import{i as g}from"./utils.wgB25Bnj.js";function p(t,r){if(t===r||t!==t)return()=>t;const s=typeof t;if(s!==typeof r||Array.isArray(t)!==Array.isArray(r))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const i=r.map((o,e)=>p(t[e],o));return o=>i.map(e=>e(o))}if(s==="object"){if(!t||!r)throw new Error("Object cannot be null");if(g(t)&&g(r)){t=t.getTime(),r=r.getTime();const e=r-t;return n=>new Date(t+n*e)}const i=Object.keys(r),o={};return i.forEach(e=>{o[e]=p(t[e],r[e])}),e=>{const n={};return i.forEach(f=>{n[f]=o[f](e)}),n}}if(s==="number"){const i=r-t;return o=>t+o*i}throw new Error(`Cannot interpolate ${s} values`)}function D(t,r={}){const s=j(t);let i,o=t;function e(n,f){if(t==null)return s.set(t=n),Promise.resolve();o=n;let u=i,l=!1,{delay:A=0,duration:c=400,easing:h=C,interpolate:E=p}=w(w({},r),f);if(c===0)return u&&(u.abort(),u=null),s.set(t=o),Promise.resolve();const a=O()+A;let m;return i=P(y=>{if(y<a)return!0;l||(m=E(t,n),typeof c=="function"&&(c=c(t,n)),l=!0),u&&(u.abort(),u=null);const d=y-a;return d>c?(s.set(t=n),!1):(s.set(t=m(h(d/c))),!0)}),i.promise}return{set:e,update:(n,f)=>e(n(o,t),f),subscribe:s.subscribe}}export{D as t};