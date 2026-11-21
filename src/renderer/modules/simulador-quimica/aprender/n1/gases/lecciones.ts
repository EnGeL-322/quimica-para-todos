import { rengLeccionN1 } from '../constructor'
import { RENG_LIBRO_GASES_A } from './libro-a'
import { RENG_LIBRO_GASES_B } from './libro-b'
import { rengFusionarLibroGas, type RengEspecGasAntigua } from './libro-comun'
import { RENG_PROCEDENCIA_ATM, RENG_PROCEDENCIA_KELVIN, RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB, RENG_PROCEDENCIA_R, rengDeclarada, rengDidactico, rengSeccionGases } from '../procedencia'
import type { RengLeccionN1 } from '../tipos'

const RENG_GAS_IDEAL = 'Gas ideal: moléculas puntuales que no se atraen ni se repelen y chocan de forma elástica.'
const RENG_CANTIDAD_FIJA = 'La cantidad de gas no cambia: el recipiente está cerrado y no hay reacción.'
const RENG_KELVIN = 'Las temperaturas se usan en kelvin: T = t + 273,15.'
const RENG_LIMITE_IDEAL = 'Es el modelo del gas ideal: funciona bien a presiones moderadas y temperaturas alejadas de la condensación. A presión alta o cerca de licuarse, el gas real se aparta del modelo (subtema 20).'

function rengLeccionGas(rengE: RengEspecGasAntigua): RengLeccionN1 {
  const rengLibro = RENG_LIBRO_GASES_A[rengE.id] ?? RENG_LIBRO_GASES_B[rengE.id]
  if (!rengLibro) throw new Error(`Falta la ficha de libro de la lección ${rengE.id}`)
  return rengLeccionN1(rengFusionarLibroGas(rengE, rengLibro))
}

export const RENG_LECCIONES_GASES: readonly RengLeccionN1[] = [
  rengLeccionGas({
    id: 'gas-propiedades',
    subtema: 'n1-b8-s1',
    nombre: 'Propiedades de los gases',
    pregunta: '¿Qué distingue a un gas de un líquido o un sólido?',
    objetivo: 'Reconocer las propiedades generales de los gases y describir su estado con presión, volumen, temperatura y cantidad.',
    idea: 'Un gas no tiene forma ni volumen propios: ocupa todo el recipiente que lo contiene. Sus moléculas están muy separadas y se mueven sin parar, por eso un gas se comprime con facilidad, tiene densidad baja (del orden de mil veces menor que la de un líquido) y se mezcla por completo con otros gases. El estado de una muestra de gas queda descrito por cuatro magnitudes: presión P, volumen V, temperatura T y cantidad n.',
    imagen: 'Piensa en una jeringa tapada llena de aire: puedes empujar el émbolo y el aire se deja comprimir; con agua, casi no se mueve.',
    error: 'Creer que comprimir un gas cambia su masa. La masa se conserva; lo que cambia es el volumen y, por tanto, la densidad.',
    ecs: [
      ['Densidad', 'ρ = m / V', 'La densidad es la masa por unidad de volumen. En gases se suele dar en g/L.', String.raw`\rho = \frac{m}{V}`],
      ['Compresión sin pérdida de gas', 'ρ₂ / ρ₁ = V₁ / V₂', 'Si la masa no cambia, la densidad crece en la misma proporción en que baja el volumen.', String.raw`\frac{\rho_2}{\rho_1} = \frac{V_1}{V_2}`]
    ],
    vars: [
      ['ρ', 'densidad', 'g/L'],
      ['m', 'masa', 'g'],
      ['V', 'volumen', 'L o mL'],
      ['1 g/mL', 'equivale a', '1000 g/L']
    ],
    supuestos: [RENG_CANTIDAD_FIJA, 'La muestra es homogénea: la densidad es la misma en todo el recipiente.'],
    limites: 'La lección describe propiedades generales. Los valores de densidad de los ejemplos y prácticas son didácticos, no de una sustancia medida.',
    ejemplo: 'ej-gas-propiedades',
    fuentes: [rengSeccionGases('g91', 'propiedades generales de los gases')],
    idealizado: 'Jeringa sellada y gas homogéneo; no se modela la fricción del émbolo ni la temperatura.',
    metodo: 'densidad inicial por el catálogo de unidades y escalado por V₁/V₂'
  }),
  rengLeccionGas({
    id: 'gas-presion',
    subtema: 'n1-b8-s2',
    nombre: 'Presión gaseosa',
    pregunta: '¿De dónde sale la presión de un gas y cómo se mide?',
    objetivo: 'Definir la presión como fuerza por unidad de área, explicarla con los choques moleculares y convertir entre Pa, kPa, atm y mmHg.',
    idea: 'Las moléculas de un gas chocan continuamente contra las paredes del recipiente. Cada choque empuja un poco; la suma de todos esos empujes, repartida sobre el área de la pared, es la presión. Se mide con manómetros y barómetros y se expresa en pascales (Pa), kilopascales (kPa), atmósferas (atm) o milímetros de mercurio (mmHg).',
    imagen: 'Un globo inflado se mantiene redondo porque los choques de dentro empujan la goma hacia fuera en todas direcciones.',
    error: 'Sumar o comparar presiones en unidades distintas sin convertirlas antes.',
    ecs: [
      ['Definición', 'P = F / A', 'Presión = fuerza perpendicular / área. 1 Pa = 1 N/m².', String.raw`P = \frac{F}{A}`],
      ['Equivalencias', '1 atm = 101,325 kPa = 760 mmHg', 'Tres formas de escribir la misma presión estándar.', String.raw`1\ \mathrm{atm} = 101{,}325\ \mathrm{kPa} = 760\ \mathrm{mmHg}`],
      ['Manómetro abierto', 'P_gas = P_atm ± h', 'Con un líquido manométrico de mercurio, h es la diferencia de niveles en mm: se suma si el gas empuja más que el aire y se resta si empuja menos.', String.raw`P_{\mathrm{gas}} = P_{\mathrm{atm}} \pm h`]
    ],
    vars: [
      ['P', 'presión', 'Pa, kPa, atm o mmHg'],
      ['F', 'fuerza', 'N'],
      ['A', 'área', 'm²'],
      ['h', 'diferencia de niveles', 'mm de mercurio']
    ],
    supuestos: ['La fuerza es perpendicular a la superficie y está repartida de manera uniforme.', 'Se toma 1 mmHg igual a 1 Torr.'],
    limites: 'La explicación por choques es cualitativa aquí; la relación cuantitativa con la velocidad de las moléculas está en los subtemas 15 y 16.',
    ejemplo: 'ej-gas-presion',
    fuentes: [rengSeccionGases('g91', 'definición de presión, unidades y manómetros'), RENG_PROCEDENCIA_ATM],
    idealizado: 'Manómetro de tubo en U ideal: sin capilaridad ni dilatación del líquido.',
    metodo: 'conversión con el catálogo de unidades del proyecto'
  }),
  rengLeccionGas({
    id: 'gas-presion-atmosferica',
    subtema: 'n1-b8-s3',
    nombre: 'Presión atmosférica',
    pregunta: '¿Por qué el aire empuja y cuánto?',
    objetivo: 'Explicar la presión atmosférica como el peso de la columna de aire, relacionarla con la altura de un barómetro y estimar la fuerza que ejerce sobre una superficie.',
    idea: 'El aire tiene masa y la Tierra lo atrae: la columna de aire que hay encima de cada superficie la empuja. En un barómetro de mercurio, esa presión sostiene una columna de líquido cuya altura mide la presión. Al nivel del mar la presión estándar equivale a 760 mm de mercurio; con un líquido menos denso la columna sería mucho más alta.',
    imagen: 'Un barómetro de agua necesitaría un tubo de unos diez metros: el mercurio, unas trece veces más denso, lo reduce a 76 cm.',
    error: 'Pensar que la presión atmosférica es pequeña porque no se nota. Sobre una hoja de papel equivale al peso de cientos de kilogramos; no aplasta las cosas porque el aire empuja por todos los lados.',
    ecs: [
      ['Columna de líquido', 'P = ρ · g · h', 'La presión que sostiene la columna es su peso por unidad de área.', String.raw`P = \rho \cdot g \cdot h`],
      ['Dos líquidos, misma presión', 'ρ₁ · h₁ = ρ₂ · h₂', 'A igual presión, la altura es inversamente proporcional a la densidad.', String.raw`\rho_1 \cdot h_1 = \rho_2 \cdot h_2`],
      ['Fuerza sobre una superficie', 'F = P · A', 'La presión por el área da la fuerza total.', String.raw`F = P \cdot A`]
    ],
    vars: [
      ['ρ', 'densidad del líquido', 'kg/m³'],
      ['g', 'aceleración de la gravedad estándar', '9,80665 m/s²'],
      ['h', 'altura de la columna', 'm o mm'],
      ['A', 'área', 'm²']
    ],
    supuestos: ['Líquido incompresible y densidad uniforme.', 'Gravedad estándar.', 'Por encima de la columna de mercurio solo hay vacío (se desprecia el vapor de mercurio).'],
    limites: 'Los valores de presión atmosférica de las prácticas son didácticos; no describen un lugar ni un día concretos. La disminución de la presión con la altitud no se modela.',
    ejemplo: 'ej-gas-atmosferica',
    fuentes: [
      rengSeccionGases('g91', 'presión atmosférica y barómetros'),
      RENG_PROCEDENCIA_ATM,
      rengDeclarada('Densidad convencional del mercurio 13,5951 g/cm³ y g = 9,80665 m/s², tal como figuran en el catálogo de unidades del proyecto (definición del mmHg en NIST SP 811 y valor estándar de la CGPM, declarados).'),
      rengDidactico('Las densidades de los otros líquidos de las prácticas son didácticas.')
    ],
    idealizado: 'Barómetro ideal y gravedad estándar.',
    metodo: 'proporción con la presión estándar de 760 mm'
  }),
  rengLeccionGas({
    id: 'gas-ley-boyle',
    subtema: 'n1-b8-s4',
    nombre: 'Ley de Boyle',
    pregunta: '¿Qué le pasa a la presión de un gas si reduzco su volumen sin cambiar la temperatura?',
    objetivo: 'Aplicar la relación inversa entre presión y volumen a temperatura y cantidad constantes.',
    idea: 'Si la temperatura y la cantidad de gas no cambian, el producto P·V se mantiene. Al reducir el volumen a la mitad, las moléculas chocan el doble de veces contra cada unidad de área y la presión se duplica.',
    imagen: 'Tapa la salida de una jeringa y empuja el émbolo: cuanto más empujas, más te cuesta.',
    error: 'Pensar que P y V son directamente proporcionales y multiplicar por V₂/V₁ en lugar de V₁/V₂.',
    ecs: [
      ['Ley de Boyle', 'P₁ · V₁ = P₂ · V₂', 'A T y n constantes, presión y volumen son inversamente proporcionales.', String.raw`P_1 \cdot V_1 = P_2 \cdot V_2`],
      ['Despeje', 'P₂ = P₁ · V₁ / V₂', 'Si el volumen baja, la presión sube.', String.raw`P_2 = \frac{P_1 \cdot V_1}{V_2}`]
    ],
    vars: [
      ['P₁, P₂', 'presión inicial y final', 'la misma unidad en ambos'],
      ['V₁, V₂', 'volumen inicial y final', 'la misma unidad en ambos']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_CANTIDAD_FIJA, 'La compresión es lenta: la temperatura se mantiene.'],
    limites: RENG_LIMITE_IDEAL,
    ejemplo: 'ej-gas-boyle',
    fuentes: [rengSeccionGases('g92', 'relación entre presión y volumen')],
    idealizado: 'Proceso isotérmico de un gas ideal.',
    metodo: 'integración numérica de dP/dV = −P/V'
  }),
  rengLeccionGas({
    id: 'gas-ley-charles',
    subtema: 'n1-b8-s5',
    nombre: 'Ley de Charles',
    pregunta: '¿Por qué un globo se encoge al meterlo en el frigorífico?',
    objetivo: 'Aplicar la proporcionalidad entre volumen y temperatura absoluta a presión y cantidad constantes.',
    idea: 'A presión constante, el volumen de un gas es proporcional a su temperatura absoluta. Al calentarlo, las moléculas se mueven más deprisa y, para que la presión no suba, el gas se expande. La proporción solo es directa en kelvin: el cero de la escala Kelvin es el punto en el que el volumen del gas ideal extrapolado sería nulo.',
    imagen: 'Un globo que sale del frigorífico se va hinchando al calentarse en la mesa.',
    error: 'Usar grados Celsius en la proporción: de 20 °C a 40 °C la temperatura absoluta no se duplica.',
    ecs: [
      ['Ley de Charles', 'V₁ / T₁ = V₂ / T₂', 'A P y n constantes, V es proporcional a T absoluta.', String.raw`\frac{V_1}{T_1} = \frac{V_2}{T_2}`],
      ['Kelvin', 'T = t + 273,15', 'Convierte siempre antes de dividir.', String.raw`T = t + 273{,}15`]
    ],
    vars: [
      ['V₁, V₂', 'volumen inicial y final', 'L o mL'],
      ['T₁, T₂', 'temperatura absoluta', 'K'],
      ['t', 'temperatura Celsius', '°C']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_CANTIDAD_FIJA, 'La presión se mantiene constante (recipiente flexible).', RENG_KELVIN],
    limites: RENG_LIMITE_IDEAL,
    ejemplo: 'ej-gas-charles',
    fuentes: [rengSeccionGases('g92', 'relación entre volumen y temperatura'), RENG_PROCEDENCIA_KELVIN],
    idealizado: 'Proceso isobárico de un gas ideal.',
    metodo: 'integración numérica de dV/dT = V/T'
  }),
  rengLeccionGas({
    id: 'gas-ley-gay-lussac',
    subtema: 'n1-b8-s6',
    nombre: 'Ley de Gay-Lussac',
    pregunta: '¿Qué le pasa a la presión de un recipiente rígido si se calienta?',
    objetivo: 'Aplicar la proporcionalidad entre presión y temperatura absoluta a volumen y cantidad constantes.',
    idea: 'En un recipiente rígido el gas no puede expandirse. Al calentarlo, las moléculas chocan más a menudo y con más fuerza, y la presión crece en proporción a la temperatura absoluta.',
    imagen: 'Un neumático marca más presión después de un viaje largo, cuando está caliente, que por la mañana en frío.',
    error: 'Usar grados Celsius o invertir el cociente de temperaturas.',
    ecs: [
      ['Ley de Gay-Lussac', 'P₁ / T₁ = P₂ / T₂', 'A V y n constantes, P es proporcional a T absoluta.', String.raw`\frac{P_1}{T_1} = \frac{P_2}{T_2}`],
      ['Despeje de la temperatura', 'T₂ = T₁ · P₂ / P₁', 'Sirve para saber a qué temperatura se alcanza una presión.', String.raw`T_2 = T_1 \cdot \frac{P_2}{P_1}`]
    ],
    vars: [
      ['P₁, P₂', 'presión inicial y final', 'misma unidad'],
      ['T₁, T₂', 'temperatura absoluta', 'K']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_CANTIDAD_FIJA, 'El recipiente no se deforma: el volumen es constante.', RENG_KELVIN],
    limites: RENG_LIMITE_IDEAL,
    ejemplo: 'ej-gas-gay-lussac',
    fuentes: [rengSeccionGases('g92', 'relación entre presión y temperatura'), RENG_PROCEDENCIA_KELVIN],
    idealizado: 'Proceso isocórico de un gas ideal.',
    metodo: 'integración numérica de dP/dT = P/T'
  }),
  rengLeccionGas({
    id: 'gas-ley-avogadro',
    subtema: 'n1-b8-s7',
    nombre: 'Ley de Avogadro',
    pregunta: '¿Ocupa el mismo volumen un mol de cualquier gas?',
    objetivo: 'Aplicar la proporcionalidad entre volumen y cantidad de gas y la relación entre volúmenes de gases que reaccionan.',
    idea: 'A la misma presión y temperatura, volúmenes iguales de gases distintos contienen el mismo número de moléculas. Por eso el volumen es proporcional a la cantidad de gas, y en una reacción entre gases los volúmenes guardan la misma proporción que los coeficientes de la ecuación ajustada.',
    imagen: 'Un globo crece al soplar más aire en él: más moléculas, más volumen, a la misma presión.',
    error: 'Pensar que un gas más pesado ocupa más volumen por mol. A igual P y T, un mol de helio y uno de argón ocupan lo mismo.',
    ecs: [
      ['Ley de Avogadro', 'V₁ / n₁ = V₂ / n₂', 'A P y T constantes, V es proporcional a n.', String.raw`\frac{V_1}{n_1} = \frac{V_2}{n_2}`],
      ['Volúmenes de combinación', 'V_A / V_B = ν_A / ν_B', 'Entre gases medidos en las mismas condiciones, los volúmenes siguen a los coeficientes ν.', String.raw`\frac{V_A}{V_B} = \frac{\nu_A}{\nu_B}`]
    ],
    vars: [
      ['n', 'cantidad de gas', 'mol'],
      ['V', 'volumen', 'L'],
      ['ν', 'coeficiente estequiométrico', 'sin unidad']
    ],
    supuestos: [RENG_GAS_IDEAL, 'Presión y temperatura iguales en todas las medidas.', 'Las reacciones de las prácticas son completas y todas sus especies están en estado gaseoso a la temperatura indicada.'],
    limites: `${RENG_LIMITE_IDEAL} Los volúmenes de combinación no dicen si la reacción ocurre ni a qué velocidad.`,
    ejemplo: 'ej-gas-avogadro',
    fuentes: [rengSeccionGases('g92', 'relación entre volumen y cantidad'), rengSeccionGases('g93', 'volúmenes de gases en reacciones')],
    idealizado: 'Gas ideal y reacciones completas.',
    metodo: 'integración numérica de dV/dn = V/n'
  }),
  rengLeccionGas({
    id: 'gas-ley-combinada',
    subtema: 'n1-b8-s8',
    nombre: 'Ley combinada de los gases',
    pregunta: '¿Cómo se trata un gas que cambia de presión, volumen y temperatura a la vez?',
    objetivo: 'Usar P·V/T = constante para una cantidad fija de gas cuando cambian varias variables.',
    idea: 'Las leyes de Boyle, Charles y Gay-Lussac son casos particulares de una sola relación: para una cantidad fija de gas, P·V/T no cambia. Se puede ir del estado 1 al estado 2 en un solo paso.',
    imagen: 'Un globo meteorológico sube: baja la presión y baja la temperatura, y el balance de las dos decide si se expande.',
    error: 'Olvidar una de las tres razones (por ejemplo, aplicar solo Boyle cuando también cambió la temperatura).',
    ecs: [
      ['Ley combinada', 'P₁V₁ / T₁ = P₂V₂ / T₂', 'Para n constante.', String.raw`\frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}`],
      ['Despeje del volumen', 'V₂ = V₁ · (P₁/P₂) · (T₂/T₁)', 'Cada cociente actúa por separado: más presión reduce, más temperatura aumenta.', String.raw`V_2 = V_1 \cdot \frac{P_1}{P_2} \cdot \frac{T_2}{T_1}`]
    ],
    vars: [
      ['P', 'presión', 'misma unidad en los dos estados'],
      ['V', 'volumen', 'misma unidad en los dos estados'],
      ['T', 'temperatura absoluta', 'K']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_CANTIDAD_FIJA, RENG_KELVIN],
    limites: RENG_LIMITE_IDEAL,
    ejemplo: 'ej-gas-combinada',
    fuentes: [rengSeccionGases('g92', 'ley combinada'), RENG_PROCEDENCIA_KELVIN],
    idealizado: 'Gas ideal con cantidad fija.',
    metodo: 'dos tramos integrados numéricamente (isotérmico e isobárico)'
  }),
  rengLeccionGas({
    id: 'gas-ideal',
    subtema: 'n1-b8-s9',
    nombre: 'Ecuación del gas ideal',
    pregunta: '¿Cómo se relacionan a la vez presión, volumen, temperatura y cantidad?',
    objetivo: 'Usar PV = nRT eligiendo el valor de R que encaja con las unidades.',
    idea: 'Las leyes anteriores se reúnen en una sola ecuación de estado: PV = nRT. La constante R es la misma para todos los gases; solo cambia su valor numérico según las unidades que uses.',
    imagen: 'Con tres de las cuatro magnitudes conocidas, la ecuación da la cuarta.',
    error: 'Mezclar unidades: usar R = 0,08206 L·atm/(mol·K) con presiones en kPa o volúmenes en mL.',
    ecs: [
      ['Ecuación de estado', 'P · V = n · R · T', 'Válida para el gas ideal.', String.raw`P \cdot V = n \cdot R \cdot T`],
      ['Valores de R', 'R = 8,314 J/(mol·K) = 8,314 L·kPa/(mol·K) = 0,08206 L·atm/(mol·K)', 'Es la misma constante escrita en tres sistemas de unidades.', String.raw`R = 8{,}314\ \mathrm{J/(mol \cdot K)} = 8{,}314\ \mathrm{L \cdot kPa/(mol \cdot K)} = 0{,}08206\ \mathrm{L \cdot atm/(mol \cdot K)}`]
    ],
    vars: [
      ['P', 'presión', 'kPa o atm'],
      ['V', 'volumen', 'L'],
      ['n', 'cantidad', 'mol'],
      ['T', 'temperatura absoluta', 'K'],
      ['R', 'constante de los gases', 'según las unidades']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_KELVIN],
    limites: RENG_LIMITE_IDEAL,
    ejemplo: 'ej-gas-ideal',
    fuentes: [rengSeccionGases('g92', 'ecuación del gas ideal'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_ATM, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Gas ideal.',
    metodo: 'P = N·k_B·T/V con N = n·N_A'
  }),
  rengLeccionGas({
    id: 'gas-densidad',
    subtema: 'n1-b8-s10',
    nombre: 'Densidad de gases',
    pregunta: '¿De qué depende la densidad de un gas?',
    objetivo: 'Calcular la densidad de un gas ideal a partir de su masa molar, la presión y la temperatura.',
    idea: 'Al sustituir n = m/M en PV = nRT se obtiene ρ = PM/(RT). La densidad de un gas crece con la presión y con la masa molar y disminuye al calentarlo. A la misma P y T, la razón entre densidades de dos gases es la razón entre sus masas molares.',
    imagen: 'Un globo de aire caliente sube porque el aire de dentro, más caliente, es menos denso que el de fuera.',
    error: 'Dar la densidad sin la masa molar (P/(RT) es una concentración en mol/L, no una densidad).',
    ecs: [
      ['Densidad de un gas ideal', 'ρ = P · M / (R · T)', 'Con P en atm, M en g/mol y R = 0,08206 L·atm/(mol·K), sale en g/L.', String.raw`\rho = \frac{P \cdot M}{R \cdot T}`],
      ['Mismo gas, otras condiciones', 'ρ₂ = ρ₁ · (P₂/P₁) · (T₁/T₂)', 'Proporcional a P e inversamente proporcional a T.', String.raw`\rho_2 = \rho_1 \cdot \frac{P_2}{P_1} \cdot \frac{T_1}{T_2}`],
      ['Dos gases, mismas condiciones', 'ρ_A / ρ_B = M_A / M_B', 'Compara densidades sin calcularlas.', String.raw`\frac{\rho_A}{\rho_B} = \frac{M_A}{M_B}`]
    ],
    vars: [
      ['ρ', 'densidad', 'g/L'],
      ['M', 'masa molar', 'g/mol'],
      ['P', 'presión', 'atm'],
      ['T', 'temperatura absoluta', 'K']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_KELVIN],
    limites: RENG_LIMITE_IDEAL,
    ejemplo: 'ej-gas-densidad',
    fuentes: [rengSeccionGases('g93', 'densidad de los gases'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Gas ideal puro.',
    metodo: 'ρ = P·m/(k_B·T) con la masa de una molécula'
  }),
  rengLeccionGas({
    id: 'gas-masa-molar',
    subtema: 'n1-b8-s11',
    nombre: 'Masa molar de gases',
    pregunta: '¿Cómo se averigua la masa molar de un gas desconocido?',
    objetivo: 'Calcular la masa molar de un gas a partir de su masa, presión, volumen y temperatura, o de su densidad.',
    idea: 'Si se mide la masa de gas que llena un recipiente conocido a una presión y temperatura conocidas, la ecuación del gas ideal da cuántos moles hay; la masa entre los moles es la masa molar. Es un método clásico para identificar gases.',
    imagen: 'Se pesa un matraz vacío y luego lleno de gas: la diferencia es la masa del gas.',
    error: 'Usar la masa del matraz lleno en lugar de la diferencia, o dejar el volumen en mL.',
    ecs: [
      ['A partir de la masa', 'M = m · R · T / (P · V)', 'Combina n = PV/(RT) y M = m/n.', String.raw`M = \frac{m \cdot R \cdot T}{P \cdot V}`],
      ['A partir de la densidad', 'M = ρ · R · T / P', 'La misma relación de la densidad, despejada.', String.raw`M = \frac{\rho \cdot R \cdot T}{P}`]
    ],
    vars: [
      ['m', 'masa del gas', 'g'],
      ['M', 'masa molar', 'g/mol'],
      ['V', 'volumen', 'L'],
      ['P', 'presión', 'atm o kPa (con su R)']
    ],
    supuestos: [RENG_GAS_IDEAL, 'El gas es una sola sustancia pura.', RENG_KELVIN],
    limites: `${RENG_LIMITE_IDEAL} Los datos de las prácticas son didácticos y no sirven para identificar ninguna muestra real.`,
    ejemplo: 'ej-gas-masa-molar',
    fuentes: [rengSeccionGases('g93', 'masa molar de un gas'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Gas ideal puro y balanza ideal.',
    metodo: 'masa de una molécula, m = ρ·k_B·T/P, y M = m·N_A'
  }),
  rengLeccionGas({
    id: 'gas-presiones-parciales',
    subtema: 'n1-b8-s12',
    nombre: 'Presiones parciales',
    pregunta: '¿Qué parte de la presión de una mezcla se debe a cada gas?',
    objetivo: 'Calcular la presión parcial de un gas en una mezcla a partir de su fracción molar o de su cantidad.',
    idea: 'En una mezcla de gases ideales cada componente se comporta como si estuviera solo en todo el recipiente. La presión que ejercería así es su presión parcial, y es proporcional a su fracción molar: la fracción de moléculas de la mezcla que son de ese gas.',
    imagen: 'En el aire, unas 21 de cada 100 moléculas son de oxígeno: el oxígeno aporta el 21 % de la presión.',
    error: 'Repartir la presión según la fracción en masa en lugar de la fracción molar.',
    ecs: [
      ['Fracción molar', 'x_i = n_i / n_total', 'Sin unidades; las fracciones de todos los componentes suman 1.', String.raw`x_i = \frac{n_i}{n_{\mathrm{total}}}`],
      ['Presión parcial', 'p_i = x_i · P_total', 'Equivale a p_i = n_i·R·T/V.', String.raw`p_i = x_i \cdot P_{\mathrm{total}}`]
    ],
    vars: [
      ['x_i', 'fracción molar del gas i', 'sin unidad'],
      ['p_i', 'presión parcial', 'kPa'],
      ['n_i', 'cantidad del gas i', 'mol']
    ],
    supuestos: [RENG_GAS_IDEAL, 'Los gases de la mezcla no reaccionan entre sí.'],
    limites: `${RENG_LIMITE_IDEAL} La fracción 0,21 del oxígeno es la del aire seco cerca de la superficie y se usa con dos cifras.`,
    ejemplo: 'ej-gas-parciales',
    explorar: {
      modulo: 'simulador-quimica',
      sub: 'casos',
      nombre: 'Caso real «El aire que respiras»',
      instruccion: 'Abre Casos reales y busca «El aire que respiras». Toma los porcentajes del aire seco y calcula la presión parcial de cada gas a la presión total que elijas.',
      limite: 'El caso solo muestra la composición del aire seco (porcentajes en volumen, que para gases ideales coinciden con fracciones molares). No calcula presiones parciales ni simula nada; sus decimales proceden de un resumen de búsqueda.'
    },
    fuentes: [
      rengSeccionGases('g93', 'mezclas de gases y presiones parciales'),
      rengDeclarada('Composición del aire seco (78 % N₂, 21 % O₂): tomada del caso real «El aire que respiras» del proyecto, que la atribuye a la NASA; no se reabrió la página en esta entrega.')
    ],
    idealizado: 'Mezcla ideal sin vapor de agua.',
    metodo: 'cantidades de sustancia en un volumen auxiliar'
  }),
  rengLeccionGas({
    id: 'gas-ley-dalton',
    subtema: 'n1-b8-s13',
    nombre: 'Ley de Dalton',
    pregunta: '¿Cuánto vale la presión total de una mezcla de gases?',
    objetivo: 'Sumar presiones parciales y aplicar la ley de Dalton a gases recogidos sobre agua y a recipientes que se conectan.',
    idea: 'La presión total de una mezcla de gases ideales es la suma de las presiones parciales de sus componentes. Por eso, cuando un gas se recoge sobre agua, la presión medida incluye la del vapor de agua y hay que restarla para obtener la del gas seco.',
    imagen: 'Si conectas dos recipientes con gases distintos, cada gas se reparte por el volumen total y su presión parcial baja.',
    error: 'Sumar presiones en unidades distintas, o sumar las presiones iniciales de dos recipientes que se conectan sin tener en cuenta que el volumen aumenta.',
    ecs: [
      ['Ley de Dalton', 'P_total = p₁ + p₂ + p₃ + …', 'Todas en la misma unidad.', String.raw`P_{\mathrm{total}} = p_1 + p_2 + p_3 + \dots`],
      ['Gas sobre agua', 'p_gas = P_total − p_agua', 'La presión del vapor de agua depende de la temperatura; en las prácticas se da como dato didáctico.', String.raw`p_{\mathrm{gas}} = P_{\mathrm{total}} - p_{\mathrm{agua}}`],
      ['Recipientes conectados (misma T)', 'P_final = (P_A·V_A + P_B·V_B) / (V_A + V_B)', 'Cada gas pasa a ocupar el volumen total.', String.raw`P_{\mathrm{final}} = \frac{P_A \cdot V_A + P_B \cdot V_B}{V_A + V_B}`]
    ],
    vars: [
      ['P_total', 'presión total', 'kPa o mmHg'],
      ['p_i', 'presión parcial', 'misma unidad'],
      ['V_A, V_B', 'volúmenes de los recipientes', 'L']
    ],
    supuestos: [RENG_GAS_IDEAL, 'Los gases no reaccionan entre sí.', 'La temperatura es la misma antes y después de mezclar.'],
    limites: `${RENG_LIMITE_IDEAL} Las presiones de vapor del agua de las prácticas son valores didácticos, no de una tabla verificada.`,
    ejemplo: 'ej-gas-dalton',
    fuentes: [rengSeccionGases('g93', 'ley de Dalton y gases recogidos sobre agua'), RENG_PROCEDENCIA_R, rengDidactico('Las presiones de vapor del agua que aparecen en el ejemplo y en las prácticas son valores didácticos del enunciado, no datos de una tabla consultada.')],
    idealizado: 'Mezcla ideal, sin reacción y a temperatura constante.',
    metodo: 'moles totales y fracción molar del gas seco'
  }),
  rengLeccionGas({
    id: 'gas-volumen-molar',
    subtema: 'n1-b8-s14',
    nombre: 'Volumen molar',
    pregunta: '¿Cuánto ocupa un mol de gas?',
    objetivo: 'Calcular el volumen molar a cualquier presión y temperatura y usarlo para pasar de volumen a moles y moléculas.',
    idea: 'El volumen molar es el volumen que ocupa un mol de gas: V_m = RT/P. No es un número fijo: a 0 °C y 1 atm vale unos 22,4 L/mol y a 25 °C y 1 atm unos 24,5 L/mol. Usar 22,4 L/mol fuera de 0 °C y 1 atm es un error frecuente.',
    imagen: 'Un mol de gas a temperatura ambiente cabe en un cubo de unos 29 cm de lado.',
    error: 'Usar 22,4 L/mol en cualquier condición.',
    ecs: [
      ['Volumen molar', 'V_m = V / n = R · T / P', 'Depende de T y P, no del gas (en el modelo ideal).', String.raw`V_m = \frac{V}{n} = \frac{R \cdot T}{P}`],
      ['Moléculas', 'N = n · N_A', 'N_A = 6,02214076·10²³ mol⁻¹.', String.raw`N = n \cdot N_A`]
    ],
    vars: [
      ['V_m', 'volumen molar', 'L/mol'],
      ['N', 'número de moléculas', 'sin unidad'],
      ['N_A', 'constante de Avogadro', 'mol⁻¹']
    ],
    supuestos: [RENG_GAS_IDEAL, RENG_KELVIN],
    limites: `${RENG_LIMITE_IDEAL} Los valores 22,41 L/mol y 24,47 L/mol son datos calculados con R, no medidos.`,
    ejemplo: 'ej-gas-volumen-molar',
    fuentes: [rengSeccionGases('g93', 'volumen molar'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_ATM, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Gas ideal.',
    metodo: 'V = N·k_B·T/P para N_A moléculas'
  }),
  rengLeccionGas({
    id: 'gas-teoria-cinetica',
    subtema: 'n1-b8-s15',
    nombre: 'Teoría cinético-molecular',
    pregunta: '¿Qué modelo de moléculas explica las leyes de los gases?',
    objetivo: 'Enunciar los postulados de la teoría cinético-molecular y relacionar la energía cinética media con la temperatura absoluta.',
    idea: 'La teoría cinético-molecular supone que un gas está formado por moléculas muy pequeñas comparadas con la distancia entre ellas, que se mueven al azar en línea recta, chocan de forma elástica y no se atraen. Con ese modelo se deduce que la energía cinética media de traslación depende solo de la temperatura absoluta: (3/2)RT por mol. Para cualquier gas ideal, la energía de traslación total es (3/2)PV.',
    imagen: 'A la misma temperatura, las moléculas de helio y de dióxido de carbono tienen la misma energía cinética media; las de helio, más ligeras, van más rápido.',
    error: 'Pensar que a la misma temperatura las moléculas pesadas tienen más energía cinética.',
    ecs: [
      ['Energía cinética media por mol', 'E_c = (3/2) · R · T', 'Solo depende de T absoluta.', String.raw`E_c = \frac{3}{2} \cdot R \cdot T`],
      ['Por molécula', 'ε = (3/2) · k_B · T', 'Con k_B = R / N_A.', String.raw`\varepsilon = \frac{3}{2} \cdot k_B \cdot T`],
      ['Energía de traslación de una muestra', 'E = (3/2) · n · R · T = (3/2) · P · V', 'Con P en kPa y V en L, sale en J.', String.raw`E = \frac{3}{2} \cdot n \cdot R \cdot T = \frac{3}{2} \cdot P \cdot V`]
    ],
    vars: [
      ['E_c', 'energía cinética de traslación', 'J o kJ'],
      ['k_B', 'constante de Boltzmann', 'J/K'],
      ['T', 'temperatura absoluta', 'K']
    ],
    supuestos: [RENG_GAS_IDEAL, 'Solo se cuenta la energía de traslación (no la de rotación ni la de vibración).'],
    limites: `${RENG_LIMITE_IDEAL} La energía de rotación y vibración de las moléculas poliatómicas no entra en (3/2)RT.`,
    ejemplo: 'ej-gas-cinetica',
    fuentes: [rengSeccionGases('g95', 'postulados y energía cinética media'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Gas ideal monoatómico en cuanto a la traslación.',
    metodo: '(3/2)·k_B·T por molécula multiplicado por N_A'
  }),
  rengLeccionGas({
    id: 'gas-velocidad-molecular',
    subtema: 'n1-b8-s16',
    nombre: 'Velocidad molecular',
    pregunta: '¿A qué velocidad se mueven las moléculas de un gas?',
    objetivo: 'Calcular la velocidad cuadrática media y la velocidad media de las moléculas de un gas ideal.',
    idea: 'En un gas no todas las moléculas van igual de rápido: sus velocidades se reparten alrededor de unos valores típicos. La velocidad cuadrática media u_rms sale de igualar la energía cinética media a (3/2)k_B·T. Aumenta con la temperatura y disminuye con la masa molar.',
    imagen: 'A temperatura ambiente las moléculas del aire van a unos 500 m/s, pero chocan tanto que avanzan muy despacio en una dirección concreta.',
    error: 'Usar la masa molar en g/mol en lugar de kg/mol, con lo que la velocidad sale unas 32 veces menor.',
    ecs: [
      ['Velocidad cuadrática media', 'u_rms = √(3 · R · T / M)', 'M en kg/mol y R = 8,314 J/(mol·K): sale en m/s.', String.raw`u_{\mathrm{rms}} = \sqrt{\frac{3 \cdot R \cdot T}{M}}`],
      ['Velocidad media', 'ū = √(8 · R · T / (π · M))', 'Un 8 % menor que u_rms.', String.raw`\bar{u} = \sqrt{\frac{8 \cdot R \cdot T}{\pi \cdot M}}`],
      ['Despeje de T', 'T = u_rms² · M / (3 · R)', 'Temperatura a la que un gas alcanza una u_rms dada.', String.raw`T = \frac{u_{\mathrm{rms}}^{2} \cdot M}{3 \cdot R}`]
    ],
    vars: [
      ['u_rms', 'velocidad cuadrática media', 'm/s'],
      ['ū', 'velocidad media', 'm/s'],
      ['M', 'masa molar', 'kg/mol']
    ],
    supuestos: [RENG_GAS_IDEAL, 'Distribución de velocidades de Maxwell-Boltzmann (solo se usan sus valores medios).'],
    limites: `${RENG_LIMITE_IDEAL} La distribución completa de velocidades no se calcula en este nivel.`,
    ejemplo: 'ej-gas-velocidad',
    fuentes: [rengSeccionGases('g95', 'velocidades moleculares'), RENG_PROCEDENCIA_R, RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Gas ideal.',
    metodo: 'igualar (1/2)·m·u² a (3/2)·k_B·T por molécula'
  }),
  rengLeccionGas({
    id: 'gas-difusion',
    subtema: 'n1-b8-s17',
    nombre: 'Difusión gaseosa',
    pregunta: '¿Por qué un olor llega a toda la habitación?',
    objetivo: 'Describir la difusión y comparar, en un modelo idealizado, lo rápido que se difunden dos gases según su masa molar.',
    idea: 'La difusión es la mezcla espontánea de un gas con otro gracias al movimiento al azar de sus moléculas. Los gases ligeros se difunden más deprisa. En un modelo sencillo, la rapidez de difusión es inversamente proporcional a la raíz cuadrada de la masa molar, como en la ley de Graham.',
    imagen: 'Si se liberan dos gases en los extremos de un tubo, se encuentran más cerca del extremo del gas pesado.',
    error: 'Usar la razón de masas molares sin la raíz cuadrada.',
    ecs: [
      ['Razón de rapideces', 'v_A / v_B = √(M_B / M_A)', 'Modelo idealizado: igual que la ley de Graham.', String.raw`\frac{v_A}{v_B} = \sqrt{\frac{M_B}{M_A}}`],
      ['Distancias en el mismo tiempo', 'd_A / d_B = v_A / v_B', 'Cada gas recorre una distancia proporcional a su rapidez.', String.raw`\frac{d_A}{d_B} = \frac{v_A}{v_B}`]
    ],
    vars: [
      ['v', 'rapidez de difusión', 'relativa'],
      ['d', 'distancia recorrida', 'cm'],
      ['M', 'masa molar', 'g/mol']
    ],
    supuestos: ['Ambos gases a la misma temperatura y presión.', 'Frentes de difusión idealizados que avanzan a rapidez constante.'],
    limites: 'Es un modelo idealizado: la difusión real depende de los choques con el otro gas, avanza con la raíz cuadrada del tiempo y no tiene un frente nítido. La ley de Graham es exacta para la efusión, no para la difusión.',
    ejemplo: 'ej-gas-difusion',
    fuentes: [rengSeccionGases('g94', 'difusión de gases'), RENG_PROCEDENCIA_MASAS],
    idealizado: 'Frentes de difusión a rapidez constante proporcional a 1/√M.',
    metodo: 'simulación paso a paso del avance de los dos frentes'
  }),
  rengLeccionGas({
    id: 'gas-efusion',
    subtema: 'n1-b8-s18',
    nombre: 'Efusión',
    pregunta: '¿Por qué un globo de helio se desinfla antes que uno de aire?',
    objetivo: 'Distinguir efusión de difusión y calcular tiempos y cantidades de efusión.',
    idea: 'La efusión es el paso de un gas a través de un orificio diminuto hacia el vacío, sin choques en el camino. Cuantas más moléculas llegan al orificio por segundo, más rápida es; y eso depende de su velocidad media, proporcional a 1/√M. Para escapar la misma cantidad, el tiempo es proporcional a √M.',
    imagen: 'Por los poros de la goma escapan antes los átomos de helio, más ligeros, que las moléculas del aire.',
    error: 'Pensar que tiempo y velocidad van en el mismo sentido: si el gas escapa más rápido, tarda menos.',
    ecs: [
      ['Velocidades de efusión', 'r_A / r_B = √(M_B / M_A)', 'A la misma P y T.', String.raw`\frac{r_A}{r_B} = \sqrt{\frac{M_B}{M_A}}`],
      ['Tiempos para la misma cantidad', 't_A / t_B = √(M_A / M_B)', 'El gas pesado tarda más.', String.raw`\frac{t_A}{t_B} = \sqrt{\frac{M_A}{M_B}}`],
      ['Enriquecimiento por etapas', 'x_k = x₀ · (√(M_B / M_A))^k', 'Cociente de cantidades del gas ligero A frente al pesado B tras k etapas ideales.', String.raw`x_k = x_0 \cdot \left(\sqrt{\frac{M_B}{M_A}}\right)^{k}`]
    ],
    vars: [
      ['r', 'velocidad de efusión', 'mol/s (relativa)'],
      ['t', 'tiempo', 's'],
      ['x', 'cociente n_A/n_B', 'sin unidad']
    ],
    supuestos: ['Orificio mucho menor que el recorrido libre de las moléculas.', 'Misma presión y temperatura para los dos gases.'],
    limites: 'Modelo ideal: en orificios reales o porosos hay choques y el cociente se aparta de √M. El enriquecimiento por etapas supone etapas idénticas e ideales.',
    ejemplo: 'ej-gas-efusion',
    fuentes: [rengSeccionGases('g94', 'efusión y ley de Graham'), RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_R],
    idealizado: 'Efusión molecular ideal.',
    metodo: 'cociente de velocidades medias moleculares en valor absoluto'
  }),
  rengLeccionGas({
    id: 'gas-ley-graham',
    subtema: 'n1-b8-s19',
    nombre: 'Ley de Graham',
    pregunta: '¿Cómo se usa la efusión para medir masas molares?',
    objetivo: 'Aplicar la ley de Graham para comparar velocidades de efusión y para calcular masas molares desconocidas.',
    idea: 'La ley de Graham dice que, a la misma presión y temperatura, las velocidades de efusión de dos gases son inversamente proporcionales a las raíces cuadradas de sus masas molares. Midiendo velocidades o tiempos frente a un gas de masa molar conocida se obtiene la masa molar de otro.',
    imagen: 'Si un gas desconocido efunde la mitad de rápido que el oxígeno, su masa molar es cuatro veces la del oxígeno.',
    error: 'Olvidar elevar al cuadrado al despejar la masa molar.',
    ecs: [
      ['Ley de Graham', 'r_A / r_B = √(M_B / M_A)', 'A la misma P y T.', String.raw`\frac{r_A}{r_B} = \sqrt{\frac{M_B}{M_A}}`],
      ['Masa molar desconocida', 'M_X = M_ref · (r_ref / r_X)² = M_ref · (t_X / t_ref)²', 'Con velocidades o con tiempos para la misma cantidad.', String.raw`M_X = M_{\mathrm{ref}} \cdot \left(\frac{r_{\mathrm{ref}}}{r_X}\right)^{2} = M_{\mathrm{ref}} \cdot \left(\frac{t_X}{t_{\mathrm{ref}}}\right)^{2}`]
    ],
    vars: [
      ['r', 'velocidad de efusión', 'relativa'],
      ['M_ref', 'masa molar del gas de referencia', 'g/mol'],
      ['M_X', 'masa molar desconocida', 'g/mol']
    ],
    supuestos: ['Efusión ideal a la misma presión y temperatura.'],
    limites: 'La ley es exacta solo para la efusión molecular ideal; los datos de las prácticas son didácticos.',
    ejemplo: 'ej-gas-graham',
    fuentes: [rengSeccionGases('g94', 'ley de Graham'), RENG_PROCEDENCIA_MASAS, RENG_PROCEDENCIA_NA_KB],
    idealizado: 'Efusión ideal.',
    metodo: 'cociente de velocidades cuadráticas medias en valor absoluto'
  }),
  rengLeccionGas({
    id: 'gas-desviaciones',
    subtema: 'n1-b8-s20',
    nombre: 'Desviaciones del comportamiento ideal',
    pregunta: '¿Cuándo deja de valer PV = nRT?',
    objetivo: 'Medir la desviación con el factor de compresibilidad y estimar su origen con la ecuación de van der Waals.',
    idea: 'Las moléculas reales ocupan volumen y se atraen. A presiones bajas y temperaturas altas eso apenas se nota, pero a presión alta o cerca de la condensación el gas se aparta del modelo ideal. El factor de compresibilidad Z = PV/(nRT) lo mide: Z = 1 es ideal, Z < 1 indica que dominan las atracciones y Z > 1 que domina el volumen propio de las moléculas. La ecuación de van der Waals corrige la presión con un término a (atracciones) y el volumen con un término b (volumen propio).',
    imagen: 'Comprimir mucho un gas acerca tanto sus moléculas que empiezan a atraerse y a estorbarse.',
    error: 'Restar el término de las atracciones con el signo cambiado o usar el volumen total en lugar de V − nb.',
    ecs: [
      ['Factor de compresibilidad', 'Z = P · V / (n · R · T)', 'Z = 1 para el gas ideal.', String.raw`Z = \frac{P \cdot V}{n \cdot R \cdot T}`],
      ['Ecuación de van der Waals', 'P = n·R·T / (V − n·b) − a·n² / V²', 'a en L²·atm/mol² y b en L/mol.', String.raw`P = \frac{n \cdot R \cdot T}{V - n \cdot b} - \frac{a \cdot n^{2}}{V^{2}}`],
      ['Desviación relativa', 'δ = (P_ideal − P_vdW) / P_vdW × 100 %', 'Cuánto se equivoca el modelo ideal respecto del corregido.', String.raw`\delta = \frac{P_{\mathrm{ideal}} - P_{\mathrm{vdW}}}{P_{\mathrm{vdW}}} \times 100\,\%`]
    ],
    vars: [
      ['Z', 'factor de compresibilidad', 'sin unidad'],
      ['a', 'parámetro de atracción', 'L²·atm/mol²'],
      ['b', 'volumen excluido por mol', 'L/mol']
    ],
    supuestos: ['Los parámetros a y b de las prácticas son didácticos, de un gas hipotético; no son los de ninguna sustancia real.', 'Las presiones «medidas» de las prácticas son didácticas.'],
    limites: 'La ecuación de van der Waals es también un modelo aproximado. Para sustancias reales harían falta parámetros con fuente verificada, que el proyecto todavía no tiene.',
    ejemplo: 'ej-gas-desviaciones',
    fuentes: [rengSeccionGases('g96', 'comportamiento no ideal y van der Waals'), RENG_PROCEDENCIA_R, rengDidactico('Parámetros a y b y presiones medidas de las prácticas: valores didácticos de gases hipotéticos.')],
    idealizado: 'Gas de van der Waals con parámetros didácticos.',
    metodo: 'el mismo cociente en unidades SI con R = N_A·k_B'
  })
]
