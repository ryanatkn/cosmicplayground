import{m as p,A as T,E as d,e as h,d as R,B as k,n as j,o as H,V as te,p as Z}from"./pixi.tNwfo43o.js";import{n as se,e as re,b as ae,l as ie,d as Q,m as oe,I as O,i as ne}from"./scheduler.EKw-xcnK.js";import{S as ce,i as le,c as Ae,a as de,m as he,t as ue,b as fe,d as me}from"./index.nrQb7by4.js";import{P as ge}from"./Pending_Animation.iF66PB_S.js";function f(t){if(typeof t!="string")throw new TypeError(`Path must be a string. Received ${JSON.stringify(t)}`)}function C(t){return t.split("?")[0].split("#")[0]}function pe(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function _e(t,e,s){return t.replace(new RegExp(pe(e),"g"),s)}function we(t,e){let s="",r=0,a=-1,i=0,n=-1;for(let o=0;o<=t.length;++o){if(o<t.length)n=t.charCodeAt(o);else{if(n===47)break;n=47}if(n===47){if(!(a===o-1||i===1))if(a!==o-1&&i===2){if(s.length<2||r!==2||s.charCodeAt(s.length-1)!==46||s.charCodeAt(s.length-2)!==46){if(s.length>2){const c=s.lastIndexOf("/");if(c!==s.length-1){c===-1?(s="",r=0):(s=s.slice(0,c),r=s.length-1-s.lastIndexOf("/")),a=o,i=0;continue}}else if(s.length===2||s.length===1){s="",r=0,a=o,i=0;continue}}e&&(s.length>0?s+="/..":s="..",r=2)}else s.length>0?s+=`/${t.slice(a+1,o)}`:s=t.slice(a+1,o),r=o-a-1;a=o,i=0}else n===46&&i!==-1?++i:i=-1}return s}const _={toPosix(t){return _e(t,"\\","/")},isUrl(t){return/^https?:/.test(this.toPosix(t))},isDataUrl(t){return/^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(t)},isBlobUrl(t){return t.startsWith("blob:")},hasProtocol(t){return/^[^/:]+:/.test(this.toPosix(t))},getProtocol(t){f(t),t=this.toPosix(t);const e=/^file:\/\/\//.exec(t);if(e)return e[0];const s=/^[^/:]+:\/{0,2}/.exec(t);return s?s[0]:""},toAbsolute(t,e,s){if(f(t),this.isDataUrl(t)||this.isBlobUrl(t))return t;const r=C(this.toPosix(e??p.ADAPTER.getBaseUrl())),a=C(this.toPosix(s??this.rootname(r)));return t=this.toPosix(t),t.startsWith("/")?_.join(a,t.slice(1)):this.isAbsolute(t)?t:this.join(r,t)},normalize(t){if(f(t),t.length===0)return".";if(this.isDataUrl(t)||this.isBlobUrl(t))return t;t=this.toPosix(t);let e="";const s=t.startsWith("/");this.hasProtocol(t)&&(e=this.rootname(t),t=t.slice(e.length));const r=t.endsWith("/");return t=we(t,!1),t.length>0&&r&&(t+="/"),s?`/${t}`:e+t},isAbsolute(t){return f(t),t=this.toPosix(t),this.hasProtocol(t)?!0:t.startsWith("/")},join(...t){if(t.length===0)return".";let e;for(let s=0;s<t.length;++s){const r=t[s];if(f(r),r.length>0)if(e===void 0)e=r;else{const a=t[s-1]??"";this.extname(a)?e+=`/../${r}`:e+=`/${r}`}}return e===void 0?".":this.normalize(e)},dirname(t){if(f(t),t.length===0)return".";t=this.toPosix(t);let e=t.charCodeAt(0);const s=e===47;let r=-1,a=!0;const i=this.getProtocol(t),n=t;t=t.slice(i.length);for(let o=t.length-1;o>=1;--o)if(e=t.charCodeAt(o),e===47){if(!a){r=o;break}}else a=!1;return r===-1?s?"/":this.isUrl(n)?i+t:i:s&&r===1?"//":i+t.slice(0,r)},rootname(t){f(t),t=this.toPosix(t);let e="";if(t.startsWith("/")?e="/":e=this.getProtocol(t),this.isUrl(t)){const s=t.indexOf("/",e.length);s!==-1?e=t.slice(0,s):e=t,e.endsWith("/")||(e+="/")}return e},basename(t,e){f(t),e&&f(e),t=C(this.toPosix(t));let s=0,r=-1,a=!0,i;if(e!==void 0&&e.length>0&&e.length<=t.length){if(e.length===t.length&&e===t)return"";let n=e.length-1,o=-1;for(i=t.length-1;i>=0;--i){const c=t.charCodeAt(i);if(c===47){if(!a){s=i+1;break}}else o===-1&&(a=!1,o=i+1),n>=0&&(c===e.charCodeAt(n)?--n===-1&&(r=i):(n=-1,r=o))}return s===r?r=o:r===-1&&(r=t.length),t.slice(s,r)}for(i=t.length-1;i>=0;--i)if(t.charCodeAt(i)===47){if(!a){s=i+1;break}}else r===-1&&(a=!1,r=i+1);return r===-1?"":t.slice(s,r)},extname(t){f(t),t=C(this.toPosix(t));let e=-1,s=0,r=-1,a=!0,i=0;for(let n=t.length-1;n>=0;--n){const o=t.charCodeAt(n);if(o===47){if(!a){s=n+1;break}continue}r===-1&&(a=!1,r=n+1),o===46?e===-1?e=n:i!==1&&(i=1):e!==-1&&(i=-1)}return e===-1||r===-1||i===0||i===1&&e===r-1&&e===s+1?"":t.slice(e,r)},parse(t){f(t);const e={root:"",dir:"",base:"",ext:"",name:""};if(t.length===0)return e;t=C(this.toPosix(t));let s=t.charCodeAt(0);const r=this.isAbsolute(t);let a;e.root=this.rootname(t),r||this.hasProtocol(t)?a=1:a=0;let i=-1,n=0,o=-1,c=!0,l=t.length-1,A=0;for(;l>=a;--l){if(s=t.charCodeAt(l),s===47){if(!c){n=l+1;break}continue}o===-1&&(c=!1,o=l+1),s===46?i===-1?i=l:A!==1&&(A=1):i!==-1&&(A=-1)}return i===-1||o===-1||A===0||A===1&&i===o-1&&i===n+1?o!==-1&&(n===0&&r?e.base=e.name=t.slice(1,o):e.base=e.name=t.slice(n,o)):(n===0&&r?(e.name=t.slice(1,i),e.base=t.slice(1,o)):(e.name=t.slice(n,i),e.base=t.slice(n,o)),e.ext=t.slice(i,o)),e.dir=this.dirname(t),e},sep:"/",delimiter:":"};let M;async function ye(){return M??(M=(async()=>{const t=document.createElement("canvas").getContext("webgl");if(!t)return T.UNPACK;const e=await new Promise(i=>{const n=document.createElement("video");n.onloadeddata=()=>i(n),n.onerror=()=>i(null),n.autoplay=!1,n.crossOrigin="anonymous",n.preload="auto",n.src="data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=",n.load()});if(!e)return T.UNPACK;const s=t.createTexture();t.bindTexture(t.TEXTURE_2D,s);const r=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,s,0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e);const a=new Uint8Array(4);return t.readPixels(0,0,1,1,t.RGBA,t.UNSIGNED_BYTE,a),t.deleteFramebuffer(r),t.deleteTexture(s),t.getExtension("WEBGL_lose_context")?.loseContext(),a[0]<=a[3]?T.PMA:T.UNPACK})()),M}const z={loader:d.LoadParser,resolver:d.ResolveParser,cache:d.CacheParser,detection:d.DetectionParser};h.handle(d.Asset,t=>{const e=t.ref;Object.entries(z).filter(([s])=>!!e[s]).forEach(([s,r])=>h.add(Object.assign(e[s],{extension:e[s].extension??r})))},t=>{const e=t.ref;Object.keys(z).filter(s=>!!e[s]).forEach(s=>h.remove(e[s]))});class be{constructor(e,s=!1){this._loader=e,this._assetList=[],this._isLoading=!1,this._maxConcurrent=1,this.verbose=s}add(e){e.forEach(s=>{this._assetList.push(s)}),this.verbose&&console.log("[BackgroundLoader] assets: ",this._assetList),this._isActive&&!this._isLoading&&this._next()}async _next(){if(this._assetList.length&&this._isActive){this._isLoading=!0;const e=[],s=Math.min(this._assetList.length,this._maxConcurrent);for(let r=0;r<s;r++)e.push(this._assetList.pop());await this._loader.load(e),this._isLoading=!1,this._next()}}get active(){return this._isActive}set active(e){this._isActive!==e&&(this._isActive=e,e&&!this._isLoading&&this._next())}}function E(t,e){if(Array.isArray(e)){for(const s of e)if(t.startsWith(`data:${s}`))return!0;return!1}return t.startsWith(`data:${e}`)}function x(t,e){const s=t.split("?")[0],r=_.extname(s).toLowerCase();return Array.isArray(e)?e.includes(r):r===e}const m=(t,e,s=!1)=>(Array.isArray(t)||(t=[t]),e?t.map(r=>typeof r=="string"||s?e(r):r):t);function J(t,e,s,r,a){const i=e[s];for(let n=0;n<i.length;n++){const o=i[n];s<e.length-1?J(t.replace(r[s],o),e,s+1,r,a):a.push(t.replace(r[s],o))}}function Be(t){const e=/\{(.*?)\}/g,s=t.match(e),r=[];if(s){const a=[];s.forEach(i=>{const n=i.substring(1,i.length-1).split(",");a.push(n)}),J(t,a,0,s,r)}else r.push(t);return r}const U=t=>!Array.isArray(t);class ve{constructor(){this._parsers=[],this._cache=new Map,this._cacheMap=new Map}reset(){this._cacheMap.clear(),this._cache.clear()}has(e){return this._cache.has(e)}get(e){const s=this._cache.get(e);return s||console.warn(`[Assets] Asset id ${e} was not found in the Cache`),s}set(e,s){const r=m(e);let a;for(let o=0;o<this.parsers.length;o++){const c=this.parsers[o];if(c.test(s)){a=c.getCacheableAssets(r,s);break}}a||(a={},r.forEach(o=>{a[o]=s}));const i=Object.keys(a),n={cacheKeys:i,keys:r};if(r.forEach(o=>{this._cacheMap.set(o,n)}),i.forEach(o=>{this._cache.has(o)&&this._cache.get(o)!==s&&console.warn("[Cache] already has key:",o),this._cache.set(o,a[o])}),s instanceof R){const o=s;r.forEach(c=>{o.baseTexture!==R.EMPTY.baseTexture&&k.addToCache(o.baseTexture,c),R.addToCache(o,c)})}}remove(e){if(!this._cacheMap.has(e)){console.warn(`[Assets] Asset id ${e} was not found in the Cache`);return}const s=this._cacheMap.get(e);s.cacheKeys.forEach(r=>{this._cache.delete(r)}),s.keys.forEach(r=>{this._cacheMap.delete(r)})}get parsers(){return this._parsers}}const b=new ve;class Pe{constructor(){this._parsers=[],this._parsersValidated=!1,this.parsers=new Proxy(this._parsers,{set:(e,s,r)=>(this._parsersValidated=!1,e[s]=r,!0)}),this.promiseCache={}}reset(){this._parsersValidated=!1,this.promiseCache={}}_getLoadPromiseAndParser(e,s){const r={promise:null,parser:null};return r.promise=(async()=>{let a=null,i=null;if(s.loadParser&&(i=this._parserHash[s.loadParser],i||console.warn(`[Assets] specified load parser "${s.loadParser}" not found while loading ${e}`)),!i){for(let n=0;n<this.parsers.length;n++){const o=this.parsers[n];if(o.load&&o.test?.(e,s,this)){i=o;break}}if(!i)return console.warn(`[Assets] ${e} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`),null}a=await i.load(e,s,this),r.parser=i;for(let n=0;n<this.parsers.length;n++){const o=this.parsers[n];o.parse&&o.parse&&await o.testParse?.(a,s,this)&&(a=await o.parse(a,s,this)||a,r.parser=o)}return a})(),r}async load(e,s){this._parsersValidated||this._validateParsers();let r=0;const a={},i=U(e),n=m(e,l=>({alias:[l],src:l})),o=n.length,c=n.map(async l=>{const A=_.toAbsolute(l.src);if(!a[l.src])try{this.promiseCache[A]||(this.promiseCache[A]=this._getLoadPromiseAndParser(A,l)),a[l.src]=await this.promiseCache[A].promise,s&&s(++r/o)}catch(u){throw delete this.promiseCache[A],delete a[l.src],new Error(`[Loader.load] Failed to load ${A}.
${u}`)}});return await Promise.all(c),i?a[n[0].src]:a}async unload(e){const s=m(e,r=>({alias:[r],src:r})).map(async r=>{const a=_.toAbsolute(r.src),i=this.promiseCache[a];if(i){const n=await i.promise;delete this.promiseCache[a],i.parser?.unload?.(n,r,this)}});await Promise.all(s)}_validateParsers(){this._parsersValidated=!0,this._parserHash=this._parsers.filter(e=>e.name).reduce((e,s)=>(e[s.name]&&console.warn(`[Assets] loadParser name conflict "${s.name}"`),{...e,[s.name]:s}),{})}}var B=(t=>(t[t.Low=0]="Low",t[t.Normal=1]="Normal",t[t.High=2]="High",t))(B||{});const Ee=".json",xe="application/json",Ie={extension:{type:d.LoadParser,priority:B.Low},name:"loadJson",test(t){return E(t,xe)||x(t,Ee)},async load(t){return await(await p.ADAPTER.fetch(t)).json()}};h.add(Ie);const Ce=".txt",Re="text/plain",Te={name:"loadTxt",extension:{type:d.LoadParser,priority:B.Low},test(t){return E(t,Re)||x(t,Ce)},async load(t){return await(await p.ADAPTER.fetch(t)).text()}};h.add(Te);const Oe=["normal","bold","100","200","300","400","500","600","700","800","900"],Le=[".ttf",".otf",".woff",".woff2"],Ue=["font/ttf","font/otf","font/woff","font/woff2"],ke=/^(--|-?[A-Z_])[0-9A-Z_-]*$/i;function Se(t){const e=_.extname(t),s=_.basename(t,e).replace(/(-|_)/g," ").toLowerCase().split(" ").map(i=>i.charAt(0).toUpperCase()+i.slice(1));let r=s.length>0;for(const i of s)if(!i.match(ke)){r=!1;break}let a=s.join(" ");return r||(a=`"${a.replace(/[\\"]/g,"\\$&")}"`),a}const Fe=/^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;function Me(t){return Fe.test(t)?t:encodeURI(t)}const We={extension:{type:d.LoadParser,priority:B.Low},name:"loadWebFont",test(t){return E(t,Ue)||x(t,Le)},async load(t,e){const s=p.ADAPTER.getFontFaceSet();if(s){const r=[],a=e.data?.family??Se(t),i=e.data?.weights?.filter(o=>Oe.includes(o))??["normal"],n=e.data??{};for(let o=0;o<i.length;o++){const c=i[o],l=new FontFace(a,`url(${Me(t)})`,{...n,weight:c});await l.load(),s.add(l),r.push(l)}return r.length===1?r[0]:r}return console.warn("[loadWebFont] FontFace API is not supported. Skipping loading font"),null},unload(t){(Array.isArray(t)?t:[t]).forEach(e=>p.ADAPTER.getFontFaceSet().delete(e))}};h.add(We);let K=0,W;const De="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",je={id:"checkImageBitmap",code:`
    async function checkImageBitmap()
    {
        try
        {
            if (typeof createImageBitmap !== 'function') return false;

            const response = await fetch('${De}');
            const imageBlob =  await response.blob();
            const imageBitmap = await createImageBitmap(imageBlob);

            return imageBitmap.width === 1 && imageBitmap.height === 1;
        }
        catch (e)
        {
            return false;
        }
    }
    checkImageBitmap().then((result) => { self.postMessage(result); });
    `},$e={id:"loadImageBitmap",code:`
    async function loadImageBitmap(url)
    {
        const response = await fetch(url);

        if (!response.ok)
        {
            throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \`
                + \`\${response.status} \${response.statusText}\`);
        }

        const imageBlob =  await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);

        return imageBitmap;
    }
    self.onmessage = async (event) =>
    {
        try
        {
            const imageBitmap = await loadImageBitmap(event.data.data[0]);

            self.postMessage({
                data: imageBitmap,
                uuid: event.data.uuid,
                id: event.data.id,
            }, [imageBitmap]);
        }
        catch(e)
        {
            self.postMessage({
                error: e,
                uuid: event.data.uuid,
                id: event.data.id,
            });
        }
    };`};let D;class Ve{constructor(){this._initialized=!1,this._createdWorkers=0,this.workerPool=[],this.queue=[],this.resolveHash={}}isImageBitmapSupported(){return this._isImageBitmapSupported!==void 0?this._isImageBitmapSupported:(this._isImageBitmapSupported=new Promise(e=>{const s=URL.createObjectURL(new Blob([je.code],{type:"application/javascript"})),r=new Worker(s);r.addEventListener("message",a=>{r.terminate(),URL.revokeObjectURL(s),e(a.data)})}),this._isImageBitmapSupported)}loadImageBitmap(e){return this._run("loadImageBitmap",[e])}async _initWorkers(){this._initialized||(this._initialized=!0)}getWorker(){W===void 0&&(W=navigator.hardwareConcurrency||4);let e=this.workerPool.pop();return!e&&this._createdWorkers<W&&(D||(D=URL.createObjectURL(new Blob([$e.code],{type:"application/javascript"}))),this._createdWorkers++,e=new Worker(D),e.addEventListener("message",s=>{this.complete(s.data),this.returnWorker(s.target),this.next()})),e}returnWorker(e){this.workerPool.push(e)}complete(e){e.error!==void 0?this.resolveHash[e.uuid].reject(e.error):this.resolveHash[e.uuid].resolve(e.data),this.resolveHash[e.uuid]=null}async _run(e,s){await this._initWorkers();const r=new Promise((a,i)=>{this.queue.push({id:e,arguments:s,resolve:a,reject:i})});return this.next(),r}next(){if(!this.queue.length)return;const e=this.getWorker();if(!e)return;const s=this.queue.pop(),r=s.id;this.resolveHash[K]={resolve:s.resolve,reject:s.reject},e.postMessage({data:s.arguments,uuid:K++,id:r})}}const X=new Ve;function $(t,e,s){t.resource.internal=!0;const r=new R(t),a=()=>{delete e.promiseCache[s],b.has(s)&&b.remove(s)};return r.baseTexture.once("destroyed",()=>{s in e.promiseCache&&(console.warn("[Assets] A BaseTexture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the BaseTexture."),a())}),r.once("destroyed",()=>{t.destroyed||(console.warn("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."),a())}),r}const Ge=[".jpeg",".jpg",".png",".webp",".avif"],Ne=["image/jpeg","image/png","image/webp","image/avif"];async function He(t){const e=await p.ADAPTER.fetch(t);if(!e.ok)throw new Error(`[loadImageBitmap] Failed to fetch ${t}: ${e.status} ${e.statusText}`);const s=await e.blob();return await createImageBitmap(s)}const S={name:"loadTextures",extension:{type:d.LoadParser,priority:B.High},config:{preferWorkers:!0,preferCreateImageBitmap:!0,crossOrigin:"anonymous"},test(t){return E(t,Ne)||x(t,Ge)},async load(t,e,s){const r=globalThis.createImageBitmap&&this.config.preferCreateImageBitmap;let a;r?this.config.preferWorkers&&await X.isImageBitmapSupported()?a=await X.loadImageBitmap(t):a=await He(t):a=await new Promise((o,c)=>{const l=new Image;l.crossOrigin=this.config.crossOrigin,l.src=t,l.complete?o(l):(l.onload=()=>o(l),l.onerror=A=>c(A))});const i={...e.data};i.resolution??(i.resolution=j(t)),r&&i.resourceOptions?.ownsImageBitmap===void 0&&(i.resourceOptions={...i.resourceOptions},i.resourceOptions.ownsImageBitmap=!0);const n=new k(a,i);return n.resource.src=t,$(n,s,t)},unload(t){t.destroy(!0)}};h.add(S);const Qe=".svg",ze="image/svg+xml",Ke={extension:{type:d.LoadParser,priority:B.High},name:"loadSVG",test(t){return E(t,ze)||x(t,Qe)},async testParse(t){return H.test(t)},async parse(t,e,s){const r=new H(t,e?.data?.resourceOptions);await r.load();const a=new k(r,{resolution:j(t),...e?.data});return a.resource.src=e.src,$(a,s,e.src)},async load(t,e){return(await p.ADAPTER.fetch(t)).text()},unload:S.unload};h.add(Ke);const Xe=[".mp4",".m4v",".webm",".ogv"],Ye=["video/mp4","video/webm","video/ogg"],Ze={name:"loadVideo",extension:{type:d.LoadParser,priority:B.High},config:{defaultAutoPlay:!0},test(t){return E(t,Ye)||x(t,Xe)},async load(t,e,s){let r;const a=await(await p.ADAPTER.fetch(t)).blob(),i=URL.createObjectURL(a);try{const n={autoPlay:this.config.defaultAutoPlay,...e?.data?.resourceOptions},o=new te(i,n);await o.load();const c=new k(o,{alphaMode:await ye(),resolution:j(t),...e?.data});c.resource.src=t,r=$(c,s,t),r.baseTexture.once("destroyed",()=>{URL.revokeObjectURL(i)})}catch(n){throw URL.revokeObjectURL(i),n}return r},unload(t){t.destroy(!0)}};h.add(Ze);class Je{constructor(){this._defaultBundleIdentifierOptions={connector:"-",createBundleAssetId:(e,s)=>`${e}${this._bundleIdConnector}${s}`,extractAssetIdFromBundle:(e,s)=>s.replace(`${e}${this._bundleIdConnector}`,"")},this._bundleIdConnector=this._defaultBundleIdentifierOptions.connector,this._createBundleAssetId=this._defaultBundleIdentifierOptions.createBundleAssetId,this._extractAssetIdFromBundle=this._defaultBundleIdentifierOptions.extractAssetIdFromBundle,this._assetMap={},this._preferredOrder=[],this._parsers=[],this._resolverHash={},this._bundles={}}setBundleIdentifier(e){if(this._bundleIdConnector=e.connector??this._bundleIdConnector,this._createBundleAssetId=e.createBundleAssetId??this._createBundleAssetId,this._extractAssetIdFromBundle=e.extractAssetIdFromBundle??this._extractAssetIdFromBundle,this._extractAssetIdFromBundle("foo",this._createBundleAssetId("foo","bar"))!=="bar")throw new Error("[Resolver] GenerateBundleAssetId are not working correctly")}prefer(...e){e.forEach(s=>{this._preferredOrder.push(s),s.priority||(s.priority=Object.keys(s.params))}),this._resolverHash={}}set basePath(e){this._basePath=e}get basePath(){return this._basePath}set rootPath(e){this._rootPath=e}get rootPath(){return this._rootPath}get parsers(){return this._parsers}reset(){this.setBundleIdentifier(this._defaultBundleIdentifierOptions),this._assetMap={},this._preferredOrder=[],this._resolverHash={},this._rootPath=null,this._basePath=null,this._manifest=null,this._bundles={},this._defaultSearchParams=null}setDefaultSearchParams(e){if(typeof e=="string")this._defaultSearchParams=e;else{const s=e;this._defaultSearchParams=Object.keys(s).map(r=>`${encodeURIComponent(r)}=${encodeURIComponent(s[r])}`).join("&")}}getAlias(e){const{alias:s,name:r,src:a,srcs:i}=e;return m(s||r||a||i,n=>typeof n=="string"?n:Array.isArray(n)?n.map(o=>o?.src??o?.srcs??o):n?.src||n?.srcs?n.src??n.srcs:n,!0)}addManifest(e){this._manifest&&console.warn("[Resolver] Manifest already exists, this will be overwritten"),this._manifest=e,e.bundles.forEach(s=>{this.addBundle(s.name,s.assets)})}addBundle(e,s){const r=[];Array.isArray(s)?s.forEach(a=>{const i=a.src??a.srcs,n=a.alias??a.name;let o;if(typeof n=="string"){const c=this._createBundleAssetId(e,n);r.push(c),o=[n,c]}else{const c=n.map(l=>this._createBundleAssetId(e,l));r.push(...c),o=[...n,...c]}this.add({...a,alias:o,src:i})}):Object.keys(s).forEach(a=>{const i=[a,this._createBundleAssetId(e,a)];if(typeof s[a]=="string")this.add({alias:i,src:s[a]});else if(Array.isArray(s[a]))this.add({alias:i,src:s[a]});else{const n=s[a],o=n.src??n.srcs;this.add({...n,alias:i,src:Array.isArray(o)?o:[o]})}r.push(...i)}),this._bundles[e]=r}add(e,s,r,a,i){const n=[];typeof e=="string"||Array.isArray(e)&&typeof e[0]=="string"?(Z("7.2.0",`Assets.add now uses an object instead of individual parameters.
Please use Assets.add({ alias, src, data, format, loadParser }) instead.`),n.push({alias:e,src:s,data:r,format:a,loadParser:i})):Array.isArray(e)?n.push(...e):n.push(e);let o;o=c=>{this.hasKey(c)&&console.warn(`[Resolver] already has key: ${c} overwriting`)},m(n).forEach(c=>{const{src:l,srcs:A}=c;let{data:u,format:v,loadParser:I}=c;const ee=m(l||A).map(g=>typeof g=="string"?Be(g):Array.isArray(g)?g:[g]),P=this.getAlias(c);Array.isArray(P)?P.forEach(o):o(P);const G=[];ee.forEach(g=>{g.forEach(w=>{let y={};if(typeof w!="object"){y.src=w;for(let F=0;F<this._parsers.length;F++){const N=this._parsers[F];if(N.test(w)){y=N.parse(w);break}}}else u=w.data??u,v=w.format??v,I=w.loadParser??I,y={...y,...w};if(!P)throw new Error(`[Resolver] alias is undefined for this asset: ${y.src}`);y=this.buildResolvedAsset(y,{aliases:P,data:u,format:v,loadParser:I}),G.push(y)})}),P.forEach(g=>{this._assetMap[g]=G})})}resolveBundle(e){const s=U(e);e=m(e);const r={};return e.forEach(a=>{const i=this._bundles[a];if(i){const n=this.resolve(i),o={};for(const c in n){const l=n[c];o[this._extractAssetIdFromBundle(a,c)]=l}r[a]=o}}),s?r[e[0]]:r}resolveUrl(e){const s=this.resolve(e);if(typeof e!="string"){const r={};for(const a in s)r[a]=s[a].src;return r}return s.src}resolve(e){const s=U(e);e=m(e);const r={};return e.forEach(a=>{if(!this._resolverHash[a])if(this._assetMap[a]){let i=this._assetMap[a];const n=i[0],o=this._getPreferredOrder(i);o?.priority.forEach(c=>{o.params[c].forEach(l=>{const A=i.filter(u=>u[c]?u[c]===l:!1);A.length&&(i=A)})}),this._resolverHash[a]=i[0]??n}else this._resolverHash[a]=this.buildResolvedAsset({alias:[a],src:a},{});r[a]=this._resolverHash[a]}),s?r[e[0]]:r}hasKey(e){return!!this._assetMap[e]}hasBundle(e){return!!this._bundles[e]}_getPreferredOrder(e){for(let s=0;s<e.length;s++){const r=e[0],a=this._preferredOrder.find(i=>i.params.format.includes(r.format));if(a)return a}return this._preferredOrder[0]}_appendDefaultSearchParams(e){if(!this._defaultSearchParams)return e;const s=/\?/.test(e)?"&":"?";return`${e}${s}${this._defaultSearchParams}`}buildResolvedAsset(e,s){const{aliases:r,data:a,loadParser:i,format:n}=s;return(this._basePath||this._rootPath)&&(e.src=_.toAbsolute(e.src,this._basePath,this._rootPath)),e.alias=r??e.alias??[e.src],e.src=this._appendDefaultSearchParams(e.src),e.data={...a||{},...e.data},e.loadParser=i??e.loadParser,e.format=n??_.extname(e.src).slice(1),e.srcs=e.src,e.name=e.alias,e}}class qe{constructor(){this._detections=[],this._initialized=!1,this.resolver=new Je,this.loader=new Pe,this.cache=b,this._backgroundLoader=new be(this.loader),this._backgroundLoader.active=!0,this.reset()}async init(e={}){if(this._initialized){console.warn("[Assets]AssetManager already initialized, did you load before calling this Asset.init()?");return}if(this._initialized=!0,e.defaultSearchParams&&this.resolver.setDefaultSearchParams(e.defaultSearchParams),e.basePath&&(this.resolver.basePath=e.basePath),e.bundleIdentifier&&this.resolver.setBundleIdentifier(e.bundleIdentifier),e.manifest){let i=e.manifest;typeof i=="string"&&(i=await this.load(i)),this.resolver.addManifest(i)}const s=e.texturePreference?.resolution??1,r=typeof s=="number"?[s]:s,a=await this._detectFormats({preferredFormats:e.texturePreference?.format,skipDetections:e.skipDetections,detections:this._detections});this.resolver.prefer({params:{format:a,resolution:r}}),e.preferences&&this.setPreferences(e.preferences)}add(e,s,r,a,i){this.resolver.add(e,s,r,a,i)}async load(e,s){this._initialized||await this.init();const r=U(e),a=m(e).map(o=>{if(typeof o!="string"){const c=this.resolver.getAlias(o);return c.some(l=>!this.resolver.hasKey(l))&&this.add(o),Array.isArray(c)?c[0]:c}return this.resolver.hasKey(o)||this.add({alias:o,src:o}),o}),i=this.resolver.resolve(a),n=await this._mapLoadToResolve(i,s);return r?n[a[0]]:n}addBundle(e,s){this.resolver.addBundle(e,s)}async loadBundle(e,s){this._initialized||await this.init();let r=!1;typeof e=="string"&&(r=!0,e=[e]);const a=this.resolver.resolveBundle(e),i={},n=Object.keys(a);let o=0,c=0;const l=()=>{s?.(++o/c)},A=n.map(u=>{const v=a[u];return c+=Object.keys(v).length,this._mapLoadToResolve(v,l).then(I=>{i[u]=I})});return await Promise.all(A),r?i[e[0]]:i}async backgroundLoad(e){this._initialized||await this.init(),typeof e=="string"&&(e=[e]);const s=this.resolver.resolve(e);this._backgroundLoader.add(Object.values(s))}async backgroundLoadBundle(e){this._initialized||await this.init(),typeof e=="string"&&(e=[e]);const s=this.resolver.resolveBundle(e);Object.values(s).forEach(r=>{this._backgroundLoader.add(Object.values(r))})}reset(){this.resolver.reset(),this.loader.reset(),this.cache.reset(),this._initialized=!1}get(e){if(typeof e=="string")return b.get(e);const s={};for(let r=0;r<e.length;r++)s[r]=b.get(e[r]);return s}async _mapLoadToResolve(e,s){const r=Object.values(e),a=Object.keys(e);this._backgroundLoader.active=!1;const i=await this.loader.load(r,s);this._backgroundLoader.active=!0;const n={};return r.forEach((o,c)=>{const l=i[o.src],A=[o.src];o.alias&&A.push(...o.alias),n[a[c]]=l,b.set(A,l)}),n}async unload(e){this._initialized||await this.init();const s=m(e).map(a=>typeof a!="string"?a.src:a),r=this.resolver.resolve(s);await this._unloadFromResolved(r)}async unloadBundle(e){this._initialized||await this.init(),e=m(e);const s=this.resolver.resolveBundle(e),r=Object.keys(s).map(a=>this._unloadFromResolved(s[a]));await Promise.all(r)}async _unloadFromResolved(e){const s=Object.values(e);s.forEach(r=>{b.remove(r.src)}),await this.loader.unload(s)}async _detectFormats(e){let s=[];e.preferredFormats&&(s=Array.isArray(e.preferredFormats)?e.preferredFormats:[e.preferredFormats]);for(const r of e.detections)e.skipDetections||await r.test()?s=await r.add(s):e.skipDetections||(s=await r.remove(s));return s=s.filter((r,a)=>s.indexOf(r)===a),s}get detections(){return this._detections}get preferWorkers(){return S.config.preferWorkers}set preferWorkers(e){Z("7.2.0","Assets.prefersWorkers is deprecated, use Assets.setPreferences({ preferWorkers: true }) instead."),this.setPreferences({preferWorkers:e})}setPreferences(e){this.loader.parsers.forEach(s=>{s.config&&Object.keys(s.config).filter(r=>r in e).forEach(r=>{s.config[r]=e[r]})})}}const L=new qe;h.handleByList(d.LoadParser,L.loader.parsers).handleByList(d.ResolveParser,L.resolver.parsers).handleByList(d.CacheParser,L.cache.parsers).handleByList(d.DetectionParser,L.detections);const et={extension:d.CacheParser,test:t=>Array.isArray(t)&&t.every(e=>e instanceof R),getCacheableAssets:(t,e)=>{const s={};return t.forEach(r=>{e.forEach((a,i)=>{s[r+(i===0?"":i+1)]=a})}),s}};h.add(et);async function q(t){if("Image"in globalThis)return new Promise(e=>{const s=new Image;s.onload=()=>{e(!0)},s.onerror=()=>{e(!1)},s.src=t});if("createImageBitmap"in globalThis&&"fetch"in globalThis){try{const e=await(await fetch(t)).blob();await createImageBitmap(e)}catch{return!1}return!0}return!1}const tt={extension:{type:d.DetectionParser,priority:1},test:async()=>q("data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="),add:async t=>[...t,"avif"],remove:async t=>t.filter(e=>e!=="avif")};h.add(tt);const st={extension:{type:d.DetectionParser,priority:0},test:async()=>q("data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="),add:async t=>[...t,"webp"],remove:async t=>t.filter(e=>e!=="webp")};h.add(st);const Y=["png","jpg","jpeg"],rt={extension:{type:d.DetectionParser,priority:-1},test:()=>Promise.resolve(!0),add:async t=>[...t,...Y],remove:async t=>t.filter(e=>!Y.includes(e))};h.add(rt);const at="WorkerGlobalScope"in globalThis&&globalThis instanceof globalThis.WorkerGlobalScope;function V(t){return at?!1:document.createElement("video").canPlayType(t)!==""}const it={extension:{type:d.DetectionParser,priority:0},test:async()=>V("video/webm"),add:async t=>[...t,"webm"],remove:async t=>t.filter(e=>e!=="webm")};h.add(it);const ot={extension:{type:d.DetectionParser,priority:0},test:async()=>V("video/mp4"),add:async t=>[...t,"mp4","m4v"],remove:async t=>t.filter(e=>e!=="mp4"&&e!=="m4v")};h.add(ot);const nt={extension:{type:d.DetectionParser,priority:0},test:async()=>V("video/ogg"),add:async t=>[...t,"ogv"],remove:async t=>t.filter(e=>e!=="ogv")};h.add(nt);const ct={extension:d.ResolveParser,test:S.test,parse:t=>({resolution:parseFloat(p.RETINA_PREFIX.exec(t)?.[1]??"1"),format:_.extname(t).slice(1),src:t})};h.add(ct);function lt(t){let e,s,r;return s=new ge({props:{running:t[0]==="pending"}}),{c(){e=re("span"),Ae(s.$$.fragment),this.h()},l(a){e=ae(a,"SPAN",{class:!0});var i=ie(e);de(s.$$.fragment,i),i.forEach(Q),this.h()},h(){oe(e,"class","svelte-1maaoke"),O(e,"success",t[2]),O(e,"failure",t[1])},m(a,i){ne(a,e,i),he(s,e,null),r=!0},p(a,[i]){const n={};i&1&&(n.running=a[0]==="pending"),s.$set(n),(!r||i&4)&&O(e,"success",a[2]),(!r||i&2)&&O(e,"failure",a[1])},i(a){r||(ue(s.$$.fragment,a),r=!0)},o(a){fe(s.$$.fragment,a),r=!1},d(a){a&&Q(e),me(s)}}}function At(t,e,s){let r,a,{status:i="pending"}=e;return t.$$set=n=>{"status"in n&&s(0,i=n.status)},t.$$.update=()=>{t.$$.dirty&1&&s(2,r=i==="success"),t.$$.dirty&1&&s(1,a=i==="failure")},[i,a,r]}class mt extends ce{constructor(e){super(),le(this,e,At,lt,se,{status:0})}}export{L as A,mt as W};