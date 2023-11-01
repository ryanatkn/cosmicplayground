import{a as j,T as k,c as G,R as I,d as $,P as U,E as Y,e as q,O as W,Q as z,f as K,h as g,W as T,i as Q,j as J,M as Z}from"./pixi.d26d8403.js";import{n as E,T as ee,e as F,b as R,l as P,d as m,m as w,i as y,U as te,V as re,W as oe,J as ae,x as ie,y as ne}from"./scheduler.317e39f5.js";import{S as D,i as O,t as H,b as L,c as se,a as le,m as ue,d as ce}from"./index.3972ef43.js";import{c as N}from"./singletons.9767a766.js";import{s as de}from"./dom.affe8f60.js";import{e as me}from"./dom.194afe55.js";import{F as he}from"./FloatingIconButton.3441810e.js";const pe=N("goto"),De=N("before_navigate"),d=new U;class B extends j{constructor(e,t=100,a=100){super(e),this.tileTransform=new k,this._width=t,this._height=a,this.uvMatrix=this.texture.uvMatrix||new G(e),this.pluginName="tilingSprite",this.uvRespectAnchor=!1}get clampMargin(){return this.uvMatrix.clampMargin}set clampMargin(e){this.uvMatrix.clampMargin=e,this.uvMatrix.update(!0)}get tileScale(){return this.tileTransform.scale}set tileScale(e){this.tileTransform.scale.copyFrom(e)}get tilePosition(){return this.tileTransform.position}set tilePosition(e){this.tileTransform.position.copyFrom(e)}_onTextureUpdate(){this.uvMatrix&&(this.uvMatrix.texture=this._texture),this._cachedTint=16777215}_render(e){const t=this._texture;!t||!t.valid||(this.tileTransform.updateLocalTransform(),this.uvMatrix.update(),e.batch.setObjectRenderer(e.plugins[this.pluginName]),e.plugins[this.pluginName].render(this))}_calculateBounds(){const e=this._width*-this._anchor._x,t=this._height*-this._anchor._y,a=this._width*(1-this._anchor._x),r=this._height*(1-this._anchor._y);this._bounds.addFrame(this.transform,e,t,a,r)}getLocalBounds(e){return this.children.length===0?(this._bounds.minX=this._width*-this._anchor._x,this._bounds.minY=this._height*-this._anchor._y,this._bounds.maxX=this._width*(1-this._anchor._x),this._bounds.maxY=this._height*(1-this._anchor._y),e||(this._localBoundsRect||(this._localBoundsRect=new I),e=this._localBoundsRect),this._bounds.getRectangle(e)):super.getLocalBounds.call(this,e)}containsPoint(e){this.worldTransform.applyInverse(e,d);const t=this._width,a=this._height,r=-t*this.anchor._x;if(d.x>=r&&d.x<r+t){const o=-a*this.anchor._y;if(d.y>=o&&d.y<o+a)return!0}return!1}destroy(e){super.destroy(e),this.tileTransform=null,this.uvMatrix=null}static from(e,t){const a=e instanceof $?e:$.from(e,t);return new B(a,t.width,t.height)}get width(){return this._width}set width(e){this._width=e}get height(){return this._height}set height(e){this._height=e}}var fe=`#version 300 es
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
`,_e=`#version 300 es
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
`,xe=`#version 100
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
`,ve=`#version 100
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
`;const f=new Z;class V extends W{constructor(e){super(e),e.runners.contextChange.add(this),this.quad=new z,this.state=K.for2d()}contextChange(){const e=this.renderer,t={globals:e.globalUniforms};this.simpleShader=g.from(A,ve,t),this.shader=e.context.webGLVersion>1?g.from(_e,fe,t):g.from(A,xe,t)}render(e){const t=this.renderer,a=this.quad;let r=a.vertices;r[0]=r[6]=e._width*-e.anchor.x,r[1]=r[3]=e._height*-e.anchor.y,r[2]=r[4]=e._width*(1-e.anchor.x),r[5]=r[7]=e._height*(1-e.anchor.y);const o=e.uvRespectAnchor?e.anchor.x:0,i=e.uvRespectAnchor?e.anchor.y:0;r=a.uvs,r[0]=r[6]=-o,r[1]=r[3]=-i,r[2]=r[4]=1-o,r[5]=r[7]=1-i,a.invalidate();const s=e._texture,l=s.baseTexture,S=l.alphaMode>0,c=e.tileTransform.localTransform,h=e.uvMatrix;let p=l.isPowerOfTwo&&s.frame.width===l.width&&s.frame.height===l.height;p&&(l._glTextures[t.CONTEXT_UID]?p=l.wrapMode!==T.CLAMP:l.wrapMode===T.CLAMP&&(l.wrapMode=T.REPEAT));const u=p?this.simpleShader:this.shader,M=s.width,b=s.height,x=e._width,v=e._height;f.set(c.a*M/x,c.b*M/v,c.c*b/x,c.d*b/v,c.tx/x,c.ty/v),f.invert(),p?f.prepend(h.mapCoord):(u.uniforms.uMapCoord=h.mapCoord.toArray(!0),u.uniforms.uClampFrame=h.uClampFrame,u.uniforms.uClampOffset=h.uClampOffset),u.uniforms.uTransform=f.toArray(!0),u.uniforms.uColor=Q.shared.setValue(e.tint).premultiply(e.worldAlpha,S).toArray(u.uniforms.uColor),u.uniforms.translationMatrix=e.transform.worldTransform.toArray(!0),u.uniforms.uSampler=s,t.shader.bind(u),t.geometry.bind(a),this.state.blendMode=J(e.blendMode,S),t.state.set(this.state),t.geometry.draw(this.renderer.gl.TRIANGLES,6,0)}}V.extension={name:"tilingSprite",type:Y.RendererPlugin};q.add(V);function ge(n){let e,t;const a=n[1].default,r=ee(a,n,n[0],null);return{c(){e=F("div"),r&&r.c(),this.h()},l(o){e=R(o,"DIV",{class:!0});var i=P(e);r&&r.l(i),i.forEach(m),this.h()},h(){w(e,"class","hud idle_fade svelte-az7lhf")},m(o,i){y(o,e,i),r&&r.m(e,null),t=!0},p(o,[i]){r&&r.p&&(!t||i&1)&&te(r,a,o,o[0],t?oe(a,o[0],i,null):re(o[0]),null)},i(o){t||(H(r,o),t=!0)},o(o){L(r,o),t=!1},d(o){o&&m(e),r&&r.d(o)}}}function Te(n,e,t){let{$$slots:a={},$$scope:r}=e;return n.$$set=o=>{"$$scope"in o&&t(0,r=o.$$scope)},[r,a]}class Oe extends D{constructor(e){super(),O(this,e,Te,ge,E,{})}}function Ce(n){let e;return{c(){e=ie("⇦")},l(t){e=ne(t,"⇦")},m(t,a){y(t,e,a)},d(t){t&&m(e)}}}function we(n){let e,t,a,r,o;return t=new he({props:{label:"go back home",$$slots:{default:[Ce]},$$scope:{ctx:n}}}),{c(){e=F("a"),se(t.$$.fragment),this.h()},l(i){e=R(i,"A",{href:!0,class:!0});var s=P(e);le(t.$$.fragment,s),s.forEach(m),this.h()},h(){w(e,"href","/"),w(e,"class","idle_fade svelte-1txbtk0")},m(i,s){y(i,e,s),ue(t,e,null),a=!0,r||(o=ae(window,"keydown",n[0]),r=!0)},p(i,[s]){const l={};s&2&&(l.$$scope={dirty:s,ctx:i}),t.$set(l)},i(i){a||(H(t.$$.fragment,i),a=!0)},o(i){L(t.$$.fragment,i),a=!1},d(i){i&&m(e),ce(t),r=!1,o()}}}function ye(n){return[async t=>{t.key==="Escape"&&t.ctrlKey&&me(t.target)&&(de(t),await pe("/"))}]}class He extends D{constructor(e){super(),O(this,e,ye,we,E,{})}}const X=()=>({totalTime:0,droppedFrames:0});let _=X();const Le=n=>{const e=Me(n);_.totalTime+=n,e&&(_.droppedFrames+=e)},Ne=()=>_=X(),Be=()=>_,Se=60,C=1e3/Se,Me=n=>n>C*1.7?Math.round(10*(n-C)/C)/10:0;export{Oe as H,B as T,He as a,De as b,pe as c,Be as g,Ne as r,Le as u};
