// --- Căutare simplă în site ---
var searchIndex = [
  { title: "Acasă", url: "index.html", snippet: "Pagina principală, autor Dan Morea, cărți, poveşti despre destin şi iubire" },
  { title: "Pe urmele destinului", url: "pe-urmele-destinului.html", snippet: "Roman despre David şi Elena, destin, trădare, iubire, pierdere, fragmente din carte" },
  { title: "Ești un Înger", url: "esti-un-inger.html", snippet: "Roman despre Patrick, călătorie prin Roma Paris Londra, trandafirul negru, promisiune" },
  { title: "Păreri despre carte", url: "pareri.html", snippet: "Recenzii, păreri cititori, comentarii despre cărţi" },
  { title: "Despre autor", url: "index.html#despre", snippet: "Dan Morea, autor de romane despre destin şi iubire" },
  { title: "Contact", url: "index.html#contact", snippet: "Telefon 0745 035 088, Facebook, email, formular de contact, comandă carte" }
];

function initSiteSearch(){
  var input = document.getElementById('site-search-input');
  var results = document.getElementById('site-search-results');
  if(!input || !results) return;

  function render(list){
    results.innerHTML = '';
    if(list.length === 0){ results.style.display = 'none'; return; }
    list.forEach(function(item){
      var a = document.createElement('a');
      a.href = item.url;
      a.className = 'search-result-item';
      a.innerHTML = '<strong>' + item.title + '</strong><span>' + item.snippet + '</span>';
      results.appendChild(a);
    });
    results.style.display = 'block';
  }

  input.addEventListener('input', function(){
    var q = input.value.trim().toLowerCase();
    if(q.length === 0){ results.style.display = 'none'; return; }
    var matches = searchIndex.filter(function(item){
      return item.title.toLowerCase().indexOf(q) !== -1 || item.snippet.toLowerCase().indexOf(q) !== -1;
    });
    render(matches);
  });

  document.addEventListener('click', function(e){
    if(!e.target.closest('.search-wrap')){ results.style.display = 'none'; }
  });
}

document.addEventListener('DOMContentLoaded', initSiteSearch);

// --- Noutăți (încărcate din noutati.json, editabil din panoul de administrare) ---
function initNoutati(){
  var list = document.getElementById('noutati-list');
  if(!list) return;
  fetch('noutati.json').then(function(r){ return r.json(); }).then(function(data){
    var items = (data && data.noutati) ? data.noutati.slice() : [];
    items.sort(function(a,b){ return new Date(b.data) - new Date(a.data); });
    if(items.length === 0){
      list.innerHTML = '<p style="color:var(--parchment-dim); text-align:center;">Nu sunt noutăți momentan.</p>';
      return;
    }
    list.innerHTML = '';
    items.forEach(function(item){
      var card = document.createElement('div');
      card.className = 'news-card';
      var d = new Date(item.data);
      var dataText = isNaN(d) ? '' : d.toLocaleDateString('ro-RO', {year:'numeric', month:'long', day:'numeric'});
      card.innerHTML = '<div class="news-date">' + dataText + '</div>' +
                        '<h3>' + item.titlu + '</h3>' +
                        '<p>' + item.text + '</p>';
      list.appendChild(card);
    });
  }).catch(function(){
    list.innerHTML = '<p style="color:var(--parchment-dim); text-align:center;">Noutățile nu au putut fi încărcate.</p>';
  });
}
document.addEventListener('DOMContentLoaded', initNoutati);

// --- Conținut editabil (texte, butoane, linkuri din panoul de administrare) ---
function setText(id, value){
  var el = document.getElementById(id);
  if(el && value !== undefined && value !== null && value !== '') el.textContent = value;
}
function setLink(id, href, text){
  var el = document.getElementById(id);
  if(!el) return;
  if(href) el.setAttribute('href', href);
  if(text) el.textContent = text;
}

function initContinutAcasa(){
  if(!document.getElementById('hero-titlu')) return;
  fetch('continut-acasa.json').then(function(r){ return r.json(); }).then(function(d){
    setText('hero-titlu', d.hero_titlu);
    setText('hero-citat', d.hero_citat ? '„' + d.hero_citat + '”' : undefined);
    setText('carte1-rezumat', d.carte1_rezumat);
    setLink('carte1-amazon-btn', d.carte1_buton_amazon_link, d.carte1_buton_amazon_text ? '📖 ' + d.carte1_buton_amazon_text.replace(/^📖\s*/, '') : undefined);
    setText('carte2-rezumat', d.carte2_rezumat);
    setText('despre-text1', d.despre_text1);
    setText('despre-text2', d.despre_text2);
  }).catch(function(){});
}

function initContinutCarte(jsonFile){
  if(!document.getElementById('carte-tagline') && !document.getElementById('carte-descriere')) return;
  fetch(jsonFile).then(function(r){ return r.json(); }).then(function(d){
    setText('carte-tagline', d.tagline);
    setText('carte-descriere', d.descriere);
    setLink('carte-buton-comanda', null, d.buton_comanda_text);
    if(document.getElementById('carte-buton-amazon')){
      setLink('carte-buton-amazon', d.buton_amazon_link, d.buton_amazon_text);
    } else if(d.buton_amazon_activ && d.buton_amazon_link){
      var row = document.getElementById('carte-cta-row');
      if(row){
        var a = document.createElement('a');
        a.href = d.buton_amazon_link;
        a.className = 'btn btn-ghost';
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = d.buton_amazon_text || 'Disponibilă pe Amazon';
        row.appendChild(a);
      }
    }
  }).catch(function(){});
}

document.addEventListener('DOMContentLoaded', function(){
  initContinutAcasa();
  if(window.location.pathname.indexOf('pe-urmele-destinului') !== -1) initContinutCarte('continut-carte1.json');
  if(window.location.pathname.indexOf('esti-un-inger') !== -1) initContinutCarte('continut-carte2.json');
});

// --- Date generale (telefon, email, Facebook, poză autor) — pe toate paginile ---
function initSiteGlobal(){
  fetch('site-global.json').then(function(r){ return r.json(); }).then(function(d){
    if(d.telefon_tel){
      document.querySelectorAll('[data-site="tel"]').forEach(function(el){
        el.setAttribute('href', 'tel:' + d.telefon_tel);
      });
    }
    if(d.telefon){
      document.querySelectorAll('.site-tel-text').forEach(function(el){ el.textContent = d.telefon; });
    }
    if(d.facebook){
      document.querySelectorAll('[data-site="fb"]').forEach(function(el){ el.setAttribute('href', d.facebook); });
    }
    if(d.goodreads){
      document.querySelectorAll('[data-site="goodreads"]').forEach(function(el){ el.setAttribute('href', d.goodreads); });
    }
    if(d.email){
      document.querySelectorAll('[data-site="email"]').forEach(function(el){
        el.setAttribute('href', 'mailto:' + d.email);
        if(el.classList.contains('site-email-text')) el.textContent = d.email;
      });
    }
    if(d.autor_foto){
      document.querySelectorAll('[data-site="author-photo"]').forEach(function(el){ el.setAttribute('src', d.autor_foto); });
    }
  }).catch(function(){});
}
document.addEventListener('DOMContentLoaded', initSiteGlobal);

// --- Galerie de fragmente (poză + citat), editabilă din panou ---
function initFragmente(){
  var list = document.getElementById('fragmente-list');
  if(!list) return;
  var file = list.getAttribute('data-file');
  if(!file) return;
  fetch(file).then(function(r){ return r.json(); }).then(function(d){
    var items = (d && d.fragmente) ? d.fragmente : [];
    if(items.length === 0){
      list.innerHTML = '<p style="color:var(--parchment-dim); text-align:center; grid-column:1/-1;">Nu sunt fragmente momentan.</p>';
      return;
    }
    list.innerHTML = '';
    items.forEach(function(item){
      var card = document.createElement('div');
      var hasImg = item.imagine && item.imagine.trim() !== '';
      card.className = 'fragment-card' + (hasImg ? ' wide' : '');
      var textHtml = '<p>' + item.text + '</p><p class="fragment-note">— din carte</p>';
      if(hasImg){
        card.innerHTML = '<div class="fragment-inner"><img src="' + item.imagine + '" alt="Fragment din carte"><div class="fragment-body">' + textHtml + '</div></div>';
      } else {
        card.innerHTML = '<div class="fragment-body" style="padding-top:32px;">' + textHtml + '</div>';
      }
      list.appendChild(card);
    });
  }).catch(function(){
    list.innerHTML = '<p style="color:var(--parchment-dim); text-align:center; grid-column:1/-1;">Fragmentele nu au putut fi încărcate.</p>';
  });
}
document.addEventListener('DOMContentLoaded', initFragmente);

// Google Translate injects an inline "top" offset on <html>/<body> to make room
// for its own banner, which pushes our sticky header down/behind it. We watch
// for that and force it back to 0 continuously, since our CSS alone can't
// out-rank an inline style with the same !important priority.
(function fixGoogleTranslateOffset(){
  function reset(){
    document.documentElement.style.top = '0px';
    document.body.style.top = '0px';
  }
  reset();
  var observer = new MutationObserver(reset);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
})();
