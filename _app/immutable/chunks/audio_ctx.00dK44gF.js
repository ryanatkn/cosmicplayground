import{f as c,h as n}from"./scheduler.EKw-xcnK.js";const e=Symbol("audio_ctx"),a=()=>c(e)(),u=()=>{let t;const o=()=>(t||(t=i()),t);return n(e,o),o},i=()=>{const t=window;return new(t.AudioContext||t.webkitAudioContext)};export{a as g,u as s};