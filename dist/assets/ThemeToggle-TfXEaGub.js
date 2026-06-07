import{r as c,j as o,b as f}from"./index-BOPbQosv.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),u=(...e)=>e.filter((t,a,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===a).join(" ").trim();/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var x={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=c.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:r,className:n="",children:s,iconNode:i,...d},h)=>c.createElement("svg",{ref:h,...x,width:t,height:t,stroke:e,strokeWidth:r?Number(a)*24/Number(t):a,className:u("lucide",n),...d},[...i.map(([m,p])=>c.createElement(m,p)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=(e,t)=>{const a=c.forwardRef(({className:r,...n},s)=>c.createElement(g,{ref:s,iconNode:t,className:u(`lucide-${b(e)}`,r),...n}));return a.displayName=`${e}`,a};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=l("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=l("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=l("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),w={primary:"bg-surface-900 text-white hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-200",outline:"border border-surface-300 dark:border-surface-700 text-surface-900 dark:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800",ghost:"text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800",danger:"bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"},j={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-sm",lg:"px-6 py-3 text-base"};function $({children:e,variant:t="primary",size:a="md",loading:r=!1,disabled:n=!1,className:s="",type:i="button",...d}){return o.jsxs("button",{type:i,disabled:n||r,className:`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${w[t]}
        ${j[a]}
        ${s}
      `,...d,children:[r&&o.jsx(k,{className:"w-4 h-4 animate-spin"}),e]})}function N({children:e,className:t="",...a}){return o.jsx("div",{className:`glass-card p-6 animate-fade-in ${t}`,...a,children:e})}function M(){const{theme:e,toggleTheme:t}=f();return o.jsx("button",{onClick:t,className:`relative p-2 rounded-xl text-surface-600 dark:text-surface-400
        hover:bg-surface-100 dark:hover:bg-surface-800
        transition-all duration-300`,"aria-label":"Toggle theme",children:o.jsxs("div",{className:"relative w-5 h-5",children:[o.jsx(v,{className:`absolute inset-0 w-5 h-5 transition-all duration-300 ${e==="dark"?"opacity-0 rotate-90 scale-0":"opacity-100 rotate-0 scale-100"}`}),o.jsx(y,{className:`absolute inset-0 w-5 h-5 transition-all duration-300 ${e==="dark"?"opacity-100 rotate-0 scale-100":"opacity-0 -rotate-90 scale-0"}`})]})})}export{$ as B,N as C,M as T,l as c};
