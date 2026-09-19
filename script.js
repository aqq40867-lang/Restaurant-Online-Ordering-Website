(function(){
'use strict';
/* ================= helpers ================= */
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var money=function(n){return '£'+n.toFixed(2)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var pad=function(n){return (n<10?'0':'')+n};
var hhmm=function(m){return pad(Math.floor(m/60))+':'+pad(m%60)};
var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var DAYS3=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var MONTHS3=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ================= business data (edit here) ================= */
var BIZ={name:'Crust & Ember',email:'hello@crustandember.example',phone:'01509 000 000',addr:'18 Ember Lane, Loughborough LE11 2AB',prep:25,lastBefore:20,slot:15};
// index = Date.getDay(); o/c in minutes from midnight, null = closed
var HOURS=[
  {o:720,c:1200},            // Sun 12:00-20:00
  {o:null,c:null},           // Mon closed
  {o:690,c:1260},{o:690,c:1260},{o:690,c:1260}, // Tue-Thu 11:30-21:00
  {o:690,c:1320},{o:690,c:1320}                 // Fri-Sat 11:30-22:00
];

/* ================= illustrations ================= */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function svg(inner,vb){return '<svg viewBox="'+(vb||'0 0 200 200')+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+inner+'</svg>'}
function topping(t,x,y,rot){
  var g='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+rot.toFixed(0)+')">',e='</g>';
  switch(t){
    case 'pep': return g+'<circle r="8" fill="#A9241C"/><circle r="8" fill="none" stroke="#7E1712" stroke-width="1.2"/><circle cx="-2.5" cy="-2" r="1.3" fill="#7E1712"/><circle cx="3" cy="2" r="1.3" fill="#7E1712"/>'+e;
    case 'mush': return g+'<path d="M-9 3Q-9 -8 0 -8Q9 -8 9 3Z" fill="#8B6B4E"/><rect x="-3" y="3" width="6" height="5" rx="1.5" fill="#EADFC8"/>'+e;
    case 'basil': return g+'<path d="M0 -10Q10 0 0 10Q-10 0 0 -10Z" fill="#2F8F3E"/><path d="M0 -8V9" stroke="#1F6B2C" stroke-width="1.2"/>'+e;
    case 'jal': return g+'<circle r="5.5" fill="#C8E27A" stroke="#4E9A2E" stroke-width="2.4"/>'+e;
    case 'corn': return g+'<circle r="3.2" fill="#FFC61A"/><circle cx="6" cy="4" r="3" fill="#FFC61A"/>'+e;
    case 'olive': return g+'<circle r="4.2" fill="none" stroke="#2B2B2B" stroke-width="2.2"/>'+e;
    case 'chick': return g+'<rect x="-7" y="-5" width="14" height="10" rx="5" fill="#E2AE78"/><path d="M-4 -1h6" stroke="#C48A52" stroke-width="1.2"/>'+e;
    case 'bbq': return g+'<path d="M-9 0q4.5 -6 9 0t9 0" stroke="#5B2412" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+e;
    case 'pepper': return g+'<path d="M-8 4Q-8 -7 0 -7Q8 -7 8 4" stroke="#39A845" stroke-width="3" fill="none" stroke-linecap="round"/>'+e;
    case 'onion': return g+'<circle r="6" fill="none" stroke="#E7BFDD" stroke-width="2"/>'+e;
  }
  return '';
}
function pizzaArt(o){
  var r=rng(o.seed||1),s='',i,a,x,y;
  s+='<circle cx="100" cy="100" r="96" fill="#E3A85E"/><circle cx="100" cy="100" r="96" fill="none" stroke="#C98336" stroke-width="3"/>';
  for(i=0;i<30;i++){a=r()*6.283;s+='<circle cx="'+(100+Math.cos(a)*89).toFixed(1)+'" cy="'+(100+Math.sin(a)*89).toFixed(1)+'" r="'+(1.5+r()*2.6).toFixed(1)+'" fill="#C98336" opacity=".5"/>'}
  s+='<circle cx="100" cy="100" r="82" fill="'+(o.sauce||'#C7301F')+'"/>';
  var nb=o.cheese==='full'?30:20;
  for(i=0;i<nb;i++){var rr=70*Math.sqrt((i+.5)/nb),th=i*2.39996+r();x=100+Math.cos(th)*rr;y=100+Math.sin(th)*rr;
    s+='<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(8+r()*6).toFixed(1)+'" ry="'+(6+r()*4.5).toFixed(1)+'" transform="rotate('+(r()*180).toFixed(0)+' '+x.toFixed(1)+' '+y.toFixed(1)+')" fill="'+(o.cheeseCol||'#FBEDBF')+'"/>'}
  var n=o.n||16,tops=o.tops;
  for(i=0;i<n;i++){var th2=i*2.39996+1+r()*.6,rr2=68*Math.sqrt((i+.7)/n);x=100+Math.cos(th2)*rr2;y=100+Math.sin(th2)*rr2;s+=topping(tops[i%tops.length],x,y,r()*360)}
  return svg(s);
}
function sliceArt(){
  return svg('<path d="M100 186 L26 44 Q100 6 174 44Z" fill="#E3A85E" stroke="#C98336" stroke-width="4" stroke-linejoin="round"/><path d="M100 164 L44 56 Q100 30 156 56Z" fill="#F7D774"/><circle cx="84" cy="70" r="11" fill="#D32B27"/><circle cx="118" cy="82" r="10" fill="#D32B27"/><circle cx="98" cy="112" r="9" fill="#D32B27"/><circle cx="104" cy="140" r="5" fill="#D32B27"/>');
}
function burgerArt(o){
  var y=178,s='',bun=o.bun||'#E5A04A',bd=o.bunD||'#C7802F',i;
  s+='<rect x="28" y="'+(y-18)+'" width="144" height="18" rx="9" fill="'+bd+'"/>';y-=18;
  (o.layers||['patty','cheese','tomato','lettuce']).forEach(function(l){
    if(l==='patty'||l==='chick'){var c=l==='chick'?'#DDA043':'#5A2E1B';s+='<rect x="24" y="'+(y-22)+'" width="152" height="22" rx="11" fill="'+c+'"/>'+(l==='chick'?'<circle cx="60" cy="'+(y-11)+'" r="2" fill="#B8791F"/><circle cx="100" cy="'+(y-13)+'" r="2" fill="#B8791F"/><circle cx="140" cy="'+(y-10)+'" r="2" fill="#B8791F"/>':'');y-=22}
    else if(l==='cheese'){s+='<path d="M22 '+(y-6)+'H178L166 '+(y+10)+'L152 '+(y-6)+'H62L48 '+(y+14)+'L34 '+(y-6)+'Z" fill="#FFC61A"/>';y-=6}
    else if(l==='tomato'){s+='<rect x="30" y="'+(y-10)+'" width="140" height="10" rx="5" fill="#E0412B"/>';y-=10}
    else if(l==='onion'){s+='<rect x="34" y="'+(y-6)+'" width="132" height="6" rx="3" fill="#EAC6DF"/>';y-=6}
    else if(l==='lettuce'){var p='M18 '+y;for(i=0;i<11;i++){p+=' Q'+(18+i*15.6+7.8)+' '+(y-16)+' '+(18+(i+1)*15.6)+' '+(y-2)}p+=' V'+(y+2)+' H18Z';s+='<path d="'+p+'" fill="#6DB33F"/>';y-=8}
    else if(l==='bacon'){s+='<path d="M26 '+(y-3)+'q14 -12 28 0t28 0t28 0t28 0t28 0" stroke="#B5432A" stroke-width="7" fill="none" stroke-linecap="round"/>';y-=6}
  });
  s+='<path d="M30 '+y+'Q30 '+(y-70)+' 100 '+(y-70)+'Q170 '+(y-70)+' 170 '+y+'Q170 '+(y+8)+' 160 '+(y+8)+'H40Q30 '+(y+8)+' 30 '+y+'Z" fill="'+bun+'"/>';
  [[70,-46],[100,-56],[130,-46],[84,-30],[118,-32],[54,-18],[148,-20]].forEach(function(p){s+='<ellipse cx="'+p[0]+'" cy="'+(y+p[1])+'" rx="5" ry="2.6" fill="'+(o.seed||'#FFF3D1')+'" transform="rotate('+(p[0]%40-20)+' '+p[0]+' '+(y+p[1])+')"/>'});
  var topY=y-70,h=178-topY,ty=(200-h)/2-topY;
  return svg('<g transform="translate(0 '+ty.toFixed(1)+')">'+s+'</g>');
}
function friesArt(o){
  var s='',i;
  for(i=0;i<10;i++){var x=54+i*9.5,h=58+(i*37%25);s+='<rect x="'+x+'" y="'+(112-h)+'" width="8.5" height="'+(h+18)+'" rx="3" fill="#FFCB3D" stroke="#E5A50F" stroke-width="1.2" transform="rotate('+((i-4.5)*4.2).toFixed(1)+' '+(x+4)+' 112)"/>'}
  if(o.top==='cheese'){s+='<path d="M52 92Q70 78 84 92T118 90T148 94V108H52Z" fill="#FFB300"/><path d="M62 106q2 16 6 0M96 106q2 22 6 0M126 106q2 12 6 0" stroke="#FFB300" stroke-width="6" stroke-linecap="round" fill="none"/>';
    if(o.chili)s+='<circle cx="72" cy="90" r="4" fill="#C0201C"/><circle cx="104" cy="88" r="4" fill="#C0201C"/><circle cx="130" cy="92" r="4" fill="#C0201C"/><circle cx="88" cy="96" r="3" fill="#39A845"/><circle cx="116" cy="97" r="3" fill="#39A845"/>'}
  s+='<path d="M48 108H152L139 184H61Z" fill="#D32B27"/><path d="M48 108H152L150 118H50Z" fill="#B21F1F"/><ellipse cx="100" cy="150" rx="22" ry="17" fill="#FFC61A"/><path d="M90 158V142l10 10 10-10v16" stroke="#D32B27" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>';
  return svg(s);
}
function ramenArt(o){
  var s='',i,br=o.broth||'#F1DDB8';
  s+='<path d="M96 40q-10 -14 0 -24M116 44q-10 -14 0 -24M136 40q-10 -14 0 -24" stroke="#fff" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round"/>';
  s+='<path d="M28 96H172A72 72 0 0 1 28 96Z" fill="#D32B27"/><path d="M28 96H172A72 72 0 0 1 166 122H34A72 72 0 0 1 28 96Z" fill="#B21F1F" opacity=".5"/><rect x="72" y="166" width="56" height="10" rx="4" fill="#8C1717"/>';
  s+='<ellipse cx="100" cy="96" rx="72" ry="18" fill="'+br+'"/>';
  for(i=0;i<5;i++)s+='<path d="M'+(44+i*4)+' '+(92+i*2)+'q18 -12 34 0t34 0t34 0" stroke="#F6D77A" stroke-width="4" fill="none" stroke-linecap="round" opacity=".95"/>';
  s+='<circle cx="72" cy="94" r="12" fill="#F3B8B0" stroke="#D98B82" stroke-width="2"/><ellipse cx="120" cy="92" rx="13" ry="10" fill="#fff"/><ellipse cx="120" cy="92" rx="6.5" ry="5.5" fill="#FFA61A"/><rect x="138" y="78" width="16" height="26" rx="2" fill="#1E3B2B" transform="rotate(12 146 90)"/>';
  if(o.chili)s+='<circle cx="96" cy="104" r="3" fill="#C0201C"/><circle cx="104" cy="100" r="2.6" fill="#C0201C"/><circle cx="90" cy="98" r="2.4" fill="#C0201C"/><circle cx="108" cy="106" r="2.4" fill="#C0201C"/>';
  s+='<circle cx="96" cy="88" r="3" fill="#5FB84C"/><circle cx="106" cy="86" r="3" fill="#5FB84C"/><circle cx="88" cy="92" r="2.6" fill="#5FB84C"/>';
  s+='<path d="M150 30L118 96M162 34L128 98" stroke="#E7C58F" stroke-width="4" stroke-linecap="round"/>';
  return svg(s);
}
function drinkArt(o){
  var s='',c=o.color||'#E4572E';
  s+='<path d="M108 58L128 12" stroke="#D32B27" stroke-width="7" stroke-linecap="round"/>';
  s+='<path d="M58 76H142L128 184H72Z" fill="'+c+'"/><path d="M66 118H136L132 148H70Z" fill="#fff" opacity=".9"/><circle cx="100" cy="133" r="9" fill="'+c+'"/>';
  s+='<path d="M64 100L70 176" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>';
  s+='<rect x="52" y="62" width="96" height="16" rx="8" fill="#F5EFE6"/><rect x="70" y="52" width="60" height="12" rx="6" fill="#F5EFE6"/>';
  if(o.lemon)s+='<circle cx="144" cy="82" r="18" fill="#FFE066" stroke="#F5C400" stroke-width="3"/><path d="M144 82L144 66M144 82L157 74M144 82L157 90M144 82L144 98M144 82L131 90M144 82L131 74" stroke="#FFF6C2" stroke-width="2"/>';
  return svg(s);
}
function nuggetsArt(){
  var s='<rect x="120" y="118" width="54" height="46" rx="8" fill="#D32B27"/><ellipse cx="147" cy="118" rx="27" ry="7" fill="#8C1717"/><ellipse cx="147" cy="118" rx="22" ry="4.5" fill="#B5432A"/>';
  [[52,110,34,26,-18],[92,132,36,28,10],[64,148,32,24,24],[100,92,34,26,-30],[126,150,30,22,-8]].forEach(function(n){
    s+='<g transform="rotate('+n[4]+' '+n[0]+' '+n[1]+')"><rect x="'+(n[0]-n[2]/2)+'" y="'+(n[1]-n[3]/2)+'" width="'+n[2]+'" height="'+n[3]+'" rx="'+(n[3]/2)+'" fill="#E3A23C" stroke="#C4801F" stroke-width="2"/><circle cx="'+(n[0]-5)+'" cy="'+(n[1]-3)+'" r="1.6" fill="#B8791F"/><circle cx="'+(n[0]+6)+'" cy="'+(n[1]+3)+'" r="1.6" fill="#B8791F"/></g>'});
  return svg(s);
}
function bucketArt(){
  var s='',i;
  [[70,80,17],[100,72,18],[130,80,17],[84,96,16],[116,96,16],[58,98,14],[142,98,14]].forEach(function(b){s+='<circle cx="'+b[0]+'" cy="'+b[1]+'" r="'+b[2]+'" fill="#E3A23C" stroke="#C4801F" stroke-width="2"/><circle cx="'+(b[0]-4)+'" cy="'+(b[1]-3)+'" r="1.6" fill="#B8791F"/><circle cx="'+(b[0]+5)+'" cy="'+(b[1]+3)+'" r="1.6" fill="#B8791F"/>'});
  s+='<path d="M50 100H150L138 186H62Z" fill="#D32B27"/>';
  [[.2,.4],[.6,.8]].forEach(function(f){var xt=function(v){return 50+100*v},xb=function(v){return 62+76*v};s+='<path d="M'+xt(f[0])+' 100H'+xt(f[1])+'L'+xb(f[1])+' 186H'+xb(f[0])+'Z" fill="#fff"/>'});
  s+='<rect x="44" y="94" width="112" height="12" rx="6" fill="#B21F1F"/>';
  return svg(s);
}
function hotdogArt(){
  return svg('<rect x="24" y="104" width="152" height="46" rx="23" fill="#D9932F"/><rect x="14" y="92" width="172" height="28" rx="14" fill="#B5452B"/><path d="M28 104q12 -14 24 0t24 0t24 0t24 0t24 0t24 0" stroke="#FFC61A" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M22 116Q100 150 178 116" stroke="#E5A94A" stroke-width="3" fill="none" opacity=".0"/><rect x="24" y="122" width="152" height="32" rx="16" fill="#E5A04A"/><path d="M100 60q-8 -12 0 -22M120 62q-8 -12 0 -22M80 62q-8 -12 0 -22" stroke="#B8AFA5" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>');
}
function bagArt(){
  return svg('<path d="M52 66H148L156 186H44Z" fill="#D6A263"/><path d="M52 66H148L149 82H51Z" fill="#B98446"/><path d="M76 66V50a24 24 0 0 1 48 0V66" stroke="#B98446" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="100" cy="128" r="26" fill="#FFC61A"/><path d="M100 146L88 116Q100 110 112 116Z" fill="#D32B27"/><path d="M62 172h76" stroke="#B98446" stroke-width="4" stroke-linecap="round"/>');
}
function starPath(n,r1,r2){var p='',i,a,r;for(i=0;i<n*2;i++){a=Math.PI*i/n;r=i%2?r2:r1;p+=(i?'L':'M')+(50+Math.cos(a)*r).toFixed(1)+' '+(50+Math.sin(a)*r).toFixed(1)}return p+'Z'}

/* art registry */
var ART={
  margherita:function(){return pizzaArt({seed:3,tops:['basil','basil','olive'],n:9,cheeseCol:'#FFF6DA'})},
  fiesta:function(){return pizzaArt({seed:7,tops:['jal','corn','chick','pepper','corn'],n:22})},
  pepperoni:function(){return pizzaArt({seed:11,tops:['pep'],n:14})},
  bbq:function(){return pizzaArt({seed:5,tops:['chick','bbq','onion','chick'],n:18,sauce:'#8A2E14'})},
  funghi:function(){return pizzaArt({seed:9,tops:['mush','mush','basil'],n:16,sauce:'#F4E4B6',cheese:'full',cheeseCol:'#FBEBC0'})},
  smoky:function(){return burgerArt({layers:['patty','cheese','bacon','tomato','lettuce']})},
  black:function(){return burgerArt({bun:'#2E2B2A',bunD:'#1F1D1C',seed:'#7A7470',layers:['patty','cheese','patty','cheese','onion','tomato','lettuce']})},
  crispy:function(){return burgerArt({layers:['chick','cheese','onion','lettuce']})},
  garden:function(){return burgerArt({bun:'#D9903A',layers:['patty','cheese','onion','tomato','lettuce']})},
  fries:function(){return friesArt({})},
  cheesyfries:function(){return friesArt({top:'cheese'})},
  loaded:function(){return friesArt({top:'cheese',chili:true})},
  tonkotsu:function(){return ramenArt({broth:'#F1DDB8'})},
  miso:function(){return ramenArt({broth:'#D9772B',chili:true})},
  shoyu:function(){return ramenArt({broth:'#B5651F'})},
  nuggets:nuggetsArt, bucket:bucketArt, hotdog:hotdogArt,
  cola:function(){return drinkArt({color:'#5A2E1B'})},
  lemonade:function(){return drinkArt({color:'#F2C230',lemon:true})},
  orange:function(){return drinkArt({color:'#F08A24'})}
};
var CATS=[
  {id:'Ramen',icon:function(){return ramenArt({broth:'#F1DDB8'})}},
  {id:'Pizza',icon:sliceArt},
  {id:'Burgers',icon:function(){return burgerArt({layers:['patty','cheese','tomato','lettuce']})}},
  {id:'Fries',icon:function(){return friesArt({})}},
  {id:'Fast food',icon:nuggetsArt},
  {id:'Drinks',icon:function(){return drinkArt({color:'#E4572E'})}}
];

/* ================= menu data ================= */
var PIZZA_SIZES=[{l:'10"',add:0},{l:'12"',add:3},{l:'14"',add:6}];
var MENU=[
  {id:'tonkotsu',cat:'Ramen',name:'Tonkotsu Ramen',desc:'Twelve-hour pork broth, chashu, soft egg, nori and spring onion.',price:12.5},
  {id:'miso',cat:'Ramen',name:'Spicy Miso Ramen',desc:'Miso and chilli broth, minced pork, sweetcorn and a soft egg.',price:12,tags:['hot']},
  {id:'shoyu',cat:'Ramen',name:'Veggie Shoyu Ramen',desc:'Soy and mushroom broth, tofu, pak choi, nori and spring onion.',price:11,tags:['veg']},
  {id:'margherita',cat:'Pizza',name:'Margherita',desc:'San Marzano tomato, fior di latte mozzarella and fresh basil.',price:10.5,sizes:PIZZA_SIZES,tags:['veg']},
  {id:'pepperoni',cat:'Pizza',name:'Pepperoni Classic',desc:'Tomato, mozzarella and generous slices of spicy pepperoni.',price:12,sizes:PIZZA_SIZES},
  {id:'fiesta',cat:'Pizza',name:'Mexican Fiesta',desc:'Chicken, jalapeños, sweetcorn, peppers and mozzarella on tomato.',price:13,sizes:PIZZA_SIZES,tags:['hot']},
  {id:'bbq',cat:'Pizza',name:'BBQ Chicken',desc:'Smoky BBQ base, roast chicken, red onion and mozzarella.',price:13,sizes:PIZZA_SIZES},
  {id:'funghi',cat:'Pizza',name:'Funghi Bianca',desc:'Cream base, roasted mushrooms, mozzarella, garlic and basil.',price:12,sizes:PIZZA_SIZES,tags:['veg']},
  {id:'smoky',cat:'Burgers',name:'Smoky Stack Burger',desc:'Beef patty, smoked bacon, cheddar, tomato, lettuce, brioche bun.',price:11.5},
  {id:'black',cat:'Burgers',name:'Double Black Burger',desc:'Two beef patties, double cheese, onion and tomato in a charcoal bun.',price:13.5},
  {id:'crispy',cat:'Burgers',name:'Crispy Chicken Burger',desc:'Buttermilk fried chicken, cheese, onion and lettuce, brioche bun.',price:10.5},
  {id:'garden',cat:'Burgers',name:'Garden Burger',desc:'Chargrilled bean and beetroot patty, cheese, tomato and lettuce.',price:10.5,tags:['veg']},
  {id:'fries',cat:'Fries',name:'Classic Fries',desc:'Skin-on, twice cooked and salted.',price:3.5,tags:['veg']},
  {id:'cheesyfries',cat:'Fries',name:'Cheesy Fries',desc:'Fries under a blanket of melted cheddar sauce.',price:5,tags:['veg']},
  {id:'loaded',cat:'Fries',name:'Ember Loaded Fries',desc:'Cheese sauce, chilli, jalapeños and spring onion.',price:6.5,tags:['hot','veg']},
  {id:'nuggets',cat:'Fast food',name:'Chicken Nuggets',desc:'Six crispy nuggets with a dip of your choice.',price:5.5},
  {id:'bucket',cat:'Fast food',name:'Popcorn Chicken Bucket',desc:'Bite-size buttermilk chicken, seasoned and extra crunchy.',price:6.5},
  {id:'hotdog',cat:'Fast food',name:'Loaded Hot Dog',desc:'Pork frankfurter, fried onions, mustard and ketchup.',price:6},
  {id:'cola',cat:'Drinks',name:'Cola',desc:'330ml can, served cold.',price:2.2,tags:['veg']},
  {id:'lemonade',cat:'Drinks',name:'Fresh Lemonade',desc:'Squeezed lemon, sugar and sparkling water.',price:2.8,tags:['veg']},
  {id:'orange',cat:'Drinks',name:'Orange Fizz',desc:'330ml sparkling orange, served cold.',price:2.5,tags:['veg']}
];
var BYID={};MENU.forEach(function(m){BYID[m.id]=m});
var TAGTXT={hot:'Spicy',veg:'V'};

/* ================= state ================= */
var state={cat:'all',q:'',size:{},cart:[],dateIdx:0,time:null,view:'cart',lastOrder:null,dates:[]};
try{var saved=JSON.parse(localStorage.getItem('ce_cart')||'[]');if(Array.isArray(saved))state.cart=saved.filter(function(l){return BYID[l.id]&&l.qty>0})}catch(e){}
function persist(){try{localStorage.setItem('ce_cart',JSON.stringify(state.cart))}catch(e){}}

function unit(m,size){var add=0;if(m.sizes){var s=m.sizes.filter(function(z){return z.l===size})[0];if(s)add=s.add}return m.price+add}
function defSize(m){return m.sizes?(state.size[m.id]||m.sizes[0].l):null}
function cartCount(){return state.cart.reduce(function(a,l){return a+l.qty},0)}
function cartTotal(){return state.cart.reduce(function(a,l){return a+l.qty*unit(BYID[l.id],l.size)},0)}

/* ================= opening hours ================= */
function statusInfo(now){
  var d=now.getDay(),h=HOURS[d],m=now.getHours()*60+now.getMinutes();
  if(h.o!==null&&m>=h.o&&m<h.c)return {open:true,txt:'Open now · closes at '+hhmm(h.c)};
  if(h.o!==null&&m<h.o)return {open:false,txt:'Closed · opens today at '+hhmm(h.o)};
  for(var i=1;i<=7;i++){var dd=(d+i)%7,hh=HOURS[dd];if(hh.o!==null)return {open:false,txt:'Closed · opens '+(i===1?'tomorrow':DAYS[dd])+' at '+hhmm(hh.o)}}
  return {open:false,txt:'Closed'};
}
function renderStatus(){var s=statusInfo(new Date()),el=$('#status');el.dataset.open=s.open?'1':'0';$('#statusTxt').textContent=s.txt}
function renderHours(){
  var order=[1,2,3,4,5,6,0],today=new Date().getDay();
  $('#hoursBody').innerHTML=order.map(function(d){var h=HOURS[d];return '<tr class="'+(d===today?'today ':'')+(h.o===null?'closed':'')+'"><td>'+DAYS[d]+(d===today?' (today)':'')+'</td><td>'+(h.o===null?'Closed':hhmm(h.o)+' – '+hhmm(h.c))+'</td></tr>'}).join('');
}
function sameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
function slotsFor(date){
  var h=HOURS[date.getDay()];if(h.o===null)return [];
  var now=new Date(),min=sameDay(date,now)?now.getHours()*60+now.getMinutes()+BIZ.prep:0,out=[];
  for(var t=h.o+BIZ.slot;t<=h.c-BIZ.lastBefore;t+=BIZ.slot){if(t>=min)out.push(t)}
  return out;
}
function buildDates(){
  var base=new Date();base.setHours(0,0,0,0);state.dates=[];
  for(var i=0;i<7;i++){var d=new Date(base);d.setDate(base.getDate()+i);state.dates.push({date:d,slots:slotsFor(d)})}
  var first=state.dates.findIndex(function(x){return x.slots.length});
  if(first<0)first=0;
  if(!state.dates[state.dateIdx]||!state.dates[state.dateIdx].slots.length)state.dateIdx=first;
}

/* ================= menu render ================= */
function renderCats(){
  $('#catStrip').innerHTML=CATS.map(function(c){return '<a class="cat-link" href="#menu" data-cat="'+esc(c.id)+'">'+c.icon()+'<span>'+esc(c.id)+'</span></a>'}).join('');
  $('#chips').innerHTML='<button class="chip all" data-chip="all" aria-pressed="true">All</button>'+CATS.map(function(c){return '<button class="chip" data-chip="'+esc(c.id)+'" aria-pressed="false">'+c.icon()+esc(c.id)+'</button>'}).join('');
}
function renderMenu(){
  var q=state.q.trim().toLowerCase();
  var list=MENU.filter(function(m){return (state.cat==='all'||m.cat===state.cat)&&(!q||(m.name+' '+m.desc+' '+m.cat).toLowerCase().indexOf(q)>-1)});
  $$('[data-chip]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.chip===state.cat?'true':'false')});
  $('#resultNote').textContent=list.length?('Showing '+list.length+' of '+MENU.length+' dishes'):'';
  $('#grid').innerHTML=list.length?list.map(cardHTML).join(''):'<div class="empty"><b>No dishes match your search.</b><br>Try another word, or choose All.</div>';
}
function cardHTML(m){
  var sz=defSize(m);
  var tags=(m.tags||[]).map(function(t){return '<span class="tag '+t+'">'+TAGTXT[t]+'</span>'}).join('');
  var sizes=m.sizes?'<div class="sizes" role="group" aria-label="Choose size for '+esc(m.name)+'">'+m.sizes.map(function(s){return '<button class="size" data-size="'+esc(s.l)+'" data-id="'+m.id+'" aria-pressed="'+(s.l===sz)+'">'+esc(s.l)+'</button>'}).join('')+'</div>':'';
  return '<article class="card" data-card="'+m.id+'"><div class="art"><div class="tags">'+tags+'</div>'+ART[m.id]()+'</div><h3>'+esc(m.name)+'</h3><p class="d">'+esc(m.desc)+'</p>'+sizes+'<div class="foot-row"><span class="price" data-price>'+money(unit(m,sz))+'</span><button class="add" data-add="'+m.id+'" aria-label="Add '+esc(m.name)+' to order">Add <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg></button></div></article>';
}

/* ================= cart ================= */
function addToCart(id){
  var m=BYID[id],size=defSize(m),ex=state.cart.filter(function(l){return l.id===id&&l.size===size})[0];
  if(ex)ex.qty++;else state.cart.push({id:id,size:size,qty:1});
  persist();updateCartUI();toast('Added '+m.name+(size?' ('+size+')':''));
}
function changeQty(i,d){var l=state.cart[i];if(!l)return;l.qty+=d;if(l.qty<=0)state.cart.splice(i,1);persist();updateCartUI();if(drawerOpen())renderDrawer()}
function updateCartUI(){
  var n=cartCount(),t=cartTotal();
  var cn=$('#cartN');cn.textContent=n;cn.dataset.zero=n?'0':'1';
  $('#cartT').textContent=money(t);
  var mb=$('#mbar');mb.hidden=!n||drawerOpen();
  $('#mbarL').textContent='View order · '+n+(n===1?' item':' items');$('#mbarR').textContent=money(t);
  document.body.classList.toggle('has-cart',n>0);
}

/* ================= drawer ================= */
function drawerOpen(){return $('#drawer').classList.contains('on')}
function openDrawer(){
  buildDates();if(state.view==='done'&&!state.lastOrder)state.view='cart';
  renderDrawer();
  $('#drawer').classList.add('on');$('#drawer').setAttribute('aria-hidden','false');$('#scrim').classList.add('on');
  document.body.style.overflow='hidden';$('#mbar').hidden=true;
  setTimeout(function(){$('#drClose').focus()},60);
}
function closeDrawer(){
  $('#drawer').classList.remove('on');$('#drawer').setAttribute('aria-hidden','true');$('#scrim').classList.remove('on');
  document.body.style.overflow='';updateCartUI();
  if(state.view==='done'){state.view='cart'}
}
function fmtDate(d){return DAYS3[d.getDay()]+' '+d.getDate()+' '+MONTHS3[d.getMonth()]}
function renderDrawer(){
  var body=$('#drBody'),foot=$('#drFoot');
  if(state.view==='done'&&state.lastOrder){renderDone(body,foot);return}
  $('#drTitle').textContent='Your order';
  if(!state.cart.length){
    body.innerHTML='<div class="dr-empty">'+bagArt().replace('<svg','<svg width="110"')+'<h3 style="font:600 20px/1.2 var(--f-body)">Your order is empty</h3><p style="margin-top:6px">Add a few dishes from the menu, then choose when you would like to collect.</p><a class="btn btn-red" style="margin-top:18px" href="#menu" data-close>Browse the menu</a></div>';
    foot.innerHTML='';return;
  }
  var lines=state.cart.map(function(l,i){var m=BYID[l.id];return '<li class="line"><div class="th">'+ART[l.id]()+'</div><div><b>'+esc(m.name)+'</b><small>'+(l.size?esc(l.size)+' · ':'')+money(unit(m,l.size))+' each</small><div class="qty"><button data-q="-1" data-i="'+i+'" aria-label="Decrease quantity of '+esc(m.name)+'">−</button><span aria-live="polite">'+l.qty+'</span><button data-q="1" data-i="'+i+'" aria-label="Increase quantity of '+esc(m.name)+'">+</button></div></div><div><div class="lp">'+money(unit(m,l.size)*l.qty)+'</div><button class="rm" data-q="-999" data-i="'+i+'" aria-label="Remove '+esc(m.name)+'">Remove</button></div></li>'}).join('');
  var dates=state.dates.map(function(x,i){var d=x.date,dis=!x.slots.length,lab=i===0?'Today':(i===1?'Tmrw':DAYS3[d.getDay()]);return '<button class="date" data-di="'+i+'" aria-pressed="'+(i===state.dateIdx)+'"'+(dis?' disabled':'')+'><small>'+(dis&&HOURS[d.getDay()].o===null?'Closed':lab)+'</small><b>'+d.getDate()+'</b><small>'+MONTHS3[d.getMonth()]+'</small></button>'}).join('');
  var cur=state.dates[state.dateIdx],slots=cur?cur.slots:[];
  var times=slots.length?'<div class="times" role="group" aria-label="Collection time">'+slots.map(function(t){return '<button class="time" data-t="'+t+'" aria-pressed="'+(state.time===t)+'">'+hhmm(t)+'</button>'}).join('')+'</div>':'<p class="no-slots">No collection slots left on this day. Please choose another date.</p>';
  body.innerHTML='<ul class="lines">'+lines+'</ul>'
   +'<div class="grp" id="pickup-note"><h3>Collection <span class="badge-pick">Pickup only</span></h3><p class="hint">Choose the day and time you will arrive at 18 Ember Lane.</p><div class="dates" role="group" aria-label="Collection date">'+dates+'</div>'+times+'<p class="pick-sum" id="pickSum" aria-live="polite">'+(state.time!==null&&cur?'Collect on '+fmtDate(cur.date)+' at '+hhmm(state.time):'')+'</p></div>'
   +'<form class="grp" id="ordForm" novalidate><h3>Your details</h3><div class="fld"><label for="oName">Name for the order</label><input id="oName" autocomplete="name" value="'+esc(state.f&&state.f.name||'')+'"></div><div class="row2"><div class="fld"><label for="oPhone">Phone</label><input id="oPhone" type="tel" autocomplete="tel" value="'+esc(state.f&&state.f.phone||'')+'"></div><div class="fld"><label for="oEmail">Email</label><input id="oEmail" type="email" autocomplete="email" value="'+esc(state.f&&state.f.email||'')+'"></div></div><div class="fld"><label for="oNote">Notes or allergies (optional)</label><textarea id="oNote" style="min-height:80px">'+esc(state.f&&state.f.note||'')+'</textarea></div><p class="err" id="oErr" role="alert"></p></form>';
  foot.innerHTML='<div class="tot"><span>Total</span><span>'+money(cartTotal())+'</span></div><button class="btn btn-red" id="placeBtn" type="button">Place pickup order</button><small>Pay when you collect, by card or cash.</small>';
}
function grabForm(){var n=$('#oName');if(!n)return;state.f={name:n.value,phone:$('#oPhone').value,email:$('#oEmail').value,note:$('#oNote').value}}
function placeOrder(){
  grabForm();var f=state.f||{},err=$('#oErr'),cur=state.dates[state.dateIdx];
  function fail(msg,id){err.textContent=msg;var el=id&&$('#'+id);if(el){el.focus();el.scrollIntoView({block:'center',behavior:'smooth'})}}
  if(!state.cart.length)return fail('Your order is empty. Add a dish first.');
  if(state.time===null||!cur||cur.slots.indexOf(state.time)<0)return fail('Choose a collection date and time.','pickSum');
  if(!f.name.trim())return fail('Enter a name so we can find your order at the counter.','oName');
  if(!/^[\d\s+()-]{7,}$/.test(f.phone.trim()))return fail('Enter a phone number we can call if there is a problem with your order.','oPhone');
  if(f.email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))return fail('That email address does not look right. Check it or leave it blank.','oEmail');
  var when=new Date(cur.date);when.setHours(0,0,0,0);when.setMinutes(state.time);
  var ref='CE-'+(1000+Math.floor(Math.random()*9000));
  state.lastOrder={ref:ref,name:f.name.trim(),phone:f.phone.trim(),email:f.email.trim(),note:f.note.trim(),when:when,whenTxt:fmtDate(when)+' at '+hhmm(state.time),
    lines:state.cart.map(function(l){var m=BYID[l.id];return {name:m.name,size:l.size,qty:l.qty,total:unit(m,l.size)*l.qty}}),total:cartTotal()};
  /* HOOK: send state.lastOrder to your order system / email service here. */
  try{var all=JSON.parse(localStorage.getItem('ce_orders')||'[]');all.push({ref:ref,at:Date.now(),order:state.lastOrder});localStorage.setItem('ce_orders',JSON.stringify(all.slice(-10)))}catch(e){}
  state.cart=[];state.time=null;state.f=null;persist();updateCartUI();state.view='done';renderDrawer();$('#drBody').scrollTop=0;
}
function orderMailto(o){
  var lines=o.lines.map(function(l){return '- '+l.qty+' x '+l.name+(l.size?' ('+l.size+')':'')+' — '+money(l.total)}).join('\n');
  var body='Hello,\n\nI would like to place a pickup order.\n\nOrder ref: '+o.ref+'\nName: '+o.name+'\nPhone: '+o.phone+'\nCollection: '+o.whenTxt+'\n\n'+lines+'\n\nTotal: '+money(o.total)+(o.note?'\n\nNotes: '+o.note:'')+'\n\nThank you';
  return 'mailto:'+BIZ.email+'?subject='+encodeURIComponent('Pickup order '+o.ref+' – '+o.whenTxt)+'&body='+encodeURIComponent(body);
}
function renderDone(body,foot){
  var o=state.lastOrder;$('#drTitle').textContent='Order placed';
  body.innerHTML='<div class="conf"><svg class="ck" viewBox="0 0 68 68" aria-hidden="true"><circle cx="34" cy="34" r="34" fill="#2E8B4B"/><path d="M20 35l10 10 19-21" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><h3>Thanks, '+esc(o.name.split(' ')[0])+'!</h3><span class="ref">'+esc(o.ref)+'</span>'
   +'<div class="conf-box"><h4>Collect</h4><p style="font-weight:600;font-size:18px">'+esc(o.whenTxt)+'</p><p style="color:var(--ink-2)">'+esc(BIZ.addr)+'</p></div>'
   +'<div class="conf-box"><h4>Your order</h4><ul>'+o.lines.map(function(l){return '<li><span>'+l.qty+' × '+esc(l.name)+(l.size?' ('+esc(l.size)+')':'')+'</span><span>'+money(l.total)+'</span></li>'}).join('')+'<li class="sum"><span>Total to pay at collection</span><span>'+money(o.total)+'</span></li></ul>'+(o.note?'<p style="margin-top:8px;color:var(--ink-2);font-size:14px">Note: '+esc(o.note)+'</p>':'')+'</div>'
   +'<div class="conf-actions"><a class="btn btn-yellow" href="'+orderMailto(o).replace(/&/g,'&amp;')+'">Email this order to the restaurant</a><a class="btn btn-red" href="tel:+441509000000">Call us about this order</a></div>'
   +'<p class="demo">Prototype note: this page does not yet send orders to a kitchen system. Connect it to your order backend before going live.</p></div>';
  foot.innerHTML='<button class="btn btn-red" id="doneBtn" type="button">Back to the menu</button>';
}

/* ================= toast ================= */
var tt;function toast(msg){var t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},1800)}

/* ================= contact form ================= */
function initContact(){
  $('#contactForm').addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#cName').value.trim(),em=$('#cEmail').value.trim(),tp=$('#cTopic').value,ms=$('#cMsg').value.trim(),er=$('#cErr');
    if(!n){er.textContent='Enter your name.';$('#cName').focus();return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){er.textContent='Enter a valid email address so we can reply.';$('#cEmail').focus();return}
    if(ms.length<5){er.textContent='Write a short message so we know how to help.';$('#cMsg').focus();return}
    var href='mailto:'+BIZ.email+'?subject='+encodeURIComponent(tp+' – '+n)+'&body='+encodeURIComponent(ms+'\n\n'+n+'\n'+em);
    $('#contactBox').innerHTML='<div class="sent"><svg viewBox="0 0 68 68" aria-hidden="true"><circle cx="34" cy="34" r="34" fill="#2E8B4B"/><path d="M20 35l10 10 19-21" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><h3>Your message is ready, '+esc(n.split(' ')[0])+'</h3><p>Send it from your email app and we will reply within one working day. For anything urgent, call '+esc(BIZ.phone)+'.</p><a class="btn btn-red" href="'+href.replace(/&/g,'&amp;')+'">Send with email app</a></div>';
  });
}

/* ================= wire up ================= */
function setCat(c,scroll){state.cat=c;state.q='';$('#q').value='';renderMenu();if(scroll)$('#menu').scrollIntoView({behavior:'smooth'})}
function init(){
  $('#heroPizza').innerHTML=pizzaArt({seed:21,tops:['mush','basil','corn','jal','chick'],n:26,cheese:'full'});
  $('#heroPizza2').innerHTML=pizzaArt({seed:33,tops:['pep','olive','basil'],n:14});
  $('#starSvg').innerHTML='<path d="'+starPath(14,49,41)+'" fill="#FFC61A"/>';
  $('#promoA').innerHTML=pizzaArt({seed:5,tops:['mush','basil','corn','chick'],n:22,cheese:'full'});
  $('#promoB').innerHTML=ART.smoky();
  $('#promoC').innerHTML=bagArt();
  renderCats();renderMenu();renderStatus();renderHours();buildDates();updateCartUI();initContact();
  setInterval(renderStatus,60000);

  document.addEventListener('click',function(e){
    var t=e.target.closest('button,a');if(!t)return;
    if(t.dataset.cat){e.preventDefault();setCat(t.dataset.cat,true);return}
    if(t.dataset.chip){setCat(t.dataset.chip,false);return}
    if(t.dataset.add){addToCart(t.dataset.add);return}
    if(t.dataset.size){var id=t.dataset.id;state.size[id]=t.dataset.size;var card=t.closest('.card');$$('.size',card).forEach(function(b){b.setAttribute('aria-pressed',b===t?'true':'false')});$('[data-price]',card).textContent=money(unit(BYID[id],t.dataset.size));return}
    if(t.dataset.q){grabForm();changeQty(+t.dataset.i,+t.dataset.q);return}
    if(t.dataset.di!==undefined){grabForm();state.dateIdx=+t.dataset.di;state.time=null;renderDrawer();return}
    if(t.dataset.t){grabForm();state.time=+t.dataset.t;var cur=state.dates[state.dateIdx];$$('.time').forEach(function(b){b.setAttribute('aria-pressed',b===t?'true':'false')});$('#pickSum').textContent='Collect on '+fmtDate(cur.date)+' at '+hhmm(state.time);return}
    if(t.id==='placeBtn'){placeOrder();return}
    if(t.id==='doneBtn'){state.view='cart';closeDrawer();$('#menu').scrollIntoView({behavior:'smooth'});return}
    if(t.hasAttribute('data-close')){closeDrawer();return}
    if(t.hasAttribute('data-open-cart')){e.preventDefault();openDrawer();return}
  });
  $('#cartBtn').addEventListener('click',openDrawer);
  $('#mbarBtn').addEventListener('click',openDrawer);
  $('#drClose').addEventListener('click',closeDrawer);
  $('#scrim').addEventListener('click',closeDrawer);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawerOpen())closeDrawer()});
  var q=$('#q'),qt;q.addEventListener('input',function(){clearTimeout(qt);qt=setTimeout(function(){state.q=q.value;if(state.q)state.cat='all';renderMenu()},120)});
  var nav=$('#nav'),mt=$('#menuToggle');
  mt.addEventListener('click',function(){var o=nav.classList.toggle('open');mt.setAttribute('aria-expanded',o?'true':'false')});
  nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');mt.setAttribute('aria-expanded','false')}});
}
init();
})();
