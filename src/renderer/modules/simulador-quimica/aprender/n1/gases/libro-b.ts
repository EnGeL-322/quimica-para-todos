import { RENG_G, rengEscenaGas, rengPreg, type RengLibroGas } from './libro-comun'

export const RENG_LIBRO_GASES_B: Readonly<Record<string, RengLibroGas>> = {
  'gas-masa-molar': {
    objetivosMas: ['Comparar la masa molar calculada con la de gases candidatos y decidir si los datos bastan para identificarlo.'],
    porQueImporta: 'Antes de los espectrómetros, la masa molar de muchos gases se obtenía pesando un matraz de volumen conocido. El método sigue sirviendo para identificar un gas desconocido en el laboratorio y muestra cómo una medida macroscópica (masa, presión, volumen) informa de una propiedad molecular.',
    analogia: 'Calcular la masa molar de un gas es como averiguar cuánto pesa cada caramelo de una bolsa: se cuentan los caramelos (moles, con P·V = n·R·T) y se divide la masa total entre ese número.',
    analogiaLimite: 'Los caramelos se cuentan uno a uno; los moles de gas no se cuentan, se deducen del modelo ideal. Si el gas se aparta del modelo, el «recuento» es inexacto y la masa molar sale desviada.',
    correccion: 'La masa del gas es la diferencia entre el matraz lleno y el vacío, y el volumen va en litros: M = m·R·T/(P·V).',
    errores: [['Dar por identificado un gas solo porque su masa molar coincide con la de uno conocido.', 'Varios gases pueden tener masas molares casi iguales (CO₂ y C₃H₈, unos 44 g/mol); hacen falta otras pruebas para distinguirlos.']],
    ejemplo2: 'ej-gas-masa-molar-2',
    figuras: ['fig-gas-densidad-m'],
    resumen: [
      'La masa molar de un gas se calcula con M = m·R·T/(P·V).',
      'También con la densidad: M = ρ·R·T/P.',
      'La masa del gas es la diferencia de pesadas y el volumen va en litros.',
      'Una masa molar sugiere candidatos, pero no siempre identifica el gas.'
    ],
    glosario: [RENG_G.masaMolar, RENG_G.densidad],
    comprobar: [
      rengPreg(
        'Dos gases tienen la misma densidad a la misma P y T. ¿Qué se puede concluir?',
        ['Que tienen la misma masa molar', true, 'Correcto: ρ = P·M/(R·T); con P y T iguales, la misma densidad implica la misma M.'],
        ['Que son el mismo gas', false, 'Pueden ser gases distintos con masas molares iguales, como el CO₂ y el propano.'],
        ['Nada, porque la densidad de un gas no depende de su masa molar', false, 'Sí depende: a igual P y T, la densidad es proporcional a la masa molar.']
      ),
      rengPreg(
        'Al medir la masa molar, el estudiante usa el volumen en mL en lugar de L. ¿Cómo sale el resultado?',
        ['Mil veces menor', true, 'Correcto: V está en el denominador; un volumen mil veces mayor numéricamente da una masa molar mil veces menor.'],
        ['Mil veces mayor', false, 'Revisa dónde está V: en M = m·R·T/(P·V) divide, así que un número mayor reduce M.'],
        ['Igual, porque las unidades se compensan', false, 'No se compensan: R está en L·atm/(mol·K), así que V debe ir en litros.']
      ),
      rengPreg(
        'Un gas desconocido es más denso que el oxígeno en las mismas condiciones. ¿Qué se sabe de su masa molar?',
        ['Que es mayor que unos 32 g/mol', true, 'Correcto: a igual P y T, más densidad significa más masa molar.'],
        ['Que es menor que unos 32 g/mol', false, 'Sería al revés: un gas más ligero que el oxígeno tendría menos densidad.'],
        ['Que es exactamente 32 g/mol', false, 'Solo sería igual si la densidad fuera la misma que la del oxígeno.']
      )
    ],
    anterior: 'n1-b8-s10',
    siguiente: 'n1-b8-s12',
    prerrequisitos: ['n1-b8-s10'],
    escena: rengEscenaGas({ n: 1, T: 273, V: 22.5, M: 44 }, 'A P y T casi fijas, ajusta M hasta que la densidad sea la de un gas desconocido: ese valor de M es su masa molar en el modelo ideal.')
  },
  'gas-presiones-parciales': {
    objetivosMas: ['Calcular la fracción molar de un componente a partir de masas o de moles de una mezcla.'],
    porQueImporta: 'Lo que importa para respirar no es la presión total del aire sino la presión parcial del oxígeno. En la montaña la presión total baja y con ella la del oxígeno; los buceadores, al revés, respiran a presiones altas y deben vigilar la presión parcial de cada gas de su mezcla.',
    analogia: 'En una mezcla de gases, cada componente es como un grupo de músicos tocando a la vez: el sonido total es la suma, y cada grupo aporta en proporción a cuántos músicos tiene.',
    analogiaLimite: 'Los músicos pueden tocar más fuerte o más flojo; en el gas ideal cada molécula aporta lo mismo a la presión a la misma temperatura, sea ligera o pesada, por eso solo cuenta el número de moles.',
    correccion: 'La presión se reparte según la fracción molar, x = n_i/n_total, no según la fracción en masa.',
    errores: [['Calcular la fracción molar dividiendo masas en lugar de moles.', 'Pasa primero cada masa a moles con su masa molar; la fracción molar compara números de moléculas, no masas.']],
    ejemplo2: 'ej-gas-parciales-2',
    figuras: ['fig-gas-parciales'],
    resumen: [
      'La fracción molar es x_i = n_i/n_total; no tiene unidades y todas suman 1.',
      'La presión parcial de un componente es p_i = x_i·P_total.',
      'Equivale a calcular p_i = n_i·R·T/V, como si el gas estuviera solo.',
      'En el aire seco, el oxígeno tiene una fracción molar de 0,21.'
    ],
    glosario: [RENG_G.fraccionMolar, RENG_G.presionParcial],
    comprobar: [
      rengPreg(
        'En una mezcla, un gas tiene una fracción molar de 0,25 y la presión total es 200 kPa. ¿Cuál es su presión parcial?',
        ['50 kPa', true, 'Correcto: p = x·P_total = 0,25 × 200 kPa.'],
        ['800 kPa', false, 'Ese resultado divide por la fracción molar en lugar de multiplicar.'],
        ['200 kPa', false, 'Esa es la presión total; la parcial es solo la parte que aporta este gas.']
      ),
      rengPreg(
        'Una mezcla tiene 1 g de helio y 1 g de argón. ¿Cuál de los dos tiene mayor presión parcial?',
        ['El helio', true, 'Correcto: 1 g de helio son unos 0,25 mol y 1 g de argón unos 0,025 mol; el helio tiene diez veces más moléculas.'],
        ['El argón', false, 'Que el argón sea más pesado hace que un gramo contenga menos moléculas, no más.'],
        ['Los dos igual, porque hay la misma masa', false, 'La presión parcial depende de los moles, no de la masa.']
      ),
      rengPreg(
        'En una montaña la presión total del aire es 70 kPa. ¿Qué le pasa a la fracción molar del oxígeno respecto del nivel del mar?',
        ['Es prácticamente la misma (0,21)', true, 'Correcto: la composición del aire seco casi no cambia con la altura en la atmósfera baja; lo que baja es la presión parcial.'],
        ['Baja a la mitad', false, 'Lo que baja es la presión parcial del oxígeno (por la presión total), no su fracción molar.'],
        ['Sube, porque hay menos nitrógeno', false, 'Los dos gases disminuyen en la misma proporción; la composición se mantiene.']
      )
    ],
    anterior: 'n1-b8-s11',
    siguiente: 'n1-b8-s13',
    prerrequisitos: ['n1-b8-s9']
  },
  'gas-ley-dalton': {
    objetivosMas: ['Calcular la presión del gas seco recogido sobre agua restando la presión de vapor.'],
    porQueImporta: 'En el laboratorio, muchos gases se recogen haciéndolos burbujear en agua y el recipiente contiene también vapor de agua. Para saber cuánto gas se ha obtenido hay que descontar el vapor, y eso solo es posible porque cada gas de una mezcla aporta su propia presión.',
    analogia: 'La ley de Dalton es como la factura de un piso compartido: el total es la suma de lo que debe cada inquilino, y cada uno paga lo suyo independientemente de los demás.',
    analogiaLimite: 'En un piso compartido los gastos pueden influirse entre sí; en el gas ideal las moléculas de un gas no afectan a las de otro, y por eso las presiones se suman sin corrección.',
    correccion: 'Antes de sumar, todas las presiones deben estar en la misma unidad; y si dos recipientes se conectan, cada gas pasa a ocupar el volumen total y su presión baja (Boyle) antes de sumar.',
    errores: [['Olvidar restar la presión del vapor de agua cuando el gas se recoge sobre agua.', 'El recipiente contiene gas y vapor de agua: p_gas = P_total − p_agua, y solo p_gas sirve para calcular los moles del gas seco.']],
    ejemplo2: 'ej-gas-dalton-2',
    figuras: ['fig-gas-parciales'],
    resumen: [
      'La presión total de una mezcla de gases ideales es la suma de las presiones parciales.',
      'Al recoger un gas sobre agua, p_gas = P_total − p_agua.',
      'La presión de vapor del agua depende de la temperatura.',
      'Al conectar recipientes, cada gas ocupa el volumen total y su presión se recalcula antes de sumar.'
    ],
    glosario: [RENG_G.presionParcial, RENG_G.presionVapor],
    comprobar: [
      rengPreg(
        'Un recipiente contiene nitrógeno a 40 kPa y oxígeno a 15 kPa. ¿Cuál es la presión total?',
        ['55 kPa', true, 'Correcto: la presión total es la suma de las parciales.'],
        ['40 kPa', false, 'Ese valor ignora al oxígeno, que también choca contra las paredes.'],
        ['27,5 kPa', false, 'Ese valor es la media; las presiones parciales se suman, no se promedian.']
      ),
      rengPreg(
        'Se recoge hidrógeno sobre agua a una presión total de 100 kPa; la presión del vapor de agua es 3 kPa. ¿Qué presión usarías para los moles de hidrógeno?',
        ['97 kPa', true, 'Correcto: solo la presión parcial del hidrógeno corresponde a sus moles.'],
        ['100 kPa', false, 'Esa presión incluye el vapor de agua; daría más hidrógeno del que hay.'],
        ['103 kPa', false, 'El vapor de agua se resta, no se suma: forma parte de la presión total.']
      ),
      rengPreg(
        'Se conectan dos matraces iguales, uno con helio a 100 kPa y otro vacío, a la misma temperatura. ¿Qué presión queda?',
        ['50 kPa', true, 'Correcto: el helio ocupa el doble de volumen y, por Boyle, su presión se reduce a la mitad.'],
        ['100 kPa', false, 'Ese resultado olvida que el volumen disponible se ha duplicado.'],
        ['200 kPa', false, 'Al aumentar el volumen la presión baja; no se suma la del matraz vacío, que no tiene gas.']
      )
    ],
    anterior: 'n1-b8-s12',
    siguiente: 'n1-b8-s14',
    prerrequisitos: ['n1-b8-s12']
  },
  'gas-volumen-molar': {
    objetivosMas: ['Pasar de volumen de gas a moles y de moles a volumen en cálculos estequiométricos.'],
    porQueImporta: 'En una reacción que produce un gas, como la descomposición de la caliza o la fermentación, lo que se mide cómodamente es un volumen. El volumen molar es el puente entre ese volumen y los moles que piden los cálculos estequiométricos.',
    analogia: 'El volumen molar es como el tamaño de una caja estándar donde siempre caben el mismo número de objetos: conociendo cuántas cajas hay (el volumen total), se sabe cuántos objetos (moles) hay.',
    analogiaLimite: 'El tamaño de la «caja» no es fijo: cambia con la temperatura y la presión. 22,4 L/mol solo vale a 0 °C y 1 atm; a 25 °C y 1 atm son unos 24,5 L/mol.',
    correccion: 'El volumen molar depende de las condiciones: V_m = R·T/P; 22,4 L/mol es solo el valor a 0 °C y 1 atm.',
    errores: [['Pensar que el volumen molar depende del gas.', 'En el modelo ideal no depende del gas: un mol de cualquier gas ocupa lo mismo a la misma P y T. Lo que cambia con el gas es la masa de ese volumen.']],
    ejemplo2: 'ej-gas-volumen-molar-2',
    figuras: ['fig-gas-avogadro'],
    resumen: [
      'El volumen molar de un gas ideal es V_m = V/n = R·T/P.',
      'A 0 °C y 1 atm vale unos 22,4 L/mol; a 25 °C y 1 atm, unos 24,5 L/mol.',
      'No depende del gas, solo de la temperatura y la presión.',
      'Permite pasar de volumen a moles: n = V/V_m.'
    ],
    glosario: [RENG_G.volumenMolar, RENG_G.avogadroNumero],
    comprobar: [
      rengPreg(
        '¿Qué volumen ocupan 2 mol de gas ideal a 0 °C y 1 atm?',
        ['Unos 44,8 L', true, 'Correcto: 2 mol × 22,4 L/mol en esas condiciones.'],
        ['Unos 22,4 L', false, 'Ese es el volumen de un solo mol; con dos moles el volumen se duplica.'],
        ['Unos 49 L', false, 'Ese valor usa el volumen molar a 25 °C (24,5 L/mol), pero el enunciado dice 0 °C.']
      ),
      rengPreg(
        'Si la temperatura absoluta aumenta a presión constante, ¿qué le pasa al volumen molar?',
        ['Aumenta en la misma proporción', true, 'Correcto: V_m = R·T/P es proporcional a T con P fija.'],
        ['Disminuye', false, 'Al calentar a presión constante el gas se expande; cada mol ocupa más.'],
        ['No cambia, porque es una constante', false, 'No es una constante universal: depende de T y P. La constante es R.']
      ),
      rengPreg(
        'A igual P y T, ¿qué diferencia hay entre un mol de helio y un mol de dióxido de carbono?',
        ['Ocupan lo mismo, pero el de CO₂ tiene más masa', true, 'Correcto: el volumen molar no depende del gas; la masa de ese volumen es la masa molar.'],
        ['El de CO₂ ocupa más porque sus moléculas son mayores', false, 'En el modelo ideal el tamaño de las moléculas no cuenta; a presiones moderadas el efecto real es pequeño.'],
        ['El de helio ocupa más porque es más ligero', false, 'La ligereza cambia la densidad, no el volumen de un mol.']
      )
    ],
    anterior: 'n1-b8-s13',
    siguiente: 'n1-b8-s15',
    prerrequisitos: ['n1-b8-s7', 'n1-b8-s9'],
    escena: rengEscenaGas({ n: 1, T: 273, V: 22.5, M: 28 }, 'Mira la lectura «Volumen molar V/n» y «Volumen que ocuparía a 1 atm»: cambia T y comprueba que a 1 atm el volumen de un mol crece con la temperatura.')
  },
  'gas-teoria-cinetica': {
    objetivosMas: ['Relacionar la temperatura absoluta con la energía cinética media de las moléculas.'],
    porQueImporta: 'La teoría cinético-molecular explica desde el modelo de partículas todas las leyes de los gases que se han visto: por qué hay presión, por qué sube al calentar y por qué los gases se mezclan. Además da un significado físico a la temperatura: es una medida de la energía de movimiento de las moléculas.',
    analogia: 'La temperatura de un gas es como la velocidad media del tráfico de una ciudad: no dice cómo va cada coche, pero resume el movimiento de todos.',
    analogiaLimite: 'El tráfico tiene semáforos y conductores que deciden; las moléculas se mueven al azar y chocan sin perder energía en el modelo ideal. Y la temperatura está ligada a la energía media, no a la velocidad media.',
    correccion: 'A la misma temperatura, todas las moléculas de un gas ideal tienen la misma energía cinética media de traslación, (3/2)·k_B·T, sean pesadas o ligeras; las ligeras se mueven más deprisa.',
    errores: [['Pensar que, al calentar un gas, cada molécula tiene la misma velocidad.', 'Las velocidades se reparten en una distribución: unas moléculas son lentas y otras rápidas; la temperatura fija la energía media, no la de cada molécula.']],
    ejemplo2: 'ej-gas-cinetica-2',
    figuras: ['fig-gas-maxwell'],
    resumen: [
      'Modelo: moléculas puntuales, en movimiento desordenado, sin atracciones y con choques elásticos.',
      'La presión se debe a los choques contra las paredes.',
      'La energía cinética media de traslación es (3/2)·R·T por mol, o (3/2)·k_B·T por molécula.',
      'Solo depende de la temperatura absoluta, no del gas.',
      'Las velocidades se reparten en una distribución que se ensancha al calentar.'
    ],
    glosario: [RENG_G.energiaCinetica, RENG_G.boltzmann, RENG_G.distribucion],
    comprobar: [
      rengPreg(
        'A 300 K, ¿qué molécula tiene más energía cinética media de traslación: la de hidrógeno o la de oxígeno?',
        ['Las dos la misma', true, 'Correcto: la energía cinética media depende solo de T; el hidrógeno compensa su menor masa con más velocidad.'],
        ['La de oxígeno, porque es más pesada', false, 'Confusión típica: más masa no significa más energía si la velocidad es menor.'],
        ['La de hidrógeno, porque es más rápida', false, 'Es más rápida, pero también más ligera; ½·m·u² sale igual en promedio.']
      ),
      rengPreg(
        'Si la temperatura absoluta de un gas se duplica, ¿qué le pasa a la energía cinética media de sus moléculas?',
        ['Se duplica', true, 'Correcto: E_c media = (3/2)·k_B·T es proporcional a T.'],
        ['Se cuadruplica', false, 'Ese resultado confunde energía con temperatura al cuadrado; la relación es lineal.'],
        ['Aumenta un 41 %', false, 'Ese factor (√2) corresponde a la velocidad cuadrática media, no a la energía.']
      ),
      rengPreg(
        '¿Cuál de estos supuestos NO forma parte del modelo cinético del gas ideal?',
        ['Las moléculas se atraen con fuerza entre sí', true, 'Correcto: el modelo ideal supone que no hay atracciones; cuando las hay, el gas se aparta del modelo.'],
        ['Los choques son elásticos', false, 'Sí es un supuesto del modelo: en los choques no se pierde energía cinética total.'],
        ['El volumen de las moléculas es despreciable', false, 'Sí es un supuesto del modelo: las moléculas se tratan como puntos.']
      )
    ],
    anterior: 'n1-b8-s14',
    siguiente: 'n1-b8-s16',
    prerrequisitos: ['n1-b8-s9'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 28 }, 'Cambia T y mira «Energía cinética media por mol»: es proporcional a T. Cambia M y comprueba que esa energía no cambia, aunque sí la velocidad.')
  },
  'gas-velocidad-molecular': {
    objetivosMas: ['Interpretar la gráfica de la distribución de velocidades y cómo cambia con la temperatura y la masa molar.'],
    porQueImporta: 'Las moléculas del aire se mueven a cientos de metros por segundo, más rápido que el sonido en muchos casos. La velocidad molecular explica por qué los gases ligeros escapan de la atmósfera de los planetas pequeños y por qué el hidrógeno se difunde tan deprisa.',
    analogia: 'Las moléculas de un gas a una temperatura son como corredores con la misma energía para gastar: los ligeros salen disparados y los pesados avanzan más despacio.',
    analogiaLimite: 'Los corredores mantienen su velocidad; las moléculas cambian de velocidad en cada choque y solo la distribución de velocidades es estable. u_rms es un valor representativo, no la velocidad de todas.',
    correccion: 'En u_rms = √(3·R·T/M), con R = 8,314 J/(mol·K), la masa molar va en kg/mol: 28 g/mol son 0,028 kg/mol.',
    errores: [['Creer que al duplicar la temperatura la velocidad se duplica.', 'u_rms crece con la raíz cuadrada de T: al duplicar T, la velocidad aumenta en un factor √2 ≈ 1,41.']],
    ejemplo2: 'ej-gas-velocidad-2',
    figuras: ['fig-gas-maxwell'],
    resumen: [
      'La velocidad cuadrática media es u_rms = √(3·R·T/M), con M en kg/mol.',
      'Crece con la raíz de la temperatura y baja con la raíz de la masa molar.',
      'La velocidad media es algo menor: ū = √(8·R·T/(π·M)).',
      'Las velocidades se reparten en una distribución; u_rms es un valor representativo.'
    ],
    glosario: [RENG_G.urms, RENG_G.distribucion],
    comprobar: [
      rengPreg(
        'Si la masa molar de un gas es cuatro veces la de otro, a la misma temperatura, ¿cómo es su u_rms?',
        ['La mitad', true, 'Correcto: u_rms es inversa a √M, y √4 = 2.'],
        ['La cuarta parte', false, 'Ese resultado olvida la raíz cuadrada: la velocidad baja con √M, no con M.'],
        ['El doble', false, 'Un gas más pesado se mueve más despacio, no más deprisa, a la misma temperatura.']
      ),
      rengPreg(
        'Al calentar un gas, ¿qué le pasa a la curva de distribución de velocidades?',
        ['Su máximo se desplaza a velocidades mayores y se ensancha', true, 'Correcto: hay más moléculas rápidas y las velocidades están más repartidas.'],
        ['Se desplaza a velocidades menores', false, 'Al calentar aumenta la energía de las moléculas; la distribución se va a velocidades mayores.'],
        ['No cambia, porque solo cambia la energía', false, 'La energía cinética depende de la velocidad: si cambia la energía media, cambia la distribución de velocidades.']
      ),
      rengPreg(
        'Un estudiante calcula u_rms del nitrógeno a 300 K usando M = 28 g/mol sin pasarla a kg/mol. ¿Qué obtiene?',
        ['Una velocidad unas 32 veces menor', true, 'Correcto: M aparece 1000 veces mayor dentro de la raíz, y √1000 ≈ 32.'],
        ['Una velocidad 1000 veces menor', false, 'El factor 1000 está dentro de la raíz, así que el error es √1000, no 1000.'],
        ['La velocidad correcta', false, 'Con R en J/(mol·K), la masa molar debe ir en kg/mol para obtener m/s.']
      )
    ],
    anterior: 'n1-b8-s15',
    siguiente: 'n1-b8-s17',
    prerrequisitos: ['n1-b8-s15'],
    escena: rengEscenaGas({ n: 1, T: 300, V: 24.5, M: 28 }, 'Mira la lectura de velocidad cuadrática media: cuadruplica T y verás que solo se duplica; cuadruplica M y verás que se reduce a la mitad.')
  },
  'gas-difusion': {
    objetivosMas: ['Explicar por qué la difusión real es mucho más lenta que la velocidad de las moléculas.'],
    porQueImporta: 'El olor de un perfume tarda segundos o minutos en cruzar una habitación, aunque sus moléculas se muevan a cientos de metros por segundo. Entender la difusión explica ese contraste, cómo se detecta una fuga de gas y cómo se separan gases de masas distintas.',
    analogia: 'La difusión es como cruzar una plaza abarrotada: cada persona camina deprisa, pero choca continuamente con otras y cambia de rumbo, así que tarda mucho en llegar al otro lado.',
    analogiaLimite: 'Las personas eligen su camino; las moléculas no. Y el modelo de este subtema, con frentes que avanzan a rapidez constante, es una simplificación: en la difusión real la distancia crece más despacio que el tiempo.',
    correccion: 'En el modelo idealizado, la razón de rapideces de difusión es la raíz cuadrada inversa de la razón de masas molares: v_A/v_B = √(M_B/M_A).',
    errores: [['Esperar que el olor llegue en milisegundos porque las moléculas son muy rápidas.', 'Cada molécula choca miles de millones de veces por segundo y cambia de dirección; avanza en zigzag, mucho más despacio que su velocidad.']],
    ejemplo2: 'ej-gas-difusion-2',
    figuras: ['fig-gas-graham'],
    resumen: [
      'La difusión es la mezcla de gases por el movimiento desordenado de sus moléculas.',
      'Los gases ligeros se difunden más deprisa que los pesados.',
      'En el modelo idealizado, v_A/v_B = √(M_B/M_A).',
      'La difusión real es lenta porque las moléculas chocan continuamente.'
    ],
    glosario: [RENG_G.difusion, RENG_G.graham],
    comprobar: [
      rengPreg(
        'En un tubo se liberan a la vez amoníaco (17 g/mol) por un extremo y cloruro de hidrógeno (36,5 g/mol) por el otro. ¿Dónde se encuentran?',
        ['Más cerca del extremo del cloruro de hidrógeno', true, 'Correcto: el amoníaco es más ligero y avanza más deprisa, así que recorre más distancia.'],
        ['Justo en el centro', false, 'Solo sería así si los dos gases tuvieran la misma masa molar.'],
        ['Más cerca del extremo del amoníaco', false, 'Sería al revés: el gas más pesado es el que avanza más despacio.']
      ),
      rengPreg(
        '¿Por qué un gas se difunde mucho más despacio que la velocidad de sus moléculas?',
        ['Porque las moléculas chocan y cambian de dirección continuamente', true, 'Correcto: el camino es un zigzag y el avance neto es mucho menor que la distancia recorrida.'],
        ['Porque las moléculas se frenan al chocar', false, 'En el modelo los choques son elásticos: las moléculas no pierden energía en promedio, solo cambian de dirección.'],
        ['Porque el aire empuja las moléculas hacia atrás', false, 'No hay un empuje del aire hacia atrás: son los choques desordenados los que hacen lento el avance.']
      ),
      rengPreg(
        'Un gas A es 9 veces más pesado (masa molar) que otro B. En el modelo idealizado, ¿cuánto más deprisa se difunde B?',
        ['3 veces', true, 'Correcto: la rapidez va con 1/√M y √9 = 3.'],
        ['9 veces', false, 'Ese resultado olvida la raíz cuadrada de la ley de Graham.'],
        ['81 veces', false, 'Ese resultado eleva al cuadrado en lugar de sacar la raíz.']
      )
    ],
    anterior: 'n1-b8-s16',
    siguiente: 'n1-b8-s18',
    prerrequisitos: ['n1-b8-s16']
  },
  'gas-efusion': {
    objetivosMas: ['Relacionar tiempos y velocidades de efusión para la misma cantidad de gas.'],
    porQueImporta: 'Un globo de helio se desinfla en un día mientras uno de aire dura semanas: el helio escapa más deprisa por los poros diminutos de la goma. La efusión explica ese efecto y está en la base de algunos métodos de separación de isótopos.',
    analogia: 'La efusión es como una multitud saliendo por una puerta estrecha: salen antes quienes llegan más a menudo a la puerta, y los rápidos llegan con más frecuencia.',
    analogiaLimite: 'En una multitud la gente se empuja y se atasca; en la efusión ideal las moléculas pasan de una en una, sin chocar entre ellas en el orificio, y el orificio es más pequeño que la distancia entre choques.',
    correccion: 'Para la misma cantidad de gas, el tiempo es inverso a la velocidad: si un gas efunde el doble de rápido, tarda la mitad.',
    errores: [['Aplicar la ley de Graham a un orificio grande o a un gas a presión alta.', 'Graham describe la efusión molécula a molécula por un orificio diminuto; por orificios grandes el gas sale en chorro y la ley no se cumple.']],
    ejemplo2: 'ej-gas-efusion-2',
    figuras: ['fig-gas-graham'],
    resumen: [
      'La efusión es el paso de un gas por un orificio diminuto, molécula a molécula.',
      'A igual P y T, r_A/r_B = √(M_B/M_A).',
      'Para la misma cantidad, t_A/t_B = √(M_A/M_B): el gas pesado tarda más.',
      'Repetir la efusión enriquece la mezcla en el componente ligero.'
    ],
    glosario: [RENG_G.efusion, RENG_G.graham],
    comprobar: [
      rengPreg(
        'El oxígeno (32 g/mol) tarda 40 s en efundir. ¿Cuánto tarda la misma cantidad de helio (4 g/mol) en las mismas condiciones?',
        ['Unos 14 s', true, 'Correcto: t_He = 40 s × √(4/32) ≈ 14,1 s.'],
        ['Unos 113 s', false, 'Ese resultado invierte la razón: el helio es más ligero, así que tarda menos, no más.'],
        ['5 s', false, 'Ese resultado usa la razón de masas sin la raíz cuadrada.']
      ),
      rengPreg(
        '¿Por qué un globo de helio se desinfla antes que uno de aire?',
        ['Porque el helio, más ligero, escapa más deprisa por los poros de la goma', true, 'Correcto: la velocidad de efusión es inversa a √M, y el helio tiene una masa molar mucho menor.'],
        ['Porque el helio reacciona con la goma', false, 'El helio es un gas noble y prácticamente no reacciona; el efecto es de velocidad molecular.'],
        ['Porque el helio está más frío', false, 'Si los dos globos están a la misma temperatura, la diferencia se debe a la masa molar.']
      ),
      rengPreg(
        '¿En qué condición se cumple la ley de Graham para la efusión?',
        ['Con un orificio muy pequeño comparado con el camino entre choques', true, 'Correcto: así las moléculas pasan de una en una y la velocidad depende solo de su rapidez.'],
        ['Con un orificio grande para que el gas salga deprisa', false, 'Por un orificio grande el gas sale en chorro y no se cumple la ley de Graham.'],
        ['Solo con gases a presión muy alta', false, 'A presión alta las moléculas chocan mucho cerca del orificio y la ley deja de cumplirse.']
      )
    ],
    anterior: 'n1-b8-s17',
    siguiente: 'n1-b8-s19',
    prerrequisitos: ['n1-b8-s16']
  },
  'gas-ley-graham': {
    objetivosMas: ['Despejar la masa molar de un gas desconocido a partir de velocidades o tiempos de efusión relativos.'],
    porQueImporta: 'La ley de Graham permite estimar la masa molar de un gas sin pesarlo, solo comparando cuánto tarda en escapar frente a un gas conocido. Es un ejemplo de cómo una medida sencilla de tiempo informa de una propiedad molecular.',
    analogia: 'Usar la ley de Graham es como estimar el peso de un corredor por lo que tarda en una carrera frente a otro de peso conocido, sabiendo que todos llevan la misma energía.',
    analogiaLimite: 'Los corredores reales no tienen todos la misma energía ni corren al azar; en el gas, la igualdad de energía media a la misma temperatura es lo que hace que la velocidad dependa solo de √M.',
    correccion: 'Al despejar la masa molar hay que elevar al cuadrado: M_X = M_ref·(r_ref/r_X)² = M_ref·(t_X/t_ref)².',
    errores: [['Comparar tiempos de efusión medidos a temperaturas o presiones distintas.', 'La ley compara gases en las mismas condiciones; si cambian P o T, la comparación deja de ser válida.']],
    ejemplo2: 'ej-gas-graham-2',
    figuras: ['fig-gas-graham'],
    resumen: [
      'Ley de Graham: r_A/r_B = √(M_B/M_A), a igual presión y temperatura.',
      'Con tiempos para la misma cantidad: t_A/t_B = √(M_A/M_B).',
      'Para despejar una masa molar se eleva al cuadrado la razón de velocidades o de tiempos.',
      'Es exacta solo para la efusión ideal por un orificio diminuto.'
    ],
    glosario: [RENG_G.graham, RENG_G.masaMolar],
    comprobar: [
      rengPreg(
        'Un gas desconocido efunde a la mitad de velocidad que el oxígeno (32 g/mol). ¿Cuál es su masa molar?',
        ['128 g/mol', true, 'Correcto: M_X = 32 × (1/0,5)² = 32 × 4.'],
        ['64 g/mol', false, 'Ese resultado usa la razón de velocidades sin elevarla al cuadrado.'],
        ['8 g/mol', false, 'Ese resultado invierte la razón: un gas más lento es más pesado.']
      ),
      rengPreg(
        '¿Qué magnitud debe ser la misma para comparar dos gases con la ley de Graham?',
        ['La presión y la temperatura', true, 'Correcto: la ley compara gases en las mismas condiciones.'],
        ['La masa de gas', false, 'Lo que conviene igualar es la cantidad (moles) si se comparan tiempos, no la masa.'],
        ['El volumen del recipiente solamente', false, 'El volumen no basta: la velocidad depende de la temperatura y la presión.']
      ),
      rengPreg(
        'Si la razón de velocidades de efusión de A frente a B es 2, ¿cómo son sus masas molares?',
        ['M_B es cuatro veces M_A', true, 'Correcto: r_A/r_B = √(M_B/M_A) = 2, así que M_B/M_A = 4.'],
        ['M_A es cuatro veces M_B', false, 'Si A efunde más deprisa, A es el más ligero; la relación está invertida.'],
        ['M_B es el doble de M_A', false, 'Ese resultado olvida elevar al cuadrado al pasar de velocidades a masas molares.']
      )
    ],
    anterior: 'n1-b8-s18',
    siguiente: 'n1-b8-s20',
    prerrequisitos: ['n1-b8-s18']
  },
  'gas-desviaciones': {
    objetivosMas: ['Interpretar el signo de Z − 1 en términos de atracciones o de volumen propio de las moléculas.'],
    porQueImporta: 'Los gases de las bombonas a presión alta, el dióxido de carbono de los extintores o el vapor de las centrales no cumplen la ley del gas ideal. Saber cuándo y por qué se aparta un gas real del modelo evita cálculos con errores grandes en la industria y en el laboratorio.',
    analogia: 'Un gas real se parece a una sala con gente: si hay poca, cada uno se mueve libremente (gas ideal); si se llena, la gente ocupa sitio y además se agrupa, y el espacio útil ya no es el de la sala vacía.',
    analogiaLimite: 'La gente se agrupa por elección; las moléculas lo hacen por fuerzas de atracción que dependen de su naturaleza. Y van der Waals, aunque mejor que el modelo ideal, sigue siendo una aproximación con parámetros ajustados.',
    correccion: 'En van der Waals el término de atracción se resta (−a·n²/V²) y el volumen disponible es V − n·b, no el volumen total.',
    errores: [['Pensar que Z < 1 significa que el gas ocupa menos volumen porque se ha licuado.', 'Z < 1 indica que las atracciones reducen la presión respecto del gas ideal en esas condiciones; el gas puede seguir siendo gas.']],
    ejemplo2: 'ej-gas-desviaciones-2',
    figuras: ['fig-gas-z'],
    resumen: [
      'Los gases reales se apartan del ideal a presión alta y a temperatura baja.',
      'El factor de compresibilidad Z = P·V/(n·R·T) mide la desviación; Z = 1 en el gas ideal.',
      'Z < 1 indica que dominan las atracciones; Z > 1, el volumen propio de las moléculas.',
      'Van der Waals corrige el modelo con a (atracción) y b (volumen propio): P = n·R·T/(V − n·b) − a·n²/V².',
      'Los parámetros a y b de este capítulo son didácticos, de un gas hipotético.'
    ],
    glosario: [RENG_G.compresibilidadZ, RENG_G.vanDerWaals, RENG_G.gasIdeal],
    comprobar: [
      rengPreg(
        'Un gas tiene Z = 0,85 en ciertas condiciones. ¿Qué indica?',
        ['Que las atracciones entre moléculas dominan y la presión es menor que la ideal', true, 'Correcto: con Z < 1, el gas ejerce menos presión de la que predice el modelo ideal en ese volumen.'],
        ['Que el volumen propio de las moléculas domina', false, 'El volumen propio aumenta la presión y da Z > 1, no Z < 1.'],
        ['Que el gas se comporta como ideal', false, 'Un gas ideal tiene exactamente Z = 1.']
      ),
      rengPreg(
        '¿En qué condiciones se parece más un gas real al gas ideal?',
        ['A presión baja y temperatura alta', true, 'Correcto: las moléculas están lejos unas de otras y se mueven deprisa, así que las atracciones y su tamaño importan poco.'],
        ['A presión alta y temperatura baja', false, 'Esas son precisamente las condiciones en que el gas real más se aparta del modelo.'],
        ['Cuando está a punto de licuarse', false, 'Cerca de la licuación las atracciones son decisivas; el modelo ideal falla.']
      ),
      rengPreg(
        'En la ecuación de van der Waals, ¿qué representa el parámetro b?',
        ['El volumen propio de las moléculas, por mol', true, 'Correcto: V − n·b es el volumen realmente libre para el movimiento.'],
        ['La intensidad de las atracciones', false, 'Las atracciones las representa el parámetro a.'],
        ['La constante de los gases para ese gas', false, 'R es la misma para todos los gases; b es una corrección propia de cada gas.']
      )
    ],
    anterior: 'n1-b8-s19',
    siguiente: 'n1-b9-s1',
    prerrequisitos: ['n1-b8-s9', 'n1-b8-s15']
  }
}
