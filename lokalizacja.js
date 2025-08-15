// ===== DANE: mapowane ID z atrybutu data-id w HTML =====
// Uzupełnij lat/lng, gdy będziesz miał współrzędne.
const PLACES = [
  // PRZEDSZKOLA
  { id: 'dobczyn-przedszkole', name: 'DOBCZYN (Przedszkole)', address: 'Mazowiecka 67, 05-205 Dobczyn', lat: 52.387061, lng: 21.299757 },
  { id: 'stary-kraszew-przedszkole', name: 'STARY KRASZEW (Przedszkole)', address: 'Szkolna 5, 05-205 Stary Kraszew', lat: 52.40248, lng: 21.264237 },
  { id: 'wolomin-aln', name: 'WOŁOMIN (Przedszkole)', address: 'Al. Niepodległości 19, 05-200 Wołomin', lat: 52.352849, lng: 21.26031 },
  { id: 'klembow-przedszkole', name: 'KLEMBÓW (Przedszkole)', address: 'Żymirskiego 68, 05-205 Klembów', lat: 52.405988, lng: 21.328253 },
  { id: 'kobylka-przedszkole', name: 'KOBYŁKA (Przedszkole)', address: 'ul. Oleńki 3, 05–230 Kobyłka', lat: 52.343516, lng: 21.176027 },
  { id: 'warszawa-bialoleka', name: 'WARSZAWA BIAŁOŁĘKA (Przedszkole)', address: 'Marywilska 60e, 03-042 Warszawa', lat: 52.319887, lng: 21.000046 },
  { id: 'miase-przedszkole', name: 'MIĄSE (Przedszkole)', address: 'Kardynała Wyszyńskiego 44, 05-240 Miąse', lat: 52.396834, lng: 21.438288 },
  { id: 'wolomin-kurkowa', name: 'WOŁOMIN (Przedszkole)', address: 'Kurkowa 15, 05-200 Wołomin', lat: 52.338172, lng: 21.235497 },
  { id: 'marki-rocha', name: 'MARKI (Przedszkole)', address: 'Rocha Kowalskiego 59a, 05-270 Marki', lat: 52.320748, lng: 21.078751 },

  // SZKOŁY
  { id: 'dobczyn-szkola', name: 'DOBCZYN (Szkoła)', address: 'Mazowiecka 67, 05-205 Dobczyn', lat: 52.387061, lng: 21.299757 },
  { id: 'stary-kraszew-szkola', name: 'STARY KRASZEW (Szkoła)', address: 'Szkolna 5, 05-205 Stary Kraszew', lat: 52.40248, lng: 21.264237 },
  { id: 'marki-mickiewicza', name: 'MARKI (Szkoła)', address: 'Adama Mickiewicza, 05-270 Marki', lat: 52.321794, lng: 21.094334 },
  { id: 'miase-szkola', name: 'MIĄSE (Szkoła)', address: 'Kardynała Wyszyńskiego 44, 05-240 Miąse', lat: 52.396834, lng: 21.438288 },
  { id: 'ostrowek-szkola', name: 'OSTRÓWEK (Szkoła)', address: 'Warszawska 2, 05-205 Ostrówek', lat: 52.388834, lng: 21.373199 },
  { id: 'zagoszyniec-szkola', name: 'ZAGOŚCINIEC (Szkoła)', address: 'Szkolna 1, 05-200 Zagościniec', lat: 52.373071, lng: 21.270278 },
];

// ===== MAPA (Leaflet) =====
const map = L.map('map', { zoomControl: true, scrollWheelZoom: true });

// Kafelki OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Utwórz markery tylko dla miejsc z wypełnionymi współrzędnymi
const markers = new Map();
const bounds = L.latLngBounds();

PLACES.forEach(p => {
  if (typeof p.lat === 'number' && typeof p.lng === 'number') {
    const m = L.marker([p.lat, p.lng]).addTo(map);
    m.bindPopup(`<strong>${p.name}</strong><br>${p.address}`);
    markers.set(p.id, m);
    bounds.extend([p.lat, p.lng]);
  }
});

// Ustaw widok — jeśli nie ma żadnego markera, pokaż domyślnie okolicę Warszawy
if (bounds.isValid()) {
  map.fitBounds(bounds.pad(0.15));
} else {
  map.setView([52.291, 21.05], 11); // okolice północno-wsch. aglomeracji (Białołęka/wołomiński)
}

// ===== Lista do panelu (pozycje z PLACES) =====
const listEl = document.getElementById('locationsList');
const searchEl = document.getElementById('locationSearch');

function renderList(items) {
  listEl.innerHTML = "";
  items.forEach(p => {
    const li = document.createElement('li');
    li.className = 'locations-item';
    li.innerHTML = `<h3>${p.name}</h3><p>${p.address}</p>`;
    li.addEventListener('click', () => focusPlace(p.id));
    listEl.appendChild(li);
  });
}

function filterList() {
  const q = (searchEl.value || "").trim().toLowerCase();
  const filtered = PLACES.filter(p =>
    p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
  );
  renderList(filtered);

  // Dopasuj mapę do przefiltrowanych (tylko jeśli mają współrzędne)
  const fb = L.latLngBounds();
  filtered.forEach(p => {
    if (typeof p.lat === 'number' && typeof p.lng === 'number') {
      fb.extend([p.lat, p.lng]);
    }
  });
  if (fb.isValid()) map.fitBounds(fb.pad(0.2));
}

searchEl.addEventListener('input', filterList);
renderList(PLACES);

// ===== Klik w kartę oddziału (sekcje na dole) =====
document.querySelectorAll('.branch').forEach(el => {
  el.addEventListener('click', () => {
    const id = el.getAttribute('data-id');
    focusPlace(id);
  });
});

// Subtelny komunikat na dole ekranu
let hintTimer = null;
function showHint(msg) {
  let el = document.querySelector('.hint');
  if (!el) {
    el = document.createElement('div');
    el.className = 'hint';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

function focusPlace(id) {
  const place = PLACES.find(p => p.id === id);
  if (!place) return;

  const marker = markers.get(id);
  if (marker) {
    map.setView([place.lat, place.lng], Math.max(map.getZoom(), 15), { animate: true });
    marker.openPopup();
  } else {
    showHint('Brak współrzędnych. Uzupełnij lat/lng w lokalizacja.js dla tego adresu.');
  }
}


