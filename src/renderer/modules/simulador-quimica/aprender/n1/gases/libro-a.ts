import { RENG_G, rengEscenaGas, rengPreg, type RengLibroGas } from './libro-comun'

export const RENG_LIBRO_GASES_A: Readonly<Record<string, RengLibroGas>> = {
  'gas-propiedades': {
    objetivosMas: ['Explicar con el modelo de partículas por qué un gas se comprime y se mezcla con facilidad.'],
    porQueImporta: 'Las bombonas de gas de una cocina guardan mucho combustible en poco espacio porque el gas se deja comprimir; el airbag de un coche se infla en milésimas de segundo porque un gas llena enseguida todo el volumen disponible. Entender qué hace distinto a un gas es el punto de partida de todo el capítulo.',
    analogia: 'Un gas se parece a unas pocas personas corriendo por un pabellón enorme: ocupan todo el espacio, casi nunca se tocan y, si se cierra la mitad del pabellón, caben sin problema.',
    analogiaLimite: 'La analogía falla en la escala y en las fuerzas: las moléculas son muchísimas, no deciden adónde van y en el modelo ideal no se atraen; además, en un gas real sí hay pequeñas atracciones.',
    correccion: 'Al comprimir sin que entre ni salga gas, la masa es la misma; como el volumen baja, la densidad sube en la misma proporción (ρ₂/ρ₁ = V₁/V₂).',
    errores: [['Pensar que un gas no tiene masa o no pesa porque es invisible y ligero.', 'Un gas tiene masa: un litro de aire a temperatura ambiente tiene alrededor de un gramo, y un balón inflado pesa más que desinflado.']],
    ejemplo2: 'ej-gas-propiedades-2',
    figuras: ['fig-gas-densidad-compresion'],
    resumen: [
      'Un gas no tiene forma ni volumen propios: ocupa todo el recipiente.',
      'Sus moléculas están muy separadas y en movimiento continuo, por eso se comprime y se mezcla con facilidad.',
      'Su densidad es baja, del orden de mil veces menor que la de los líquidos.',
      'Su estado se describe con cuatro magnitudes: presión, volumen, temperatura y cantidad.',
      'Al comprimir un gas encerrado, la masa se conserva y la densidad aumenta.'
    ],
    glosario: [RENG_G.gas, RENG_G.densidad, RENG_G.compresibilidad],
    comprobar: [
      rengPreg(
        'Se empuja el émbolo de una jeringa tapada llena de aire hasta la mitad de su volumen. ¿Qué le pasa a la masa del aire?',
        ['No cambia', true, 'Correcto: el recipiente está cerrado, así que no entra ni sale aire; solo cambia el volumen que ocupa.'],
        ['Se reduce a la mitad', false, 'Confusión típica entre masa y volumen: lo que se reduce a la mitad es el volumen, no la cantidad de aire.'],
        ['Se duplica', false, 'Lo que se duplica es la densidad (misma masa en la mitad de volumen), no la masa del aire.']
      ),
      rengPreg(
        '¿Por qué un gas se comprime mucho más que un líquido?',
        ['Porque sus moléculas están muy separadas', true, 'Correcto: casi todo el volumen de un gas es espacio vacío entre moléculas, y ese espacio se puede reducir.'],
        ['Porque sus moléculas son más pequeñas', false, 'El tamaño de las moléculas no es la causa: el agua líquida y el vapor de agua tienen las mismas moléculas.'],
        ['Porque sus moléculas se atraen más', false, 'Al revés: en un gas las atracciones son muy débiles comparadas con el movimiento; en el modelo ideal son nulas.']
      ),
      rengPreg(
        '¿Qué cuatro magnitudes describen el estado de una muestra de gas?',
        ['Presión, volumen, temperatura y cantidad', true, 'Correcto: con P, V, T y n queda descrito el estado; la ecuación del gas ideal las relaciona.'],
        ['Masa, color, olor y volumen', false, 'El color y el olor dependen de la sustancia, no describen el estado mecánico y térmico de la muestra.'],
        ['Densidad, forma, masa y velocidad', false, 'Un gas no tiene forma propia, y la densidad se deduce de la masa y el volumen; no son las cuatro variables de estado.']
      )
    ],
    anterior: 'n1-b7-s21',
    siguiente: 'n1-b8-s2',
    prerrequisitos: [],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 29 }, 'Reduce el volumen V con n y T fijos: la masa de gas (n·M) no cambia y la densidad ρ crece en la misma proporción en que baja V.')
  },
  'gas-presion': {
    objetivosMas: ['Distinguir la presión absoluta de la presión manométrica y calcular una a partir de la otra.'],
    porQueImporta: 'Los neumáticos, las ollas a presión, los tensiómetros y las bombonas de buceo dan presiones en unidades distintas (kPa, bar, psi, mmHg). Leerlas bien evita accidentes y errores de cálculo: una presión mal convertida puede ser cien veces mayor o menor de lo que se cree.',
    analogia: 'La presión de un gas es como la lluvia de granizo sobre un tejado: cada piedra empuja muy poco, pero miles de impactos por segundo repartidos sobre la superficie dan un empuje constante.',
    analogiaLimite: 'El granizo cae solo de arriba y de forma irregular; las moléculas chocan en todas direcciones, rebotan sin perder energía en el modelo ideal y son tantas que el empuje es perfectamente uniforme.',
    correccion: 'Antes de sumar, restar o comparar presiones hay que expresarlas en la misma unidad, por ejemplo todas en kPa con 1 atm = 101,325 kPa = 760 mmHg.',
    errores: [['Tomar la lectura de un manómetro de neumático como presión absoluta del aire de dentro.', 'Esos manómetros miden la presión por encima de la atmosférica; la absoluta es la lectura más la presión atmosférica.']],
    ejemplo2: 'ej-gas-presion-2',
    figuras: ['fig-gas-columnas'],
    resumen: [
      'La presión es fuerza perpendicular por unidad de área: P = F/A, y 1 Pa = 1 N/m².',
      'En un gas, la presión resulta de los choques de las moléculas contra las paredes.',
      'Unidades habituales: Pa, kPa, atm y mmHg, con 1 atm = 101,325 kPa = 760 mmHg.',
      'Un manómetro abierto mide la diferencia con la presión atmosférica; hay que sumarla o restarla.'
    ],
    glosario: [RENG_G.presion, RENG_G.pascal, RENG_G.manometro, RENG_G.manometrica],
    comprobar: [
      rengPreg(
        'Una misma fuerza se aplica sobre un área cuatro veces mayor. ¿Qué pasa con la presión?',
        ['Se reduce a la cuarta parte', true, 'Correcto: P = F/A, así que al multiplicar el área por cuatro la presión se divide por cuatro.'],
        ['Se cuadruplica', false, 'Confusión con una relación directa: el área está en el denominador, por eso más área significa menos presión.'],
        ['No cambia, porque la fuerza es la misma', false, 'La presión no es la fuerza: depende de cómo se reparte esa fuerza sobre la superficie.']
      ),
      rengPreg(
        '¿Cuál de estas presiones es la mayor?',
        ['1,2 atm', true, 'Correcto: 1,2 atm son unos 121,6 kPa y unos 912 mmHg, más que las otras dos.'],
        ['110 kPa', false, '110 kPa son unas 1,09 atm: menos que 1,2 atm. Hay que convertir antes de comparar.'],
        ['800 mmHg', false, '800 mmHg son unos 106,7 kPa (1,05 atm): el número es grande, pero la unidad es pequeña.']
      ),
      rengPreg(
        'En un manómetro abierto de mercurio, el nivel está más alto del lado abierto. ¿Qué indica?',
        ['Que el gas empuja más que el aire', true, 'Correcto: el gas empuja el mercurio hacia el lado abierto, así que P_gas = P_atm + h.'],
        ['Que el gas empuja menos que el aire', false, 'Sería al revés: si el gas empujara menos, el aire subiría el mercurio del lado del gas.'],
        ['Que el gas está a la presión atmosférica', false, 'A la misma presión, los dos niveles de mercurio estarían a la misma altura.']
      )
    ],
    anterior: 'n1-b8-s1',
    siguiente: 'n1-b8-s3',
    prerrequisitos: ['n1-b8-s1']
  },
  'gas-presion-atmosferica': {
    objetivosMas: ['Calcular la altura de una columna de líquido que equilibra una presión dada con P = ρ·g·h.'],
    porQueImporta: 'Las previsiones del tiempo, los altímetros de los aviones y el agua que hierve antes en la montaña dependen de la presión atmosférica. Un barómetro de mercurio la mide con una simple columna de líquido, y entender cómo lo hace explica por qué un pozo no se puede aspirar a más de unos diez metros.',
    analogia: 'La atmósfera es como una pila enorme de mantas sobre la superficie: la manta de abajo soporta el peso de todas las de encima, y por eso el aire de abajo está más comprimido.',
    analogiaLimite: 'Las mantas solo empujan hacia abajo; el aire, como todo fluido, empuja igual en todas direcciones, y además su densidad cambia con la temperatura y la altura de forma que una pila de mantas no describe.',
    correccion: 'La presión atmosférica es grande (unos 101 kPa, como diez toneladas por metro cuadrado), pero no aplasta los objetos porque actúa por todos los lados y se compensa.',
    errores: [['Creer que el barómetro de mercurio «aspira» el mercurio hacia arriba.', 'Nada tira del mercurio: el aire empuja la superficie del recipiente y sube la columna hasta que su peso por unidad de área iguala esa presión.']],
    ejemplo2: 'ej-gas-atmosferica-2',
    figuras: ['fig-gas-columnas'],
    resumen: [
      'El aire tiene masa y la gravedad lo atrae: su peso ejerce la presión atmosférica.',
      'Un barómetro de mercurio equilibra esa presión con una columna: P = ρ·g·h.',
      'A nivel del mar, la presión estándar sostiene 760 mm de mercurio, unos 10,3 m de agua.',
      'Para la misma presión, la altura de la columna es inversa a la densidad del líquido.',
      'La fuerza sobre una superficie es la presión por el área: F = P·A.'
    ],
    glosario: [RENG_G.presionAtmosferica, RENG_G.barometro, RENG_G.atmosfera],
    comprobar: [
      rengPreg(
        'Si un barómetro usara un líquido con la mitad de densidad que el mercurio, ¿qué altura marcaría a la misma presión?',
        ['El doble', true, 'Correcto: ρ·h debe ser el mismo; si ρ se reduce a la mitad, h se duplica.'],
        ['La mitad', false, 'Confusión con la proporcionalidad directa: un líquido menos denso necesita una columna más alta para pesar lo mismo.'],
        ['La misma, porque la presión no cambia', false, 'La presión es la misma, pero la altura que la equilibra depende de la densidad del líquido.']
      ),
      rengPreg(
        '¿Por qué una hoja de papel no se aplasta aunque el aire empuje con una fuerza de cientos de kilogramos?',
        ['Porque el aire empuja igual por las dos caras', true, 'Correcto: las fuerzas sobre las dos caras se compensan; solo una diferencia de presión deforma el papel.'],
        ['Porque el aire no tiene peso', false, 'El aire sí tiene peso; precisamente ese peso origina la presión atmosférica.'],
        ['Porque la presión atmosférica solo actúa sobre líquidos', false, 'La presión del aire actúa sobre todas las superficies, sólidas o líquidas.']
      ),
      rengPreg(
        'En lo alto de una montaña, ¿qué marca un barómetro de mercurio comparado con el nivel del mar?',
        ['Una columna más baja', true, 'Correcto: arriba hay menos aire encima, así que la presión es menor y sostiene menos mercurio.'],
        ['Una columna más alta', false, 'Al subir disminuye la cantidad de aire que hay encima; la presión baja, no sube.'],
        ['La misma altura', false, 'La columna mide la presión del lugar, que cambia con la altitud.']
      )
    ],
    anterior: 'n1-b8-s2',
    siguiente: 'n1-b8-s4',
    prerrequisitos: ['n1-b8-s2']
  },
  'gas-ley-boyle': {
    objetivosMas: ['Reconocer una isoterma en una gráfica P–V y explicar por qué P·V es constante en ella.'],
    porQueImporta: 'Al subir desde el fondo del mar, el aire de los pulmones de un buceador se expande; si no lo expulsa, puede dañarlos. La ley de Boyle predice cuánto cambia el volumen de un gas cuando cambia la presión sin que cambie la temperatura, y explica también cómo funcionan una jeringa o un fuelle.',
    analogia: 'Las moléculas en un recipiente son como pelotas rebotando en una habitación: si la habitación se reduce a la mitad, cada pelota llega a las paredes el doble de veces y el empuje total se duplica.',
    analogiaLimite: 'Las pelotas pierden energía en cada bote y la habitación tiene pocas; en el gas ideal los choques son elásticos y hay tantas moléculas que el efecto es continuo y uniforme.',
    correccion: 'Presión y volumen son inversamente proporcionales a T y n constantes: P₂ = P₁·V₁/V₂. Si el volumen baja, la presión sube.',
    errores: [['Aplicar Boyle cuando la temperatura del gas cambia durante el proceso.', 'Boyle exige T constante; si la temperatura también cambia hay que usar la ley combinada (subtema 8).']],
    ejemplo2: 'ej-gas-boyle-2',
    figuras: ['fig-gas-boyle'],
    resumen: [
      'A temperatura y cantidad constantes, P·V = constante.',
      'Si el volumen se reduce a la mitad, la presión se duplica.',
      'En una gráfica P–V, cada temperatura da una curva llamada isoterma.',
      'Las dos presiones (o los dos volúmenes) deben estar en la misma unidad.',
      'Vale para el gas ideal y procesos lentos que no cambian la temperatura.'
    ],
    glosario: [RENG_G.isoterma, RENG_G.inversa],
    comprobar: [
      rengPreg(
        'Un gas a temperatura constante pasa de 3,0 L a 1,0 L. ¿Qué le pasa a la presión?',
        ['Se triplica', true, 'Correcto: P·V es constante, así que al dividir V entre 3 la presión se multiplica por 3.'],
        ['Se reduce a la tercera parte', false, 'Ese error trata P y V como directamente proporcionales; con Boyle van en sentidos opuestos.'],
        ['No cambia, porque la temperatura es constante', false, 'La temperatura constante es la condición de la ley, no significa que la presión se mantenga.']
      ),
      rengPreg(
        'En una gráfica P frente a V a temperatura constante, ¿qué forma tiene la curva de un gas ideal?',
        ['Una curva que baja y se aplana (hipérbola)', true, 'Correcto: P = constante/V, que es una hipérbola; nunca toca los ejes.'],
        ['Una recta que sube', false, 'Una recta que sube indicaría proporcionalidad directa, como en Charles o Gay-Lussac, no en Boyle.'],
        ['Una recta horizontal', false, 'Una recta horizontal significaría que P no depende de V, lo contrario de lo que dice la ley.']
      ),
      rengPreg(
        '¿Cuál de estas situaciones se describe bien con la ley de Boyle?',
        ['Comprimir despacio una jeringa tapada', true, 'Correcto: si se hace despacio, el gas intercambia calor y mantiene su temperatura, y la cantidad no cambia.'],
        ['Calentar un globo al sol', false, 'Al calentar cambia la temperatura; eso lo describe la ley de Charles, no Boyle.'],
        ['Inflar un globo soplando más aire', false, 'Al soplar cambia la cantidad de gas; eso lo describe la ley de Avogadro.']
      )
    ],
    anterior: 'n1-b8-s3',
    siguiente: 'n1-b8-s5',
    prerrequisitos: ['n1-b8-s2'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 28 }, 'Mueve solo el volumen V: el punto recorre la isoterma, P·V/(n·T) se mantiene igual a R y al reducir V a la mitad la presión se duplica.')
  },
  'gas-ley-charles': {
    objetivosMas: ['Convertir temperaturas Celsius a kelvin y justificar por qué la ley de Charles exige la escala absoluta.'],
    porQueImporta: 'Un globo de aire caliente vuela porque el aire calentado se expande y una parte sale de la envoltura, de modo que el aire de dentro pesa menos que el de fuera. La ley de Charles describe ese efecto y fue una de las pistas que llevaron a la idea de cero absoluto.',
    analogia: 'Calentar un gas a presión constante es como acelerar a los jugadores de un partido: corren más deprisa y, para que los choques contra las vallas no aumenten, el campo tiene que hacerse más grande.',
    analogiaLimite: 'Las moléculas no se «apartan» por decisión propia; el volumen crece porque una pared móvil (émbolo, globo) se desplaza hasta que la presión de dentro vuelve a igualar la de fuera.',
    correccion: 'En V₁/T₁ = V₂/T₂ las temperaturas van en kelvin: de 20 °C (293,15 K) a 40 °C (313,15 K) el volumen crece solo un 6,8 %, no el doble.',
    errores: [['Creer que la recta V–T de Charles indica que el gas real llega a volumen cero a −273,15 °C.', 'La recta es del modelo ideal; los gases reales se licúan mucho antes. Lo que se extrapola es el cero de la escala absoluta.']],
    ejemplo2: 'ej-gas-charles-2',
    figuras: ['fig-gas-charles'],
    resumen: [
      'A presión y cantidad constantes, el volumen es proporcional a la temperatura absoluta: V/T = constante.',
      'Las temperaturas siempre van en kelvin: T = t + 273,15.',
      'Las rectas V–T de un gas ideal, prolongadas, pasan por el cero absoluto.',
      'Un proceso a presión constante se llama isobárico.'
    ],
    glosario: [RENG_G.kelvin, RENG_G.ceroAbsoluto, RENG_G.isobarico],
    comprobar: [
      rengPreg(
        'Un gas a presión constante pasa de 100 °C a 200 °C. ¿Cómo cambia su volumen?',
        ['Aumenta alrededor de un 27 %', true, 'Correcto: en kelvin pasa de 373,15 K a 473,15 K, un factor 1,27; no se duplica.'],
        ['Se duplica', false, 'Error típico de usar grados Celsius: 200/100 = 2, pero la proporción es entre temperaturas absolutas.'],
        ['No cambia, porque la presión es constante', false, 'La presión constante es la condición; precisamente por eso el volumen tiene que crecer al calentar.']
      ),
      rengPreg(
        '¿Por qué hay que usar kelvin en la ley de Charles?',
        ['Porque el volumen es proporcional a la temperatura medida desde el cero absoluto', true, 'Correcto: una proporción V/T solo tiene sentido si T = 0 corresponde al cero de la magnitud, y eso solo ocurre en la escala absoluta.'],
        ['Porque el kelvin es la unidad del SI y es obligatoria', false, 'Ser unidad del SI no basta: en una resta de temperaturas da igual usar °C o K; lo que importa aquí es el cero de la escala.'],
        ['Porque así los números salen más grandes y más precisos', false, 'El tamaño de los números no tiene que ver con la precisión; el problema del Celsius es su cero arbitrario.']
      ),
      rengPreg(
        'En una gráfica V frente a T (en K) de un gas ideal a presión constante, ¿qué indica una pendiente mayor?',
        ['Más cantidad de gas o menos presión', true, 'Correcto: la pendiente es n·R/P, que crece con n y disminuye con P.'],
        ['Una temperatura más alta', false, 'La temperatura es la variable del eje horizontal; no cambia la pendiente de la recta.'],
        ['Que el gas es más pesado', false, 'En el modelo ideal la recta no depende de la masa molar: un mol de cualquier gas da la misma.']
      )
    ],
    anterior: 'n1-b8-s4',
    siguiente: 'n1-b8-s6',
    prerrequisitos: ['n1-b8-s1'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 28 }, 'Mueve la temperatura T y mira la lectura «Volumen que ocuparía a 1 atm»: a presión constante ese volumen crece en proporción a T en kelvin.')
  },
  'gas-ley-gay-lussac': {
    objetivosMas: ['Explicar con choques moleculares por qué sube la presión al calentar un recipiente rígido.'],
    porQueImporta: 'Un aerosol junto a un fuego puede reventar y una olla a presión cocina más deprisa: en un recipiente rígido, calentar el gas hace subir su presión. Por eso los envases a presión avisan de no exponerlos al calor y los neumáticos se revisan en frío.',
    analogia: 'Calentar un gas en una caja rígida es como hacer que unas pelotas reboten más deprisa dentro de una caja cerrada: golpean más a menudo y con más fuerza, y la caja recibe más empuje.',
    analogiaLimite: 'En la analogía parece que las pelotas ganan velocidad de forma ordenada; en el gas, la temperatura sube la energía media de un movimiento desordenado, y cada molécula tiene una velocidad distinta.',
    correccion: 'En P₁/T₁ = P₂/T₂ las temperaturas van en kelvin y el cociente es T₂/T₁ (temperatura final sobre inicial) cuando se calcula P₂.',
    errores: [['Aplicar la ley a la lectura de un manómetro de neumático sin pasarla a presión absoluta.', 'La proporción vale para la presión absoluta: suma la presión atmosférica, aplica la ley y, si se pide la lectura del manómetro, réstala al final.']],
    ejemplo2: 'ej-gas-gay-lussac-2',
    figuras: ['fig-gas-gay-lussac'],
    resumen: [
      'A volumen y cantidad constantes, la presión es proporcional a la temperatura absoluta: P/T = constante.',
      'Un proceso a volumen constante se llama isocórico.',
      'La ley vale para presiones absolutas y temperaturas en kelvin.',
      'Explica el aumento de presión de los recipientes rígidos al calentarse.'
    ],
    glosario: [RENG_G.isocorico, RENG_G.kelvin, RENG_G.manometrica],
    comprobar: [
      rengPreg(
        'Un recipiente rígido con gas pasa de 300 K a 450 K. ¿Cómo cambia la presión absoluta?',
        ['Se multiplica por 1,5', true, 'Correcto: P₂/P₁ = T₂/T₁ = 450/300 = 1,5.'],
        ['Se reduce a dos tercios', false, 'Es el cociente invertido: al calentar un recipiente rígido la presión sube, no baja.'],
        ['Aumenta 150 kPa', false, 'La ley da un factor multiplicativo, no una suma fija; el aumento depende de la presión inicial.']
      ),
      rengPreg(
        '¿Por qué no se debe calentar un aerosol?',
        ['Porque en un envase rígido la presión crece con la temperatura', true, 'Correcto: el volumen no puede crecer, así que la presión sube hasta poder superar la resistencia del envase.'],
        ['Porque el gas pierde masa al calentarse', false, 'La masa del gas no cambia al calentarlo dentro de un envase cerrado.'],
        ['Porque el volumen del gas se reduce y el envase se hunde', false, 'Al calentar, el gas tiende a expandirse, no a contraerse.']
      ),
      rengPreg(
        '¿Qué magnitud debe permanecer constante para aplicar la ley de Gay-Lussac?',
        ['El volumen (y la cantidad de gas)', true, 'Correcto: es la ley del recipiente rígido y cerrado.'],
        ['La presión', false, 'Si la presión fuera constante, la ley aplicable sería la de Charles.'],
        ['La temperatura', false, 'Si la temperatura fuera constante, la ley aplicable sería la de Boyle.']
      )
    ],
    anterior: 'n1-b8-s5',
    siguiente: 'n1-b8-s7',
    prerrequisitos: ['n1-b8-s2', 'n1-b8-s5'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 12, M: 28 }, 'Deja fijo el volumen V y mueve la temperatura T: la presión cambia en la misma proporción que T en kelvin (compara 300 K con 600 K).')
  },
  'gas-ley-avogadro': {
    objetivosMas: ['Usar los coeficientes de una ecuación química para calcular volúmenes de gases medidos en las mismas condiciones.'],
    porQueImporta: 'Para diseñar un quemador o una bombona de gas hace falta saber cuánto oxígeno consume cada litro de combustible. La ley de Avogadro permite responder con volúmenes en lugar de masas, porque a igual presión y temperatura los volúmenes de gas son proporcionales a los moles.',
    analogia: 'A igual presión y temperatura, un mol de cualquier gas ocupa el mismo volumen, como un mismo número de corredores necesita el mismo espacio aunque unos pesen más que otros.',
    analogiaLimite: 'Los corredores ocupan espacio con su cuerpo; en el gas ideal las moléculas no ocupan volumen propio. Por eso la regla falla en gases reales a presión alta, donde el tamaño molecular sí cuenta.',
    correccion: 'A igual P y T, el volumen depende solo del número de moles, no de la masa molar: un mol de helio y uno de argón ocupan lo mismo.',
    errores: [['Comparar volúmenes de gases medidos en condiciones distintas como si siguieran los coeficientes.', 'La proporción entre volúmenes y coeficientes solo vale si todos los gases se miden a la misma presión y temperatura.']],
    ejemplo2: 'ej-gas-avogadro-2',
    figuras: ['fig-gas-avogadro'],
    resumen: [
      'A presión y temperatura constantes, el volumen es proporcional a la cantidad: V/n = constante.',
      'Volúmenes iguales de gases distintos, en las mismas condiciones, contienen el mismo número de moléculas.',
      'Por eso, en una reacción entre gases, los volúmenes siguen a los coeficientes.',
      'La masa molar no interviene: solo cuenta el número de moles.'
    ],
    glosario: [RENG_G.mol, RENG_G.volumenCombinacion],
    comprobar: [
      rengPreg(
        'A igual presión y temperatura, ¿qué ocupa más volumen: 1 mol de hidrógeno o 1 mol de dióxido de carbono?',
        ['Ocupan lo mismo', true, 'Correcto: en el modelo ideal el volumen depende solo de n, P y T, no de qué gas sea.'],
        ['El dióxido de carbono, porque es más pesado', false, 'Confusión entre masa y volumen: el gas más pesado tiene más masa en el mismo volumen, no más volumen.'],
        ['El hidrógeno, porque es más ligero', false, 'La ligereza afecta a la densidad, no al volumen que ocupa un mol en las mismas condiciones.']
      ),
      rengPreg(
        'En N₂ + 3 H₂ → 2 NH₃, con todos los gases medidos igual, ¿cuántos litros de H₂ reaccionan con 2 L de N₂?',
        ['6 L', true, 'Correcto: los volúmenes siguen a los coeficientes, 1 : 3, así que 2 L de N₂ necesitan 6 L de H₂.'],
        ['3 L', false, 'Ese valor usa el coeficiente sin multiplicarlo por los 2 L de nitrógeno.'],
        ['4 L', false, 'Ese valor corresponde al amoníaco que se forma (2 × 2 L), no al hidrógeno que se consume.']
      ),
      rengPreg(
        'Se añade gas a un globo hasta tener el doble de moles, a la misma P y T. ¿Qué pasa con el volumen?',
        ['Se duplica', true, 'Correcto: V es proporcional a n cuando P y T no cambian.'],
        ['Se reduce a la mitad', false, 'Esa sería una relación inversa, como la de Boyle entre P y V; aquí V y n van en el mismo sentido.'],
        ['No cambia, porque la presión es la misma', false, 'Para mantener la misma presión con más moléculas, el globo tiene que crecer.']
      )
    ],
    anterior: 'n1-b8-s6',
    siguiente: 'n1-b8-s8',
    prerrequisitos: ['n1-b8-s1'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 28 }, 'Mueve la cantidad n y observa «Volumen que ocuparía a 1 atm»: crece en proporción a n. Cambia M y verás que ese volumen no depende de la masa molar.')
  },
  'gas-ley-combinada': {
    objetivosMas: ['Decidir qué cocientes de presión y temperatura intervienen cuando cambian dos variables a la vez.'],
    porQueImporta: 'En la vida real cambian varias cosas a la vez: un globo sonda sube y encuentra menos presión y más frío; un gas recogido en el laboratorio se mide a la presión y temperatura del día y hay que referirlo a unas condiciones estándar. La ley combinada resuelve esos casos de una sola vez.',
    analogia: 'La ley combinada es como ajustar una receta para otro número de comensales y otro tamaño de molde: cada cambio aplica su propio factor, y los factores se multiplican.',
    analogiaLimite: 'En una receta los factores se eligen a voluntad; aquí cada factor sale de una ley física (Boyle para la presión, Charles para la temperatura) y solo vale si la cantidad de gas no cambia.',
    correccion: 'Cuando cambian presión y temperatura, hay que aplicar los dos cocientes: V₂ = V₁ · (P₁/P₂) · (T₂/T₁), con temperaturas en kelvin.',
    errores: [['Poner los cocientes al revés, por ejemplo P₂/P₁ cuando la presión sube y el volumen debería bajar.', 'Comprueba el sentido de cada factor: más presión reduce el volumen (P₁/P₂ < 1) y más temperatura lo aumenta (T₂/T₁ > 1).']],
    ejemplo2: 'ej-gas-combinada-2',
    figuras: ['fig-gas-boyle'],
    resumen: [
      'Para una cantidad fija de gas, P·V/T = constante.',
      'Incluye a Boyle (T constante), Charles (P constante) y Gay-Lussac (V constante) como casos particulares.',
      'Cada cociente actúa por separado y se puede comprobar con el sentido común.',
      'Las temperaturas van siempre en kelvin y las presiones en la misma unidad.'
    ],
    glosario: [RENG_G.estado, RENG_G.kelvin],
    comprobar: [
      rengPreg(
        'Un gas se comprime al doble de presión y a la vez se calienta al doble de temperatura absoluta. ¿Qué le pasa al volumen?',
        ['No cambia', true, 'Correcto: el factor de presión (1/2) y el de temperatura (2) se compensan.'],
        ['Se duplica', false, 'Este resultado olvida el efecto de la presión, que por sí sola reduciría el volumen a la mitad.'],
        ['Se reduce a la cuarta parte', false, 'Este resultado aplica mal el factor de temperatura: calentar aumenta el volumen, no lo reduce.']
      ),
      rengPreg(
        '¿Qué condición es imprescindible para usar la ley combinada?',
        ['Que la cantidad de gas no cambie', true, 'Correcto: P·V/T es constante solo si n es fija; si entra o sale gas hay que usar P·V = n·R·T.'],
        ['Que la temperatura no cambie', false, 'Precisamente la ley combinada permite que la temperatura cambie.'],
        ['Que el gas sea aire', false, 'En el modelo ideal la ley vale para cualquier gas, no solo para el aire.']
      ),
      rengPreg(
        'Cuando un gas pasa de una isoterma a otra más alta en la gráfica P–V, ¿qué ha cambiado necesariamente?',
        ['La temperatura', true, 'Correcto: cada isoterma corresponde a una temperatura; pasar a otra exige calentar o enfriar el gas.'],
        ['Solo el volumen', false, 'Cambiar solo el volumen mueve el punto a lo largo de la misma isoterma.'],
        ['La masa molar del gas', false, 'La masa molar no aparece en P·V = n·R·T; no decide en qué isoterma está el gas.']
      )
    ],
    anterior: 'n1-b8-s7',
    siguiente: 'n1-b8-s9',
    prerrequisitos: ['n1-b8-s4', 'n1-b8-s5', 'n1-b8-s6'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 28 }, 'Cambia a la vez V y T: el punto salta de una isoterma a otra. Comprueba que P·V/T, que la escena da como P·V/(n·T), no cambia con n fija.')
  },
  'gas-ideal': {
    objetivosMas: ['Elegir el valor de R que corresponde a las unidades de presión y volumen del problema.'],
    porQueImporta: 'Con una sola ecuación, P·V = n·R·T, se calcula cuánto gas hay en una bombona, qué presión alcanzará un recipiente o cuánto volumen ocupará un producto gaseoso de una reacción. Es la herramienta central del capítulo y la base de la estequiometría con gases.',
    analogia: 'La ecuación del gas ideal es como una balanza de cuatro platos: si se fijan tres magnitudes, la cuarta queda determinada, y cualquier cambio en una obliga a reajustar las demás.',
    analogiaLimite: 'Una balanza real tiene rozamientos y tolerancias; la ecuación es exacta para el modelo ideal, pero el modelo mismo es una aproximación que empeora a presión alta o cerca de la condensación.',
    correccion: 'R debe ir en las mismas unidades que P y V: 0,08206 L·atm/(mol·K) con atm y litros, u 8,314 L·kPa/(mol·K) con kPa y litros.',
    errores: [['Usar la temperatura en grados Celsius en P·V = n·R·T.', 'La ecuación exige temperatura absoluta: con 25 °C hay que usar 298,15 K; con °C el resultado puede ser hasta infinito o negativo.']],
    ejemplo2: 'ej-gas-ideal-2',
    figuras: ['fig-gas-ideal-n'],
    resumen: [
      'P·V = n·R·T relaciona las cuatro magnitudes de estado de un gas ideal.',
      'R vale 8,314 J/(mol·K), que es lo mismo que 8,314 L·kPa/(mol·K) o 0,08206 L·atm/(mol·K).',
      'Las leyes de Boyle, Charles, Gay-Lussac y Avogadro son casos particulares.',
      'Las unidades de P, V y R deben ser coherentes y T va en kelvin.',
      'Es un modelo: describe bien los gases a presiones moderadas y lejos de la condensación.'
    ],
    glosario: [RENG_G.gasIdeal, RENG_G.constanteR, RENG_G.mol],
    comprobar: [
      rengPreg(
        'Si se duplica la cantidad de gas en un recipiente rígido a la misma temperatura, ¿qué le pasa a la presión?',
        ['Se duplica', true, 'Correcto: con V y T fijos, P = n·R·T/V es proporcional a n.'],
        ['Se reduce a la mitad', false, 'Más moléculas en el mismo volumen chocan más a menudo con las paredes; la presión sube, no baja.'],
        ['No cambia', false, 'Solo se mantendría si a la vez aumentara el volumen o bajara la temperatura, y el recipiente es rígido.']
      ),
      rengPreg(
        'Con P en kPa y V en L, ¿qué valor de R hay que usar?',
        ['8,314 L·kPa/(mol·K)', true, 'Correcto: es el mismo número que en J/(mol·K), porque 1 kPa·L = 1 J.'],
        ['0,08206 L·kPa/(mol·K)', false, 'Ese número es R en L·atm/(mol·K); usarlo con kPa da resultados unas cien veces menores.'],
        ['8314 L·kPa/(mol·K)', false, 'Ese número corresponde a Pa·L, no a kPa·L; con kPa sobraría un factor mil.']
      ),
      rengPreg(
        '¿En qué situación es menos fiable la ecuación del gas ideal?',
        ['Con un gas a presión muy alta y baja temperatura', true, 'Correcto: ahí las moléculas están cerca, se atraen y su volumen propio cuenta; el gas real se aparta del modelo.'],
        ['Con aire a presión atmosférica y 25 °C', false, 'En esas condiciones el aire se comporta casi como un gas ideal: es el caso favorable.'],
        ['Con helio a baja presión', false, 'El helio a baja presión es uno de los gases que mejor siguen el modelo ideal.']
      )
    ],
    anterior: 'n1-b8-s8',
    siguiente: 'n1-b8-s10',
    prerrequisitos: ['n1-b8-s7', 'n1-b8-s8'],
    escena: rengEscenaGas({ n: 0.35, T: 305, V: 5, M: 28 }, 'Elige n, T y V y lee la presión. La lectura P·V/(n·T) vale siempre R, sea cual sea el estado: es la ecuación de estado en acción.')
  },
  'gas-densidad': {
    objetivosMas: ['Predecir si un gas sube o baja en el aire comparando su masa molar con la masa molar media del aire.'],
    porQueImporta: 'El dióxido de carbono se acumula en sótanos y bodegas porque es más denso que el aire, y el helio hace subir los globos porque es mucho menos denso. Calcular la densidad de un gas permite anticipar dónde se acumulará una fuga y cuánto puede levantar un globo.',
    analogia: 'Comparar la densidad de dos gases a igual presión y temperatura es como comparar dos cajas con el mismo número de bolas: pesa más la caja cuyas bolas son más pesadas.',
    analogiaLimite: 'Las cajas tienen paredes y las bolas no se mueven; los gases se mezclan por difusión, así que un gas denso se acumula abajo solo si no hay corrientes que lo mezclen.',
    correccion: 'P/(R·T) da moles por litro; para la densidad hay que multiplicar por la masa molar: ρ = P·M/(R·T).',
    errores: [['Creer que la densidad de un gas es un valor fijo como la de un sólido.', 'La densidad de un gas depende de la presión y de la temperatura: sube al comprimir y baja al calentar.']],
    ejemplo2: 'ej-gas-densidad-2',
    figuras: ['fig-gas-densidad-m'],
    resumen: [
      'La densidad de un gas ideal es ρ = P·M/(R·T).',
      'A igual P y T, la densidad es proporcional a la masa molar.',
      'La densidad de un gas aumenta con la presión y disminuye con la temperatura.',
      'Un gas de masa molar menor que la del aire tiende a subir; uno mayor, a acumularse abajo.'
    ],
    glosario: [RENG_G.densidad, RENG_G.masaMolar],
    comprobar: [
      rengPreg(
        '¿Qué gas es más denso a 25 °C y 1 atm: el oxígeno (32 g/mol) o el nitrógeno (28 g/mol)?',
        ['El oxígeno', true, 'Correcto: a igual P y T, la densidad es proporcional a la masa molar.'],
        ['El nitrógeno', false, 'Tiene menor masa molar, así que en el mismo volumen hay la misma cantidad de moléculas pero más ligeras.'],
        ['Los dos igual, porque ocupan lo mismo por mol', false, 'Ocupan lo mismo por mol, pero un mol de oxígeno pesa más: por eso su densidad es mayor.']
      ),
      rengPreg(
        'Si se calienta un gas a presión constante, ¿qué le pasa a su densidad?',
        ['Disminuye', true, 'Correcto: ρ = P·M/(R·T); con P fija, al subir T la densidad baja.'],
        ['Aumenta', false, 'Al calentar a presión constante el gas se expande: la misma masa ocupa más volumen.'],
        ['No cambia, porque la masa es la misma', false, 'La masa es la misma, pero el volumen cambia; la densidad depende de los dos.']
      ),
      rengPreg(
        '¿Por qué es peligroso entrar en un sótano donde ha habido una fuga de dióxido de carbono?',
        ['Porque el CO₂ es más denso que el aire y puede acumularse abajo', true, 'Correcto: con 44 g/mol frente a unos 29 g/mol del aire, tiende a quedarse en las zonas bajas si no hay ventilación.'],
        ['Porque el CO₂ sube y empuja el aire hacia abajo', false, 'Al revés: es más denso que el aire, así que tiende a bajar, no a subir.'],
        ['Porque el CO₂ es más denso que el agua', false, 'Ningún gas a presión atmosférica es más denso que el agua líquida; la comparación relevante es con el aire.']
      )
    ],
    anterior: 'n1-b8-s9',
    siguiente: 'n1-b8-s11',
    prerrequisitos: ['n1-b8-s1', 'n1-b8-s9'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 44 }, 'Cambia la masa molar M con P y T fijas y observa la densidad: es proporcional a M. Luego sube T y verás que la densidad baja.')
  }
}
