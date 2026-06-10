// =====================================================
// POLLA MUNDIALISTA 2026 — script.js (versión final)
// ⚠️  ANTES DE SUBIR:
//   1. Reemplaza REEMPLAZA_CON_TU_API_KEY
//   2. Reemplaza REEMPLAZA_CON_TU_UID_DE_ADMIN
// =====================================================

const firebaseConfig = {
    apiKey:            "AIzaSyANRuJ29fTj2hmbSuIFXlbTlhT36f3su9o",
    authDomain:        "pollamundialista-31268.firebaseapp.com",
    projectId:         "pollamundialista-31268",
    storageBucket:     "pollamundialista-31268.firebasestorage.app",
    messagingSenderId: "836692716321",
    appId:             "1:836692716321:web:32ff9a5591786ff77aec60",
    measurementId:     "G-38D0DZ7XB3"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();

let usuarioActual  = null;
let totalGuardados = 0;
const ADMIN_UID    = "YNFk9pArZ0S4PFcEgPxAr3a5Hmr2";

// =====================================================
// CALENDARIO OFICIAL MUNDIAL 2026 — 64 partidos
// Horario Colombia (UTC-5)
// =====================================================
const partidosMundial = [

    // ── GRUPO A: México · Corea del Sur · Rep. Checa · Sudáfrica ──
    { id:1,  dia:"Jue 11 Jun", grupo:"Grupo A", local:"México",         visitante:"Sudáfrica",      bL:"🇲🇽", bV:"🇿🇦", est:"Ciudad de México",  hora:"2:00 p.m." },
    { id:2,  dia:"Jue 11 Jun", grupo:"Grupo A", local:"Corea del Sur",  visitante:"Rep. Checa",     bL:"🇰🇷", bV:"🇨🇿", est:"Guadalajara",        hora:"9:00 p.m." },
    { id:3,  dia:"Jue 18 Jun", grupo:"Grupo A", local:"Rep. Checa",     visitante:"Sudáfrica",      bL:"🇨🇿", bV:"🇿🇦", est:"Atlanta",            hora:"11:00 a.m." },
    { id:4,  dia:"Jue 18 Jun", grupo:"Grupo A", local:"México",         visitante:"Corea del Sur",  bL:"🇲🇽", bV:"🇰🇷", est:"Guadalajara",        hora:"8:00 p.m." },
    { id:5,  dia:"Mié 25 Jun", grupo:"Grupo A", local:"Sudáfrica",      visitante:"Corea del Sur",  bL:"🇿🇦", bV:"🇰🇷", est:"Por Confirmar",      hora:"" },
    { id:6,  dia:"Mié 25 Jun", grupo:"Grupo A", local:"México",         visitante:"Rep. Checa",     bL:"🇲🇽", bV:"🇨🇿", est:"Por Confirmar",      hora:"" },

    // ── GRUPO B: Canadá · Bosnia y Herz. · Qatar · Suiza ──
    { id:7,  dia:"Vie 12 Jun", grupo:"Grupo B", local:"Canadá",         visitante:"Bosnia y Herz.", bL:"🇨🇦", bV:"🇧🇦", est:"Toronto",            hora:"2:00 p.m." },
    { id:8,  dia:"Vie 12 Jun", grupo:"Grupo B", local:"Estados Unidos", visitante:"Paraguay",       bL:"🇺🇸", bV:"🇵🇾", est:"Los Ángeles",        hora:"8:00 p.m." },
    { id:9,  dia:"Jue 18 Jun", grupo:"Grupo B", local:"Suiza",          visitante:"Bosnia y Herz.", bL:"🇨🇭", bV:"🇧🇦", est:"Los Ángeles",        hora:"2:00 p.m." },
    { id:10, dia:"Jue 18 Jun", grupo:"Grupo B", local:"Canadá",         visitante:"Qatar",          bL:"🇨🇦", bV:"🇶🇦", est:"Vancouver",          hora:"5:00 p.m." },
    { id:11, dia:"Mié 24 Jun", grupo:"Grupo B", local:"Suiza",          visitante:"Canadá",         bL:"🇨🇭", bV:"🇨🇦", est:"Vancouver",          hora:"2:00 p.m." },
    { id:12, dia:"Mié 24 Jun", grupo:"Grupo B", local:"Bosnia y Herz.", visitante:"Qatar",          bL:"🇧🇦", bV:"🇶🇦", est:"Seattle",            hora:"2:00 p.m." },

    // ── GRUPO C: Brasil · Marruecos · Haití · Escocia ──
    { id:13, dia:"Sáb 13 Jun", grupo:"Grupo C", local:"Qatar",          visitante:"Suiza",          bL:"🇶🇦", bV:"🇨🇭", est:"San Francisco",      hora:"2:00 p.m." },
    { id:14, dia:"Sáb 13 Jun", grupo:"Grupo C", local:"Brasil",         visitante:"Marruecos",      bL:"🇧🇷", bV:"🇲🇦", est:"Nueva Jersey",       hora:"5:00 p.m." },
    { id:15, dia:"Sáb 13 Jun", grupo:"Grupo C", local:"Haití",          visitante:"Escocia",        bL:"🇭🇹", bV:"🏴",   est:"Boston",             hora:"8:00 p.m." },
    { id:16, dia:"Sáb 20 Jun", grupo:"Grupo C", local:"Brasil",         visitante:"Haití",          bL:"🇧🇷", bV:"🇭🇹", est:"Philadelphia",       hora:"7:30 p.m." },
    { id:17, dia:"Sáb 20 Jun", grupo:"Grupo C", local:"Escocia",        visitante:"Marruecos",      bL:"🏴",   bV:"🇲🇦", est:"Boston",             hora:"5:00 p.m." },
    { id:18, dia:"Mar 24 Jun", grupo:"Grupo C", local:"Marruecos",      visitante:"Haití",          bL:"🇲🇦", bV:"🇭🇹", est:"Atlanta",            hora:"5:00 p.m." },

    // ── GRUPO D: Alemania · Curazao · Costa de Marfil · Ecuador ──
    { id:19, dia:"Dom 14 Jun", grupo:"Grupo D", local:"Alemania",        visitante:"Curazao",         bL:"🇩🇪", bV:"🇨🇼", est:"Houston",           hora:"12:00 p.m." },
    { id:20, dia:"Dom 14 Jun", grupo:"Grupo D", local:"Países Bajos",    visitante:"Japón",           bL:"🇳🇱", bV:"🇯🇵", est:"Dallas",            hora:"3:00 p.m." },
    { id:21, dia:"Dom 14 Jun", grupo:"Grupo D", local:"Costa de Marfil", visitante:"Ecuador",         bL:"🇨🇮", bV:"🇪🇨", est:"Philadelphia",      hora:"6:00 p.m." },
    { id:22, dia:"Sáb 20 Jun", grupo:"Grupo D", local:"Países Bajos",    visitante:"Suecia",          bL:"🇳🇱", bV:"🇸🇪", est:"Houston",           hora:"12:00 p.m." },
    { id:23, dia:"Sáb 20 Jun", grupo:"Grupo D", local:"Alemania",        visitante:"Costa de Marfil", bL:"🇩🇪", bV:"🇨🇮", est:"Toronto",           hora:"3:00 p.m." },
    { id:24, dia:"Sáb 20 Jun", grupo:"Grupo D", local:"Ecuador",         visitante:"Curazao",         bL:"🇪🇨", bV:"🇨🇼", est:"Kansas City",       hora:"7:00 p.m." },

    // ── GRUPO E: España · Cabo Verde · Arabia Saudita · Uruguay ──
    { id:25, dia:"Lun 15 Jun", grupo:"Grupo E", local:"España",          visitante:"Cabo Verde",      bL:"🇪🇸", bV:"🇨🇻", est:"Atlanta",           hora:"11:00 a.m." },
    { id:26, dia:"Lun 15 Jun", grupo:"Grupo E", local:"Bélgica",         visitante:"Egipto",          bL:"🇧🇪", bV:"🇪🇬", est:"Seattle",           hora:"2:00 p.m." },
    { id:27, dia:"Lun 15 Jun", grupo:"Grupo E", local:"Arabia Saudita",  visitante:"Uruguay",         bL:"🇸🇦", bV:"🇺🇾", est:"Miami",             hora:"5:00 p.m." },
    { id:28, dia:"Dom 22 Jun", grupo:"Grupo E", local:"Argentina",        visitante:"Austria",         bL:"🇦🇷", bV:"🇦🇹", est:"Dallas",            hora:"12:00 p.m." },
    { id:29, dia:"Dom 22 Jun", grupo:"Grupo E", local:"Francia",          visitante:"Irak",            bL:"🇫🇷", bV:"🇮🇶", est:"Philadelphia",      hora:"4:00 p.m." },
    { id:30, dia:"Dom 22 Jun", grupo:"Grupo E", local:"Noruega",          visitante:"Senegal",         bL:"🇳🇴", bV:"🇸🇳", est:"Nueva Jersey",      hora:"7:00 p.m." },

    // ── GRUPO F: Francia · Senegal · Irak · Noruega ──
    { id:31, dia:"Mar 16 Jun", grupo:"Grupo F", local:"Francia",          visitante:"Senegal",         bL:"🇫🇷", bV:"🇸🇳", est:"Nueva Jersey",      hora:"2:00 p.m." },
    { id:32, dia:"Mar 16 Jun", grupo:"Grupo F", local:"Irak",             visitante:"Noruega",         bL:"🇮🇶", bV:"🇳🇴", est:"Boston",            hora:"5:00 p.m." },
    { id:33, dia:"Mar 16 Jun", grupo:"Grupo F", local:"Argentina",        visitante:"Argelia",         bL:"🇦🇷", bV:"🇩🇿", est:"Kansas City",       hora:"8:00 p.m." },
    { id:34, dia:"Lun 23 Jun", grupo:"Grupo F", local:"Portugal",         visitante:"Uzbekistán",      bL:"🇵🇹", bV:"🇺🇿", est:"Houston",           hora:"12:00 p.m." },
    { id:35, dia:"Lun 23 Jun", grupo:"Grupo F", local:"Inglaterra",       visitante:"Ghana",           bL:"🇬🇧", bV:"🇬🇭", est:"Boston",            hora:"3:00 p.m." },
    { id:36, dia:"Lun 23 Jun", grupo:"Grupo F", local:"Panamá",           visitante:"Croacia",         bL:"🇵🇦", bV:"🇭🇷", est:"Toronto",           hora:"6:00 p.m." },

    // ── GRUPO G: Portugal · RD Congo · Uzbekistán · Colombia ──
    { id:37, dia:"Mié 17 Jun", grupo:"Grupo G", local:"Portugal",         visitante:"RD Congo",        bL:"🇵🇹", bV:"🇨🇩", est:"Houston",           hora:"12:00 p.m." },
    { id:38, dia:"Mié 17 Jun", grupo:"Grupo G", local:"Inglaterra",       visitante:"Croacia",         bL:"🇬🇧", bV:"🇭🇷", est:"Dallas",            hora:"3:00 p.m." },
    { id:39, dia:"Mié 17 Jun", grupo:"Grupo G", local:"Ghana",            visitante:"Panamá",          bL:"🇬🇭", bV:"🇵🇦", est:"Toronto",           hora:"6:00 p.m." },
    { id:40, dia:"Mié 17 Jun", grupo:"Grupo G", local:"Uzbekistán",       visitante:"Colombia",        bL:"🇺🇿", bV:"🇨🇴", est:"Ciudad de México",  hora:"9:00 p.m." },
    { id:41, dia:"Mar 23 Jun", grupo:"Grupo G", local:"Colombia",         visitante:"RD Congo",        bL:"🇨🇴", bV:"🇨🇩", est:"Guadalajara",       hora:"9:00 p.m." },
    { id:42, dia:"Sáb 27 Jun", grupo:"Grupo G", local:"Colombia",         visitante:"Portugal",        bL:"🇨🇴", bV:"🇵🇹", est:"Miami",             hora:"6:30 p.m." },

    // ── GRUPO H: España · Cabo Verde · Arabia Saudita · Uruguay ──
    { id:43, dia:"Dom 21 Jun", grupo:"Grupo H", local:"España",           visitante:"Arabia Saudita",  bL:"🇪🇸", bV:"🇸🇦", est:"Atlanta",           hora:"11:00 a.m." },
    { id:44, dia:"Dom 21 Jun", grupo:"Grupo H", local:"Bélgica",          visitante:"Irán",            bL:"🇧🇪", bV:"🇮🇷", est:"Los Ángeles",       hora:"2:00 p.m." },
    { id:45, dia:"Dom 21 Jun", grupo:"Grupo H", local:"Uruguay",          visitante:"Cabo Verde",      bL:"🇺🇾", bV:"🇨🇻", est:"Miami",             hora:"5:00 p.m." },
    { id:46, dia:"Dom 21 Jun", grupo:"Grupo H", local:"Nueva Zelanda",    visitante:"Egipto",          bL:"🇳🇿", bV:"🇪🇬", est:"Vancouver",         hora:"8:00 p.m." },
    { id:47, dia:"Vie 26 Jun", grupo:"Grupo H", local:"Uruguay",          visitante:"España",          bL:"🇺🇾", bV:"🇪🇸", est:"Guadalajara",       hora:"7:00 p.m." },
    { id:48, dia:"Sáb 27 Jun", grupo:"Grupo H", local:"Jordan",           visitante:"Argentina",       bL:"🇯🇴", bV:"🇦🇷", est:"Dallas",            hora:"9:00 p.m." },

    // ── OCTAVOS DE FINAL ──
    { id:49, dia:"Mar 1 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo A", visitante:"2° Grupo B", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:50, dia:"Mar 1 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo C", visitante:"2° Grupo D", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:51, dia:"Mié 2 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo E", visitante:"2° Grupo F", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:52, dia:"Mié 2 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo G", visitante:"2° Grupo H", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:53, dia:"Jue 3 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo B", visitante:"2° Grupo A", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:54, dia:"Jue 3 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo D", visitante:"2° Grupo C", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:55, dia:"Vie 4 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo F", visitante:"2° Grupo E", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:56, dia:"Vie 4 Jul",  grupo:"⚡ Octavos",    local:"1° Grupo H", visitante:"2° Grupo G", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },

    // ── CUARTOS DE FINAL ──
    { id:57, dia:"Mar 8 Jul",  grupo:"🔥 Cuartos",    local:"G. P49", visitante:"G. P50", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:58, dia:"Mar 8 Jul",  grupo:"🔥 Cuartos",    local:"G. P51", visitante:"G. P52", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:59, dia:"Mié 9 Jul",  grupo:"🔥 Cuartos",    local:"G. P53", visitante:"G. P54", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },
    { id:60, dia:"Mié 9 Jul",  grupo:"🔥 Cuartos",    local:"G. P55", visitante:"G. P56", bL:"🏆", bV:"🏆", est:"Por Definir", hora:"" },

    // ── SEMIFINALES ──
    { id:61, dia:"Mar 15 Jul", grupo:"🌟 Semifinal",  local:"G. P57", visitante:"G. P58", bL:"🏆", bV:"🏆", est:"MetLife Stadium, NJ",     hora:"" },
    { id:62, dia:"Mié 16 Jul", grupo:"🌟 Semifinal",  local:"G. P59", visitante:"G. P60", bL:"🏆", bV:"🏆", est:"AT&T Stadium, Dallas",    hora:"" },

    // ── TERCER PUESTO ──
    { id:63, dia:"Sáb 19 Jul", grupo:"🥉 3er Puesto", local:"P. P61", visitante:"P. P62", bL:"🥉", bV:"🥉", est:"Hard Rock Stadium, Miami", hora:"" },

    // ── GRAN FINAL ──
    { id:64, dia:"Dom 20 Jul", grupo:"🏆 GRAN FINAL", local:"G. P61", visitante:"G. P62", bL:"🏆", bV:"🏆", est:"MetLife Stadium, NJ",     hora:"" }
];

// =====================================================
// REFERENCIAS DOM
// =====================================================
const sectionAuth   = document.getElementById('section-auth');
const sectionApp    = document.getElementById('section-app');
const boxLogin      = document.getElementById('box-login');
const boxRegister   = document.getElementById('box-register');
const displayUser   = document.getElementById('display-user-name');
const cntGuardados  = document.getElementById('count-guardados');
const cntPendientes = document.getElementById('count-pendientes');
const cntPuntos     = document.getElementById('count-puntos');

// ── Toggle login / registro ──
document.getElementById('go-to-register').addEventListener('click', () => {
    boxLogin.classList.add('hidden');
    boxRegister.classList.remove('hidden');
});
document.getElementById('go-to-login').addEventListener('click', () => {
    boxRegister.classList.add('hidden');
    boxLogin.classList.remove('hidden');
});

// =====================================================
// REGISTRO
// =====================================================
document.getElementById('form-register').addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('register-name').value.trim();
    const email  = document.getElementById('register-email').value.trim();
    const pass   = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then(cred => cred.user.updateProfile({ displayName: nombre }).then(() =>
            db.collection('usuarios').doc(cred.user.uid).set({ nombre, email, puntosTotales: 0 })
        ))
        .then(() => {
            showToast('🎉 Cuenta creada. ¡Bienvenido!');
            document.getElementById('form-register').reset();
        })
        .catch(err => showToast('❌ ' + err.message));
});

// =====================================================
// LOGIN
// =====================================================
document.getElementById('form-login').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, pass)
        .then(() => showToast('🔓 Sesión iniciada.'))
        .catch(() => showToast('❌ Correo o contraseña incorrectos.'));
});

// =====================================================
// LOGOUT
// =====================================================
document.getElementById('btn-logout').addEventListener('click', () => {
    auth.signOut().then(() => showToast('🔒 Sesión cerrada.'));
});

// =====================================================
// ESTADO DE SESIÓN — único onAuthStateChanged
// =====================================================
auth.onAuthStateChanged(user => {
    if (user) {
        usuarioActual = user;
        sectionAuth.classList.add('hidden');
        sectionApp.classList.remove('hidden');
        displayUser.textContent = user.displayName || 'Participante';
        renderizarCalendario();
        cargarPronosticosGuardados();
        cargarResultadosRegistrados();
        // Activar panel admin si corresponde
        if (user.uid === ADMIN_UID) {
            setTimeout(activarBotonesAdmin, 600);
        }
    } else {
        usuarioActual = null;
        totalGuardados = 0;
        sectionApp.classList.add('hidden');
        sectionAuth.classList.remove('hidden');
    }
});

// =====================================================
// RENDERIZAR CALENDARIO AGRUPADO POR DÍA
// =====================================================
function renderizarCalendario() {
    const contenedor = document.getElementById('calendario-dias-container');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    totalGuardados = 0;

    const dias = [];
    const grupos = {};
    partidosMundial.forEach(p => {
        if (!grupos[p.dia]) { grupos[p.dia] = []; dias.push(p.dia); }
        grupos[p.dia].push(p);
    });

    dias.forEach(dia => {
        const bloque = document.createElement('div');
        bloque.className = 'day-block';
        bloque.innerHTML = `<h3 class="day-title">📅 ${dia}</h3><div class="matches-grid"></div>`;
        contenedor.appendChild(bloque);
        const grid = bloque.querySelector('.matches-grid');
        grupos[dia].forEach(p => grid.insertAdjacentHTML('beforeend', crearTarjetaHTML(p)));
    });

    actualizarResumen();
}

function crearTarjetaHTML(p) {
    const horaHTML = p.hora ? ` &nbsp;·&nbsp; 🕐 ${p.hora}` : '';
    return `
    <div class="match-card" id="card-${p.id}">
        <div class="match-group">${p.grupo}</div>
        <div class="match-details">🏟️ ${p.est}${horaHTML}</div>
        <div class="match-teams">
            <div class="team">
                <div class="team-info-left">
                    <span class="flag">${p.bL}</span>
                    <span class="team-name">${p.local}</span>
                </div>
                <input type="number" id="m${p.id}-local" min="0" max="99" class="score-input" placeholder="0">
            </div>
            <div class="vs">VS</div>
            <div class="team">
                <div class="team-info-left">
                    <span class="flag">${p.bV}</span>
                    <span class="team-name">${p.visitante}</span>
                </div>
                <input type="number" id="m${p.id}-visitante" min="0" max="99" class="score-input" placeholder="0">
            </div>
        </div>
        <p class="status-indicator" id="status-${p.id}">Sin registrar apuesta</p>
        <button onclick="guardarApuesta(${p.id})" class="btn-save" id="btn-${p.id}">
            Guardar Marcador ⚽
        </button>
        <button onclick="abrirAdmin(${p.id})" class="btn-admin hidden" id="btn-admin-${p.id}">
            ⚙️ Ingresar Resultado Real
        </button>
    </div>`;
}

// =====================================================
// GUARDAR APUESTA Y BLOQUEAR
// =====================================================
window.guardarApuesta = function(idPartido) {
    if (!usuarioActual) return;

    const inpL = document.getElementById(`m${idPartido}-local`);
    const inpV = document.getElementById(`m${idPartido}-visitante`);

    if (!inpL || inpL.value === '' || !inpV || inpV.value === '') {
        showToast('⚠️ Ingresa el marcador de ambos equipos.');
        return;
    }

    const gL    = parseInt(inpL.value);
    const gV    = parseInt(inpV.value);
    const docId = `${usuarioActual.uid}_partido_${idPartido}`;

    db.collection('pronosticos').doc(docId).set({
        idUsuario:               usuarioActual.uid,
        nombreUsuario:           usuarioActual.displayName || 'Participante',
        idPartido,
        golesLocalPrediccion:    gL,
        golesVisitantePrediccion: gV,
        fechaRegistro:           firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        bloquearTarjeta(idPartido, gL, gV);
        totalGuardados++;
        actualizarResumen();
        showToast('🔒 Apuesta guardada. ¡No se puede modificar!');
    })
    .catch(err => { console.error(err); showToast('❌ Error al guardar.'); });
};

// =====================================================
// BLOQUEAR TARJETA
// =====================================================
function bloquearTarjeta(idPartido, gL, gV) {
    const inpL = document.getElementById(`m${idPartido}-local`);
    const inpV = document.getElementById(`m${idPartido}-visitante`);
    const ind  = document.getElementById(`status-${idPartido}`);
    const btn  = document.getElementById(`btn-${idPartido}`);
    const card = document.getElementById(`card-${idPartido}`);

    if (inpL) { inpL.value = gL; inpL.disabled = true; }
    if (inpV) { inpV.value = gV; inpV.disabled = true; }
    if (ind)  { ind.textContent = `🔒 Tu apuesta: ${gL} - ${gV}`; ind.style.color = '#10b981'; }
    if (btn)  btn.style.display = 'none';
    if (card) card.classList.add('locked');
}

// =====================================================
// CARGAR APUESTAS PREVIAS AL INICIAR SESIÓN
// =====================================================
function cargarPronosticosGuardados() {
    if (!usuarioActual) return;
    totalGuardados = 0;

    db.collection('pronosticos')
      .where('idUsuario', '==', usuarioActual.uid)
      .get()
      .then(snap => {
          snap.forEach(doc => {
              const d = doc.data();
              bloquearTarjeta(d.idPartido, d.golesLocalPrediccion, d.golesVisitantePrediccion);
              totalGuardados++;
          });
          actualizarResumen();
          // Cargar puntos
          db.collection('usuarios').doc(usuarioActual.uid).get().then(uDoc => {
              if (uDoc.exists) cntPuntos.textContent = uDoc.data().puntosTotales || 0;
          });
      })
      .catch(err => console.error('Error cargando pronósticos:', err));
}

// =====================================================
// BARRA DE RESUMEN
// =====================================================
function actualizarResumen() {
    const pendientes = partidosMundial.length - totalGuardados;
    if (cntGuardados)  cntGuardados.textContent  = totalGuardados;
    if (cntPendientes) cntPendientes.textContent = Math.max(0, pendientes);
}

// =====================================================
// PESTAÑAS
// =====================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'tab-ranking') cargarRanking();
    });
});

// =====================================================
// TABLA DE POSICIONES
// =====================================================
function cargarRanking() {
    const tbody = document.getElementById('ranking-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b;padding:20px">Cargando...</td></tr>';

    db.collection('usuarios').orderBy('puntosTotales', 'desc').get()
      .then(snap => {
          tbody.innerHTML = '';
          if (snap.empty) {
              tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b;padding:20px">Aún no hay participantes</td></tr>';
              return;
          }
          let pos = 1;
          snap.forEach(doc => {
              const u     = doc.data();
              const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
              const esYo  = usuarioActual && doc.id === usuarioActual.uid;
              tbody.insertAdjacentHTML('beforeend', `
                  <tr${esYo ? ' style="background:rgba(37,99,235,0.12)"' : ''}>
                      <td class="rank-pos">${medal}</td>
                      <td>👤 ${u.nombre}${esYo ? ' <span style="color:#f59e0b;font-size:0.75rem">(tú)</span>' : ''}</td>
                      <td class="rank-pts">${u.puntosTotales || 0} pts</td>
                  </tr>`);
              pos++;
          });
      })
      .catch(() => {
          tbody.innerHTML = '<tr><td colspan="3" style="color:#ef4444;text-align:center">Error al cargar</td></tr>';
      });
}

// =====================================================
// SISTEMA DE PUNTUACIÓN
// 🥇 Marcador exacto  → 3 pts
// ✅ Ganador correcto  → 1 pt
// 🤝 Empate correcto  → 1 pt
// ❌ Incorrecto        → 0 pts
// =====================================================
function calcularPuntos(pL, pV, rL, rV) {
    if (pL === rL && pV === rV) return 3;
    if (Math.sign(pL - pV) === Math.sign(rL - rV)) return 1;
    return 0;
}

window.registrarResultadoReal = async function(idPartido, rL, rV) {
    if (!usuarioActual) return;

    await db.collection('resultados').doc(`partido_${idPartido}`).set({
        idPartido, golesLocal: rL, golesVisitante: rV,
        registradoPor: usuarioActual.uid,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    });

    const snap  = await db.collection('pronosticos').where('idPartido', '==', idPartido).get();
    const batch = db.batch();

    snap.forEach(doc => {
        const d      = doc.data();
        const puntos = calcularPuntos(d.golesLocalPrediccion, d.golesVisitantePrediccion, rL, rV);
        batch.update(doc.ref, { puntosObtenidos: puntos, evaluado: true });
        batch.update(db.collection('usuarios').doc(d.idUsuario), {
            puntosTotales: firebase.firestore.FieldValue.increment(puntos)
        });
    });

    await batch.commit();
    mostrarResultadoEnTarjeta(idPartido, rL, rV);
    showToast(`✅ Resultado del partido ${idPartido} guardado.`);
};

async function mostrarResultadoEnTarjeta(idPartido, rL, rV) {
    if (!usuarioActual) return;
    const docId  = `${usuarioActual.uid}_partido_${idPartido}`;
    const proDoc = await db.collection('pronosticos').doc(docId).get();
    if (!proDoc.exists) return;

    const d      = proDoc.data();
    const puntos = calcularPuntos(d.golesLocalPrediccion, d.golesVisitantePrediccion, rL, rV);
    const ind    = document.getElementById(`status-${idPartido}`);
    if (!ind) return;

    const label = puntos === 3 ? '🥇 ¡Exacto!'         :
                  puntos === 1 ? '✅ Ganador correcto'   : '❌ Sin puntos';
    const color = puntos === 3 ? '#f59e0b' :
                  puntos === 1 ? '#10b981' : '#ef4444';

    ind.innerHTML =
        `🔒 Apuesta: ${d.golesLocalPrediccion}-${d.golesVisitantePrediccion} &nbsp;|&nbsp; ` +
        `Real: <strong>${rL}-${rV}</strong> &nbsp;` +
        `<span style="color:${color};font-weight:700">${label} (+${puntos} pts)</span>`;
    ind.style.color = '#94a3b8';

    const uDoc = await db.collection('usuarios').doc(usuarioActual.uid).get();
    if (uDoc.exists) cntPuntos.textContent = uDoc.data().puntosTotales || 0;
}

async function cargarResultadosRegistrados() {
    try {
        const snap = await db.collection('resultados').get();
        snap.forEach(doc => {
            const r = doc.data();
            mostrarResultadoEnTarjeta(r.idPartido, r.golesLocal, r.golesVisitante);
        });
    } catch(e) { console.error('Error cargando resultados:', e); }
}

// =====================================================
// PANEL ADMIN
// =====================================================
let _adminPartidoId = null;

function activarBotonesAdmin() {
    document.querySelectorAll('[id^="btn-admin-"]').forEach(btn => btn.classList.remove('hidden'));
}

window.abrirAdmin = function(idPartido) {
    const p = partidosMundial.find(x => x.id === idPartido);
    if (!p) return;
    _adminPartidoId = idPartido;

    document.getElementById('admin-partido-num').textContent      = idPartido;
    document.getElementById('admin-partido-nombre').textContent   = `${p.local} vs ${p.visitante}`;
    document.getElementById('admin-local-nombre').textContent     = p.local;
    document.getElementById('admin-visitante-nombre').textContent = p.visitante;
    document.getElementById('admin-goles-local').value     = '';
    document.getElementById('admin-goles-visitante').value = '';
    document.getElementById('modal-admin').classList.remove('hidden');
};

window.confirmarResultado = async function() {
    const gL = document.getElementById('admin-goles-local').value;
    const gV = document.getElementById('admin-goles-visitante').value;
    if (gL === '' || gV === '') { showToast('⚠️ Ingresa el marcador completo.'); return; }
    await registrarResultadoReal(_adminPartidoId, parseInt(gL), parseInt(gV));
    cerrarAdmin();
};

window.cerrarAdmin = function() {
    document.getElementById('modal-admin').classList.add('hidden');
    _adminPartidoId = null;
};

document.getElementById('modal-admin').addEventListener('click', function(e) {
    if (e.target === this) cerrarAdmin();
});

// =====================================================
// TOAST
// =====================================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.add('hidden'), 3500);
}
