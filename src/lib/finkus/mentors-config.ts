// -----------------------------------------------------------------------------
// Finkus Mentors Config
// Archivo central de configuración estática para el onboarding:
// - Mentors
// - Objectives
// - Challenges
// - Ambits (var1)
// - Tones (var2)
// - Panel texts (lado izquierdo)
//
// Se importa desde la UI del onboarding (Step 1).
// -----------------------------------------------------------------------------

export type MentorId = "productivity" | "wisdom";

export interface PanelTexts {
  mentor: string;
  objective: string;
  challenge: string;
  vars: string;
}

export interface ObjectiveItem {
  id: string;
  name: string;
  description?: string;
}

export interface ChallengeItem {
  id: string;
  name: string;
  // En Sabiduría algunos challenges aplican solo a ciertos objectives
  objectiveUse?: string[];
}

export interface AmbitItem {
  id: string;
  name: string;
  description?: string;
  // En Sabiduría algunos ambits aplican solo a ciertos objectives
  objectiveUse?: string[];
}

export interface ToneItem {
  id: string;
  name: string;
  description?: string;
  definitionUser?: string;
}
// rango de niveles
export interface LevelRange {
  level: number;     // número de nivel (1, 2, 3, ...)
  startDay: number;  // día inicial (incluido)
  endDay: number;    // día final (incluido)
}

// 🔹 NUEVO: bloque de preguntas específicas por mentor
export interface MentorQuestions {
  objectiveLabel: string;
  challengeLabel: string;
  ambitLabel: string;
  toneLabel: string;
}


export interface MentorConfig {
  id: MentorId;
  name: string;
  shortDescription: string;
  panelTexts: PanelTexts;
// 🔹 NUEVO: preguntas del formulario (Step 1) específicas por mentor
  questions: MentorQuestions;
  objectives: ObjectiveItem[];
  challenges: ChallengeItem[];
  ambits: AmbitItem[];
  tones: ToneItem[];
  levels: LevelRange[];
  // Espacio reservado para futuras reglas avanzadas si las necesitas
  // rules?: {
  //   challengesByObjective?: Record<string, string[]>;
  //   ambitsByObjective?: Record<string, string[]>;
  // };
}

// -----------------------------------------------------------------------------
// PRODUCTIVITY
// (datos tomados de mentors/productivity/objectives.py)
// -----------------------------------------------------------------------------

const PRODUCTIVITY_CONFIG: MentorConfig = {
  id: "productivity",
  name: "Productividad",
  shortDescription:
    "Mensajes diarios para romper la inercia, organizar tus días y avanzar en lo que importa.",

  panelTexts: {
    mentor:
      "El mentor de productividad te ayuda a pasar de intención a acción",
    objective:
      "El objetivo marca hacia dónde empujaremos cada día.",
    challenge:
      "El desafío es el freno principal. Nos ayuda a ajustar tono y tipo de acción.",
    vars:
      "El ámbito indica dónde aplicarás los cambios. El tono define cómo quieres que Finkus te hable.",
  },

  // 🔹 NUEVO: preguntas por defecto para Productividad
  questions: {
    objectiveLabel: "¿Cuál de estos objetivos de productividad quieres lograr? *",
    challengeLabel: "¿Qué es lo que más te está impidiendo avanzar? *",
    ambitLabel: "¿En qué ámbito quieres aplicar tu guía? *",
    toneLabel: "¿Que tono prefieres? *",
  },

  objectives: [
    {
      id: "procrastinacion",
      name: "Superar procrastinación",
      description:
        "Construir constancia diaria reduciendo la postergación mediante disparadores claros, bloques de foco y fricción mínima para empezar.",
    },
    {
      id: "planificacion",
      name: "Planificar días y semanas",
      description:
        "Diseñar una agenda realista con tiempos, prioridades y buffers, aterrizando compromisos clave y evitando sobrecarga.",
    },
    {
      id: "priorizacion",
      name: "Priorizar con criterio",
      description:
        "Elegir lo esencial primero usando criterios simples (impacto, urgencia, energía disponible) y limitar el trabajo en progreso.",
    },
    {
      id: "interrupciones",
      name: "Eliminar interrupciones",
      description:
        "Proteger ventanas de foco gestionando notificaciones, límites con terceros y reglas de acceso al tiempo.",
    },
  ],

  challenges: [
    { id: "claridad", name: "Falta de claridad" },
    { id: "distraccion", name: "Distracción / falta de foco" },
    { id: "motivacion", name: "Baja motivación o energía" },
    { id: "decision", name: "Dificultad para decidir y priorizar" },
    { id: "ansiedad", name: "Ansiedad" },
    { id: "pseudo_productividad", name: "Pseudo-productividad" },
  ],

  ambits: [
    {
      id: "trabajo",
      name: "Trabajo o profesión",
      description:
        "Aplicar la productividad en actividades laborales o profesionales para mejorar las tareas del trabajo diario.",
    },
    {
      id: "estudio",
      name: "Estudio o aprendizaje",
      description:
        "Usar la productividad para mejorar el estudio o formación continua.",
    },
    {
      id: "hogar",
      name: "Hogar o vida personal",
      description:
        "Optimizar rutinas diarias, tiempo personal y responsabilidades familiares.",
    },
    {
      id: "proyectos",
      name: "Proyectos personales",
      description:
        "Aplicar la productividad en iniciativas propias, emprendimientos o proyectos creativos que requieren constancia y autogestión.",
    },
    {
      id: "vida_integral",
      name: "Vida integral (general)",
      description:
        "Usar la productividad de forma transversal para equilibrar distintos ámbitos del día.",
    },
  ],

  tones: [
    {
      id: "amigable",
      name: "Amigable",
      description:
        "Empático, cálido y motivador. Usa frases suaves y ánimo positivo.",
    },
    {
      id: "directo",
      name: "Directo",
      description:
        "Claro, conciso y sin rodeos. Invita a actuar con decisión.",
    },
    {
      id: "retador",
      name: "Retador y exigente",
      description:
        "Firme, tipo coach. Motiva con pequeños desafíos para salir de la zona cómoda.",
    },
    {
      id: "profesional",
      name: "Profesional",
      description:
        "Técnico y orientado a método. Transmite orden, lógica y precisión.",
    },
    {
      id: "inspirador",
      name: "Inspirador",
      description:
        "Elevado y motivacional. Reafirma propósito y sentido del esfuerzo.",
    },
    {
      id: "ligero",
      name: "Ligero y con humor leve",
      description:
        "Tono fresco y natural, usa humor sutil o giros simpáticos sin perder foco.",
    },
  ],
  // 🔹 Rango oficial de niveles para Productividad
  levels: [
    { level: 1, startDay: 1,  endDay: 7  },  // Nivel 1: días 1–7
    { level: 2, startDay: 8,  endDay: 15 },  // Nivel 2: días 8–15
    { level: 3, startDay: 16, endDay: 25 },  // Nivel 3: días 16–25
    { level: 4, startDay: 26, endDay: 40 },  // Nivel 4: días 26–40
    { level: 5, startDay: 41, endDay: 1000 },  // Nivel 5: días 41–60 (tentativo)
  ],
};

// -----------------------------------------------------------------------------
// WISDOM (Sabiduría)
// (datos tomados de mentors/wisdom/objectives.py)
// Incluye reglas de objective_use en challenges y ambits.
// -----------------------------------------------------------------------------

const WISDOM_CONFIG: MentorConfig = {
  id: "wisdom",
  name: "Sabiduría",
  shortDescription:
    "Reflexiones guiadas para fortalecer la vida interior, conectar con el propósito y vivir la sabiduría de forma práctica.",

  panelTexts: {
    mentor:
      "El mentor de sabiduría te ayuda a ver con más calma, tomar mejores decisiones y encontrar dirección interior.",
    objective:
      "Tu objetivo define en qué área de tu vida quieres claridad y crecimiento interior.",
    challenge:
      "El desafío es el patrón que más te frena: duda, desánimo, falta de conexión o incoherencia.",
    vars:
      "El ámbito aterriza dónde quieres aplicar la enseñanza. El tono define cómo prefieres recibir el mensaje.",
  },

 // 🔹 NUEVO: preguntas por defecto para Sabiduría
  questions: {
    objectiveLabel: "¿Cuál de estos objetivos de sabiduría de quieres lograr? *",
    challengeLabel: "¿Qué es lo que más te está impidiendo avanzar? *",
    ambitLabel: "¿En qué ámbito quieres aplicar tu guía? *",
    toneLabel: "¿Que tono prefieres? *",
  },

  objectives: [
    {
      id: "conexion_interior",
      name: "Conexión interior",
      description:
        "Ayudar a fortalecer la relación con uno mismo y con la presencia espiritual a través de acciones que generen calma, atención y propósito.",
    },
    {
      id: "desarrollo_interior",
      name: "Desarrollo interior",
      description:
        "Promover crecimiento personal a través de virtudes como paciencia, humildad, compasión y disciplina interior.",
    },
    {
      id: "aplicacion_practica",
      name: "Aplicación práctica",
      description:
        "Traducir la sabiduría bíblica en acciones, decisiones y actitudes concretas para el día a día.",
    },
  ],

  challenges: [
    // Desafíos emocionales / espirituales de base
    {
      id: "impaciencia",
      name: "Impaciencia ante los procesos",
      objectiveUse: ["conexion_interior", "desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "falta_constancia",
      name: "Falta de constancia",
      objectiveUse: ["conexion_interior", "desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "desanimo",
      name: "Desánimo o perida de proposito",
      objectiveUse: ["conexion_interior", "desarrollo_interior", "aplicacion_practica"],
    },

    // Desafíos de conexión emocional / sentido interno
    {
      id: "falta_conexion",
      name: "Sensación de estar desconectado por dentro",
      objectiveUse: ["conexion_interior", "desarrollo_interior"],
    },
    {
      id: "dudas_sentido",
      name: "Dudas sobre sentido o dirección.",
      objectiveUse: ["conexion_interior", "desarrollo_interior"],
    },
    {
      id: "falta_serenidad",
      name: "Falta de serenidad o exceso de control",
      objectiveUse: ["conexion_interior", "desarrollo_interior"],
    },

    // Desafíos internos de transformación personal
    {
      id: "temor_cambio",
      name: "Temor a los cambios o a confiar",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "juicio_excesivo",
      name: "Autoexigencia o juicio duro hacia uno mismo",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "dificultad_perdonar",
      name: "Dificultad para perdonar o soltar",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },

    // Desafíos de traducción a acción / coherencia diaria
    {
      id: "falta_coherencia",
      name: "Siento que lo que pienso o creo no se refleja en lo que hago",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },
  ],

  ambits: [
    // Ámbitos de interioridad / alineación personal
    {
      id: "vida_personal",
      name: "Vida personal",
      description: "Buscar crecimiento integral y equilibrio interior.",
      objectiveUse: ["conexion_interior", "desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "proposito",
      name: "Propósito",
      description: "Buscar coherencia entre lo que piensa, siente y hace.",
      objectiveUse: ["conexion_interior", "desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "fe_confianza",
      name: "Confianza y entrega",
      description: "Soltar el control excesivo y apoyarse en la confianza.",
      objectiveUse: ["conexion_interior", "desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "silencio_interior",
      name: "Silencio interior",
      description: "Hacer pausa, escucharse y reconocer lo que se mueve dentro.",
      objectiveUse: ["conexion_interior", "desarrollo_interior"],
    },

    // Ámbitos de trabajo interno / formación del carácter
    {
      id: "adversidad",
      name: "Adversidad o prueba",
      description:
        "Aprender de los momentos difíciles sin rendirse ni endurecer el corazón.",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "relaciones",
      name: "Relaciones",
      description: "Mejorar y cuidar relación con otros.",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "familia",
      name: "Familia",
      description: "Mejorar y cuidar los vínculos más cercanos.",
      objectiveUse: ["desarrollo_interior", "aplicacion_practica"],
    },
    {
      id: "dificiles_del_corazon",
      name: "Cargas del corazón",
      description: "Aquello que pesa emocionalmente.",
      objectiveUse: ["conexion_interior", "desarrollo_interior"],
    },

    // Ámbitos de acción ética / vida diaria
    {
      id: "decisiones",
      name: "Decisiones",
      description: "Elegir caminos o responder ante situaciones concretas.",
      objectiveUse: ["aplicacion_practica", "desarrollo_interior"],
    },
    {
      id: "trabajo",
      name: "Trabajo",
      description:
        "Actuar con honestidad, responsabilidad y sentido en lo que haces cada día.",
      objectiveUse: ["aplicacion_practica", "desarrollo_interior"],
    },
    {
      id: "servicio",
      name: "Servicio a otros",
      description:
        "Expresar cuidado real a través de apoyo, presencia y actos concretos hacia los demás.",
      objectiveUse: ["aplicacion_practica", "desarrollo_interior"],
    },
    {
      id: "salud",
      name: "Cuidado de cuerpo y mente",
      description: "Tratar el cuerpo y la mente como algo valioso.",
      objectiveUse: ["aplicacion_practica", "desarrollo_interior"],
    },
  ],

  tones: [
    {
      id: "sereno",
      name: "Sereno y comprensivo",
      definitionUser:
        "Prefiero mensajes tranquilos y empáticos, que transmitan calma y claridad.",
      description:
        "Tono suave y reflexivo. Usa lenguaje pausado, cálido y cercano.",
    },
    {
      id: "inspirador",
      name: "Luminoso e inspirador",
      definitionUser:
        "Prefiero mensajes que transmitan energía positiva y esperanza.",
      description:
        "Tono optimista y motivador, con frases breves y alentadoras.",
    },
    {
      id: "directo",
      name: "Claro y enfocado",
      definitionUser:
        "Prefiero mensajes concretos y prácticos, sin rodeos.",
      description:
        "Tono sobrio y preciso, enfocado en la acción y la claridad.",
    },
    {
      id: "firme_sereno",
      name: "Firme pero sereno",
      definitionUser:
        "Prefiero mensajes con tono motivador y estructura, que impulsen sin presionar.",
      description:
        "Tono firme, con equilibrio entre aliento y disciplina. Usa lenguaje claro y seguro, sin dureza.",
    },
  ],
  // 🔹 Rango oficial de niveles para Productividad
  levels: [
    { level: 1, startDay: 1,  endDay: 15  },  // Nivel 1: días 1–7
    { level: 2, startDay: 16,  endDay: 35 },  // Nivel 2: días 8–15
    { level: 3, startDay: 36, endDay: 65 },  // Nivel 3: días 16–25
    { level: 4, startDay: 66, endDay: 100 },  // Nivel 4: días 26–40
    { level: 5, startDay: 101, endDay: 1000 },  // Nivel 5: días 41–60 (tentativo)
  ],
};

// -----------------------------------------------------------------------------
// EXPORT
// -----------------------------------------------------------------------------

export const MENTORS_CONFIG: Record<MentorId, MentorConfig> = {
  productivity: PRODUCTIVITY_CONFIG,
  wisdom: WISDOM_CONFIG,
};
