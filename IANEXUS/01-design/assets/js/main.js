const DATA = {
  student: {
    theme: 'theme-student',
    kicker: 'Ruta recomendada',
    title: 'Empieza por planes gratuitos verificados para estudiantes',
    desc: 'Ahorra tiempo y dinero con herramientas que sí tienen plan educativo activo. Incluye guía de validación por plataforma y nivel de dificultad.',
    points: [
      'GitHub Student Pack, Notion Education y herramientas con free tier serio.',
      'Checklist para validar correo institucional y evitar bloqueos.',
      'Selección por carrera: ingeniería, medicina, diseño y humanidades.'
    ],
    cta: {
      label: 'Unirme al grupo Estudiantes',
      href: 'https://chat.whatsapp.com/tu-enlace-estudiantes'
    }
  },
  daily: {
    theme: 'theme-daily',
    kicker: 'Flujo diario',
    title: 'Reduce horas de tareas repetitivas con IA práctica',
    desc: 'Casos rápidos para estudio y trabajo: resumir documentos, organizar tareas, preparar presentaciones y automatizar mini procesos.',
    points: [
      'OpenClaw/agentes para research rápido y tareas pequeñas.',
      'Codex para automatización simple sin volverte programador full.',
      'Claude Agent para análisis profundo con tono humano.'
    ],
    cta: {
      label: 'Entrar al grupo Productividad IA',
      href: 'https://chat.whatsapp.com/tu-enlace-productividad'
    }
  },
  directory: {
    theme: 'theme-directory',
    kicker: 'Mapa completo',
    title: 'Explora el Directorio Maestro por área y objetivo',
    desc: 'Encuentra IA por especialidad: salud, programación, ingeniería, letras, economía, fitness y diseño. Con filtros por nivel y plan.',
    points: [
      'Incluye herramientas del momento + fundamentales que no fallan.',
      'Recomendaciones por perfil: principiante, intermedio, avanzado.',
      'Actualizaciones semanales para mantener el directorio vivo.'
    ],
    cta: {
      label: 'Ir al grupo Directorio y Tendencias',
      href: 'https://chat.whatsapp.com/tu-enlace-directorio'
    }
  }
};

const cards = [...document.querySelectorAll('.pillar-card')];
const panelKicker = document.getElementById('panel-kicker');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-desc');
const panelPoints = document.getElementById('panel-points');
const panelCta = document.getElementById('panel-cta');

function activatePillar(key) {
  const state = DATA[key];
  if (!state) return;

  cards.forEach((card) => {
    const isActive = card.dataset.pillar === key;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-selected', String(isActive));
  });

  document.body.classList.remove('theme-student', 'theme-daily', 'theme-directory');
  document.body.classList.add(state.theme);

  panelKicker.textContent = state.kicker;
  panelTitle.textContent = state.title;
  panelDesc.textContent = state.desc;

  panelPoints.innerHTML = '';
  state.points.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    panelPoints.appendChild(li);
  });

  panelCta.textContent = state.cta.label;
  panelCta.href = state.cta.href;
}

cards.forEach((card) => {
  card.addEventListener('click', () => activatePillar(card.dataset.pillar));
});
