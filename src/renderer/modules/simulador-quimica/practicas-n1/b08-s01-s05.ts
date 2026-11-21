import { RENG_G_N, RENG_KPA_ATM, RENG_MMHG_ATM, RENG_RHO_HG, rengK, rengTx } from '../aprender/n1/gases/constantes'
import { rengDidactico } from '../aprender/n1/procedencia'
import { rengEntreN1, rengIndice } from './aleatorio'
import { RENG_TOL_CELSIUS, RENG_TOL_GAS, RENG_TOL_KELVIN, RENG_TOL_PORCENTAJE, rengFuentesGas } from './b08-comun'
import { rengFabricarPracticaN1 } from './fabrica'
import type { RengPracticaN1 } from './tipos'

const RENG_MM_A_KPA = RENG_KPA_ATM / RENG_MMHG_ATM

export const RENG_PRACTICAS_B08_S01: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s1-p1',
    subtema: 'n1-b8-s1',
    titulo: 'Densidad del gas de una jeringa',
    dificultad: 'basica',
    objetivo: 'Calcular la densidad de un gas en g/L a partir de su masa y de un volumen en mL.',
    unidad: 'g/L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g91', 'densidad baja de los gases'),
    idealizado: 'Gas homogéneo en una jeringa sellada.',
    metodo: 'cociente en g/mL convertido a g/L con el catálogo de unidades',
    parametros: (rengRng) => ({ m: rengEntreN1(rengRng, 0.15, 0.95, 0.005), V: rengEntreN1(rengRng, 100, 500, 5) }),
    respuesta: (rengD) => rengD.m / (rengD.V / 1000),
    errores: (rengD) => [
      ['sin-convertir', 'Volumen sin pasar a litros', rengD.m / rengD.V, 'Dividiste entre el volumen en mililitros: eso da g/mL. Para obtener g/L pasa antes el volumen a litros (1 L = 1000 mL).'],
      ['invertida', 'Volumen entre masa', rengD.V / 1000 / rengD.m, 'Calculaste volumen entre masa (L/g). La densidad es masa entre volumen.']
    ],
    enunciado: (rengD) => `Una jeringa sellada contiene ${rengTx(rengD.m)} g de un gas, que ocupa ${rengTx(rengD.V)} mL.`,
    pregunta: () => '¿Cuál es la densidad del gas, en g/L?',
    datos: (rengD) => [['Masa del gas', `${rengTx(rengD.m)} g`], ['Volumen', `${rengTx(rengD.V)} mL`]],
    pasos: (rengD, rengR) => [`V = ${rengTx(rengD.V)} mL = ${rengTx(rengD.V / 1000)} L.`, `ρ = m / V = ${rengTx(rengD.m)} g / ${rengTx(rengD.V / 1000)} L = ${rengTx(rengR)} g/L.`],
    pistas: ['La densidad es masa dividida entre volumen.', 'Pasa los mililitros a litros: 1 L = 1000 mL.', 'Con la masa en g y el volumen en L sale g/L.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s1-p2',
    subtema: 'n1-b8-s1',
    titulo: 'Densidad tras comprimir',
    dificultad: 'intermedia',
    objetivo: 'Usar la conservación de la masa para relacionar densidad y volumen al comprimir un gas.',
    unidad: 'g/L',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g91', 'compresibilidad de los gases'),
    idealizado: 'Jeringa sellada: la masa de gas no cambia.',
    metodo: 'masa calculada con el volumen inicial y dividida entre el volumen final',
    parametros: (rengRng) => ({ rho1: rengEntreN1(rengRng, 0.8, 2.5, 0.01), V1: rengEntreN1(rengRng, 60, 100, 1), V2: rengEntreN1(rengRng, 10, 50, 1) }),
    valida: (rengD) => rengD.V2 < 0.8 * rengD.V1,
    respuesta: (rengD) => (rengD.rho1 * rengD.V1) / rengD.V2,
    errores: (rengD) => [
      ['invertida', 'Razón de volúmenes al revés', (rengD.rho1 * rengD.V2) / rengD.V1, 'Multiplicaste por V₂/V₁. Al comprimir, la densidad debe aumentar: el factor es V₁/V₂.'],
      ['sin-cambio', 'Densidad sin cambiar', rengD.rho1, 'La masa se conserva, pero el volumen cambia: la densidad no puede quedarse igual.']
    ],
    enunciado: (rengD) => `Una jeringa sellada contiene un gas de densidad ${rengTx(rengD.rho1)} g/L que ocupa ${rengTx(rengD.V1)} mL. Se empuja el émbolo hasta que el gas ocupa ${rengTx(rengD.V2)} mL, sin que entre ni salga gas.`,
    pregunta: () => '¿Cuál es la nueva densidad del gas, en g/L?',
    datos: (rengD) => [['Densidad inicial', `${rengTx(rengD.rho1)} g/L`], ['Volumen inicial', `${rengTx(rengD.V1)} mL`], ['Volumen final', `${rengTx(rengD.V2)} mL`]],
    pasos: (rengD, rengR) => ['La masa no cambia: ρ₁·V₁ = ρ₂·V₂.', `ρ₂ = ρ₁ · V₁ / V₂ = ${rengTx(rengD.rho1)} × ${rengTx(rengD.V1)} / ${rengTx(rengD.V2)} = ${rengTx(rengR)} g/L.`],
    pistas: ['¿Qué magnitud se conserva al empujar el émbolo?', 'Masa = densidad × volumen, antes y después.', 'ρ₂ = ρ₁ · V₁ / V₂ (los mL se cancelan).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s1-p3',
    subtema: 'n1-b8-s1',
    titulo: 'Cuánto más ocupa el gas que el líquido',
    dificultad: 'avanzada',
    objetivo: 'Comparar el volumen de una misma masa como líquido y como gas igualando antes las unidades de densidad.',
    unidad: '',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g91', 'diferencia de densidad entre líquidos y gases'), rengDidactico('Las densidades de líquido y de gas son didácticas, de una sustancia hipotética.')],
    idealizado: 'Una misma masa de sustancia en dos estados de densidad uniforme.',
    metodo: 'volúmenes de 1 g en cada estado convertidos a la misma unidad con el catálogo',
    parametros: (rengRng) => ({ rhoL: rengEntreN1(rengRng, 0.6, 1.6, 0.01), rhoG: rengEntreN1(rengRng, 0.5, 3, 0.01) }),
    respuesta: (rengD) => (rengD.rhoL * 1000) / rengD.rhoG,
    errores: (rengD) => [
      ['sin-mil', 'Unidades de densidad sin igualar', rengD.rhoL / rengD.rhoG, 'Dividiste g/mL entre g/L sin igualar las unidades: 1 g/mL = 1000 g/L.'],
      ['invertida', 'Cociente al revés', rengD.rhoG / (rengD.rhoL * 1000), 'Calculaste cuánto ocupa el líquido respecto del gas; se pregunta cuántas veces más ocupa el gas.']
    ],
    enunciado: (rengD) => `Una sustancia hipotética tiene, a cierta temperatura, una densidad de ${rengTx(rengD.rhoL)} g/mL como líquido y de ${rengTx(rengD.rhoG)} g/L como gas.`,
    pregunta: () => 'Para la misma masa, ¿cuántas veces más volumen ocupa como gas que como líquido?',
    datos: (rengD) => [['Densidad del líquido', `${rengTx(rengD.rhoL)} g/mL`], ['Densidad del gas', `${rengTx(rengD.rhoG)} g/L`]],
    pasos: (rengD, rengR) => [`Densidad del líquido en g/L: ${rengTx(rengD.rhoL)} g/mL = ${rengTx(rengD.rhoL * 1000)} g/L.`, 'Para la misma masa, V_gas / V_líquido = ρ_líquido / ρ_gas.', `${rengTx(rengD.rhoL * 1000)} / ${rengTx(rengD.rhoG)} = ${rengTx(rengR)} veces.`],
    pistas: ['A igual masa, el volumen es inversamente proporcional a la densidad.', 'Pon las dos densidades en la misma unidad.', 'V_gas / V_líquido = ρ_líquido / ρ_gas.']
  })
]

export const RENG_PRACTICAS_B08_S02: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s2-p1',
    subtema: 'n1-b8-s2',
    titulo: 'Presión de un émbolo',
    dificultad: 'basica',
    objetivo: 'Calcular una presión como fuerza entre área, con el área en cm² y el resultado en kPa.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g91', 'definición de presión'),
    idealizado: 'Fuerza perpendicular repartida uniformemente; émbolo sin rozamiento.',
    metodo: 'área convertida a m² y presión convertida a kPa con el catálogo de unidades',
    parametros: (rengRng) => ({ F: rengEntreN1(rengRng, 50, 500, 5), A: rengEntreN1(rengRng, 2, 20, 0.1) }),
    respuesta: (rengD) => rengD.F / (rengD.A * 1e-4) / 1000,
    errores: (rengD) => [
      ['area-sin-convertir', 'Área en cm²', rengD.F / rengD.A, 'Dividiste newtons entre cm²: eso da N/cm². Pasa el área a m² (1 cm² = 10⁻⁴ m²) para obtener Pa y luego kPa.'],
      ['en-pascales', 'Resultado en pascales', rengD.F / (rengD.A * 1e-4), 'Ese número está en pascales; la respuesta se pide en kPa (1 kPa = 1000 Pa).']
    ],
    enunciado: (rengD) => `Sobre el émbolo de una jeringa tapada, de sección ${rengTx(rengD.A)} cm², se aplica una fuerza perpendicular de ${rengTx(rengD.F)} N.`,
    pregunta: () => '¿Qué presión ejerce el émbolo sobre el gas, en kPa?',
    datos: (rengD) => [['Fuerza', `${rengTx(rengD.F)} N`], ['Área del émbolo', `${rengTx(rengD.A)} cm²`]],
    pasos: (rengD, rengR) => [`A = ${rengTx(rengD.A)} cm² = ${rengTx(rengD.A * 1e-4)} m².`, `P = F / A = ${rengTx(rengD.F)} N / ${rengTx(rengD.A * 1e-4)} m² = ${rengTx(rengR * 1000)} Pa = ${rengTx(rengR)} kPa.`],
    pistas: ['Presión es fuerza dividida entre área.', '1 cm² = 10⁻⁴ m², y N/m² es el pascal.', 'Divide entre 1000 para pasar de Pa a kPa.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s2-p2',
    subtema: 'n1-b8-s2',
    titulo: 'De mmHg a kPa',
    dificultad: 'intermedia',
    objetivo: 'Convertir una presión de mmHg a kPa con la equivalencia de la atmósfera estándar.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g91', 'unidades de presión', 'atm'),
    idealizado: 'Se toma 1 mmHg = 1 Torr.',
    metodo: 'conversión directa con el catálogo de unidades (mmHg convencional)',
    parametros: (rengRng) => ({ P: rengEntreN1(rengRng, 600, 800, 1) }),
    respuesta: (rengD) => rengD.P * RENG_MM_A_KPA,
    errores: (rengD) => [
      ['en-atm', 'Presión en atmósferas', rengD.P / RENG_MMHG_ATM, 'Te quedaste en atmósferas (P/760). Multiplica además por 101,325 kPa/atm.'],
      ['factor-invertido', 'Factor de conversión al revés', (rengD.P * RENG_MMHG_ATM) / RENG_KPA_ATM, 'Usaste el factor al revés: para pasar de mmHg a kPa se multiplica por 101,325/760, no por 760/101,325.']
    ],
    enunciado: (rengD) => `Un manómetro digital marca ${rengTx(rengD.P)} mmHg.`,
    pregunta: () => '¿Cuánto es esa presión en kPa?',
    datos: (rengD) => [['Presión', `${rengTx(rengD.P)} mmHg`], ['Equivalencia', '760 mmHg = 101,325 kPa']],
    pasos: (rengD, rengR) => ['Factor: 101,325 kPa / 760 mmHg.', `P = ${rengTx(rengD.P)} × 101,325 / 760 = ${rengTx(rengR)} kPa.`],
    pistas: ['Busca una equivalencia que contenga las dos unidades.', '760 mmHg y 101,325 kPa son la misma presión.', 'Multiplica por la fracción que cancela los mmHg.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s2-p3',
    subtema: 'n1-b8-s2',
    titulo: 'Manómetro de tubo abierto',
    dificultad: 'avanzada',
    objetivo: 'Leer un manómetro de tubo en U abierto, decidir el signo de la diferencia de niveles y expresar la presión en kPa.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g91', 'manómetros', 'atm'), rengDidactico('Las presiones atmosféricas y diferencias de nivel son didácticas.')],
    idealizado: 'Manómetro ideal de mercurio, sin capilaridad ni dilatación.',
    metodo: 'presión hidrostática ρ·g·h del mercurio en unidades SI sumada o restada a la atmosférica en Pa',
    parametros: (rengRng) => ({ Patm: rengEntreN1(rengRng, 720, 775, 1), h: rengEntreN1(rengRng, 20, 250, 1), caso: rengIndice(rengRng, 2) }),
    respuesta: (rengD) => (rengD.caso === 0 ? rengD.Patm + rengD.h : rengD.Patm - rengD.h) * RENG_MM_A_KPA,
    errores: (rengD) => [
      ['signo', 'Diferencia con el signo cambiado', (rengD.caso === 0 ? rengD.Patm - rengD.h : rengD.Patm + rengD.h) * RENG_MM_A_KPA, 'Revisa el signo: si el mercurio sube por la rama abierta, el gas empuja más que el aire y su presión es mayor que la atmosférica; si sube por la rama del gas, es menor.'],
      ['manometrica', 'Solo la diferencia de niveles', rengD.h * RENG_MM_A_KPA, 'Esa es solo la diferencia respecto del aire. La presión del gas incluye la presión atmosférica.'],
      ['sin-convertir', 'Presión en mmHg', rengD.caso === 0 ? rengD.Patm + rengD.h : rengD.Patm - rengD.h, 'Ese valor está en mmHg; conviértelo a kPa (760 mmHg = 101,325 kPa).']
    ],
    enunciado: (rengD) =>
      `Un manómetro de tubo en U, abierto al aire por un extremo, contiene mercurio. El nivel del mercurio está ${rengTx(rengD.h)} mm más alto en ${rengD.caso === 0 ? 'la rama abierta que en la rama conectada al gas' : 'la rama conectada al gas que en la rama abierta'}. La presión atmosférica es ${rengTx(rengD.Patm)} mmHg.`,
    pregunta: () => '¿Cuál es la presión del gas, en kPa?',
    datos: (rengD) => [['Presión atmosférica', `${rengTx(rengD.Patm)} mmHg`], ['Diferencia de niveles', `${rengTx(rengD.h)} mm`], ['Rama más alta', rengD.caso === 0 ? 'la abierta' : 'la del gas']],
    pasos: (rengD, rengR) => [
      rengD.caso === 0 ? 'El gas empuja el mercurio hacia la rama abierta: su presión es mayor que la atmosférica.' : 'El aire empuja el mercurio hacia la rama del gas: la presión del gas es menor que la atmosférica.',
      `P_gas = ${rengTx(rengD.Patm)} ${rengD.caso === 0 ? '+' : '−'} ${rengTx(rengD.h)} = ${rengTx(rengD.caso === 0 ? rengD.Patm + rengD.h : rengD.Patm - rengD.h)} mmHg.`,
      `En kPa: × 101,325 / 760 = ${rengTx(rengR)} kPa.`
    ],
    pistas: ['¿Hacia qué rama ha empujado el gas al mercurio?', 'La diferencia de niveles en mm es una diferencia de presión en mmHg.', 'Suma o resta a la presión atmosférica y convierte a kPa.']
  })
]

export const RENG_PRACTICAS_B08_S03: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s3-p1',
    subtema: 'n1-b8-s3',
    titulo: 'Barómetro de otro líquido',
    dificultad: 'basica',
    objetivo: 'Calcular la altura de la columna de un barómetro con P = ρ·g·h en unidades SI.',
    unidad: 'm',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g91', 'barómetros'), rengDidactico('Las densidades de los líquidos y las presiones atmosféricas son didácticas.')],
    idealizado: 'Barómetro ideal: líquido incompresible, sin vapor sobre la columna y gravedad estándar.',
    metodo: 'proporción con el barómetro de mercurio: 760 mm a 101,325 kPa, escalada por la razón de densidades',
    parametros: (rengRng) => ({ P: rengEntreN1(rengRng, 95, 103, 0.1), rho: rengEntreN1(rengRng, 0.8, 1.3, 0.01) }),
    respuesta: (rengD) => (rengD.P * 1000) / (rengD.rho * 1000 * RENG_G_N),
    errores: (rengD) => [
      ['sin-kpa', 'Presión en kPa como si fueran Pa', rengD.P / (rengD.rho * 1000 * RENG_G_N), 'Usaste la presión en kPa como si fueran pascales: multiplica por 1000 antes de dividir.'],
      ['densidad-g-ml', 'Densidad en g/mL', (rengD.P * 1000) / (rengD.rho * RENG_G_N), 'Dejaste la densidad en g/mL: pásala a kg/m³ (1 g/mL = 1000 kg/m³).']
    ],
    enunciado: (rengD) => `Se construye un barómetro idealizado con un líquido no volátil de densidad ${rengTx(rengD.rho)} g/mL. La presión atmosférica es ${rengTx(rengD.P)} kPa. Toma g = 9,80665 m/s².`,
    pregunta: () => '¿Qué altura alcanza la columna de líquido, en m?',
    datos: (rengD) => [['Presión atmosférica', `${rengTx(rengD.P)} kPa`], ['Densidad del líquido', `${rengTx(rengD.rho)} g/mL`], ['g', '9,80665 m/s²']],
    pasos: (rengD, rengR) => [`P = ${rengTx(rengD.P * 1000)} Pa; ρ = ${rengTx(rengD.rho * 1000)} kg/m³.`, `h = P / (ρ·g) = ${rengTx(rengD.P * 1000)} / (${rengTx(rengD.rho * 1000)} × 9,80665) = ${rengTx(rengR)} m.`],
    pistas: ['La columna se sostiene cuando ρ·g·h iguala a la presión del aire.', 'Usa Pa y kg/m³ para que h salga en metros.', 'h = P / (ρ·g).']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s3-p2',
    subtema: 'n1-b8-s3',
    titulo: 'Del mercurio a otro líquido',
    dificultad: 'intermedia',
    objetivo: 'Usar ρ₁·h₁ = ρ₂·h₂ para traducir la altura de un barómetro de mercurio a la de otro líquido.',
    unidad: 'm',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g91', 'barómetro de mercurio'), rengDidactico('La densidad del segundo líquido es didáctica; la del mercurio es la convencional del catálogo de unidades.')],
    idealizado: 'Dos barómetros ideales sometidos a la misma presión.',
    metodo: 'presión calculada con ρ·g·h del mercurio en Pa y altura despejada para el otro líquido',
    parametros: (rengRng) => ({ hHg: rengEntreN1(rengRng, 700, 780, 1), rhoL: rengEntreN1(rengRng, 0.8, 1.3, 0.01) }),
    respuesta: (rengD) => (rengD.hHg * RENG_RHO_HG) / rengD.rhoL / 1000,
    errores: (rengD) => [
      ['invertida', 'Densidades al revés', (rengD.hHg * rengD.rhoL) / RENG_RHO_HG / 1000, 'Pusiste las densidades al revés: un líquido menos denso que el mercurio necesita una columna más alta, no más baja.'],
      ['en-mm', 'Resultado en milímetros', (rengD.hHg * RENG_RHO_HG) / rengD.rhoL, 'Ese resultado está en milímetros; la pregunta lo pide en metros.']
    ],
    enunciado: (rengD) => `Un barómetro de mercurio (densidad 13,5951 g/cm³) marca ${rengTx(rengD.hHg)} mm. Al mismo tiempo se lee un barómetro idealizado con un líquido no volátil de densidad ${rengTx(rengD.rhoL)} g/mL.`,
    pregunta: () => '¿Qué altura marca el segundo barómetro, en m?',
    datos: (rengD) => [['Altura del mercurio', `${rengTx(rengD.hHg)} mm`], ['Densidad del mercurio', '13,5951 g/cm³'], ['Densidad del otro líquido', `${rengTx(rengD.rhoL)} g/mL`]],
    pasos: (rengD, rengR) => ['Misma presión: ρ_Hg·h_Hg = ρ_L·h_L.', `h_L = ${rengTx(rengD.hHg)} mm × 13,5951 / ${rengTx(rengD.rhoL)} = ${rengTx(rengR * 1000)} mm = ${rengTx(rengR)} m.`],
    pistas: ['Los dos barómetros soportan la misma presión.', 'A igual presión, altura y densidad son inversamente proporcionales.', 'Pasa el resultado de mm a m.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s3-p3',
    subtema: 'n1-b8-s3',
    titulo: 'Fuerza del aire sobre una lámina',
    dificultad: 'avanzada',
    objetivo: 'Estimar la fuerza que ejerce la atmósfera sobre una cara de una superficie con F = P·A.',
    unidad: 'kN',
    tolerancia: RENG_TOL_GAS,
    fuentes: [...rengFuentesGas('g91', 'presión atmosférica'), rengDidactico('Las presiones atmosféricas y las medidas de la lámina son didácticas.')],
    idealizado: 'Presión uniforme sobre una sola cara.',
    metodo: 'área y presión convertidas a SI con el catálogo de unidades y fuerza convertida a kN',
    parametros: (rengRng) => ({ P: rengEntreN1(rengRng, 95, 103, 0.1), l: rengEntreN1(rengRng, 10, 50, 1), a: rengEntreN1(rengRng, 10, 40, 1) }),
    respuesta: (rengD) => rengD.P * rengD.l * rengD.a * 1e-4,
    errores: (rengD) => [
      ['area-cm2', 'Área en cm²', rengD.P * rengD.l * rengD.a, 'Multiplicaste por el área en cm². Pásala a m² (1 cm² = 10⁻⁴ m²).'],
      ['en-newtons', 'Resultado en newtons', rengD.P * rengD.l * rengD.a * 1e-4 * 1000, 'Ese número está en newtons; la respuesta se pide en kN.']
    ],
    enunciado: (rengD) => `Una lámina rectangular de ${rengTx(rengD.l)} cm × ${rengTx(rengD.a)} cm está en contacto con el aire a ${rengTx(rengD.P)} kPa por una de sus caras.`,
    pregunta: () => '¿Qué fuerza ejerce el aire sobre esa cara, en kN?',
    datos: (rengD) => [['Presión', `${rengTx(rengD.P)} kPa`], ['Largo', `${rengTx(rengD.l)} cm`], ['Ancho', `${rengTx(rengD.a)} cm`]],
    pasos: (rengD, rengR) => [`A = ${rengTx(rengD.l)} × ${rengTx(rengD.a)} cm² = ${rengTx(rengD.l * rengD.a * 1e-4)} m².`, `F = P·A = ${rengTx(rengD.P * 1000)} Pa × ${rengTx(rengD.l * rengD.a * 1e-4)} m² = ${rengTx(rengR * 1000)} N = ${rengTx(rengR)} kN.`, 'No dobla la lámina porque el aire empuja igual por la otra cara.'],
    pistas: ['Fuerza = presión × área.', 'Pasa el área a m² y la presión a Pa.', '1 kN = 1000 N.']
  })
]

export const RENG_PRACTICAS_B08_S04: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s4-p1',
    subtema: 'n1-b8-s4',
    titulo: 'Presión tras cambiar el volumen',
    dificultad: 'basica',
    objetivo: 'Aplicar P₁V₁ = P₂V₂ a temperatura constante.',
    unidad: 'kPa',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Boyle'),
    idealizado: 'Gas ideal a temperatura y cantidad constantes.',
    metodo: 'integración numérica (Runge–Kutta 4) de dP/dV = −P/V',
    parametros: (rengRng) => ({ P1: rengEntreN1(rengRng, 80, 150, 1), V1: rengEntreN1(rengRng, 1, 5, 0.05), V2: rengEntreN1(rengRng, 0.4, 8, 0.05) }),
    valida: (rengD) => Math.abs(rengD.V2 / rengD.V1 - 1) >= 0.2,
    respuesta: (rengD) => (rengD.P1 * rengD.V1) / rengD.V2,
    errores: (rengD) => [
      ['proporcion-directa', 'Proporción directa', (rengD.P1 * rengD.V2) / rengD.V1, 'Pusiste la razón de volúmenes al revés: a temperatura constante, si el volumen baja la presión sube.'],
      ['sin-cambio', 'Presión sin cambiar', rengD.P1, 'Con la temperatura constante, la presión cambia cuando cambia el volumen; no puede quedarse igual.']
    ],
    enunciado: (rengD) => `Un gas ocupa ${rengTx(rengD.V1)} L a ${rengTx(rengD.P1)} kPa. Sin cambiar su temperatura ni su cantidad, se lleva a ${rengTx(rengD.V2)} L.`,
    pregunta: () => '¿Cuál es la presión final, en kPa?',
    datos: (rengD) => [['P₁', `${rengTx(rengD.P1)} kPa`], ['V₁', `${rengTx(rengD.V1)} L`], ['V₂', `${rengTx(rengD.V2)} L`]],
    pasos: (rengD, rengR) => ['T y n constantes: P₁V₁ = P₂V₂.', `P₂ = ${rengTx(rengD.P1)} × ${rengTx(rengD.V1)} / ${rengTx(rengD.V2)} = ${rengTx(rengR)} kPa.`],
    pistas: ['¿Qué se mantiene constante?', 'Con T y n constantes, P·V no cambia.', 'P₂ = P₁ · V₁ / V₂.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s4-p2',
    subtema: 'n1-b8-s4',
    titulo: 'Volumen con presiones en unidades distintas',
    dificultad: 'intermedia',
    objetivo: 'Aplicar la ley de Boyle con presiones dadas en mmHg y atm.',
    unidad: 'mL',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Boyle', 'atm'),
    idealizado: 'Gas ideal a temperatura y cantidad constantes.',
    metodo: 'P₁ convertida con el catálogo de unidades e integración numérica de dV/dP = −V/P',
    parametros: (rengRng) => ({ P1: rengEntreN1(rengRng, 600, 780, 1), P2: rengEntreN1(rengRng, 1.2, 4, 0.05), V1: rengEntreN1(rengRng, 200, 900, 5) }),
    respuesta: (rengD) => (rengD.V1 * (rengD.P1 / RENG_MMHG_ATM)) / rengD.P2,
    errores: (rengD) => [
      ['sin-convertir', 'Presiones en unidades distintas', (rengD.V1 * rengD.P1) / rengD.P2, 'Usaste P₁ en mmHg y P₂ en atm a la vez: pon las dos presiones en la misma unidad antes de dividir.'],
      ['invertida', 'Razón de presiones al revés', (rengD.V1 * rengD.P2) / (rengD.P1 / RENG_MMHG_ATM), 'Razón de presiones al revés: si la presión final es mayor, el volumen final debe ser menor.']
    ],
    enunciado: (rengD) => `Una muestra de gas ocupa ${rengTx(rengD.V1)} mL a ${rengTx(rengD.P1)} mmHg. Se comprime a temperatura constante hasta ${rengTx(rengD.P2)} atm.`,
    pregunta: () => '¿Qué volumen ocupa al final, en mL?',
    datos: (rengD) => [['V₁', `${rengTx(rengD.V1)} mL`], ['P₁', `${rengTx(rengD.P1)} mmHg`], ['P₂', `${rengTx(rengD.P2)} atm`]],
    pasos: (rengD, rengR) => [`P₁ = ${rengTx(rengD.P1)} / 760 = ${rengTx(rengD.P1 / RENG_MMHG_ATM)} atm.`, `V₂ = V₁ · P₁ / P₂ = ${rengTx(rengD.V1)} × ${rengTx(rengD.P1 / RENG_MMHG_ATM)} / ${rengTx(rengD.P2)} = ${rengTx(rengR)} mL.`],
    pistas: ['Las dos presiones tienen que estar en la misma unidad.', '760 mmHg = 1 atm.', 'V₂ = V₁ · P₁ / P₂.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s4-p3',
    subtema: 'n1-b8-s4',
    titulo: 'Cuánto reducir el volumen',
    dificultad: 'avanzada',
    objetivo: 'Razonar con proporciones inversas: qué reducción de volumen produce un aumento de presión dado.',
    unidad: '%',
    tolerancia: RENG_TOL_PORCENTAJE,
    fuentes: rengFuentesGas('g92', 'ley de Boyle'),
    idealizado: 'Gas ideal a temperatura y cantidad constantes.',
    metodo: 'simulación directa: se comprime un litro hasta la presión pedida integrando dV/dP = −V/P y se mide la reducción',
    parametros: (rengRng) => ({ X: rengEntreN1(rengRng, 10, 150, 5) }),
    respuesta: (rengD) => (1 - 1 / (1 + rengD.X / 100)) * 100,
    errores: (rengD) => [
      ['mismo-porcentaje', 'El mismo porcentaje', rengD.X, 'El volumen no baja el mismo porcentaje que sube la presión: P y V son inversamente proporcionales.'],
      ['volumen-final', 'Volumen final en %', 100 / (1 + rengD.X / 100), 'Ese es el volumen final como porcentaje del inicial; la pregunta pide cuánto se reduce.']
    ],
    enunciado: (rengD) => `Se quiere que la presión de un gas aumente un ${rengTx(rengD.X)} % sin cambiar su temperatura ni su cantidad.`,
    pregunta: () => '¿En qué porcentaje hay que reducir su volumen?',
    datos: (rengD) => [['Aumento de presión', `${rengTx(rengD.X)} %`], ['Condiciones', 'T y n constantes']],
    pasos: (rengD, rengR) => [`P₂/P₁ = 1 + ${rengTx(rengD.X)}/100 = ${rengTx(1 + rengD.X / 100)}.`, `V₂/V₁ = P₁/P₂ = ${rengTx(1 / (1 + rengD.X / 100))}.`, `Reducción = (1 − V₂/V₁) × 100 = ${rengTx(rengR)} %.`],
    pistas: ['Escribe el aumento como un cociente P₂/P₁.', 'V₂/V₁ es el inverso de P₂/P₁.', 'La reducción es 1 − V₂/V₁, en porcentaje.']
  })
]

export const RENG_PRACTICAS_B08_S05: readonly RengPracticaN1[] = [
  rengFabricarPracticaN1({
    id: 'n1-b8-s5-p1',
    subtema: 'n1-b8-s5',
    titulo: 'Volumen al calentar',
    dificultad: 'basica',
    objetivo: 'Aplicar V₁/T₁ = V₂/T₂ con temperaturas dadas en °C.',
    unidad: 'mL',
    tolerancia: RENG_TOL_GAS,
    fuentes: rengFuentesGas('g92', 'ley de Charles', 'K'),
    idealizado: 'Gas ideal a presión y cantidad constantes.',
    metodo: 'integración numérica (Runge–Kutta 4) de dV/dT = V/T',
    parametros: (rengRng) => ({ V1: rengEntreN1(rengRng, 200, 900, 5), t1: rengEntreN1(rengRng, 5, 40, 1), t2: rengEntreN1(rengRng, 50, 150, 1) }),
    respuesta: (rengD) => (rengD.V1 * rengK(rengD.t2)) / rengK(rengD.t1),
    errores: (rengD) => [
      ['celsius', 'Temperaturas en °C', (rengD.V1 * rengD.t2) / rengD.t1, 'Usaste grados Celsius en la proporción. La ley de Charles exige temperatura absoluta: suma 273,15.'],
      ['invertida', 'Razón de temperaturas al revés', (rengD.V1 * rengK(rengD.t1)) / rengK(rengD.t2), 'Razón de temperaturas al revés: al calentar a presión constante, el gas se expande.']
    ],
    enunciado: (rengD) => `Un globo flexible contiene ${rengTx(rengD.V1)} mL de gas a ${rengTx(rengD.t1)} °C. Se calienta a presión constante hasta ${rengTx(rengD.t2)} °C.`,
    pregunta: () => '¿Qué volumen ocupa al final, en mL?',
    datos: (rengD) => [['V₁', `${rengTx(rengD.V1)} mL`], ['t₁', `${rengTx(rengD.t1)} °C`], ['t₂', `${rengTx(rengD.t2)} °C`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K; T₂ = ${rengTx(rengK(rengD.t2), 5)} K.`, `V₂ = V₁ · T₂ / T₁ = ${rengTx(rengD.V1)} × ${rengTx(rengK(rengD.t2), 5)} / ${rengTx(rengK(rengD.t1), 5)} = ${rengTx(rengR)} mL.`],
    pistas: ['La proporción solo vale con temperatura absoluta.', 'Suma 273,15 a cada temperatura.', 'V₂ = V₁ · T₂ / T₁.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s5-p2',
    subtema: 'n1-b8-s5',
    titulo: 'Temperatura para alcanzar un volumen',
    dificultad: 'intermedia',
    objetivo: 'Despejar la temperatura final de la ley de Charles y expresarla en °C.',
    unidad: '°C',
    tolerancia: RENG_TOL_CELSIUS,
    fuentes: rengFuentesGas('g92', 'ley de Charles', 'K'),
    idealizado: 'Gas ideal a presión y cantidad constantes.',
    metodo: 'búsqueda por bisección de la temperatura en la que V(T) = V₁·T/T₁ alcanza V₂',
    parametros: (rengRng) => {
      const rengV1 = rengEntreN1(rengRng, 200, 600, 5)
      return { t1: rengEntreN1(rengRng, 5, 30, 1), V1: rengV1, V2: Math.round((rengV1 * rengEntreN1(rengRng, 1.1, 1.4, 0.01)) / 5) * 5 }
    },
    valida: (rengD) => rengD.V2 > rengD.V1 * 1.05,
    respuesta: (rengD) => (rengK(rengD.t1) * rengD.V2) / rengD.V1 - 273.15,
    errores: (rengD, rengR) => [
      ['en-kelvin', 'Resultado en kelvin', rengR + 273.15, 'Ese valor está en kelvin. La pregunta pide °C: resta 273,15.'],
      ['celsius', 'Proporción con °C', (rengD.t1 * rengD.V2) / rengD.V1, 'Aplicaste la proporción a los grados Celsius. Hazlo en kelvin y convierte al final.']
    ],
    enunciado: (rengD) => `Un gas ocupa ${rengTx(rengD.V1)} mL a ${rengTx(rengD.t1)} °C. Se calienta a presión constante hasta que ocupa ${rengTx(rengD.V2)} mL.`,
    pregunta: () => '¿A qué temperatura hay que llevarlo, en °C?',
    datos: (rengD) => [['V₁', `${rengTx(rengD.V1)} mL`], ['t₁', `${rengTx(rengD.t1)} °C`], ['V₂', `${rengTx(rengD.V2)} mL`]],
    pasos: (rengD, rengR) => [`T₁ = ${rengTx(rengK(rengD.t1), 5)} K.`, `T₂ = T₁ · V₂ / V₁ = ${rengTx(rengK(rengD.t1), 5)} × ${rengTx(rengD.V2)} / ${rengTx(rengD.V1)} = ${rengTx(rengR + 273.15, 5)} K.`, `t₂ = ${rengTx(rengR + 273.15, 5)} − 273,15 = ${rengTx(rengR)} °C.`],
    pistas: ['Trabaja en kelvin y convierte solo al final.', 'T₂ = T₁ · V₂ / V₁.', 'Resta 273,15 para volver a °C.']
  }),
  rengFabricarPracticaN1({
    id: 'n1-b8-s5-p3',
    subtema: 'n1-b8-s5',
    titulo: 'Temperatura inicial desconocida',
    dificultad: 'avanzada',
    objetivo: 'Deducir la temperatura absoluta inicial a partir de un calentamiento y del aumento relativo de volumen.',
    unidad: 'K',
    tolerancia: RENG_TOL_KELVIN,
    fuentes: rengFuentesGas('g92', 'ley de Charles', 'K'),
    idealizado: 'Gas ideal a presión y cantidad constantes.',
    metodo: 'simulación directa: se busca por bisección la T₁ con la que el calentamiento produce el aumento pedido',
    parametros: (rengRng) => ({ dt: rengEntreN1(rengRng, 10, 60, 1), p: rengEntreN1(rengRng, 4, 20, 0.5) }),
    valida: (rengD) => rengD.dt / (rengD.p / 100) >= 200 && rengD.dt / (rengD.p / 100) <= 600,
    respuesta: (rengD) => rengD.dt / (rengD.p / 100),
    errores: (rengD, rengR) => [
      ['en-celsius', 'Resultado en °C', rengR - 273.15, 'Ese valor está en °C; la pregunta pide la temperatura absoluta en K.'],
      ['producto', 'Incremento por porcentaje', (rengD.dt * rengD.p) / 100, 'Multiplicaste el incremento por el porcentaje. Plantea V₂/V₁ = (T₁ + ΔT)/T₁ y despeja T₁.']
    ],
    enunciado: (rengD) => `Al calentar un gas a presión constante, su temperatura sube ${rengTx(rengD.dt)} °C y su volumen aumenta un ${rengTx(rengD.p)} %.`,
    pregunta: () => '¿Cuál era su temperatura inicial, en K?',
    datos: (rengD) => [['Aumento de temperatura', `${rengTx(rengD.dt)} °C (= ${rengTx(rengD.dt)} K)`], ['Aumento de volumen', `${rengTx(rengD.p)} %`]],
    pasos: (rengD, rengR) => [`V₂/V₁ = 1 + ${rengTx(rengD.p / 100)} = (T₁ + ${rengTx(rengD.dt)}) / T₁.`, `De ahí: ${rengTx(rengD.p / 100)} · T₁ = ${rengTx(rengD.dt)}.`, `T₁ = ${rengTx(rengD.dt)} / ${rengTx(rengD.p / 100)} = ${rengTx(rengR)} K.`],
    pistas: ['Un aumento de temperatura de 1 °C es también de 1 K.', 'Escribe V₂/V₁ como (T₁ + ΔT)/T₁.', 'El aumento relativo de volumen es ΔT / T₁.']
  })
]
