import{a as H,T as j,c as k,R as G,d as $,P as I,E as U,e as Y,O as q,Q as W,f as z,h as g,W as T,i as K,j as Q,M as J}from"./pixi.CGO4fLu2.js";import{n as E,T as Z,e as F,b as R,l as P,d as m,m as w,i as S,U as ee,V as te,W as re,J as oe,x as ie,y as ae}from"./scheduler.B6ZHjePS.js";import{S as D,i as O,t as L,b as N,c as ne,a as se,m as le,d as ue}from"./index.D8p8-7y1.js";import{g as ce}from"./entry.CiXJkX7C.js";import{s as de}from"./dom.COxKB0-J.js";import{e as me}from"./dom.CLnrzRWB.js";import{F as he}from"./FloatingIconButton.CJXmzrl4.js";const d=new I;class V extends H{constructor(e,t=100,i=100){super(e),this.tileTransform=new j,this._width=t,this._height=i,this.uvMatrix=this.texture.uvMatrix||new k(e),this.pluginName="tilingSprite",this.uvRespectAnchor=!1}get clampMargin(){return this.uvMatrix.clampMargin}set clampMargin(e){this.uvMatrix.clampMargin=e,this.uvMatrix.update(!0)}get tileScale(){return this.tileTransform.scale}set tileScale(e){this.tileTransform.scale.copyFrom(e)}get tilePosition(){return this.tileTransform.position}set tilePosition(e){this.tileTransform.position.copyFrom(e)}_onTextureUpdate(){this.uvMatrix&&(this.uvMatrix.texture=this._texture),this._cachedTint=16777215}_render(e){const t=this._texture;!t||!t.valid||(this.tileTransform.updateLocalTransform(),this.uvMatrix.update(),e.batch.setObjectRenderer(e.plugins[this.pluginName]),e.plugins[this.pluginName].render(this))}_calculateBounds(){const e=this._width*-this._anchor._x,t=this._height*-this._anchor._y,i=this._width*(1-this._anchor._x),r=this._height*(1-this._anchor._y);this._bounds.addFrame(this.transform,e,t,i,r)}getLocalBounds(e){return this.children.length===0?(this._bounds.minX=this._width*-this._anchor._x,this._bounds.minY=this._height*-this._anchor._y,this._bounds.maxX=this._width*(1-this._anchor._x),this._bounds.maxY=this._height*(1-this._anchor._y),e||(this._localBoundsRect||(this._localBoundsRect=new G),e=this._localBoundsRect),this._bounds.getRectangle(e)):super.getLocalBounds.call(this,e)}containsPoint(e){this.worldTransform.applyInverse(e,d);const t=this._width,i=this._height,r=-t*this.anchor._x;if(d.x>=r&&d.x<r+t){const o=-i*this.anchor._y;if(d.y>=o&&d.y<o+i)return!0}return!1}destroy(e){super.destroy(e),this.tileTransform=null,this.uvMatrix=null}static from(e,t){const i=e instanceof $?e:$.from(e,t);return new V(i,t.width,t.height)}get width(){return this._width}set width(e){this._width=e}get height(){return this._height}set height(e){this._height=e}}var pe=`#version 300 es
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

in vec2 vTextureCoord;

out vec4 fragmentColor;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0

    fragmentColor = texSample * uColor;
}
`,fe=`#version 300 es
#define SHADER_NAME Tiling-Sprite-300

precision lowp float;

in vec2 aVertexPosition;
in vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

out vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`,_e=`#version 100
#ifdef GL_EXT_shader_texture_lod
    #extension GL_EXT_shader_texture_lod : enable
#endif
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    #ifdef GL_EXT_shader_texture_lod
        vec4 texSample = unclamped == coord
            ? texture2D(uSampler, coord) 
            : texture2DLodEXT(uSampler, coord, 0);
    #else
        vec4 texSample = texture2D(uSampler, coord);
    #endif

    gl_FragColor = texSample * uColor;
}
`,A=`#version 100
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`,xe=`#version 100
#define SHADER_NAME Tiling-Sprite-Simple-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;

void main(void)
{
    vec4 texSample = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texSample * uColor;
}
`;const f=new J;class X extends q{constructor(e){super(e),e.runners.contextChange.add(this),this.quad=new W,this.state=z.for2d()}contextChange(){const e=this.renderer,t={globals:e.globalUniforms};this.simpleShader=g.from(A,xe,t),this.shader=e.context.webGLVersion>1?g.from(fe,pe,t):g.from(A,_e,t)}render(e){const t=this.renderer,i=this.quad;let r=i.vertices;r[0]=r[6]=e._width*-e.anchor.x,r[1]=r[3]=e._height*-e.anchor.y,r[2]=r[4]=e._width*(1-e.anchor.x),r[5]=r[7]=e._height*(1-e.anchor.y);const o=e.uvRespectAnchor?e.anchor.x:0,a=e.uvRespectAnchor?e.anchor.y:0;r=i.uvs,r[0]=r[6]=-o,r[1]=r[3]=-a,r[2]=r[4]=1-o,r[5]=r[7]=1-a,i.invalidate();const s=e._texture,l=s.baseTexture,M=l.alphaMode>0,c=e.tileTransform.localTransform,h=e.uvMatrix;let p=l.isPowerOfTwo&&s.frame.width===l.width&&s.frame.height===l.height;p&&(l._glTextures[t.CONTEXT_UID]?p=l.wrapMode!==T.CLAMP:l.wrapMode===T.CLAMP&&(l.wrapMode=T.REPEAT));const u=p?this.simpleShader:this.shader,y=s.width,b=s.height,x=e._width,v=e._height;f.set(c.a*y/x,c.b*y/v,c.c*b/x,c.d*b/v,c.tx/x,c.ty/v),f.invert(),p?f.prepend(h.mapCoord):(u.uniforms.uMapCoord=h.mapCoord.toArray(!0),u.uniforms.uClampFrame=h.uClampFrame,u.uniforms.uClampOffset=h.uClampOffset),u.uniforms.uTransform=f.toArray(!0),u.uniforms.uColor=K.shared.setValue(e.tint).premultiply(e.worldAlpha,M).toArray(u.uniforms.uColor),u.uniforms.translationMatrix=e.transform.worldTransform.toArray(!0),u.uniforms.uSampler=s,t.shader.bind(u),t.geometry.bind(i),this.state.blendMode=Q(e.blendMode,M),t.state.set(this.state),t.geometry.draw(this.renderer.gl.TRIANGLES,6,0)}}X.extension={name:"tilingSprite",type:U.RendererPlugin};Y.add(X);function ve(n){let e,t;const i=n[1].default,r=Z(i,n,n[0],null);return{c(){e=F("div"),r&&r.c(),this.h()},l(o){e=R(o,"DIV",{class:!0});var a=P(e);r&&r.l(a),a.forEach(m),this.h()},h(){w(e,"class","hud idle_fade svelte-az7lhf")},m(o,a){S(o,e,a),r&&r.m(e,null),t=!0},p(o,[a]){r&&r.p&&(!t||a&1)&&ee(r,i,o,o[0],t?re(i,o[0],a,null):te(o[0]),null)},i(o){t||(L(r,o),t=!0)},o(o){N(r,o),t=!1},d(o){o&&m(e),r&&r.d(o)}}}function ge(n,e,t){let{$$slots:i={},$$scope:r}=e;return n.$$set=o=>{"$$scope"in o&&t(0,r=o.$$scope)},[r,i]}class Pe extends D{constructor(e){super(),O(this,e,ge,ve,E,{})}}function Te(n){let e;return{c(){e=ie("⇦")},l(t){e=ae(t,"⇦")},m(t,i){S(t,e,i)},d(t){t&&m(e)}}}function Ce(n){let e,t,i,r,o;return t=new he({props:{label:"go back home",$$slots:{default:[Te]},$$scope:{ctx:n}}}),{c(){e=F("a"),ne(t.$$.fragment),this.h()},l(a){e=R(a,"A",{href:!0,class:!0});var s=P(e);se(t.$$.fragment,s),s.forEach(m),this.h()},h(){w(e,"href","/"),w(e,"class","idle_fade svelte-1txbtk0")},m(a,s){S(a,e,s),le(t,e,null),i=!0,r||(o=oe(window,"keydown",n[0]),r=!0)},p(a,[s]){const l={};s&2&&(l.$$scope={dirty:s,ctx:a}),t.$set(l)},i(a){i||(L(t.$$.fragment,a),i=!0)},o(a){N(t.$$.fragment,a),i=!1},d(a){a&&m(e),ue(t),r=!1,o()}}}function we(n){return[async t=>{t.key==="Escape"&&t.ctrlKey&&me(t.target)&&(de(t),await ce("/"))}]}class De extends D{constructor(e){super(),O(this,e,we,Ce,E,{})}}const B=()=>({totalTime:0,droppedFrames:0});let _=B();const Oe=n=>{const e=Me(n);_.totalTime+=n,e&&(_.droppedFrames+=e)},Le=()=>_=B(),Ne=()=>_,Se=60,C=1e3/Se,Me=n=>n>C*1.7?Math.round(10*(n-C)/C)/10:0;export{Pe as H,V as T,De as a,Ne as g,Le as r,Oe as u};
