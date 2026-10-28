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
// FONDO: MEDIA ALEATORIA DE LOL (Videos + Splash Arts)
// ========================================

// Videos oficiales de Riot (CDN público - ligeros y fiables)
const BACKGROUND_VIDEOS = [
    {
        id: 'lol-promo-1',
        name: 'LoL Promo Clip 1',
        src: 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/bbc27473157462adacf0de441a8796268eb2d0ac.mp4?accountingTag=LoL',
        credit: 'Riot Games - Promo Oficial',
        duration: 30 // segundos de bucle aproximado
    },
    {
        id: 'lol-promo-2',
        name: 'LoL Promo Clip 2',
        src: 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/1f5b2cf01a1cf2afa1ce61febee6e2e900808347.mp4?accountingTag=LoL',
        credit: 'Riot Games - Promo Oficial',
        duration: 30
    },
    {
        id: 'lol-promo-3',
        name: 'LoL Promo Clip 3',
        src: 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/0a9b9f8dacb54086c58c1af8aa880d7cf6d7fea6.mp4?accountingTag=LoL',
        credit: 'Riot Games - Promo Oficial',
        duration: 30
    },
    {
        id: 'lol-promo-live',
        name: 'LoL Live/News Promo',
        src: 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news_live/69b0e6a4393233da0d292c286fd371cfa036d30f.mp4?accountingTag=LoL',
        credit: 'Riot Games - Live/News',
        duration: 35
    },
    {
        id: 'lol-promo-4',
        name: 'LoL Promo Clip 4',
        src: 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/e5791dbc0787a96e83b82df20d44375f09f4d861.mp4?accountingTag=LoL',
        credit: 'Riot Games - Promo Oficial',
        duration: 30
    },
    {
        id: 'lol-promo-webm',
        name: 'LoL Promo WebM',
        src: 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/8ab3e227121c53aacab0c9b9f7a48adbc65db520.webm?accountingTag=LoL',
        credit: 'Riot Games - Promo WebM',
        duration: 40
    }
];

// Imágenes existentes (splash arts)
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

// Pool unificado: videos remotos + imágenes + videos locales (si existen)
function buildMediaPool() {
    const pool = [];

    // Detectar si estamos en file:// (local) -> CORS bloquea videos remotos
    const isLocalFile = window.location.protocol === 'file:';

    // Videos remotos (oficiales de Riot) - SOLO si NO es file://
    if (!isLocalFile) {
        BACKGROUND_VIDEOS.forEach(v => pool.push({ ...v, type: 'video', remote: true }));
    } else {
        console.log('%c📁 Modo local (file://) detectado: videos remotos desactivados (CORS)', 'color: #ffaa00;');
    }

    // Videos locales (si hay carpeta videos/ con archivos)
    // Nombres esperados en D:\Proyecto\juego de lol\videos\
    const localVideoNames = [
        { id: 'awaken', name: 'Awaken', file: 'awaken.mp4', credit: 'Cinemática Awaken' },
        { id: 'warriors', name: 'Warriors', file: 'warriors.mp4', credit: 'Cinemática Warriors' },
        { id: 'the-hunt', name: 'The Hunt', file: 'the-hunt.mp4', credit: 'Cinemática The Hunt' },
        { id: 'kda-popstars', name: 'K/DA POP/STARS', file: 'kda-popstars.mp4', credit: 'Cinemática K/DA' },
        { id: 'kda-more', name: 'K/DA MORE', file: 'kda-more.mp4', credit: 'Cinemática K/DA MORE' },
        { id: 'arcane', name: 'Arcane', file: 'arcane.mp4', credit: 'Serie Arcane' },
    ];
    localVideoNames.forEach(v => pool.push({
        ...v,
        type: 'video',
        remote: false,
        local: true,
        src: `videos/${v.file}`
    }));

    // Imágenes (splash arts) - siempre disponibles
    BACKGROUND_IMAGES.forEach(img => pool.push({ ...img, type: 'image' }));

    return pool;
}

// Barajar array (Fisher-Yates)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Inicializar fondo con videos e imágenes aleatorias
function initBackgroundMedia() {
    const bgLayer = document.getElementById('bgLayer');
    if (!bgLayer) return;

    const mediaPool = buildMediaPool();
    const videos = mediaPool.filter(m => m.type === 'video');
    const images = mediaPool.filter(m => m.type === 'image');

    // Limpiar contenido previo (excepto overlay)
    const existingMedia = bgLayer.querySelectorAll('.bg-image, .bg-video');
    existingMedia.forEach(el => el.remove());

    // SIEMPRE arrancar con video si hay videos disponibles
    const startWithVideo = videos.length > 0;

    let mediaSequence = [];

    if (startWithVideo) {
        // 1 video aleatorio + 8-10 imágenes + posibilidad de volver a video
        const videoPick = shuffleArray(videos).slice(0, 1);
        const imagePicks = shuffleArray(images).slice(0, 9);
        mediaSequence = [...videoPick, ...imagePicks];

        // Añadir un 2º video al final del ciclo (opcional, 30% chance)
        if (videos.length > 1 && Math.random() < 0.3) {
            const secondVideo = shuffleArray(videos.filter(v => v.id !== videoPick[0].id)).slice(0, 1);
            mediaSequence.push(...secondVideo);
        }
    } else {
        // Fallback: solo imágenes si no hay videos
        mediaSequence = shuffleArray(images).slice(0, 10);
    }

    // Aplicar estilos y montar en el DOM
    mediaSequence.forEach((media, index) => {
        if (media.type === 'video') {
            createBgVideo(bgLayer, media, index);
        } else {
            createBgImage(bgLayer, media, index);
        }
    });

    // Log para debug
    console.log('%c🎬 Fondo multimedia cargado:', 'color: #ffc400; font-weight: bold;');
    mediaSequence.forEach((m, i) => {
        const tag = m.type === 'video' ? '🎞️' : '🖼️';
        const srcTag = m.remote ? ' (remoto)' : (m.local ? ' (local)' : '');
        console.log(`  ${i + 1}. ${tag} ${m.name} (${m.credit})${srcTag}`);
    });
}

// Crear elemento de video de fondo
function createBgVideo(bgLayer, videoData, index) {
    const video = document.createElement('video');
    video.className = 'bg-video';
    video.setAttribute('aria-hidden', 'true');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.crossOrigin = 'anonymous';

    // Delay escalonado (videos duran más, así que delay mayor)
    const delay = index * 35; // ~35s por video (incluye fade)
    video.style.animationDelay = `${-delay}s`;

    // Source
    const source = document.createElement('source');
    source.src = videoData.src;
    source.type = videoData.src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
    video.appendChild(source);

    // Dataset para debug
    video.dataset.name = videoData.name;
    video.dataset.credit = videoData.credit;
    video.dataset.duration = videoData.duration || 30;

    // Fallback si falla la carga
    video.addEventListener('error', () => handleVideoError(bgLayer, video, videoData, index));
    video.addEventListener('loadeddata', () => {
        console.log(`%c▶️ Video cargado: ${videoData.name}`, 'color: #00ffaa;');
    });

    bgLayer.appendChild(video);

    // Intentar play (algunos navegadores exigen interacción)
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Si falla autoplay, el video se quedará en el primer frame
            // El fallback se activará por timeout si no carga
        });
    }

    // Timeout de seguridad: si el video no reproduce en 8s, fallback a imagen
    setTimeout(() => {
        if (video.readyState < 2) { // HAVE_CURRENT_DATA = 2
            handleVideoError(bgLayer, video, videoData, index);
        }
    }, 8000);
}

// Crear elemento de imagen de fondo (como antes)
function createBgImage(bgLayer, imgData, index) {
    const bgImage = document.createElement('div');
    bgImage.className = 'bg-image';
    bgImage.setAttribute('aria-hidden', 'true');
    bgImage.style.backgroundImage = `url("${imgData.url}")`;
    bgImage.style.animationDelay = `${-index * 5.5}s`;
    bgImage.dataset.champion = imgData.name;
    bgImage.dataset.credit = imgData.credit;
    bgLayer.appendChild(bgImage);
}

// Manejar error de video -> fallback a imagen aleatoria
function handleVideoError(bgLayer, videoEl, videoData, index) {
    console.warn(`%c⚠️ Video falló/timeout: ${videoData.name} — fallback a imagen`, 'color: #ffaa00;');

    // Eliminar video fallido
    videoEl.remove();

    // Pick una imagen aleatoria que no esté ya en el DOM
    const usedNames = new Set(
        Array.from(bgLayer.querySelectorAll('.bg-image, .bg-video'))
            .map(el => el.dataset.champion || el.dataset.name)
            .filter(Boolean)
    );

    const availableImages = BACKGROUND_IMAGES.filter(img => !usedNames.has(img.name));
    if (availableImages.length === 0) return;

    const fallbackImg = shuffleArray(availableImages)[0];
    createBgImage(bgLayer, fallbackImg, index);
    console.log(`%c🔄 Fallback imagen: ${fallbackImg.name}`, 'color: #00ffaa;');
}

// Compatibilidad: alias para código existente
function initBackgroundImages() {
    initBackgroundMedia();
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
    initEntryScreen();
    initBackgroundImages();
    initChampionSilhouettes();
    initParticles();
    bindEvents();
    // bindDifficultyEvents eliminado - ahora hay 10 rondas seguidas
    initEntranceAnimations();
    initBackgroundMusic();
    console.log('%c🎮 Pruebas del Invocador cargado', 'color: #ffc400; font-size: 14px; font-weight: bold;');
    console.log('%cModo serio: conocimiento real de LoL', 'color: #6ba3e0;');
    console.log('%cModo advertencia: caos y trolleo', 'color: #e82a2a;');
    console.log('%c💡 Pista: Pasa el ratón por las siluetas... algunas no son lo que parece', 'color: #7fb800; font-style: italic;');
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
    DOM.btnJugar.addEventListener('click', () => {
    DOM.difficultySelector.style.display = 'none';
    DOM.btnJugar.style.display = 'none';
    DOM.btnAdvertencia.style.display = 'none';
    startMode('serious');
});
    DOM.btnAdvertencia.addEventListener('click', () => openWarningModal());

    DOM.modalCancel.addEventListener('click', () => closeWarningModal());
    DOM.modalConfirm.addEventListener('click', () => {
        closeWarningModal();
        // Advertencia NO inicia la prueba de siluetas, solo cierra el modal y vuelve al menú
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
function startMode(mode, difficulty = 'facil') {
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
        initTestSystem(difficulty);
        bindTestEvents();
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
// ANIMACIONES DE ENTRADA
// ========================================
function initEntranceAnimations() {
    // Las animaciones principales están en CSS (fadeInUp con delays)
    // Esta función puede usarse para triggers extra si se necesita
    console.log('%c✨ Animaciones de entrada activadas', 'color: #a8cff5;');
}

// ========================================
// PANTALLA DE ENTRADA (Click para activar sonido)
// ========================================
function initEntryScreen() {
    const screen = document.getElementById('entryScreen');
    const btn = document.getElementById('entryBtn');
    const entryBgImage = document.getElementById('entryBgLayer')?.querySelector('.entry-bg-image');
    
    if (!screen || !btn) return;

    // Inicializar splash art aleatoria en el fondo de la pantalla de entrada
    if (entryBgImage && typeof BACKGROUND_IMAGES !== 'undefined' && BACKGROUND_IMAGES.length > 0) {
        const randomImg = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
        entryBgImage.style.backgroundImage = `url("${randomImg.url}")`;
        console.log(`🎨 Entry screen fondo: ${randomImg.name} (${randomImg.credit})`);
    }

    btn.addEventListener('click', () => {
        // 1. Desmutear música y poner volumen 5%
        const audio = document.getElementById('bgMusic');
        if (audio) {
            audio.muted = false;
            audio.volume = 0.05;
            document.getElementById('volumeSlider').value = 5;
            document.getElementById('volumeValue').textContent = '5';
            updateMuteUI(false);
            // Asegurar reproducción
            audio.play().catch(() => {});
            console.log('🎵 Pantalla entrada: música desmuteada + vol 5%');
        }

        // 2. Animar salida de pantalla
        screen.classList.add('exiting');
        
        // 3. Eliminar del DOM tras animación (con timeout de seguridad)
        const removeScreen = () => {
            screen.remove();
            console.log('🎮 Pantalla entrada completada → menú principal');
        };
        
        screen.addEventListener('animationend', removeScreen, { once: true });
        
        // Timeout de seguridad: si animationend no dispara en 1s, forzar eliminación
        setTimeout(() => {
            if (document.body.contains(screen)) {
                console.warn('⚠️ animationend no disparó, forzando eliminación');
                screen.removeEventListener('animationend', removeScreen);
                removeScreen();
            }
        }, 1000);
    });

    // Accesibilidad: Enter/Space también funciona
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });

    console.log('%c🚪 Pantalla de entrada lista', 'color: #ffc400; font-weight: bold;');
}

// ========================================
// MÚSICA DE FONDO
// ========================================
const MUSIC_TRACKS = [
    { file: 'still-here.mp3', title: 'Still Here', credit: 'Season 2024 Cinematic (ft. Forts, Tiffany Aris, 2WEI)' },
    { file: 'ma-meilleure-ennemie.mp3', title: 'Ma Meilleure Ennemie', credit: 'Arcane Season 2 (Stromae, Pomme)' },
    { file: 'the-line.mp3', title: 'The Line', credit: 'Arcane Season 2 (Twenty One Pilots)' },
];

let currentTrackIndex = -1;
let musicUnlocked = false;

function initBackgroundMusic() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;

    // Configurar para autoplay SIN sonido (política navegadores)
    audio.muted = true;
    audio.autoplay = true;

    // Elegir track aleatorio inicial
    currentTrackIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
    loadTrack(currentTrackIndex);

    // Intentar autoplay muted (siempre funciona)
    attemptAutoplay(audio);

    // Cuando termina, pasar al siguiente aleatorio
    audio.addEventListener('ended', () => playNextTrack());

    // Inicializar UI
    initMusicController(audio);

    console.log('%c🎵 Sistema de música inicializado (muted autoplay)', 'color: #ffc400; font-weight: bold;');
}

function loadTrack(index) {
    const audio = document.getElementById('bgMusic');
    const track = MUSIC_TRACKS[index];
    const fullPath = `musica/${track.file}`;
    audio.src = fullPath;
    audio.load();

    // Actualizar UI
    document.getElementById('musicTitle').textContent = track.title;
    document.getElementById('musicCredit').textContent = track.credit;

    console.log(`🎵 Cargado: ${track.title} — ${track.credit}`);

    // Cuando metadata cargada: saltar a la mitad
    // NO ponemos volumen ni unmute aquí - se hace en unlock
    audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = audio.duration / 2;
        console.log(`🎵 Iniciando en medio (${(audio.duration/2).toFixed(1)}s de ${audio.duration.toFixed(1)}s) — muted hasta interacción`);
    }, { once: true });
}

function playTrack() {
    const audio = document.getElementById('bgMusic');
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Autoplay bloqueado, esperar interacción
            waitForUnlock(audio);
        });
    }
    updatePlayPauseUI(false);
}

function pauseTrack() {
    const audio = document.getElementById('bgMusic');
    audio.pause();
    updatePlayPauseUI(true);
}

function togglePlayPause() {
    const audio = document.getElementById('bgMusic');
    if (audio.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
}

function playNextTrack() {
    // Siguiente aleatorio (diferente al actual)
    const available = MUSIC_TRACKS.map((_, i) => i).filter(i => i !== currentTrackIndex);
    if (available.length === 0) return;
    currentTrackIndex = available[Math.floor(Math.random() * available.length)];
    loadTrack(currentTrackIndex);
    playTrack();
}

function playPrevTrack() {
    // Anterior aleatorio (diferente al actual)
    const available = MUSIC_TRACKS.map((_, i) => i).filter(i => i !== currentTrackIndex);
    if (available.length === 0) return;
    currentTrackIndex = available[Math.floor(Math.random() * available.length)];
    loadTrack(currentTrackIndex);
    playTrack();
}

function attemptAutoplay(audio) {
    // Autoplay muted - siempre funciona
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('🎵 Autoplay MUTED iniciado');
            updatePlayPauseUI(false);
        }).catch(() => {
            waitForUnlock(audio);
        });
    }
}

function waitForUnlock(audio) {
    if (musicUnlocked) return;
    const unlock = () => {
        musicUnlocked = true;
        // Desmutear y poner volumen 5% en primera interacción
        audio.muted = false;
        audio.volume = 0.05;
        document.getElementById('volumeSlider').value = 5;
        document.getElementById('volumeValue').textContent = '5';
        updateMuteUI(false);
        console.log('🎵 Desmuteado + vol 5% tras interacción usuario');
        audio.play().then(() => updatePlayPauseUI(false)).catch(() => {});
        document.removeEventListener('click', unlock);
        document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
}

function updatePlayPauseUI(isPaused) {
    const playIcon = document.querySelector('.music-play-pause .play-icon');
    const pauseIcon = document.querySelector('.music-play-pause .pause-icon');
    if (playIcon && pauseIcon) {
        playIcon.style.display = isPaused ? 'block' : 'none';
        pauseIcon.style.display = isPaused ? 'none' : 'block';
    }
}

function setVolume(value) {
    const audio = document.getElementById('bgMusic');
    const volume = Math.max(0, Math.min(100, value)) / 100;
    audio.volume = volume;
    document.getElementById('volumeSlider').value = Math.round(volume * 100);
    document.getElementById('volumeValue').textContent = Math.round(volume * 100);
    updateMuteUI(volume === 0);
}

function toggleMute() {
    const audio = document.getElementById('bgMusic');
    audio.muted = !audio.muted;
    updateMuteUI(audio.muted);
    if (!audio.muted && audio.volume === 0) {
        audio.volume = 0.3;
        document.getElementById('volumeSlider').value = 30;
        document.getElementById('volumeValue').textContent = '30';
    }
}

function updateMuteUI(isMuted) {
    const toggle = document.getElementById('musicToggle');
    const muteBtn = document.getElementById('musicMute');
    const volumeIcon = muteBtn.querySelector('.volume-icon');
    const muteIcon = muteBtn.querySelector('.mute-icon');
    const btnMutePermanent = document.getElementById('btnMutePermanent');

    if (toggle) toggle.classList.toggle('muted', isMuted);
    if (btnMutePermanent) btnMutePermanent.classList.toggle('muted', isMuted);
    if (volumeIcon && muteIcon) {
        volumeIcon.style.display = isMuted ? 'none' : 'block';
        muteIcon.style.display = isMuted ? 'block' : 'none';
    }
}

function initMusicController(audio) {
    const toggle = document.getElementById('musicToggle');
    const panel = document.getElementById('musicPanel');
    const playPause = document.getElementById('musicPlayPause');
    const prevBtn = document.getElementById('musicPrev');
    const nextBtn = document.getElementById('musicNext');
    const muteBtn = document.getElementById('musicMute');
    const volumeSlider = document.getElementById('volumeSlider');

    // Toggle panel
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // Cerrar panel al click fuera
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !panel.contains(e.target)) {
            panel.style.display = 'none';
        }
    });

    // Play/Pause
    playPause.addEventListener('click', togglePlayPause);

    // Prev/Next
    prevBtn.addEventListener('click', playPrevTrack);
    nextBtn.addEventListener('click', playNextTrack);

    // Mute
    muteBtn.addEventListener('click', toggleMute);

    // Mute permanente (siempre visible)
    const btnMutePermanent = document.getElementById('btnMutePermanent');
    if (btnMutePermanent) {
        btnMutePermanent.addEventListener('click', toggleMute);
    }

    // Volume slider
    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

    // Sincronizar volumen inicial
    setVolume(30);

    // Actualizar UI cuando cambia el volumen por código
    audio.addEventListener('volumechange', () => {
        if (!audio.muted) {
            document.getElementById('volumeSlider').value = Math.round(audio.volume * 100);
            document.getElementById('volumeValue').textContent = Math.round(audio.volume * 100);
        }
        updateMuteUI(audio.muted);
    });
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

// ========================================
// SISTEMA DE PRUEBAS: ADIVINA LA SILUETA
// ========================================

// ========================================
// SISTEMA DE PRUEBAS: ADIVINA LA SILUETA (10 RONDAS SEGUIDAS)
// ========================================

// Configuración de rondas: 10 rondas seguidas, una por carpeta de siluetas
const TEST_ROUNDS = [
    {
        id: 1,
        champion: 'Ahri',
        image: 'siluetas/ultra facil/AHRI 1_silhouette (1).png',
        secondImage: null,
        difficulty: 'Fácil',
        timeLimit: 20,
        hint: null,
        trollReveal: false
    },
    {
        id: 2,
        champion: 'Riven',
        image: 'siluetas/ultra facil 2/riven_silhouette (2).png',
        secondImage: null,
        difficulty: 'Fácil',
        timeLimit: 20,
        hint: null,
        trollReveal: false
    },
    {
        id: 3,
        champion: 'Kaisa',
        image: 'siluetas/facil 1/157901de17b8e5f68d0d91b63252c62b_silhouette (1).png',
        secondImage: 'siluetas/facil 1/157901de17b8e5f68d0d91b63252c62b_silhouette (2).png',
        difficulty: 'Fácil',
        timeLimit: 20,
        hint: null,
        trollReveal: false
    },
    {
        id: 4,
        champion: 'Senna',
        image: 'siluetas/facil 2/images_silhouette (2).png',
        secondImage: null,
        difficulty: 'Fácil',
        timeLimit: 20,
        hint: null,
        trollReveal: false
    },
    {
        id: 5,
        champion: 'Diana',
        image: 'siluetas/medio 1/500_333_silhouette (1).png',
        secondImage: 'siluetas/medio 1/500_333_silhouette (2).png',
        difficulty: 'Medio',
        timeLimit: null,
        hint: 'Hija de la luna, portadora de la Espada Lunar, cazadora de los herejes del Sol',
        trollReveal: false
    },
    {
        id: 6,
        champion: 'Akali',
        image: 'siluetas/medio 2/coven-akali-splash_silhouette (2).png',
        secondImage: 'siluetas/medio 2/coven-akali-splash_silhouette (3).png',
        difficulty: 'Medio',
        timeLimit: null,
        hint: 'Puño Sombrío de Kinkou, exiliada, lucha por su propia justicia',
        trollReveal: false
    },
    {
        id: 7,
        champion: 'Karma',
        image: 'siluetas/dificl 1/e00782e7b3be9e6c4a8c8781d14103f1_silhouette (1).png',
        secondImage: 'siluetas/dificl 1/e00782e7b3be9e6c4a8c8781d14103f1.jpg',
        difficulty: 'Difícil',
        timeLimit: null,
        hint: 'La Iluminada, encarna las almas de Ionia, busca el equilibrio espiritual',
        trollReveal: false
    },
    {
        id: 8,
        champion: 'Qiyana',
        image: 'siluetas/dificil 2/Qiyana_40_silhouette (1).png',
        secondImage: 'siluetas/dificil 2/Qiyana_40_silhouette (2).png',
        difficulty: 'Difícil',
        timeLimit: null,
        hint: 'Emperatriz de los Elementos de Ixtal, domina los elementos con su arma esmeralda',
        trollReveal: false
    },
    {
        id: 9,
        champion: 'Evelynn',
        image: 'siluetas/dificl 3/Spirit.Blossom.Evelynn.full.4215734_silhouette (1).png',
        secondImage: 'siluetas/dificl 3/Spirit.Blossom.Evelynn.full.4215734_silhouette (2).png',
        difficulty: 'Difícil',
        timeLimit: null,
        hint: 'El Agonía de la Agonía, demonio seductor que se alimenta del sufrimiento ajeno',
        trollReveal: false
    },
    {
        id: 10,
        champion: 'Braum',
        image: 'siluetas/imposible 1/braum_silhouette (1).png',
        secondImage: 'siluetas/imposible 1/braum_silhouette (2).png',
        difficulty: 'Imposible',
        timeLimit: null,
        hint: 'El Corazón de Freljord, guarda la puerta de Howling Abyss con su escudo de puerta',
        trollReveal: false
    }
];

// Estado del sistema de pruebas
const TestState = {
    currentRound: 0,
    score: 0,
    totalRounds: TEST_ROUNDS.length,
    timer: null,
    timeLeft: 0,
    timeLimit: 20,
    secondImageShown: false,
    isAnswering: false,
    isGameOver: false
};

// Elementos DOM del test
const TestDOM = {
    testScreen: document.getElementById('testScreen'),
    testRound: document.getElementById('testRound'),
    testMode: document.getElementById('testMode'),
    testTitle: document.getElementById('testTitle'),
    bgSilhouette: document.getElementById('bgSilhouette'),
    timerBar: document.getElementById('timerBar'),
    timerText: document.getElementById('timerText'),
    testAnswer: document.getElementById('testAnswer'),
    btnSubmit: document.getElementById('btnSubmit'),
    btnBack: document.getElementById('btnBackToMenu'),
    btnHint: document.getElementById('btnHint'),
    testFeedback: document.getElementById('testFeedback'),
    silhouetteWrapper: document.getElementById('silhouetteWrapper')
};

// Inicializar el sistema de pruebas (10 rondas seguidas)
function initTestSystem() {
    // Ocultar menú y mostrar pantalla de prueba
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.style.display = 'none';

    TestDOM.testScreen.classList.add('visible');

    // Resetear estado
    TestState.currentRound = 0;
    TestState.score = 0;
    TestState.isGameOver = false;

    // Cargar primera ronda
    loadRound(0);

    console.log('%c🎮 Sistema de pruebas iniciado - 10 rondas seguidas', 'color: #ffc400; font-weight: bold;');
}

// Cargar una ronda específica
function loadRound(roundIndex) {
    if (roundIndex >= TEST_ROUNDS.length) {
        showTestResults();
        return;
    }

    TestState.isAnswering = false;
    TestState.isGameOver = false;
    TestState.secondImageShown = false;

    const round = TEST_ROUNDS[roundIndex];

    // Actualizar UI
    TestDOM.testRound.textContent = `PRUEBA ${roundIndex + 1}/${TEST_ROUNDS.length}`;
    TestDOM.testTitle.textContent = 'ADIVINA LA SILUETA CABRONA';
    TestDOM.testMode.textContent = `Modo: ${GameState.mode === 'warning' ? 'ADVERTENCIA' : 'INVOCADOR'} | ${round.difficulty}`;

    // Cargar silueta (primera imagen)
    TestDOM.bgSilhouette.src = round.image;
    TestDOM.bgSilhouette.classList.remove('revealed');

    // Resetear input y feedback
    TestDOM.testAnswer.value = '';
    TestDOM.testAnswer.disabled = false;
    TestDOM.btnSubmit.disabled = false;
    TestDOM.testFeedback.style.display = 'none';

    // Mostrar/ocultar botón de pista (solo rondas 5-10)
    const hasHint = round.hint && TestState.currentRound >= 4;
    TestDOM.btnHint.style.display = hasHint ? 'block' : 'none';

    // Iniciar temporizador solo en rondas 1-4 (modo fácil con timer)
    if (round.timeLimit && round.timeLimit > 0) {
        startTimer(round.timeLimit);
    } else {
        stopTimer();
        TestDOM.timerBar.style.width = '100%';
        TestDOM.timerText.textContent = '--:--';
    }

    console.log(`🎯 Ronda ${roundIndex + 1}: ${round.champion} (${round.difficulty})`);
}

// Temporizador solo para rondas 1-4
function startTimer(seconds) {
    stopTimer();

    TestState.timeLeft = seconds;
    TestState.timeLimit = seconds;
    updateTimerDisplay();

    TestDOM.timerBar.classList.remove('warning');

    TestState.timer = setInterval(() => {
        TestState.timeLeft--;
        updateTimerDisplay();

        if (TestState.timeLeft <= 5) {
            TestDOM.timerBar.classList.add('warning');
        }

        if (TestState.timeLeft <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (TestState.timer) {
        clearInterval(TestState.timer);
        TestState.timer = null;
    }
}

function updateTimerDisplay() {
    const percentage = TestState.timeLimit > 0 ? (TestState.timeLeft / TestState.timeLimit) * 100 : 0;
    TestDOM.timerBar.style.width = `${Math.max(0, percentage)}%`;
    TestDOM.timerText.textContent = TestState.timeLimit > 0 ? `${TestState.timeLeft}s` : '--:--';
}

// Sonido del reloj bomba (usando Web Audio API)
function playBombTick() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.log('🔊 Sonido no disponible');
    }
}

function playBombExplosion() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.log('🔊 Sonido no disponible');
    }
}

// Manejar timeout (solo rondas 1-4 con timer)
function handleTimeout() {
    TestState.isAnswering = true;
    const currentRound = TEST_ROUNDS[TestState.currentRound];
    showFeedback(`⏰ Tiempo agotado. El campeón era: ${currentRound.champion}`, 'wrong');
    TestDOM.bgSilhouette.classList.add('revealed');

    setTimeout(() => {
        TestState.currentRound++;
        loadRound(TestState.currentRound);
    }, 2000);
}

// Manejar envío de respuesta
function handleSubmitAnswer() {
    if (TestState.isAnswering || TestState.isGameOver) return;

    const userAnswer = TestDOM.testAnswer.value.trim().toLowerCase();
    const currentRound = TEST_ROUNDS[TestState.currentRound];
    const correctAnswer = currentRound.champion.toLowerCase();

    stopTimer();

    if (userAnswer === correctAnswer) {
        // Acierto
        TestState.score++;
        TestState.isAnswering = true;
        showFeedback(`✅ ¡Correcto! Es ${currentRound.champion}`, 'correct');
        TestDOM.bgSilhouette.classList.add('revealed');

        setTimeout(() => {
            TestState.currentRound++;
            loadRound(TestState.currentRound);
        }, 2000);
    } else {
        // Fallo: mostrar segunda imagen si existe y no se mostró aún
        if (currentRound.secondImage && !TestState.secondImageShown) {
            TestState.secondImageShown = true;
            TestDOM.bgSilhouette.src = currentRound.secondImage;
            showFeedback(`❌ Incorrecto. Segunda oportunidad con pista visual.`, 'wrong');
            // NO deshabilitar input/botón aquí - permitir segundo intento
            TestDOM.testAnswer.disabled = false;
            TestDOM.testAnswer.value = '';
            TestDOM.testAnswer.focus();
            TestDOM.btnSubmit.disabled = false;
        } else {
            // Segunda oportunidad fallida o sin segunda imagen
            TestState.isAnswering = true;
            showFeedback(`❌ Incorrecto. Era ${currentRound.champion}`, 'wrong');
            TestDOM.bgSilhouette.classList.add('revealed');

            setTimeout(() => {
                TestState.currentRound++;
                loadRound(TestState.currentRound);
            }, 2500);
        }
    }
}

// Mostrar feedback visual
function showFeedback(message, type) {
    TestDOM.testFeedback.textContent = message;
    TestDOM.testFeedback.className = `test-feedback ${type}`;
    TestDOM.testFeedback.style.display = 'block';

    TestDOM.testAnswer.disabled = true;
    TestDOM.btnSubmit.disabled = true;
}

// Mostrar resultados finales
function showTestResults() {
    TestState.isGameOver = true;
    stopTimer();

    const percentage = Math.round((TestState.score / TEST_ROUNDS.length) * 100);
    let resultMessage = '';
    let resultType = 'correct';

    if (TestState.score === TEST_ROUNDS.length) {
        resultMessage = GameState.mode === 'warning'
            ? '🃏 ¡Caos absoluto! Dominas el trolleo.'
            : '🏆 ¡Invocador experto! Conoces a todos los campeones.';
    } else if (TestState.score >= TEST_ROUNDS.length / 2) {
        resultMessage = GameState.mode === 'warning'
            ? '🃏 No está mal para ser un caos.'
            : '⚔️ Buen conocimiento, pero puedes mejorar.';
    } else {
        resultMessage = GameState.mode === 'warning'
            ? '🃏 El caos te ha devorado...'
            : '❌ Necesitas repasar tus campeones.';
    }

    TestDOM.testScreen.innerHTML = `
        <div style="text-align: center; max-width: 400px;">
            <h2 style="color: var(--lol-gold-500); font-family: var(--font-display); text-transform: uppercase; margin-bottom: var(--space-lg);">RESULTADOS</h2>
            <div style="font-size: 3rem; font-weight: 700; color: var(--lol-gold-500); margin-bottom: var(--space-md);">${TestState.score} / ${TEST_ROUNDS.length}</div>
            <p style="color: var(--lol-blue-200); margin-bottom: var(--space-xl);">${resultMessage}</p>
            <button class="btn-submit" onclick="location.reload()" style="width: auto; padding: var(--space-md) var(--space-xl);">VOLVER AL MENÚ</button>
        </div>
    `;

    console.log(`🏁 Prueba finalizada: ${TestState.score}/${TEST_ROUNDS.length} (${percentage}%)`);
}

// Pista: mostrar una letra del campeón
function showHint() {
    const round = TEST_ROUNDS[TestState.currentRound];
    if (!round.hint) return;

    const currentAnswer = TestDOM.testAnswer.value.trim();
    if (!currentAnswer) {
        const firstLetter = round.champion.charAt(0);
        TestDOM.testAnswer.value = firstLetter;
        showToast(`💡 Pista: ${round.hint}`, 'serious', 3000);
    } else {
        showToast(`💡 Pista: ${round.hint}`, 'serious', 3000);
    }
}

// Vincular eventos del test
function bindTestEvents() {
    if (!TestDOM.btnSubmit) return;

    TestDOM.btnSubmit.addEventListener('click', handleSubmitAnswer);

    TestDOM.testAnswer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmitAnswer();
        }
    });

    TestDOM.btnBack.addEventListener('click', () => {
        stopTimer();
        TestDOM.testScreen.classList.remove('visible');
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.style.display = 'flex';
        TestDOM.testScreen.innerHTML = '';
        location.reload();
    });

    TestDOM.btnHint.addEventListener('click', showHint);
}

// Exportar para debugging
window.LoLTests.testState = TestState;
window.LoLTests.initTestSystem = initTestSystem;
window.LoLTests.loadRound = loadRound;