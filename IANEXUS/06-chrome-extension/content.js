// Este script se inyecta en ChatGPT, Gemini y Claude

console.log("⚡ IA NEXUS: Extension Content Script Cargado");

// Función para inyectar el botón de "Skills" en la interfaz
function injectSkillButton() {
  const existingButton = document.getElementById("ianexus-skill-btn");
  if (existingButton) return;

  const btn = document.createElement("button");
  btn.id = "ianexus-skill-btn";
  btn.innerText = "⚡ IA NEXUS Skills";
  btn.title = "Añade una skill secreta a tu prompt (quedan 20 gratis)";
  
  // Estilos glassmorphism en el CSS (styles.css)
  btn.classList.add("ianexus-floating-btn");

  btn.addEventListener("click", () => {
    // Aquí es donde haremos la petición HTTP a la API de Next.js
    // Ejemplo: const response = await fetch("https://tusitio.com/api/skills");
    // const skill = await response.json();
    
    // Y luego inyectamos el texto en la caja de ChatGPT/Gemini
    insertTextInChatBox("⚡ [IA NEXUS Skill Activada: Ensayo Argumentativo]\n\nEscribe aquí tu tema...");
    
    alert("Skill inyectada. (En el futuro, esto se descontará de tu límite mensual o requerirá IA NEXUS Pro).");
  });

  document.body.appendChild(btn);
}

// Lógica básica para inyectar el texto (varía según si es ChatGPT, Gemini, etc.)
function insertTextInChatBox(text) {
  // Los editores modernos suelen usar contenteditable o textareas complejos
  const textarea = document.querySelector('textarea, div[contenteditable="true"]');
  if (textarea) {
    textarea.focus();
    document.execCommand('insertText', false, text);
    // Para React/Angular, a veces hay que forzar el evento 'input'
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
  } else {
    console.warn("IA NEXUS: No se encontró la caja de texto.");
  }
}

// Intentar inyectar repetidamente (por si la página es una SPA que carga lento)
setInterval(injectSkillButton, 2000);
