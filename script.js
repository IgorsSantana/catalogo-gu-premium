'use strict';

const PRODUCTS = [
  {
    id: 'amendoleite', name: 'Amendoleite', category: 'doces', tags: ['doces', 'revenda'], categoryLabel: 'Doce de amendoim com leite',
    subtitle: 'O doce de amendoim com leite da Doces Gu Premium, apresentado em pote.',
    description: 'O Amendoleite é identificado na embalagem como “Doce de Amendoim com Leite”. Consulte composição, alergênicos, peso, disponibilidade e valores com a equipe.',
    image: 'assets/amendoleite-recorte.webp', imageAlt: 'Pote de Amendoleite Doces Gu Premium', theme: 'amendoleite', label: 'Em destaque', notice: 'Preço e apresentação sob consulta.'
  },
  {
    id: 'pacoca', name: 'Paçoca Caseira Premium', category: 'doces', tags: ['doces', 'revenda'], categoryLabel: 'Linha de paçocas',
    subtitle: 'Paçoca caseira premium de 90 g, com opções de espeto e caixa para revenda.',
    description: 'A mesma Paçoca Caseira Premium do catálogo de 2026, em três apresentações: unidade de 90 g, espeto com 30 unidades e caixa com 4 espetos. Consulte preços e disponibilidade com a equipe.',
    image: 'assets/pacoca-premium.webp', imageAlt: 'Paçoca Caseira Premium em sua embalagem individual', theme: 'pacoca', label: '3 apresentações', notice: 'Um único produto, com unidade, espeto ou caixa.',
    variants: [
      {id:'unidade', name:'Unidade — 90 g'},
      {id:'espeto', name:'Espeto — 30 unidades'},
      {id:'caixa', name:'Caixa — 4 espetos (120 unidades)'}
    ]
  },
  {
    id: 'amendoim', name: 'Amendoim Frito Salgado', category: 'salgados', tags: ['salgados', 'revenda'], categoryLabel: 'Linha salgada',
    subtitle: 'Amendoim frito salgado sem pele, com alho. Pacote individual de 45 g.',
    description: 'Amendoim Frito Salgado Sem Pele com Alho, embalagem individual de 45 g, conforme o Catálogo Doces Gu Premium 2026. Pronto para lanches, porções e momentos de descontração. Consulte alergênicos, preço e disponibilidade.',
    image: 'assets/amendoim-frito-45g.webp', imageAlt: 'Pacote de Amendoim Frito Salgado sem pele com alho 45 g, com fundo transparente', theme: 'amendoim', label: 'Novidade no catálogo', notice: 'Embalagem individual de 45 g conforme catálogo 2026.'
  }
];


const WHATSAPP_NUMBER = '5532999286097';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const productById = id => PRODUCTS.find(p => p.id === id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const artFor = p => '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '" loading="lazy">';

function renderProducts(filter='todos'){
 const products=PRODUCTS.filter(p=>filter==='todos'||p.tags.includes(filter));
 $('#productGrid').innerHTML=products.map(p=>'<article class="product-card" data-product-card="'+esc(p.id)+'">'+
 '<button type="button" class="product-photo is-'+esc(p.theme)+'" data-details="'+esc(p.id)+'" aria-label="Ver fotos e detalhes de '+esc(p.name)+'"><span class="product-label">'+esc(p.label)+'</span>'+artFor(p)+'<span class="photo-hint">Ver fotos <svg class="icon"><use href="#i-arrow"/></svg></span></button>'+
 '<div class="product-body"><span class="product-category">'+esc(p.categoryLabel)+'</span><h3>'+esc(p.name)+'</h3><p>'+esc(p.subtitle)+'</p>'+
 (p.id==='pacoca'?'<div class="product-presentation-note">Unidade 90 g · Espeto 30 un. · Caixa 4 espetos</div>':'')+
 '<div class="product-bottom"><div class="product-price"><small>Preço</small><strong>Sob consulta</strong></div>'+
 '<div class="product-actions"><button type="button" class="product-detail-btn" data-details="'+esc(p.id)+'" aria-label="Ver detalhes de '+esc(p.name)+'">Ver detalhes <svg class="icon"><use href="#i-arrow"/></svg></button></div></div></div></article>').join('');
}
const packFormats=[
 {title:'Unidade',detail:'Paçoca Caseira Premium',qty:'Peso líquido: 90 g',image:'assets/pacoca-premium.webp',alt:'Pacote de paçoca premium 90 g'},
 {title:'Espeto',detail:'Apresentação comercial',qty:'30 unidades por espeto',image:'assets/espeto-pacoca.webp',alt:'Espeto de paçocas em embalagens individuais'},
 {title:'Caixa',detail:'Embalagem para revenda',qty:'4 espetos por caixa (120 unidades ao todo)',image:'assets/caixa-revenda.webp',alt:'Caixa de paçocas para revenda'}
];
function presentationsFor(p){
 if(p.id!=='pacoca')return '';
 return '<div class="presentation-heading">Apresentações disponíveis</div><div class="presentation-list">'+packFormats.map(f=>
 '<div class="presentation-item"><img src="'+esc(f.image)+'" alt="'+esc(f.alt)+'" loading="lazy"><div>'+
 '<strong>'+esc(f.title)+'</strong><span>'+esc(f.detail)+'</span><b>'+esc(f.qty)+'</b></div></div>').join('')+'</div>';
}
let lastFocus=null;
let activeGallery=[];
function selectPhoto(index){
 const photo=activeGallery[index];if(!photo)return;
 $('#galleryPhoto').src=photo.image;
 $('#galleryPhoto').alt=photo.alt;
 $('#galleryCaption').textContent=photo.caption;
 $$('.gallery-thumb').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
}
function renderGallery(p){
 activeGallery=p.id==='pacoca'?packFormats.map(f=>({image:f.image,alt:f.alt,caption:f.title+' · '+f.qty})):
 [{image:p.image,alt:p.imageAlt,caption:p.name}];
 $('#modalImage').innerHTML='<div class="gallery-stage"><img id="galleryPhoto" src="'+esc(activeGallery[0].image)+'" alt="'+esc(activeGallery[0].alt)+'"></div>'+
 '<p id="galleryCaption" class="gallery-caption" aria-live="polite">'+esc(activeGallery[0].caption)+'</p>'+
 (activeGallery.length>1?'<div class="gallery-thumbs" role="group" aria-label="Fotos das apresentações">'+activeGallery.map((photo,i)=>
 '<button type="button" class="gallery-thumb" data-photo="'+i+'" aria-pressed="'+(i===0)+'" aria-label="Ver foto: '+esc(packFormats[i].title)+'"><img src="'+esc(photo.image)+'" alt=""><span>'+esc(packFormats[i].title)+'</span></button>').join('')+'</div>':'');
}

function unlockBody(){if(!$('#productModal').classList.contains('open')&&!$('#privacyModal').classList.contains('open'))document.body.classList.remove('no-scroll');}
function openDetails(id){
 const p=productById(id);if(!p)return;
 closePrivacy();lastFocus=document.activeElement;
 $('#modalTitle').textContent=p.name;
 $('#modalDescription').textContent=p.description;
 $('#modalNotice').textContent=p.notice;
 renderGallery(p);
 $('.modal-card').scrollTop=0;
 $('#modalPresentations').innerHTML=presentationsFor(p);
 $('#modalContact').href='https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent('Olá! Vi o produto '+p.name+' no catálogo da Doces Gu Premium e gostaria de consultar preços, apresentações e disponibilidade.');
 $('#productModal').classList.add('open');
 $('#productModal').setAttribute('aria-hidden','false');
 document.body.classList.add('no-scroll');$('#closeModal').focus();
}
function closeDetails(){
 const open=$('#productModal').classList.contains('open');$('#productModal').classList.remove('open');
 $('#productModal').setAttribute('aria-hidden','true');unlockBody();if(open&&lastFocus?.isConnected)lastFocus.focus();
}
function openPrivacy(){
 closeDetails();lastFocus=document.activeElement;
 $('#privacyModal').classList.add('open');$('#privacyModal').setAttribute('aria-hidden','false');
 document.body.classList.add('no-scroll');$('#privacyClose').focus();
}
function closePrivacy(){
 const open=$('#privacyModal').classList.contains('open');$('#privacyModal').classList.remove('open');
 $('#privacyModal').setAttribute('aria-hidden','true');unlockBody();if(open&&lastFocus?.isConnected)lastFocus.focus();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.matches('[data-photo]'))selectPhoto(Number(b.dataset.photo));
 if(b.matches('[data-details]'))openDetails(b.dataset.details);
 if(b.matches('[data-filter]')){$$('.filter').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});renderProducts(b.dataset.filter);}
});
$('#closeModal').addEventListener('click',closeDetails);
$('#productModal').addEventListener('click',e=>{if(e.target===$('#productModal'))closeDetails();});
$('#privacyBtn').addEventListener('click',openPrivacy);
$('#privacyClose').addEventListener('click',closePrivacy);
$('#privacyOk').addEventListener('click',closePrivacy);
$('#privacyModal').addEventListener('click',e=>{if(e.target===$('#privacyModal'))closePrivacy();});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeDetails();closePrivacy();}
 if(e.key==='Tab'){
  const modal=[$('#productModal'),$('#privacyModal')].find(x=>x.classList.contains('open'));if(!modal)return;
  const elements=$$('button:not([disabled]), a[href]',modal).filter(x=>x.getClientRects().length>0);
  if(!elements.length)return;
  const first=elements[0],last=elements.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
});
$('#mobileMenuBtn').addEventListener('click',()=>{const open=$('#navLinks').classList.toggle('open');$('#mobileMenuBtn').setAttribute('aria-expanded',String(open));});
$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>{$('#navLinks').classList.remove('open');$('#mobileMenuBtn').setAttribute('aria-expanded','false');}));
$('#year').textContent=new Date().getFullYear();
renderProducts();
