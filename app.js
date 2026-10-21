/**
 * League of Legends - Pruebas del Invocador
 * Lógica principal de la pantalla de inicio
 */

// ========================================
// ESTADO GLOBAL
// ========================================
const GameState = {
    mode: null, // 'serious' | 'warning'
    currentTest: 0,
    score: { serious: 0, warning: 0 },
    tests: [],
    trollHintsFound: new Set()
};

// ========================================
// DATOS: CAMPEONES PARA SILUETAS
// ========================================
const CHAMPIONS = [
    // Equipo Azul (iconos azules)
    { id: 'ahri', name: 'Ahri', team: 'blue', icon: '🦊' },
    { id: 'ezreal', name: 'Ezreal', team: 'blue', icon: '🧭' },
    { id: 'jinx', name: 'Jinx', team: 'blue', icon: '💥' },
    { id: 'lux', name: 'Lux', team: 'blue', icon: '✨' },
    { id: 'thresh', name: 'Thresh', team: 'blue', icon: '🪝' },
    { id: 'yasuo', name: 'Yasuo', team: 'blue', icon: '🌪️' },
    { id: 'zed', name: 'Zed', team: 'blue', icon: '🗡️' },
    { id: 'lee', name: 'Lee Sin', team: 'blue', icon: '👊' },
    { id: 'vayne', name: 'Vayne', team: 'blue', icon: '🏹' },
    { id: 'darius', name: 'Darius', team: 'blue', icon: '⚔️' },

    // Equipo Rojo (iconos rojos)
    { id: 'draven', name: 'Draven', team: 'red', icon: '🪓' },
    { id: 'katarina', name: 'Katarina', team: 'red', icon: '🗡️' },
    { id: 'rengar', name: 'Rengar', team: 'red', icon: '🦁' },
    { id: 'vladimir', name: 'Vladimir', team: 'red', icon: '🩸' },
    { id: 'fiora', name: 'Fiora', team: 'red', icon: '🤺' },
    { id: 'tryndamere', name: 'Tryndamere', team: 'red', icon: '💢' },
    { id: 'master-yi', name: 'Master Yi', team: 'red', icon: '⚡' },
    { id: 'kayn', name: 'Kayn', team: 'red', icon: '🌑' },
    { id: 'samira', name: 'Samira', team: 'red', icon: '🔫' },
    { id: 'akali', name: 'Akali', team: 'red', icon: '🥷' },

    // Neutrales / Dorados (iconos dorados)
    { id: 'bard', name: 'Bard', team: 'neutral', icon: '🎭' },
    { id: 'kindred', name: 'Kindred', team: 'neutral', icon: '🐑🐺' },
    { id: 'aurelion', name: 'Aurelion Sol', team: 'neutral', icon: '🌟' },
    { id: 'jhin', name: 'Jhin', team: 'neutral', icon: '🎭' },
];

// Siluetas SVG simples para cada campeón (basadas en su arma/rasgo característico)
const CHAMPION_SILHOUETTES = {
    ahri: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="35" ry="40"/><ellipse cx="40" cy="40" rx="12" ry="10"/><ellipse cx="80" cy="40" rx="12" ry="10"/><path d="M60 75 Q50 85 60 95 Q70 85 60 75" fill="none" stroke="currentColor" stroke-width="3"/></g></svg>',
    ezreal: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M30 60 L90 60" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M60 30 L60 90" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></svg>',
    jinx: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="50" rx="28" ry="35"/><path d="M60 30 L60 15 L75 15" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M60 30 L60 15 L45 15" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></g></svg>',
    lux: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M60 20 L60 90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M30 55 L90 55" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="55" r="8" fill="none" stroke="currentColor" stroke-width="2"/></g></svg>',
    thresh: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="32" ry="40"/><path d="M60 25 L60 85" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M35 85 Q60 65 85 85" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></g></svg>',
    yasuo: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M30 70 Q60 40 90 70" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M45 60 Q60 45 75 60" stroke="currentColor" stroke-width="2" fill="none"/></g></svg>',
    zed: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M40 45 L80 45 M40 65 L80 65" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M60 30 L60 80" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></svg>',
    lee: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M60 25 L60 85" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="55" r="20" fill="none" stroke="currentColor" stroke-width="3"/></g></svg>',
    vayne: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="28" ry="35"/><path d="M60 20 L60 90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M45 40 L75 70 M75 40 L45 70" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></svg>',
    darius: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="32" ry="40"/><path d="M30 80 L90 30" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><ellipse cx="60" cy="55" rx="15" ry="10" fill="none" stroke="currentColor" stroke-width="2"/></g></svg>',

    draven: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M40 40 L80 70 M80 40 L40 70" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></g></svg>',
    katarina: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="28" ry="35"/><path d="M60 25 L60 85" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M35 50 L85 50 M35 65 L85 65" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></svg>',
    rengar: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="32" ry="40"/><ellipse cx="45" cy="40" rx="10" ry="8"/><ellipse cx="75" cy="40" rx="10" ry="8"/><path d="M45 70 Q60 60 75 70" stroke="currentColor" stroke-width="3" fill="none"/></g></svg>',
    vladimir: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><circle cx="60" cy="55" r="18" fill="none" stroke="currentColor" stroke-width="3"/><path d="M60 30 L60 80 M35 55 L85 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></svg>',
    fiora: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="28" ry="35"/><path d="M60 15 L60 95" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M35 55 L85 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></svg>',
    tryndamere: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="32" ry="40"/><path d="M40 80 L80 30" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M40 30 L80 80" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></g></svg>',
    master_yi: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M60 20 L60 90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M40 55 L80 55" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="55" r="8" fill="none" stroke="currentColor" stroke-width="2"/></g></svg>',
    kayn: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><path d="M35 75 Q60 35 85 75" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="55" rx="18" ry="12" fill="none" stroke="currentColor" stroke-width="2"/></g></svg>',
    samira: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="28" ry="35"/><path d="M60 25 L60 85" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M35 55 L85 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="40" r="6" fill="currentColor"/></g></svg>',
    akali: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="28" ry="35"/><path d="M60 20 L60 90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M40 55 L80 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M50 75 Q60 85 70 75" stroke="currentColor" stroke-width="3" fill="none"/></g></svg>',

    bard: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><circle cx="60" cy="55" r="22" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="60" cy="55" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M60 20 L60 90 M35 55 L85 55" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g></svg>',
    kindred: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="32" ry="40"/><ellipse cx="45" cy="40" rx="8" ry="6"/><ellipse cx="75" cy="40" rx="8" ry="6"/><path d="M40 70 Q60 60 80 70" stroke="currentColor" stroke-width="3" fill="none"/></g></svg>',
    aurelion: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="30" ry="38"/><ellipse cx="60" cy="55" rx="28" ry="15" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="60" cy="55" rx="20" ry="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="55" r="6" fill="currentColor"/></g></svg>',
    jhin: '<svg viewBox="0 0 120 120"><g fill="currentColor"><ellipse cx="60" cy="55" rx="28" ry="35"/><path d="M60 20 L60 90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M35 55 L85 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><ellipse cx="60" cy="55" rx="15" ry="8" fill="none" stroke="currentColor" stroke-width="2"/></g></svg>',
};

// Pistas troll que aparecen como "campeones raros"
const TROLL_CHAMPIONS = [
    { id: 'teemo', name: 'Teemo', team: 'troll', icon: '🍄', hint: 'El explorador más odiado. Si lo ves en la selección... corre.', lore: 'Teemo no elige carril, el carril elige a Teemo.' },
    { id: 'poro', name: 'Poro', team: 'troll', icon: '🤍', hint: 'Un poro en la selección de campeones. Algo huele mal.', lore: 'Los poros no son campeones... ¿o sí?' },
    { id: 'urf', name: 'Manatí URF', team: 'troll', icon: '🐋', hint: 'URF mode activado. Los cooldowns son una sugerencia.', lore: 'En URF, hasta los manatíes son viables.' },
    { id: 'fake-item', name: 'Botas de la Vergüenza', team: 'troll', icon: '👞', hint: 'Ítem legendario disfrazado de campeón. +100% velocidad hacia la derrota.', lore: 'Comprar esto es rendirse con estilo.' },
    { id: 'minion-teemo', name: 'Minion-Teemo', team: 'troll', icon: '👾', hint: 'Un minion con sombrero de Teemo. Infiltrado en la wave.', lore: 'Los minions también tienen derecho a jugar.' },
    { id: 'ward', name: 'Centinela Zombie', team: 'troll', icon: '👁️', hint: 'Un ward con ojos. Te está observando elegir.', lore: 'La visión es poder. Este ward tiene demasiado.' },
];

// ========================================
// FONDO: IMÁGENES ALEATORIAS DE LOL (Splash Arts, Skins)
// ========================================
const BACKGROUND_IMAGES = [
    { id: 'jinx-sg', name: 'Jinx Star Guardian', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_13.jpg', credit: 'Skin Star Guardian' },
    { id: 'ahri-kda', name: 'Ahri K/DA ALL OUT', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_37.jpg', credit: 'Skin K/DA' },
    { id: 'yasuo-hn', name: 'Yasuo High Noon', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_16.jpg', credit: 'Skin High Noon' },
    { id: 'lux-elementalist', name: 'Lux Elementalist', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_22.jpg', credit: 'Ultimate Skin' },
    { id: 'thresh-dt', name: 'Thresh Deep Terror', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_8.jpg', credit: 'Skin Deep Terror' },
    { id: 'zed-project', name: 'Zed PROJECT', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_15.jpg', credit: 'Skin PROJECT' },
    { id: 'mf-arcade', name: 'Miss Fortune Arcade', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/MissFortune_10.jpg', credit: 'Skin Arcade' },
    { id: 'ekko-td', name: 'Ekko True Damage', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ekko_25.jpg', credit: 'Skin True Damage' },
    { id: 'vi-heartbreaker', name: 'Vi Heartbreaker', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vi_11.jpg', credit: 'Skin Heartbreaker' },
    { id: 'jinx-arcane', name: 'Jinx Arcane', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_31.jpg', credit: 'Serie Arcane' },
    { id: 'akali-kda', name: 'Akali K/DA', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_10.jpg', credit: 'Skin K/DA' },
    { id: 'kaisa-kda', name: 'Kai\'Sa K/DA', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_10.jpg', credit: 'Skin K/DA' },
    { id: 'seraphine-kda', name: 'Seraphine K/DA', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Seraphine_10.jpg', credit: 'Skin K/DA' },
    { id: 'vex', name: 'Vex', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vex_0.jpg', credit: 'Splash Clásica' },
    { id: 'belveth', name: 'Bel\'Veth', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Belveth_0.jpg', credit: 'Splash Clásica' },
    { id: 'nilah', name: 'Nilah', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Nilah_0.jpg', credit: 'Splash Clásica' },
    { id: 'renata', name: 'Renata Glasc', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Renata_0.jpg', credit: 'Splash Clásica' },
    { id: 'zary', name: 'Zeri', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zeri_0.jpg', credit: 'Splash Clásica' },
    { id: 'milio', name: 'Milio', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Milio_0.jpg', credit: 'Splash Clásica' },
    { id: 'naafiri', name: 'Naafiri', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Naafiri_0.jpg', credit: 'Splash Clásica' },
    { id: 'briar', name: 'Briar', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Briar_0.jpg', credit: 'Splash Clásica' },
    { id: 'hwei', name: 'Hwei', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Hwei_0.jpg', credit: 'Splash Clásica' },
    { id: 'smolder', name: 'Smolder', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Smolder_0.jpg', credit: 'Splash Clásica' },
    { id: 'aurora', name: 'Aurora', url: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aurora_0.jpg', credit: 'Splash Clásica' },
];

// Barajar array (Fisher-Yates)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Inicializar imágenes de fondo aleatorias
function initBackgroundImages() {
    const bgLayer = document.getElementById('bgLayer');
    if (!bgLayer) return;

    // Seleccionar 10 imágenes aleatorias del pool
    const selected = shuffleArray(BACKGROUND_IMAGES).slice(0, 10);

    // Limpiar imágenes existentes (excepto overlay)
    const existingImages = bgLayer.querySelectorAll('.bg-image');
    existingImages.forEach(img => img.remove());

    // Crear nuevas imágenes con orden aleatorio
    selected.forEach((imgData, index) => {
        const bgImage = document.createElement('div');
        bgImage.className = 'bg-image';
        bgImage.setAttribute('aria-hidden', 'true');
        bgImage.style.backgroundImage = `url("${imgData.url}")`;
        bgImage.style.animationDelay = `${-index * 5.5}s`;
        bgImage.dataset.champion = imgData.name;
        bgImage.dataset.credit = imgData.credit;
        bgLayer.appendChild(bgImage);
    });

    // Log para debug
    console.log('%c🎨 Fondo aleatorio cargado:', 'color: #ffc400; font-weight: bold;');
    selected.forEach((img, i) => console.log(`  ${i + 1}. ${img.name} (${img.credit})`));
}

// ========================================
// ELEMENTOS DOM
// ========================================
const DOM = {
    btnJugar: document.getElementById('btnJugar'),
    btnAdvertencia: document.getElementById('btnAdvertencia'),
    modalAdvertencia: document.getElementById('modalAdvertencia'),
    modalCancel: document.getElementById('modalCancel'),
    modalConfirm: document.getElementById('modalConfirm'),
    modalBackdrop: document.querySelector('.modal-backdrop'),
    toastContainer: document.getElementById('toastContainer'),
    particles: document.getElementById('particles'),
    champSilhouettes: document.getElementById('champSilhouettes'),
};

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initBackgroundImages();
    initChampionSilhouettes();
    initParticles();
    bindEvents();
    initEntranceAnimations();
    console.log('%c🎮 Pruebas del Invocador cargado', 'color: #ffc400; font-size: 14px; font-weight: bold;');
    console.log('%cModo serio: conocimiento real de LoL', 'color: #6ba3e0;');
    console.log('%cModo advertencia: caos y trolleo', 'color: #e82a2a;');
    console.log('%c💡 Pista: Pasa el ratón por las siluetas... algunas no son lo que parecen', 'color: #7fb800; font-style: italic;');
});

// ========================================
// SILUETAS DE CAMPEONES (estilo Champ Select)
// ========================================
function initChampionSilhouettes() {
    const container = DOM.champSilhouettes;
    const totalChamps = 18; // Número de siluetas en pantalla

    // Mezclar campeones normales + algunos troll
    const allChampions = [...CHAMPIONS];
    const trollCount = 3; // 3 campeones troll escondidos
    const trollPicks = shuffleArray([...TROLL_CHAMPIONS]).slice(0, trollCount);

    // Seleccionar campeones normales aleatorios
    const normalPicks = shuffleArray([...CHAMPIONS]).slice(0, totalChamps - trollCount);
    const allPicks = shuffleArray([...normalPicks, ...trollPicks]);

    allPicks.forEach((champ, index) => {
        createChampionSilhouette(champ, index, container);
    });

    // Añadir más periódicamente para que parezca vivo
    setInterval(() => {
        if (container.children.length < totalChamps + 2) {
            const isTroll = Math.random() < 0.15; // 15% chance de troll
            const champ = isTroll
                ? TROLL_CHAMPIONS[Math.floor(Math.random() * TROLL_CHAMPIONS.length)]
                : CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
            createChampionSilhouette(champ, container.children.length, container, true);
        }
    }, 8000);
}

function createChampionSilhouette(champ, index, container, isNew = false) {
    const el = document.createElement('div');
    const isTroll = champ.team === 'troll';
    const teamClass = isTroll ? 'troll-hint' : (champ.team === 'blue' ? 'team-blue' : (champ.team === 'red' ? 'team-red' : 'team-neutral'));

    // Posición aleatoria pero distribuida
    const cols = 6;
    const rows = 4;
    const col = index % cols;
    const row = Math.floor(index / cols) % rows;
    const left = 8 + col * 15 + Math.random() * 8; // 8% - 95%
    const top = 10 + row * 20 + Math.random() * 12; // 10% - 85%

    // Silueta SVG
    const silhouette = CHAMPION_SILHOUETTES[champ.id] || getGenericSilhouette(champ.team);
    const svgDataUri = 'data:image/svg+xml,' + encodeURIComponent(silhouette);

    el.className = `champ-silhouette ${teamClass}`;
    el.style.cssText = `
        left: ${left}%;
        top: ${top}%;
        animation-delay: ${-index * 1.5}s;
        --drift-x: ${(Math.random() - 0.5) * 30}px;
    `;
    el.style.backgroundImage = `url("${svgDataUri}")`;

    // Tooltip / datos
    el.title = isTroll ? `${champ.name} - ${champ.hint}` : champ.name;
    el.dataset.championId = champ.id;
    el.dataset.championName = champ.name;
    el.dataset.isTroll = isTroll;

    if (isTroll) {
        el.dataset.trollHint = champ.hint;
        el.dataset.trollLore = champ.lore;
    }

    // Interactividad
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        discoverChampionHint(el, champ);
    });
    el.addEventListener('mouseenter', () => {
        el.style.opacity = isTroll ? '0.1' : '0.12';
        el.style.transform = 'scale(1.15)';
        el.style.transition = 'opacity 0.3s, transform 0.3s';
    });
    el.addEventListener('mouseleave', () => {
        el.style.opacity = '';
        el.style.transform = '';
    });
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', isTroll ? `Investigar: ${champ.name} (¿?)` : `Ver: ${champ.name}`);
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            discoverChampionHint(el, champ);
        }
    });

    if (isNew) {
        el.style.opacity = '0';
        el.style.animation = 'none';
        requestAnimationFrame(() => {
            el.style.animation = '';
            el.style.opacity = '';
        });
    }

    container.appendChild(el);

    // Limpiar si hay demasiados
    if (container.children.length > 22) {
        container.firstElementChild?.remove();
    }
}

function getGenericSilhouette(team) {
    const colors = { blue: '#3d7ac8', red: '#e82a2a', neutral: '#ffc400' };
    return `<svg viewBox="0 0 120 120"><g fill="${colors[team] || colors.blue}"><ellipse cx="60" cy="55" rx="30" ry="38"/><circle cx="60" cy="55" r="12"/></g></svg>`;
}

function discoverChampionHint(el, champ) {
    const isTroll = champ.team === 'troll';
    const key = champ.id;

    if (isTroll) {
        if (!GameState.trollHintsFound.has(key)) {
            GameState.trollHintsFound.add(key);
            showToast(`🔍 ¡Campeón raro descubierto: ${champ.name}!`, 'warning', 4500);
            console.log(`%c🕵️ CAMPEÓN TROLL ENCONTRADO: ${champ.name}`, 'color: #ff00ff; font-weight: bold; font-size: 14px;');
            console.log(`%c${champ.lore}`, 'color: #f05a5a;');
            console.log(`%c💡 ${champ.hint}`, 'color: #ffff00; font-style: italic;');
        } else {
            showToast(`👁️ ${champ.name}: "${champ.hint}"`, 'warning', 3500);
        }

        // Efecto visual fuerte
        el.style.animation = 'trollHintPulse 0.4s ease-out 4';
        setTimeout(() => el.style.animation = '', 1600);

        // Si encuentra todos los trolls
        if (GameState.trollHintsFound.size >= TROLL_CHAMPIONS.length) {
            setTimeout(() => {
                showToast('🃏 ¡Has desenmascarado a todos los infiltrados! El modo Advertencia no te engaña.', 'warning', 7000);
                document.body.style.animation = 'atmosphereBreath 1s ease-in-out 5';
                setTimeout(() => document.body.style.animation = '', 5000);
            }, 500);
        }
    } else {
        // Campeón normal - tooltip informativo
        showToast(`⚔️ ${champ.name} - Listo para la Grieta`, 'serious', 2500);
    }
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ========================================
// PARTÍCULAS DE ESENCIA
// ========================================
function initParticles() {
    const particleCount = 30;
    const types = ['gold', 'blue', 'red'];

    for (let i = 0; i < particleCount; i++) {
        createParticle(types);
    }

    setInterval(() => {
        if (document.querySelectorAll('.particle').length < particleCount) {
            createParticle(types);
        }
    }, 2000);
}

function createParticle(types) {
    const particle = document.createElement('div');
    const type = types[Math.floor(Math.random() * types.length)];
    particle.className = `particle ${type}`;

    const size = Math.random() * 4 + 1.5;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 12;
    const delay = Math.random() * 6;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    DOM.particles.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
}

// ========================================
// EVENTOS
// ========================================
function bindEvents() {
    DOM.btnJugar.addEventListener('click', () => startMode('serious'));
    DOM.btnAdvertencia.addEventListener('click', () => openWarningModal());

    DOM.modalCancel.addEventListener('click', () => closeWarningModal());
    DOM.modalConfirm.addEventListener('click', () => {
        closeWarningModal();
        startMode('warning');
    });
    DOM.modalBackdrop.addEventListener('click', () => closeWarningModal());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.modalAdvertencia.open) {
            closeWarningModal();
        }
    });

    [DOM.btnJugar, DOM.btnAdvertencia].forEach(btn => {
        btn.addEventListener('pointerdown', () => btn.classList.add('pressed'));
        btn.addEventListener('pointerup', () => btn.classList.remove('pressed'));
        btn.addEventListener('pointerleave', () => btn.classList.remove('pressed'));
    });
}

// ========================================
// MODAL ADVERTENCIA
// ========================================
function openWarningModal() {
    DOM.modalAdvertencia.showModal();
    setTimeout(() => DOM.modalCancel.focus(), 100);
    playSound('modalOpen');
}

function closeWarningModal() {
    DOM.modalAdvertencia.close();
    DOM.btnAdvertencia.focus();
    playSound('modalClose');
}

// ========================================
// INICIO DE MODOS
// ========================================
function startMode(mode) {
    GameState.mode = mode;
    GameState.currentTest = 0;
    GameState.score[mode] = 0;

    const messages = {
        serious: {
            text: '⚔️ Modo Invocador activado. Que comiencen las pruebas.',
            type: 'serious'
        },
        warning: {
            text: '🃏 Modo Advertencia activado. La realidad se distorsiona...',
            type: 'warning'
        }
    };

    showToast(messages[mode].text, messages[mode].type);

    setTimeout(() => {
        navigateToTest(1);
    }, 1500);
}

function navigateToTest(testNumber) {
    GameState.currentTest = testNumber;
    showToast(`Cargando Prueba ${testNumber}...`, GameState.mode);
    console.log(`🎯 Navegando a Prueba ${testNumber} - Modo: ${GameState.mode}`);
    setTimeout(() => showTestPlaceholder(testNumber), 1000);
}

// ========================================
// PLACEHOLDER DE PRUEBA (TEMPORAL)
// ========================================
function showTestPlaceholder(testNum) {
    const testNames = {
        1: 'Silueta del Campeón',
        2: 'Habilidad Oculta',
        3: 'Ítem Legendario',
        4: 'Frase de Campeón',
        5: 'Splash Art Parcial'
    };

    const trollTwists = {
        1: '¿Es Teemo? ¿Un Poro? ¿El Nexus?',
        2: 'La pasiva de Teemo: "Ser molesto"',
        3: 'El objeto: "Zapato de la Vergüenza"',
        4: '"¡Por Demacia!" - dijo un minion',
        5: 'Splash art de un ward con ojos'
    };

    const isTroll = GameState.mode === 'warning' && Math.random() > 0.3;
    const isSeriousTroll = GameState.mode === 'serious' && Math.random() < 0.15;

    const content = isTroll || isSeriousTroll
        ? trollTwists[testNum] || '¡SORPRESA!'
        : testNames[testNum] || `Prueba ${testNum}`;

    const message = `Prueba ${testNum}: ${content}`;
    const type = (isTroll || isSeriousTroll) ? 'warning' : 'serious';

    showToast(message, type, 5000);
    console.log(`📝 Prueba ${testNum} | Modo: ${GameState.mode} | ${isTroll || isSeriousTroll ? '🤡 TROLL' : '✅ SERIO'} | ${content}`);
}

// ========================================
// TOAST / NOTIFICACIONES
// ========================================
function showToast(message, type = 'serious', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => removeToast(toast), duration);
    toast.addEventListener('click', () => removeToast(toast));
}

function removeToast(toast) {
    if (!toast.classList.contains('removing')) {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }
}

// ========================================
// SONIDOS (Web Audio API - opcional)
// ========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
}

function playSound(type) {
    // Descomenta para activar sonidos
    // initAudio();
    // const osc = audioCtx.createOscillator();
    // const gain = audioCtx.createGain();
    // osc.connect(gain);
    // gain.connect(audioCtx.destination);
    // const freqs = { modalOpen: [200, 100], modalClose: [300, 150], buttonHover: [800, 800] };
    // const [start, end] = freqs[type] || [440, 220];
    // osc.frequency.setValueAtTime(start, audioCtx.currentTime);
    // osc.frequency.exponentialRampToValueAtTime(end, audioCtx.currentTime + 0.2);
    // gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    // gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    // osc.start();
    // osc.stop(audioCtx.currentTime + 0.2);
}

// ========================================
// UTILIDADES
// ========================================
function debounce(fn, delay) {
    let id;
    return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), delay); };
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================================
// EXPORTAR PARA DEBUGGING (consola)
// ========================================
window.LoLTests = {
    state: GameState,
    startMode,
    navigateToTest,
    showToast,
    openWarningModal,
    closeWarningModal,
    champions: CHAMPIONS,
    trollChampions: TROLL_CHAMPIONS
};