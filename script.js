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
const basket = new Map();
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const productById = id => PRODUCTS.find(p => p.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function artFor(product) {
  return `<img src="${esc(product.image)}" alt="${esc(product.imageAlt)}" loading="lazy">`;
}
function variantPicker(product, context) {
  if (!product.variants) return '';
  const id = `presentation-${context}-${product.id}`;
  return `<div class="variant-field"><label for="${id}">Apresentação</label><select id="${id}" data-product-variant>${product.variants.map(v=>`<option value="${esc(v.id)}">${esc(v.name)}</option>`).join('')}</select></div>`;
}
function renderProducts(filter = 'todos') {
  const list = PRODUCTS.filter(p => filter === 'todos' || p.tags.includes(filter));
  $('#productGrid').innerHTML = list.map(p => `
    <article class="product-card" data-product-card="${esc(p.id)}">
      <div class="product-photo is-${p.theme}"><span class="product-label">${esc(p.label)}</span>${artFor(p)}</div>
      <div class="product-body">
        <span class="product-category">${esc(p.categoryLabel)}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.subtitle)}</p>
        ${variantPicker(p, 'card')}
        <div class="product-bottom">
          <div class="product-price"><small>Preço</small><strong>Sob consulta</strong></div>
          <div class="product-actions">
            <button type="button" class="product-detail-btn" data-details="${p.id}" aria-label="Ver detalhes de ${esc(p.name)}">Detalhes</button>
            <button type="button" class="product-add-btn" data-add="${p.id}" aria-label="Adicionar ${esc(p.name)} ao pedido"><svg class="icon"><use href="#i-plus"/></svg></button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}
function decodeItem(key) {
  const [id, variantId] = key.split(':');
  const product = productById(id);
  const variant = product?.variants?.find(v=>v.id===variantId);
  return {product, variant};
}
function itemKey(id, variantId) {
  const product = productById(id);
  if (!product) return null;
  if (product.variants) {
    if (!product.variants.some(v=>v.id===variantId)) return null;
    return `${id}:${variantId}`;
  }
  return id;
}
function totalItems() {return [...basket.values()].reduce((a,b) => a+b,0);}
function toast(msg) {
  const el = $('#toast'); el.textContent = msg;
  el.classList.add('show'); clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2500);
}
function changeQty(key, delta) {
  if (!decodeItem(key).product) return;
  const next = Math.max(0, Math.min(99, (basket.get(key) || 0) + delta));
  if (next === 0) basket.delete(key); else basket.set(key, next);
  renderBasket();
}
function addItem(id, variantId) {
  const key = itemKey(id, variantId);
  if (!key) return;
  changeQty(key, 1);
  const {product, variant} = decodeItem(key);
  toast(`${product.name}${variant ? ' — ' + variant.name : ''} adicionado ao pedido`);
}
function renderBasket() {
  const count = totalItems();
  $('#cartCount').textContent = count;
  $('#drawerCount').textContent = `(${count})`;
  $('#cartItems').innerHTML = !count ? `<div class="cart-empty"><svg class="icon"><use href="#i-bag"/></svg><strong>Seu pedido está vazio</strong><p>Adicione seus produtos favoritos pelo catálogo para solicitar um orçamento.</p><button class="btn btn-outline" type="button" data-shopping>Ver produtos <svg class="icon"><use href="#i-arrow"/></svg></button></div>` :
    [...basket].map(([key,qty]) => {
      const {product:p,variant:v} = decodeItem(key);
      if (!p) return '';
      const safeKey = esc(key);
      return `<div class="cart-item"><div class="cart-item-img">${artFor(p)}</div><div><button type="button" class="cart-remove" data-remove="${safeKey}">Remover</button><h3>${esc(p.name)}</h3>${v?`<span class="cart-variant">${esc(v.name)}</span>`:''}<small>Preço sob consulta</small><div class="qty-control"><button type="button" data-decrease="${safeKey}" aria-label="Diminuir ${esc(p.name)}"><svg class="icon"><use href="#i-minus"/></svg></button><span>${qty}</span><button type="button" data-increase="${safeKey}" aria-label="Aumentar ${esc(p.name)}"><svg class="icon"><use href="#i-plus"/></svg></button></div></div></div>`;
    }).join('');
  $('#sendWhatsApp').disabled = count === 0;
}
let lastFocus = null;
function lockBody(){document.body.classList.add('no-scroll');}
function unlockBody(){if (!$('#cartDrawer').classList.contains('open') && !$('#productModal').classList.contains('open') && !$('#privacyModal').classList.contains('open')) document.body.classList.remove('no-scroll');}
function openBasket(){closeDetails();closePrivacy();lastFocus=document.activeElement;$('#overlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');lockBody();$('[data-close-cart]').focus();}
function closeBasket(){const isOpen = $('#cartDrawer').classList.contains('open');$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');$('#overlay').hidden=true;unlockBody();if (isOpen && lastFocus && lastFocus.isConnected) lastFocus.focus();}
let modalId;
function openDetails(id){const p=productById(id);if(!p)return;closeBasket();closePrivacy();lastFocus=document.activeElement;modalId=id;$('#modalTitle').textContent=p.name;$('#modalDescription').textContent=p.description;$('#modalNotice').textContent=p.notice;$('#modalImage').innerHTML=artFor(p);$('#modalVariants').innerHTML=variantPicker(p,'modal');$('#productModal').classList.add('open');$('#productModal').setAttribute('aria-hidden','false');lockBody();$('#closeModal').focus();}
function closeDetails(){const hadOpen=$('#productModal').classList.contains('open');$('#productModal').classList.remove('open');$('#productModal').setAttribute('aria-hidden','true');unlockBody();if(hadOpen && lastFocus && lastFocus.isConnected)lastFocus.focus();}
function openPrivacy(){closeBasket();closeDetails();lastFocus=document.activeElement;$('#privacyModal').classList.add('open');$('#privacyModal').setAttribute('aria-hidden','false');lockBody();$('#privacyClose').focus();}
function closePrivacy(){const hadOpen=$('#privacyModal').classList.contains('open');$('#privacyModal').classList.remove('open');$('#privacyModal').setAttribute('aria-hidden','true');unlockBody();if(hadOpen && lastFocus && lastFocus.isConnected)lastFocus.focus();}
function sendWhatsApp(){if(!basket.size)return;const lines=[
 'Olá! Vim pelo catálogo da Doces Gu Premium e gostaria de consultar preços e disponibilidade:',
 '', ...[...basket].map(([key,qty])=>{const {product,variant}=decodeItem(key);return `• ${product.name}${variant ? ' — ' + variant.name : ''} — quantidade: ${qty}`;}),
 '', 'Por favor, informem os valores, as condições e as opções de entrega. Obrigado!'
];window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener,noreferrer');}

// Delegated click handlers also cover cards generated by the category filters.
document.addEventListener('click', e => {
  const button=e.target.closest('button');
  if(!button)return;
  if(button.matches('[data-add]')){const sel=button.closest('.product-card')?.querySelector('[data-product-variant]');addItem(button.dataset.add,sel?.value);}
  if(button.matches('[data-details]'))openDetails(button.dataset.details);
  if(button.matches('[data-open-cart]'))openBasket();
  if(button.matches('[data-close-cart]'))closeBasket();
  if(button.matches('[data-increase]'))changeQty(button.dataset.increase,1);
  if(button.matches('[data-decrease]'))changeQty(button.dataset.decrease,-1);
  if(button.matches('[data-remove]')){basket.delete(button.dataset.remove);renderBasket();}
  if(button.matches('[data-shopping]')){closeBasket();$('#catalogo').scrollIntoView({behavior:'smooth'});}
  if(button.matches('[data-filter]')){
    $$('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false');});
    renderProducts(button.dataset.filter);
  }
});
$('#overlay').addEventListener('click',closeBasket);
$('#closeModal').addEventListener('click',closeDetails);
$('#productModal').addEventListener('click',e=>{if(e.target===$('#productModal'))closeDetails();});
$('#modalAdd').addEventListener('click',()=>{addItem(modalId,$('#modalVariants [data-product-variant]')?.value);closeDetails();openBasket();});
$('#privacyBtn').addEventListener('click',openPrivacy);
$('#privacyClose').addEventListener('click',closePrivacy);
$('#privacyOk').addEventListener('click',closePrivacy);
$('#privacyModal').addEventListener('click',e=>{if(e.target===$('#privacyModal'))closePrivacy();});
$('#sendWhatsApp').addEventListener('click',sendWhatsApp);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeDetails();closePrivacy();closeBasket();}
  if(e.key==='Tab'){
    const activeModal = [$('#productModal'),$('#privacyModal'),$('#cartDrawer')].find(el=>el.classList.contains('open'));
    if(!activeModal)return;
    const focusable=$$('button:not([disabled]), a[href], [tabindex="0"]',activeModal).filter(el=>el.offsetParent!==null);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable.at(-1);
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  }
});
$('#mobileMenuBtn').addEventListener('click',()=>{const open=$('#navLinks').classList.toggle('open');$('#mobileMenuBtn').setAttribute('aria-expanded',String(open));});
$$('#navLinks a').forEach(link=>link.addEventListener('click',()=>{$('#navLinks').classList.remove('open');$('#mobileMenuBtn').setAttribute('aria-expanded','false');}));
$('#year').textContent=new Date().getFullYear();
renderProducts();renderBasket();
