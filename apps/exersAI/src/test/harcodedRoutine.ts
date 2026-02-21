import { RutinaConEjercicios } from '../types/rutina';

export const hardcodedRoutine: RutinaConEjercicios = {
  id: 1,
  usuario_id: 'user_123',
  nombre: 'Rutina de Hipertrofia Completa',
  objetivo: 'Hipertrofia',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ejercicios: [
    // --- PECHO ---
    {
      id: 101,
      rutina_id: 1,
      ejercicio_id: '97',
      series: 4,
      repeticiones: '8-12',
      tiempo_descanso_segundos: 90,
      notas_ia:
        'Mantén los codos ligeramente hacia adentro para proteger los hombros. Baja controlando el movimiento.',
      orden: 1,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Fondos en Barras Paralelas',
        grupos_musculares: ['Pecho'],
        imagen_url: 'https://example.com/dips.png',
      },
    },
    {
      id: 102,
      rutina_id: 1,
      ejercicio_id: '12',
      series: 4,
      repeticiones: '8-12',
      tiempo_descanso_segundos: 90,
      notas_ia:
        'Enfócate en la contracción del pectoral en la parte superior del movimiento. No bloquees los codos.',
      orden: 2,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Press de Banca en Máquina Sentado',
        grupos_musculares: ['Pecho'],
        imagen_url: 'https://example.com/chest_press.png',
      },
    },
    {
      id: 103,
      rutina_id: 1,
      ejercicio_id: '11',
      series: 3,
      repeticiones: '10-12',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Movimiento controlado. Imagina que estás abrazando un árbol grande.',
      orden: 3,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Aperturas en Máquina Peck Deck',
        grupos_musculares: ['Pecho'],
        imagen_url: 'https://example.com/peck_deck.png',
      },
    },
    // --- ESPALDA ---
    {
      id: 201,
      rutina_id: 1,
      ejercicio_id: '14',
      series: 4,
      repeticiones: '6-10',
      tiempo_descanso_segundos: 90,
      notas_ia:
        'Rango completo de movimiento. Si no puedes completar las repeticiones, usa una banda elástica.',
      orden: 4,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Dominadas (Pull-ups)',
        grupos_musculares: ['Espalda'],
        imagen_url: 'https://example.com/pullups.png',
      },
    },
    {
      id: 202,
      rutina_id: 1,
      ejercicio_id: '19',
      series: 4,
      repeticiones: '8-12',
      tiempo_descanso_segundos: 90,
      notas_ia:
        'Inicia el movimiento bajando los hombros (depresión escapular). Lleva la barra hacia la parte superior del pecho.',
      orden: 5,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Jalón al Pecho',
        grupos_musculares: ['Espalda'],
        imagen_url: 'https://example.com/lat_pulldown.png',
      },
    },
    {
      id: 203,
      rutina_id: 1,
      ejercicio_id: '31',
      series: 3,
      repeticiones: '10-12',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Mantén la espalda recta y el pecho erguido. Tira con los codos hacia atrás.',
      orden: 6,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Remo Sentado en Polea',
        grupos_musculares: ['Espalda'],
        imagen_url: 'https://example.com/seated_row.png',
      },
    },
    // --- PIERNAS ---
    {
      id: 301,
      rutina_id: 1,
      ejercicio_id: '40',
      series: 4,
      repeticiones: '8-10',
      tiempo_descanso_segundos: 90,
      notas_ia:
        'Pies a la anchura de los hombros. Baja profundo y sube empujando con los talones.',
      orden: 7,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Sentadilla con Barra (Squat)',
        grupos_musculares: ['Piernas'],
        imagen_url: 'https://example.com/squat.png',
      },
    },
    {
      id: 302,
      rutina_id: 1,
      ejercicio_id: '45',
      series: 3,
      repeticiones: '10-12',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Flexiona la rodilla completamente. Controla la fase excéntrica.',
      orden: 8,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Curl de Isquiotibiales Tumbado',
        grupos_musculares: ['Piernas'],
        imagen_url: 'https://example.com/leg_curl.png',
      },
    },
    {
      id: 303,
      rutina_id: 1,
      ejercicio_id: '48',
      series: 3,
      repeticiones: '12-15',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Extiende completamente las rodillas y contrae los cuádriceps en la cima.',
      orden: 9,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Extensiones de Cuádriceps',
        grupos_musculares: ['Piernas'],
        imagen_url: 'https://example.com/leg_extension.png',
      },
    },
    // --- HOMBROS ---
    {
      id: 401,
      rutina_id: 1,
      ejercicio_id: '52',
      series: 4,
      repeticiones: '8-12',
      tiempo_descanso_segundos: 90,
      notas_ia:
        'No arqueen excesivamente la espalda baja. Empuja hacia arriba hasta extender los brazos.',
      orden: 10,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Press de Hombros con Mancuernas',
        grupos_musculares: ['Hombros'],
        imagen_url: 'https://example.com/shoulder_press.png',
      },
    },
    {
      id: 402,
      rutina_id: 1,
      ejercicio_id: '54',
      series: 3,
      repeticiones: '12-15',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Eleva los brazos hasta la altura de los hombros. Mantén una ligera flexión en los codos.',
      orden: 11,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Elevaciones Laterales',
        grupos_musculares: ['Hombros'],
        imagen_url: 'https://example.com/shoulder_press.png',
      },
    },
    // --- BRAZOS ---
    {
      id: 501,
      rutina_id: 1,
      ejercicio_id: '74',
      series: 3,
      repeticiones: '10-12',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Mantén los codos pegados al cuerpo. Contrae el bíceps al subir.',
      orden: 12,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Curl de Bíceps con Barra',
        grupos_musculares: ['Bíceps'],
        imagen_url: 'https://example.com/bicep_curl.png',
      },
    },
    {
      id: 502,
      rutina_id: 1,
      ejercicio_id: '85',
      series: 3,
      repeticiones: '10-12',
      tiempo_descanso_segundos: 60,
      notas_ia:
        'Mantén los codos fijos y extiende completamente los brazos hacia abajo.',
      orden: 13,
      created_at: new Date().toISOString(),
      ejercicio: {
        nombre: 'Extensiones de Tríceps en Polea',
        grupos_musculares: ['Tríceps'],
        imagen_url: 'https://example.com/tricep_pushdown.png',
      },
    },
  ],
};
