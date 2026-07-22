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
