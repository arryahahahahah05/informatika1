/* ============================
   PIXAR MOVIE PICKER — ALL IN ONE
   Features:
   - poster, rating, review per film
   - genre filter, search, sort
   - modal detail with trailer link
   - favorites (localStorage), export/import JSON
   - dark/light mode persisted
   - lazy image loading via loading="lazy"
   ============================ */

/* -------------- DATA -------------- */
/* contoh data lengkap — tiap film punya: title, genres (array), poster, rating, year, review */
const MOVIES = [
  { title: "Toy Story", genres: ["Adventure","Comedy","Family"], poster: "https://i.imgur.com/Zq8xk5u.jpeg", rating: 8.3, year: 1995, review: "Klasik Pixar tentang persahabatan mainan. Lucu, hangat, dan penuh imajinasi." },
  { title: "Toy Story 2", genres: ["Adventure","Comedy","Family"], poster: "https://i.imgur.com/Zq8xk5u.jpeg", rating: 7.9, year: 1999, review: "Melanjutkan kisah Woody & kawan-kawan dengan emosi dan aksi yang memikat." },
  { title: "Toy Story 3", genres: ["Adventure","Comedy","Family"], poster: "https://i.imgur.com/Zq8xk5u.jpeg", rating: 8.3, year: 2010, review: "Perpisahan yang menyentuh — sangat emosional dan memuaskan." },
  { title: "A Bug's Life", genres: ["Adventure","Comedy"], poster: "https://i.imgur.com/Kk7Du7Q.jpeg", rating: 7.2, year: 1998, review: "Kisah kecil-kecilan dengan pesan keberanian yang menyenangkan." },
  { title: "Monsters, Inc.", genres: ["Comedy","Family","Fantasy"], poster: "https://i.imgur.com/3rQmW6t.jpeg", rating: 8.1, year: 2001, review: "Mencampurkan komedi & hati — ikonik dan hangat." },
  { title: "Finding Nemo", genres: ["Adventure","Family"], poster: "https://i.imgur.com/7Qp1Z8H.jpeg", rating: 8.1, year: 2003, review: "Petualangan ayah mencari anaknya, indah dan mengharukan." },
  { title: "The Incredibles", genres: ["Action","Superhero","Family"], poster: "https://i.imgur.com/1f6KfQ0.jpeg", rating: 8.0, year: 2004, review: "Keluarga pahlawan dengan cerita yang solid & adegan aksi keren." },
  { title: "Ratatouille", genres: ["Comedy","Family"], poster: "https://i.imgur.com/ObK3fOi.jpeg", rating: 8.0, year: 2007, review: "Tikus jadi koki? Kreatif, manis, dan sangat inspiratif." },
  { title: "WALL-E", genres: ["Sci-Fi","Romance","Adventure"], poster: "https://i.imgur.com/9QK3v3o.jpeg", rating: 8.4, year: 2008, review: "Robot kecil dengan kisah cinta & pesan lingkungan yang kuat." },
  { title: "Up", genres: ["Adventure","Drama","Family"], poster: "https://i.imgur.com/2YzZL5a.jpeg", rating: 8.2, year: 2009, review: "Emosional, lucu, dan visual yang menakjubkan — kisah hidup & harapan." },
  { title: "Brave", genres: ["Adventure","Fantasy","Family"], poster: "https://i.imgur.com/5X6Vw4A.jpeg", rating: 7.1, year: 2012, review: "Legenda keluarga & keberanian dengan visual Celtic yang cantik." },
  { title: "Inside Out", genres: ["Drama","Family","Fantasy"], poster: "https://i.imgur.com/8I3vQ4E.jpeg", rating: 8.2, year: 2015, review: "Pandangan orisinal ke emosi manusia — menyentuh & jenius." },
  { title: "Coco", genres: ["Fantasy","Family","Music"], poster: "https://i.imgur.com/4YzE8gP.jpeg", rating: 8.4, year: 2017, review: "Perayaan keluarga & musik, mengharukan dan visual spektakuler." },
  { title: "Soul", genres: ["Drama","Fantasy","Music"], poster: "https://i.imgur.com/7h2Dk0L.jpeg", rating: 8.1, year: 2020, review: "Refleksi mendalam tentang makna hidup & panggilan jiwa." },
  { title: "Luca", genres: ["Adventure","Coming-of-Age","Fantasy"], poster: "https://i.imgur.com/6YwPq7P.jpeg", rating: 7.5, year: 2021, review: "Hangat, penuh warna, tentang persahabatan dan penerimaan." },
  { title: "Turning Red", genres: ["Comedy","Family","Coming-of-Age"], poster: "https://i.imgur.com/9d8Kxq3.jpeg", rating: 7.0, year: 2022, review: "Unik, lucu, & jujur tentang masa remaja." },
  { title: "Lightyear", genres: ["Sci-Fi","Action","Space"], poster: "https://i.imgur.com/o2Y9h3W.jpeg", rating: 6.8, year: 2022, review: "Sci-fi aksi yang mencoba memperluas mitos Buzz Lightyear." },
  { title: "Elemental", genres: ["Fantasy","Family"], poster: "https://i.imgur.com/e7S4rN1.jpeg", rating: 6.5, year: 2023, review: "Premis menarik tentang elemen hidup & hubungan antarwujud." }
];

/* -------------- STATE & KEYS -------------- */
const LS_FAV_KEY = 'pixar_favs_v1';
const LS_LIGHT_KEY = 'pixar_light_v1';
let state = {
  query: '',
  genre: '',
  sort: 'popular',
  favs: JSON.parse(localStorage.getItem(LS_FAV_KEY) || '[]')
};

/* -------------- DOM -------------- */
const el = {
  search: document.getElementById('searchInput'),
  genre: document.getElementById('genreSelect'),
  sort: document.getElementById('sortSelect'),
  grid: document.getElementById('grid'),
  favList: document.getElementById('favList'),
  resultCount: document.getElementById('resultCount'),
  activeFilters: document.getElementById('activeFilters'),
  exportBtn: document.getElementById('exportBtn'),
  importFile: document.getElementById('importFile'),
  toggleDark: document.getElementById('toggleDark'),
  modal: document.getElementById('modal'),
  modalPoster: document.getElementById('modalPoster'),
  modalTitle: document.getElementById('modalTitle'),
  modalMeta: document.getElementById('modalMeta'),
  modalRating: document.getElementById('modalRating'),
  modalReview: document.getElementById('modalReview'),
  modalFav: document.getElementById('modalFav'),
  modalTrailer: document.getElementById('modalTrailer'),
  closeModalBtn: document.getElementById('closeModal')
};

/* -------------- HELPERS -------------- */
function uniqueGenres(movies){
  const s = new Set();
  movies.forEach(m => m.genres.forEach(g => s.add(g)));
  return Array.from(s).sort();
}
function saveFavs(){ localStorage.setItem(LS_FAV_KEY, JSON.stringify(state.favs)); }
function setLightMode(on){ document.body.classList.toggle('light', !!on); localStorage.setItem(LS_LIGHT_KEY, on ? '1' : '0'); }

/* -------------- RENDER UI -------------- */
function populateGenres(){
  const genres = uniqueGenres(MOVIES);
  el.genre.innerHTML = '<option value=\"\">Semua Genre</option>' + genres.map(g => `<option value="${g}">${g}</option>`).join('');
}
function renderGrid(){
  const q = state.query.trim().toLowerCase();
  let list = MOVIES.filter(m => {
    const matchesQ = !q || m.title.toLowerCase().includes(q);
    const matchesG = !state.genre || m.genres.includes(state.genre);
    return matchesQ && matchesG;
  });

  // Sorting
  if(state.sort === 'rating_desc') list.sort((a,b) => b.rating - a.rating);
  else if(state.sort === 'rating_asc') list.sort((a,b) => a.rating - b.rating);
  else if(state.sort === 'title_az') list.sort((a,b) => a.title.localeCompare(b.title));
  else if(state.sort === 'title_za') list.sort((a,b) => b.title.localeCompare(a.title));
  else if(state.sort === 'year_desc') list.sort((a,b) => b.year - a.year);

  el.grid.innerHTML = '';
  el.resultCount.textContent = list.length;
  el.activeFilters.textContent = (state.genre ? `Genre: ${state.genre}` : '') + (state.query ? ` ${state.query ? '•' : ''} Cari: "${state.query}"` : '');

  if(list.length === 0){
    el.grid.innerHTML = `<div class="card"><div class="body"><div class="title muted">Tidak ditemukan</div><div class="muted">Coba kata kunci berbeda atau pilih genre lain.</div></div></div>`;
    return;
  }

  list.forEach(m => {
    const isFav = state.favs.includes(m.title);
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="poster" loading="lazy" src="${m.poster}" alt="${escapeHtml(m.title)}">
      <div class="body">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div class="title">${escapeHtml(m.title)}</div>
            <div class="meta">${m.genres.join(' • ')} • ${m.year}</div>
          </div>
          <div style="text-align:right">
            <div class="small">⭐ ${m.rating}</div>
            <div style="margin-top:6px">
              <button class="btn small detail-btn" data-title="${escapeAttr(m.title)}">Detail</button>
            </div>
          </div>
        </div>
        <div class="desc" style="margin-top:8px">${escapeHtml(truncate(m.review, 120))}</div>
        <div class="row" style="margin-top:auto">
          <button class="btn ghost fav-toggle" data-title="${escapeAttr(m.title)}">${isFav ? '❤ Favorit' : '♡ Simpan'}</button>
          <a class="btn" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' trailer')}">Trailer</a>
        </div>
      </div>
    `;
    el.grid.appendChild(card);
  });

  // attach delegated handlers: detail & fav
  // detail buttons
  el.grid.querySelectorAll('.detail-btn').forEach(b => {
    b.addEventListener('click', e => {
      const title = e.currentTarget.getAttribute('data-title');
      openModal(title);
    });
  });
  // fav toggles
  el.grid.querySelectorAll('.fav-toggle').forEach(b => {
    b.addEventListener('click', e => {
      const title = e.currentTarget.getAttribute('data-title');
      toggleFavorite(title);
      renderFavs();
      renderGrid(); // refresh labels
    });
  });
}

/* -------------- MODAL -------------- */
function openModal(title){
  const movie = MOVIES.find(m => m.title === title);
  if(!movie) return;
  el.modalPoster.src = movie.poster;
  el.modalTitle.textContent = movie.title;
  el.modalMeta.textContent = `${movie.genres.join(' • ')} • ${movie.year}`;
  el.modalRating.textContent = `⭐ ${movie.rating}`;
  el.modalReview.textContent = movie.review;
  el.modalFav.textContent = state.favs.includes(movie.title) ? '❤ Favorit' : '♡ Simpan';
  el.modalTrailer.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`;
  el.modal.setAttribute('aria-hidden','false');
  el.modal.style.display = 'flex';
}
function closeModal(){
  el.modal.setAttribute('aria-hidden','true');
  el.modal.style.display = 'none';
}
el.closeModalBtn.addEventListener('click', closeModal);
el.modal.addEventListener('click', (e) => { if(e.target === el.modal) closeModal(); });

el.modalFav.addEventListener('click', ()=> {
  const title = el.modalTitle.textContent;
  toggleFavorite(title);
  el.modalFav.textContent = state.favs.includes(title) ? '❤ Favorit' : '♡ Simpan';
  renderFavs();
  renderGrid();
});

/* -------------- FAVORITES -------------- */
function toggleFavorite(title){
  if(state.favs.includes(title)) state.favs = state.favs.filter(t => t !== title);
  else state.favs.push(title);
  saveFavs();
}
function renderFavs(){
  el.favList.innerHTML = '';
  if(state.favs.length === 0){
    el.favList.innerHTML = '<li class="muted">(Belum ada favorit)</li>'; return;
  }
  state.favs.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    li.style.cursor = 'pointer';
    li.addEventListener('click', ()=> openModal(t));
    el.favList.appendChild(li);
  });
}

/* -------------- EXPORT / IMPORT -------------- */
el.exportBtn.addEventListener('click', ()=> {
  const data = { movies: MOVIES, favorites: state.favs };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'pixar_data.json'; a.click(); URL.revokeObjectURL(url);
});

el.importFile.addEventListener('change', e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const data = JSON.parse(ev.target.result);
      if(Array.isArray(data.movies)){
        // merge by title (avoid dup)
        data.movies.forEach(m => {
          if(!MOVIES.some(x => x.title === m.title)) MOVIES.push(m);
        });
        populateGenres(); renderGrid();
        alert('Import berhasil: film ditambahkan (tidak mengganti yang ada).');
      }
      if(Array.isArray(data.favorites)){
        state.favs = data.favorites; saveFavs(); renderFavs();
      }
    } catch(err){
      alert('File JSON tidak valid.');
    }
  };
  reader.readAsText(file);
});

/* -------------- SEARCH / FILTER / SORT EVENTS -------------- */
el.search.addEventListener('input', e => { state.query = e.target.value; renderGrid(); });
el.genre.addEventListener('change', e => { state.genre = e.target.value; renderGrid(); });
el.sort.addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });

/* -------------- DARK MODE -------------- */
const savedLight = localStorage.getItem(LS_LIGHT_KEY) === '1';
setLightMode(savedLight);
el.toggleDark.addEventListener('click', ()=> {
  const on = !document.body.classList.contains('light');
  setLightMode(on);
});

/* -------------- UTIL -------------- */
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
function escapeAttr(str){ return String(str).replace(/"/g,'&quot;'); }
function truncate(str, n){ return str.length > n ? str.slice(0,n-1) + '…' : str; }

/* -------------- INIT -------------- */
populateGenres();
renderGrid();
renderFavs();

/* Accessibility: close modal with Escape */
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });
