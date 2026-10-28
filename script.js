const STORAGE_KEY = "udIdealTresSiteDataV1";

const initialData = {
  players: [
    { id: 1, name: "Nombre del jugador", number: 1, position: "Portero", team: "Juvenil" },
    { id: 2, name: "Nombre del jugador", number: 4, position: "Defensa", team: "Juvenil" },
    { id: 3, name: "Nombre del jugador", number: 8, position: "Centrocampista", team: "Juvenil" },
    { id: 4, name: "Nombre del jugador", number: 9, position: "Delantero", team: "Juvenil" }
  ],
  matches: [
    { id: 1, opponent: "Equipo rival", date: "", time: "20:30", venue: "Campo por confirmar", competition: "Segunda Juvenil", score: "" },
    { id: 2, opponent: "Próximo rival", date: "", time: "12:00", venue: "Campo por confirmar", competition: "Segunda Regional", score: "" }
  ],
  news: [
    { id: 1, title: "¡Bienvenidos a la web del club!", date: "", body: "Aquí publicaremos las noticias, los avisos y las novedades de la U.D. Ideal Tres. Edita o sustituye este texto desde el panel de administración." },
    { id: 2, title: "Una nueva temporada juntos", date: "", body: "Comienza una nueva etapa para seguir trabajando, creciendo y defendiendo nuestros colores con orgullo." },
    { id: 3, title: "Gracias por vuestro apoyo", date: "", body: "La afición, las familias y los patrocinadores forman parte de esta gran familia. ¡Gracias por estar siempre ahí!" }
  ],
  sponsors: [
    { id: 1, name: "Tu patrocinador", url: "" },
    { id: 2, name: "Empresa colaboradora", url: "" }
  ]
};

let data = loadData();
let selectedTeam = "Todos";

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.warn("No se pudieron cargar los datos guardados.", error);
  }
  return structuredClone(initialData);
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showMessage("Cambios guardados en este navegador.");
  } catch (error) {
    showMessage("No se pudieron guardar los datos. Comprueba el navegador.");
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function formatDate(value) {
  if (!value) return "Fecha por confirmar";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function renderMatches() {
  const sorted = [...data.matches].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const upcoming = sorted.find(match => !match.score) || sorted[0];

  document.getElementById("featuredMatch").innerHTML = upcoming ? `
    <div class="team-block"><div class="team-mark">UD<br>IT</div><strong>U.D. IDEAL TRES</strong><small>LOCAL / VISITANTE SEGÚN JORNADA</small></div>
    <div class="versus"><b>${upcoming.score ? escapeHTML(upcoming.score) : "VS"}</b><span>${upcoming.score ? "RESULTADO" : "PRÓXIMO ENCUENTRO"}</span></div>
    <div class="team-block"><div class="team-mark">FC</div><strong>${escapeHTML(upcoming.opponent)}</strong><small>${escapeHTML(upcoming.competition || "Partido de liga")}</small></div>
    <div class="match-info"><span>▦ ${escapeHTML(formatDate(upcoming.date))}</span><span>◷ ${escapeHTML(upcoming.time || "Hora por confirmar")}</span><span>⌖ ${escapeHTML(upcoming.venue || "Campo por confirmar")}</span></div>` :
    `<div class="empty-state">Todavía no hay partidos. Añade uno desde Administración.</div>`;

  document.getElementById("matchesTable").innerHTML = sorted.length ? sorted.map(match => `
    <tr><td>${escapeHTML(formatDate(match.date))}${match.time ? ` · ${escapeHTML(match.time)}` : ""}</td>
    <td><strong>U.D. Ideal Tres</strong> — ${escapeHTML(match.opponent)}</td>
    <td>${escapeHTML(match.competition || "—")}</td>
    <td>${match.score ? `<span class="status">${escapeHTML(match.score)}</span>` : `<span class="status">Pendiente</span>`}<button class="remove-btn" data-remove-match="${match.id}" aria-label="Eliminar partido">Eliminar</button></td></tr>`).join("") :
    `<tr><td colspan="4">No hay partidos guardados.</td></tr>`;
}

function renderPlayers() {
  const grid = document.getElementById("playersGrid");
  const visiblePlayers = selectedTeam === "Todos" ? data.players : data.players.filter(player => player.team === selectedTeam);
  grid.innerHTML = visiblePlayers.length ? visiblePlayers.map(player => `
    <article class="player-card">
      <div class="player-art"><span class="player-number">${escapeHTML(player.number)}</span><span class="player-silhouette">●</span></div>
      <div class="player-info"><small>${escapeHTML(player.position)} · ${escapeHTML(player.team || "Primer equipo")}</small><h3>${escapeHTML(player.name)}</h3><p>Dorsal ${escapeHTML(player.number)} <button class="remove-btn" data-remove-player="${player.id}">Eliminar</button></p></div>
    </article>`).join("") : `<p class="empty-state">Todavía no hay jugadores. Añade la plantilla desde Administración.</p>`;
}

function renderNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = data.news.length ? data.news.slice().reverse().slice(0, 6).map(item => `
    <article class="news-card"><div class="news-image">UD · IT</div><div class="news-content"><small>${escapeHTML(formatDate(item.date))}</small><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.body)}</p><button class="remove-btn" data-remove-news="${item.id}">Eliminar noticia</button></div></article>`).join("") :
    `<p class="empty-state">Todavía no hay noticias publicadas.</p>`;
}

function renderSponsors() {
  document.getElementById("sponsorsList").innerHTML = data.sponsors.length ? data.sponsors.map(sponsor => {
    const name = escapeHTML(sponsor.name);
    const safeUrl = /^https?:\/\//i.test(sponsor.url || "") ? escapeHTML(sponsor.url) : "";
    return `<div class="sponsor-logo">${safeUrl ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${name}</a>` : name}<button class="remove-btn" data-remove-sponsor="${sponsor.id}">×</button></div>`;
  }).join("") : `<p class="empty-state">Añade patrocinadores desde Administración.</p>`;
}

function renderAll() {
  renderMatches();
  renderPlayers();
  renderNews();
  renderSponsors();
  document.getElementById("year").textContent = new Date().getFullYear();
}

function showMessage(message) {
  const target = document.getElementById("adminMessage");
  target.textContent = message;
  window.setTimeout(() => { if (target.textContent === message) target.textContent = ""; }, 4500);
}

document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("mainNav").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
}));

document.querySelectorAll(".team-filter").forEach(button => button.addEventListener("click", () => {
  selectedTeam = button.dataset.teamFilter;
  document.querySelectorAll(".team-filter").forEach(item => item.classList.toggle("active", item === button));
  renderPlayers();
}));

document.querySelectorAll(".admin-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".admin-tab").forEach(item => item.classList.toggle("active", item === tab));
  document.querySelectorAll(".admin-panel").forEach(panel => panel.classList.toggle("active", panel.id === tab.dataset.tab));
}));

document.getElementById("playerForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  data.players.push({ id: Date.now(), name: form.get("name").trim(), number: form.get("number"), position: form.get("position"), team: form.get("team").trim() });
  saveData(); renderPlayers(); event.currentTarget.reset();
});

document.getElementById("matchForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  data.matches.push({ id: Date.now(), opponent: form.get("opponent").trim(), date: form.get("date"), time: form.get("time"), venue: form.get("venue").trim() || "Campo por confirmar", competition: form.get("competition").trim(), score: form.get("score").trim() });
  saveData(); renderMatches(); event.currentTarget.reset();
});

document.getElementById("newsForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  data.news.push({ id: Date.now(), title: form.get("title").trim(), date: form.get("date"), body: form.get("body").trim() });
  saveData(); renderNews(); event.currentTarget.reset();
});

document.getElementById("sponsorForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  data.sponsors.push({ id: Date.now(), name: form.get("name").trim(), url: form.get("url").trim() });
  saveData(); renderSponsors(); event.currentTarget.reset();
});

document.addEventListener("click", event => {
  const playerId = event.target.dataset.removePlayer;
  const matchId = event.target.dataset.removeMatch;
  const newsId = event.target.dataset.removeNews;
  const sponsorId = event.target.dataset.removeSponsor;
  if (playerId) { data.players = data.players.filter(item => item.id !== Number(playerId)); saveData(); renderPlayers(); }
  if (matchId) { data.matches = data.matches.filter(item => item.id !== Number(matchId)); saveData(); renderMatches(); }
  if (newsId) { data.news = data.news.filter(item => item.id !== Number(newsId)); saveData(); renderNews(); }
  if (sponsorId) { data.sponsors = data.sponsors.filter(item => item.id !== Number(sponsorId)); saveData(); renderSponsors(); }
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "ud-ideal-tres-datos.json"; link.click();
  URL.revokeObjectURL(url);
  showMessage("Copia de datos exportada.");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!window.confirm("¿Quieres restaurar los datos de ejemplo? Se perderán los cambios guardados en este navegador.")) return;
  data = structuredClone(initialData);
  saveData(); renderAll();
});

renderAll();
