const PILLAR_DATA = {
  student: {
    theme: 'theme-student',
    kicker: 'Ruta sugerida',
    title: 'Empieza con planes educativos que sí están activos',
    desc: 'Te mostramos herramientas con planes gratis reales para .edu, cómo validarlas y cómo aprovecharlas según tu carrera.',
    list: [
      'Comparativa por dificultad y curva de aprendizaje.',
      'Guía de activación del beneficio estudiantil.',
      'Selección por ingeniería, salud, diseño y humanidades.'
    ],
    news: 'GitHub Student Pack amplió beneficios para desarrollo y cloud.',
    prompt: '"Enséñame este tema en 3 niveles: básico, examen, aplicación real."',
    cta: {
      text: 'Unirme al grupo de Estudiantes',
      href: 'https://chat.whatsapp.com/tu-enlace-estudiantes'
    }
  },
  daily: {
    theme: 'theme-daily',
    kicker: 'Productividad diaria',
    title: 'Optimiza tareas repetitivas sin complejidad técnica',
    desc: 'Este pilar está pensado para resultados rápidos: resumir, organizar, escribir mejor y automatizar micro-flujos.',
    list: [
      'Prompts cortos para correos, resúmenes y planificación semanal.',
      'Guías para OpenClaw, Codex y asistentes de productividad.',
      'Ranking por facilidad de uso para principiantes.'
    ],
    news: 'Subió el interés en “IA para estudio” y “automatización sin código”.',
    prompt: '"Resume este documento en bullets accionables y una lista de pendientes."',
    cta: {
      text: 'Entrar al grupo de Productividad IA',
      href: 'https://chat.whatsapp.com/tu-enlace-productividad'
    }
  },
  directory: {
    theme: 'theme-directory',
    kicker: 'Mapa IA por especialidad',
    title: 'Explora el Directorio Maestro por área y objetivo',
    desc: 'Encuentra herramientas por salud, programación, ingeniería, letras, economía, fitness y diseño con contexto real.',
    list: [
      'Clasificación por área + nivel de experiencia.',
      'Indicador de plan: gratis, freemium, estudiante o pago.',
      'Actualización continua con tendencias y fundamentales.'
    ],
    news: 'Nuevas herramientas de diseño y presentación entraron al top mensual.',
    prompt: '"Dame 3 opciones de herramientas para [área] según nivel y presupuesto."',
    cta: {
      text: 'Unirme al grupo de Directorio y Tendencias',
      href: 'https://chat.whatsapp.com/tu-enlace-directorio'
    }
  }
};

const tabs = [...document.querySelectorAll('.pill')];
const panelKicker = document.getElementById('panel-kicker');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-desc');
const panelList = document.getElementById('panel-list');
const panelNews = document.getElementById('panel-news');
const panelPrompt = document.getElementById('panel-prompt');
const panelCta = document.getElementById('panel-cta');

function renderPillar(key) {
  const data = PILLAR_DATA[key];
  if (!data) return;

  tabs.forEach((tab) => {
    const active = tab.dataset.pillar === key;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  document.body.classList.remove('theme-student', 'theme-daily', 'theme-directory');
  document.body.classList.add(data.theme);

  panelKicker.textContent = data.kicker;
  panelTitle.textContent = data.title;
  panelDesc.textContent = data.desc;

  panelList.innerHTML = '';
  data.list.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    panelList.appendChild(li);
  });

  panelNews.textContent = data.news;
  panelPrompt.textContent = data.prompt;
  panelCta.textContent = data.cta.text;
  panelCta.href = data.cta.href;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => renderPillar(tab.dataset.pillar));
});
