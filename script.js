'use strict';

const PRODUCTS = [
  {
    id: 'amendoleite', name: 'Amendoleite', category: 'doces', categoryLabel: 'Doce de amendoim',
    subtitle: 'Doce de amendoim com leite, no pote apresentado nas fotos da marca.',
    description: 'O Amendoleite é identificado na embalagem como “Doce de Amendoim com Leite”. Consulte peso, composição, alergênicos, disponibilidade e preço com a equipe.',
    image: 'assets/amendoleite-recorte.webp', imageAlt: 'Pote de Amendoleite Doces Gu Premium sem fundo', theme: 'amendoleite', label: 'Em destaque', notice: 'Peso, preço e condições sob consulta.'
  },
  {
    id: 'pacoca', name: 'Paçoca Caseira Premium 90g', category: 'doces', categoryLabel: 'Paçoca premium',
    subtitle: 'A paçoca caseira premium de 90g apresentada no catálogo da marca.',
    description: 'Paçoca Caseira Premium 90g. O catálogo informa “mais amendoim” e “menos açúcar”, sem apresentar valores nutricionais comparativos. Consulte informações de rótulo e preço com a equipe.',
    image: 'assets/pacoca-premium.webp', imageAlt: 'Paçocas Caseiras Premium da Doces Gu Premium, em embalagens individuais', theme: 'pacoca', label: 'Clássico', notice: '90g por unidade conforme o catálogo.'
  },
  {
    id: 'caixa', name: 'Caixa com 4 espetos', category: 'revenda', categoryLabel: 'Linha de revenda',
    subtitle: 'Caixa de paçocas para revendedores, com 4 espetos.',
    description: 'O catálogo original apresenta caixa com 4 espetos de Paçoca Caseira Premium. Cada espeto é identificado com 30 unidades. Consulte disponibilidade e condições comerciais.',
    image: 'assets/caixa-revenda.webp', imageAlt: 'Caixa de doces da marca Doces Gu Premium', theme: 'box', label: 'Para revenda', notice: '4 espetos por caixa, conforme o catálogo.'
  },
  {
    id: 'espeto', name: 'Espeto com 30 unidades', category: 'revenda', categoryLabel: 'Linha de revenda',
    subtitle: 'Formato com 30 unidades de paçoca por espeto.',
    description: 'Apresentação em espeto com 30 unidades, conforme o catálogo da Paçoca Caseira Premium 90g. Consulte a equipe para confirmar condições e disponibilidade.',
    image: 'assets/espeto-pacoca.webp', imageAlt: 'Espetos de paçocas em embalagens individuais', theme: 'espeto', label: 'Para revenda', notice: '30 unidades por espeto, conforme o catálogo.'
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

function renderProducts(filter = 'todos') {
  const list = PRODUCTS.filter(p => filter === 'todos' || p.category === filter);
  $('#productGrid').innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-photo is-${p.theme}"><span class="product-label">${esc(p.label)}</span>${artFor(p)}</div>
      <div class="product-body">
        <span class="product-category">${esc(p.categoryLabel)}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.subtitle)}</p>
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

function totalItems() {return [...basket.values()].reduce((a,b) => a+b,0);}
function toast(msg) {
  const el = $('#toast'); el.textContent = msg;
  el.classList.add('show'); clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2500);
}
function changeQty(id, delta) {
  if (!productById(id)) return;
  const next = Math.max(0, Math.min(99, (basket.get(id) || 0) + delta));
  if (next === 0) basket.delete(id); else basket.set(id, next);
  renderBasket();
}
function addItem(id) {
  changeQty(id, 1);
  toast(`${productById(id).name} adicionado ao pedido`);
}
function renderBasket() {
  const count = totalItems();
  $('#cartCount').textContent = count;
  $('#drawerCount').textContent = `(${count})`;
  $('#cartItems').innerHTML = !count ? `<div class="cart-empty"><svg class="icon"><use href="#i-bag"/></svg><strong>Seu pedido está vazio</strong><p>Adicione seus doces favoritos pelo catálogo para solicitar um orçamento.</p><button class="btn btn-outline" type="button" data-shopping>Ver produtos <svg class="icon"><use href="#i-arrow"/></svg></button></div>` :
    [...basket].map(([id,qty]) => {
      const p = productById(id);
      return `<div class="cart-item"><div class="cart-item-img">${artFor(p)}</div><div><button type="button" class="cart-remove" data-remove="${id}">Remover</button><h3>${esc(p.name)}</h3><small>Preço sob consulta</small><div class="qty-control"><button type="button" data-decrease="${id}" aria-label="Diminuir ${esc(p.name)}"><svg class="icon"><use href="#i-minus"/></svg></button><span>${qty}</span><button type="button" data-increase="${id}" aria-label="Aumentar ${esc(p.name)}"><svg class="icon"><use href="#i-plus"/></svg></button></div></div></div>`;
    }).join('');
  $('#sendWhatsApp').disabled = count === 0;
}
let lastFocus = null;
function lockBody(){document.body.classList.add('no-scroll');}
function unlockBody(){if (!$('#cartDrawer').classList.contains('open') && !$('#productModal').classList.contains('open') && !$('#privacyModal').classList.contains('open')) document.body.classList.remove('no-scroll');}
function openBasket(){closeDetails();closePrivacy();lastFocus=document.activeElement;$('#overlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');lockBody();$('[data-close-cart]').focus();}
function closeBasket(){const isOpen = $('#cartDrawer').classList.contains('open');$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');$('#overlay').hidden=true;unlockBody();if (isOpen && lastFocus && lastFocus.isConnected) lastFocus.focus();}
let modalId;
function openDetails(id){const p=productById(id);if(!p)return;closeBasket();closePrivacy();lastFocus=document.activeElement;modalId=id;$('#modalTitle').textContent=p.name;$('#modalDescription').textContent=p.description;$('#modalNotice').textContent=p.notice;$('#modalImage').innerHTML=artFor(p);$('#productModal').classList.add('open');$('#productModal').setAttribute('aria-hidden','false');lockBody();$('#closeModal').focus();}
function closeDetails(){const hadOpen=$('#productModal').classList.contains('open');$('#productModal').classList.remove('open');$('#productModal').setAttribute('aria-hidden','true');unlockBody();if(hadOpen && lastFocus && lastFocus.isConnected)lastFocus.focus();}
function openPrivacy(){closeBasket();closeDetails();lastFocus=document.activeElement;$('#privacyModal').classList.add('open');$('#privacyModal').setAttribute('aria-hidden','false');lockBody();$('#privacyClose').focus();}
function closePrivacy(){const hadOpen=$('#privacyModal').classList.contains('open');$('#privacyModal').classList.remove('open');$('#privacyModal').setAttribute('aria-hidden','true');unlockBody();if(hadOpen && lastFocus && lastFocus.isConnected)lastFocus.focus();}
function sendWhatsApp(){if(!basket.size)return;const lines=[
 'Olá! Vim pelo catálogo da Doces Gu Premium e gostaria de consultar preços e disponibilidade:',
 '', ...[...basket].map(([id,qty])=>`• ${productById(id).name} — quantidade: ${qty}`),
 '', 'Por favor, informem os valores, as condições e as opções de entrega. Obrigado!'
];window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener,noreferrer');}

// Delegated click handlers also cover cards generated by the category filters.
document.addEventListener('click', e => {
  const button=e.target.closest('button');
  if(!button)return;
  if(button.matches('[data-add]'))addItem(button.dataset.add);
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
$('#modalAdd').addEventListener('click',()=>{addItem(modalId);closeDetails();openBasket();});
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
