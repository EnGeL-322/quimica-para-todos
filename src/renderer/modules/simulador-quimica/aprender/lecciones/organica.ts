import type { RengLeccion } from '../tipos'
import { rengFuenteGoldBookCip, rengFuenteOpenStax } from './comun'

export const RENG_LECCIONES_ORGANICA: readonly RengLeccion[] = [
  {
    tema: 'grupos',
    objetivo: 'Reconocer los grupos funcionales de una molécula y elegir cuál es el grupo principal.',
    conceptos: [
      'Un grupo funcional es un conjunto de átomos con un comportamiento químico característico: hidroxilo (–OH, alcoholes), carbonilo (C=O, aldehídos y cetonas), carboxilo (–COOH, ácidos), éster (–COO–), éter (–O–), amina (–N) y amida (–CON).',
      'Una molécula puede tener varios grupos. Para nombrarla se elige uno como principal según un orden de prioridad (por ejemplo, ácido carboxílico > éster > amida > aldehído > cetona > alcohol > amina); los demás se tratan como sustituyentes.',
      'Reconocer el grupo permite predecir propiedades (acidez, polaridad, enlaces de hidrógeno) y qué reacciones son posibles.'
    ],
    ejemplo: {
      titulo: 'Dos grupos en el ácido láctico',
      enunciado: 'Identifica los grupos funcionales del ácido láctico, CH₃–CH(OH)–COOH, y decide cuál es el principal.',
      datos: [{ etiqueta: 'Estructura', valor: 'CH₃–CH(OH)–COOH (C₃H₆O₃)' }],
      estructuras: [{ smiles: 'CC(O)C(=O)O', descripcion: 'Ácido láctico: un hidroxilo sobre el carbono central y un carboxilo en el extremo', numeracion: 'C1: carboxilo (–COOH) · C2: lleva el –OH · C3: metilo (–CH₃)' }],
      pasos: [
        { accion: 'Buscar los átomos de oxígeno y ver a qué se unen.', dato: 'Tres oxígenos: uno con un solo enlace a C y H (–OH), otro con doble enlace a C (C=O) y otro con –OH sobre ese mismo C.', porQue: 'Los grupos funcionales de esta molécula contienen oxígeno.', interpretar: 'Hay un –OH aislado y un grupo C(=O)OH.' },
        { accion: 'Nombrar cada grupo: –OH sobre carbono saturado = hidroxilo (alcohol); C(=O)OH = carboxilo (ácido carboxílico).', dato: 'El grupo –COOH combina un carbonilo y un hidroxilo sobre el mismo carbono.', porQue: 'El carboxilo se reconoce por la pareja C=O y O–H en un mismo carbono.', interpretar: 'La molécula es, a la vez, alcohol y ácido.' },
        { accion: 'Elegir el principal: el ácido carboxílico tiene prioridad sobre el alcohol.', dato: 'El orden de prioridad de grupos.', porQue: 'En nomenclatura IUPAC solo un grupo es sufijo: el de mayor prioridad.', interpretar: 'El nombre será de ácido (ácido 2-hidroxipropanoico) y el –OH aparece como prefijo «hidroxi».' }
      ],
      resultado: { texto: 'Grupos: hidroxilo y carboxilo. Principal: ácido carboxílico.' },
      errorTipico: 'Llamar «alcohol» a toda la molécula por ver un –OH, sin darse cuenta de que el –OH del carboxilo forma parte de otro grupo.',
      revision: 'Cuenta los oxígenos: cada uno debe pertenecer a algún grupo que hayas nombrado.'
    },
    comprobacion: {
      pregunta: '¿Qué grupo funcional tiene prioridad al nombrar una molécula con un grupo cetona y un grupo alcohol?',
      opciones: [
        { id: 'a', texto: 'La cetona: el alcohol pasa a prefijo «hidroxi».' },
        { id: 'b', texto: 'El alcohol: la cetona pasa a prefijo «oxo».' },
        { id: 'c', texto: 'Ninguno: se nombran ambos como sufijo.' }
      ],
      correcta: 'a',
      explicacion: 'En el orden de prioridad la cetona está por encima del alcohol. Solo el grupo principal va en el sufijo; los demás son prefijos (hidroxi en este caso).'
    },
    porNivel: {
      preuniversitario: 'Reconoce un grupo funcional en moléculas con uno solo.',
      universitario: 'Identifica varios grupos y elige el principal por prioridad.'
    },
    prerrequisitos: [],
    observar: { texto: 'Mira la estructura 2D del ácido láctico en la Mesa y localiza cada grupo.', mesaSmiles: 'CC(O)C(=O)O' },
    fuentes: [rengFuenteOpenStax('secciones 20.2 «Alcohols and Ethers», 20.3 «Aldehydes, Ketones, Carboxylic Acids, and Esters» y 20.4 «Amines and Amides»')],
    recorrido: false
  },
  {
    tema: 'nomenclatura',
    objetivo: 'Nombrar un compuesto orgánico sencillo siguiendo la secuencia IUPAC: cadena principal, numeración, sufijo y sustituyentes.',
    conceptos: [
      'El nombre sale de cuatro decisiones, en este orden: la cadena principal (la más larga que contiene el grupo principal), la numeración (el grupo principal con el localizador más bajo), los sustituyentes con sus localizadores y su orden alfabético.',
      'La raíz depende del número de carbonos de la cadena (met-, et-, prop-, but-, pent-, hex-…); el sufijo indica el grupo principal (-ano, -eno, -ol, -al, -ona, -oico).',
      'Un nombre correcto permite dibujar una única estructura: si dos estructuras distintas tienen el mismo nombre, hay un error.'
    ],
    ejemplo: {
      titulo: '3-metilbutan-1-ol',
      enunciado: 'Nombra el compuesto CH₃–CH(CH₃)–CH₂–CH₂–OH.',
      datos: [{ etiqueta: 'Estructura', valor: 'CH₃–CH(CH₃)–CH₂–CH₂–OH (C₅H₁₂O)' }],
      estructuras: [{ smiles: 'CC(C)CCO', descripcion: 'Cadena de cuatro carbonos con un metilo y un –OH terminal', numeracion: 'C1: lleva el –OH · C2: –CH₂– · C3: lleva el metilo · C4: –CH₃ terminal' }],
      pasos: [
        { accion: 'Elegir la cadena principal: la más larga que incluye el carbono con –OH tiene 4 C (butano).', dato: 'El grupo –OH está en un extremo; el CH₃ lateral no alarga la cadena.', porQue: 'La cadena principal debe contener el grupo principal y ser la más larga.', interpretar: 'La raíz es «but-» y el sufijo «-ol»: butanol.' },
        { accion: 'Numerar para que el –OH tenga el localizador más bajo: C1 es el carbono con –OH.', dato: 'El –OH está en un extremo: puede ser 1 o 4.', porQue: 'El grupo principal debe llevar el localizador más bajo.', interpretar: 'Es butan-1-ol y el metilo queda en el carbono 3.' },
        { accion: 'Añadir el sustituyente: metilo en C3.', dato: 'El CH₃ lateral está sobre el tercer carbono contando desde el –OH.', porQue: 'Se nombra con su localizador y va delante de la raíz.', interpretar: 'El nombre completo es 3-metilbutan-1-ol.' }
      ],
      resultado: { texto: '3-metilbutan-1-ol' },
      errorTipico: 'Numerar desde el extremo del metilo: se obtendría «2-metilbutan-4-ol», que es incorrecto porque el –OH debe llevar el localizador más bajo.',
      revision: 'Dibuja la estructura a partir del nombre: 4 carbonos, –OH en C1 y CH₃ en C3; debe coincidir con la original.'
    },
    comprobacion: {
      pregunta: 'En la numeración de una cadena con un –OH y un metilo, ¿qué manda?',
      opciones: [
        { id: 'a', texto: 'Que el –OH, al ser el grupo principal, tenga el localizador más bajo.' },
        { id: 'b', texto: 'Que el metilo tenga el localizador más bajo.' },
        { id: 'c', texto: 'Se numera siempre de izquierda a derecha.' }
      ],
      correcta: 'a',
      explicacion: 'El grupo principal (sufijo) manda sobre los sustituyentes. Solo si hay empate se miran los sustituyentes.'
    },
    porNivel: {
      preuniversitario: 'Nombra alcanos y alcoholes de cadena lineal y con un sustituyente.',
      universitario: 'Nombra con varios sustituyentes y orden alfabético.',
      quimico: 'Resuelve empates de numeración y elige entre cadenas de igual longitud.'
    },
    prerrequisitos: ['grupos'],
    observar: { texto: 'Dibuja el compuesto en la Mesa y comprueba que su fórmula es C₅H₁₂O.', mesaSmiles: 'CC(C)CCO' },
    fuentes: [rengFuenteOpenStax('secciones 20.1 «Hydrocarbons» y 20.2 «Alcohols and Ethers»')],
    recorrido: false
  },
  {
    tema: 'estructura',
    objetivo: 'Pasar entre la fórmula condensada, la notación SMILES y el dibujo de esqueleto de una molécula.',
    conceptos: [
      'Una misma molécula se puede escribir de varias formas: fórmula condensada (CH₃CH₂COOH), SMILES (CCC(=O)O) o esqueleto. Todas deben contener la misma información: qué átomos hay y cómo se conectan.',
      'En SMILES cada átomo se escribe seguido, los dobles enlaces con «=», las ramas entre paréntesis y los anillos con números. El orden de escritura no importa: CCO y OCC son la misma molécula (etanol).',
      'Dos escrituras distintas pueden representar la misma sustancia. Para compararlas se calcula una forma canónica: si coinciden, es la misma estructura.'
    ],
    ejemplo: {
      titulo: 'Ácido propanoico',
      enunciado: 'Escribe en SMILES el ácido propanoico, CH₃CH₂COOH.',
      datos: [{ etiqueta: 'Fórmula condensada', valor: 'CH₃CH₂COOH (C₃H₆O₂)' }],
      estructuras: [{ smiles: 'CCC(=O)O', descripcion: 'Ácido propanoico: cadena de tres carbonos con un carboxilo en el extremo', numeracion: 'C1: carboxilo · C2: –CH₂– · C3: –CH₃' }],
      pasos: [
        { accion: 'Escribir la cadena de carbonos: C C C (CH₃, CH₂ y el carbono del carboxilo).', dato: 'Los tres carbonos de la fórmula condensada.', porQue: 'En SMILES los átomos consecutivos se enlazan con enlace sencillo.', interpretar: 'Hasta aquí es la cadena de propano: CCC.' },
        { accion: 'Añadir el doble enlace al oxígeno del carbonilo en el último carbono: CCC(=O).', dato: 'El grupo C=O del carboxilo.', porQue: 'Las ramas y los dobles enlaces se marcan con paréntesis y «=».', interpretar: 'Ese carbono ya tiene tres enlaces (uno al C anterior y el doble al O).' },
        { accion: 'Añadir el hidroxilo: CCC(=O)O.', dato: 'El –OH del carboxilo.', porQue: 'El hidrógeno de OH está implícito: SMILES lo cuenta por valencia.', interpretar: 'El carbono tiene cuatro enlaces y la fórmula es C₃H₆O₂.' }
      ],
      resultado: { texto: 'CCC(=O)O' },
      errorTipico: 'Escribir CCCO2 pensando en subíndices: en SMILES no hay subíndices, los átomos se enlazan uno a uno.',
      revision: 'Cuenta los átomos de la cadena escrita y compara con la fórmula molecular (C₃H₆O₂).'
    },
    comprobacion: {
      pregunta: '¿Son CCO y OCC la misma molécula?',
      opciones: [
        { id: 'a', texto: 'Sí: ambas son etanol; solo cambia el sentido en que se escribió la cadena.' },
        { id: 'b', texto: 'No: CCO es etanol y OCC es un éter.' },
        { id: 'c', texto: 'No: tienen distinto número de átomos.' }
      ],
      correcta: 'a',
      explicacion: 'Una cadena se puede recorrer en cualquier sentido. En ambas hay dos carbonos enlazados y un oxígeno unido a uno de ellos: etanol (C₂H₆O).'
    },
    porNivel: {
      preuniversitario: 'Escribe estructuras condensadas de cadenas lineales.',
      universitario: 'Pasa entre condensada y SMILES con ramas y dobles enlaces.',
      quimico: 'Decide cuándo dos escrituras son la misma estructura y cuándo son isómeros.'
    },
    prerrequisitos: ['grupos'],
    observar: { texto: 'Escribe el SMILES en la Mesa: debe aparecer el ácido propanoico.', mesaSmiles: 'CCC(=O)O' },
    fuentes: [rengFuenteOpenStax('secciones 7.3 «Lewis Symbols and Structures» y 20.1 «Hydrocarbons»')],
    recorrido: false
  },
  {
    tema: 'isomeria',
    objetivo: 'Reconocer isómeros constitucionales (misma fórmula molecular, distinta conectividad) y escribir todos los de una fórmula sencilla.',
    conceptos: [
      'Los isómeros constitucionales comparten la fórmula molecular pero se conectan de forma distinta; por eso son sustancias diferentes con propiedades distintas. Etanol y dimetil éter son C₂H₆O y se distinguen por su estructura.',
      'Para enumerarlos se calcula primero el grado de insaturación (¿hay anillos o dobles enlaces?) y luego se varía el esqueleto de carbono, la posición del grupo y el tipo de grupo, comprobando cada resultado: la fórmula debe ser la misma y la estructura distinta.',
      'Una fórmula molecular sola no identifica una sustancia: C₃H₈O corresponde a tres compuestos. Para asociar propiedades o fichas hay que elegir la estructura.'
    ],
    ejemplo: {
      titulo: 'Isómeros de C₃H₈O',
      enunciado: 'Escribe todos los isómeros constitucionales de fórmula C₃H₈O y nómbralos.',
      datos: [{ etiqueta: 'Fórmula molecular', valor: 'C₃H₈O' }],
      estructuras: [
        { smiles: 'CCCO', descripcion: 'Propan-1-ol: el –OH en el carbono terminal', numeracion: 'C1: lleva el –OH · C2 · C3' },
        { smiles: 'CC(C)O', descripcion: 'Propan-2-ol: el –OH en el carbono central', numeracion: 'C1 · C2: lleva el –OH · C3' },
        { smiles: 'COCC', descripcion: 'Metoxietano: un éter, con el oxígeno entre dos carbonos', numeracion: 'CH₃–O–CH₂–CH₃: el oxígeno une el metilo y el etilo' }
      ],
      pasos: [
        { accion: 'Calcular el grado de insaturación: (2·3 + 2 − 8) / 2 = 0.', dato: 'C₃H₈O: 3 carbonos y 8 hidrógenos (el oxígeno no cuenta).', porQue: 'Indica cuántos anillos o dobles enlaces caben: 0 significa estructura saturada y acíclica.', interpretar: 'Solo hay enlaces sencillos y no hay anillos.' },
        { accion: 'Fijar el esqueleto: tres carbonos en cadena (C–C–C); no hay otra forma con tres carbonos sin anillo.', dato: 'La fórmula tiene 3 carbonos.', porQue: 'Con tres carbonos solo existe una ramificación posible: la lineal.', interpretar: 'El oxígeno solo se puede colocar de dos formas: en un carbono o entre carbonos.' },
        { accion: 'Colocar el oxígeno como –OH: en un carbono terminal (propan-1-ol) o en el central (propan-2-ol).', dato: 'Hay dos tipos de carbono en la cadena: extremos (equivalentes) y centro.', porQue: 'Los dos extremos son equivalentes: colocar el –OH en cualquiera de ellos da la misma molécula.', interpretar: 'Se obtienen dos alcoholes.' },
        { accion: 'Colocar el oxígeno entre carbonos: C–O–C–C, metoxietano.', dato: 'El oxígeno enlazado a dos carbonos.', porQue: 'Es la tercera forma de colocar un oxígeno divalente en una cadena.', interpretar: 'Es un éter y no un alcohol: grupo funcional distinto.' },
        { accion: 'Comprobar cada resultado: los tres son C₃H₈O y sus estructuras son distintas.', dato: 'Las tres estructuras.', porQue: 'La enumeración solo es válida si se verifica fórmula y conectividad.', interpretar: 'Hay exactamente tres isómeros constitucionales.' }
      ],
      resultado: { texto: 'Tres isómeros: propan-1-ol, propan-2-ol y metoxietano', valor: 3, unidad: '', tolRel: 0 },
      errorTipico: 'Contar dos veces el mismo isómero escrito en sentido contrario (CCCO y OCCC son la misma molécula).',
      revision: 'Comprueba que no hay otra posición distinta para el oxígeno y que no repites una molécula que solo cambió de sentido.'
    },
    comprobacion: {
      pregunta: 'Etanol (CH₃CH₂OH) y dimetil éter (CH₃OCH₃), ¿son la misma sustancia?',
      opciones: [
        { id: 'a', texto: 'Sí, porque tienen la misma fórmula molecular, C₂H₆O.' },
        { id: 'b', texto: 'No: tienen la misma fórmula pero distinta conectividad (un alcohol y un éter).' },
        { id: 'c', texto: 'Sí, porque tienen los mismos átomos.' }
      ],
      correcta: 'b',
      explicacion: 'Son isómeros constitucionales: igual fórmula molecular, distinta estructura, propiedades distintas. Por eso la fórmula sola no identifica una sustancia.'
    },
    porNivel: {
      preuniversitario: 'Reconoce si dos estructuras son isómeros comparando fórmula y conectividad.',
      universitario: 'Enumera los isómeros de una fórmula sencilla y los clasifica (cadena, posición, función).',
      quimico: 'Usa el grado de insaturación para acotar la búsqueda y decide qué estructura corresponde a una ficha o a una propiedad.'
    },
    prerrequisitos: ['estructura'],
    observar: { texto: 'Abre en la Mesa propan-2-ol y compara con el metoxietano: misma fórmula, estructura distinta.', mesaSmiles: 'CC(C)O' },
    fuentes: [rengFuenteOpenStax('sección 20.1 «Hydrocarbons»')],
    recorrido: true
  },
  {
    tema: 'estereo',
    objetivo: 'Asignar el descriptor R o S a un centro estereogénico con las reglas de prioridad CIP.',
    conceptos: [
      'Un centro estereogénico (carbono con cuatro sustituyentes distintos) genera dos imágenes especulares no superponibles: los enantiómeros. Tienen las mismas propiedades físicas salvo la actividad óptica.',
      'Las reglas CIP ordenan los cuatro sustituyentes por número atómico del primer átomo (y, si hay empate, de los siguientes). Se mira la molécula con el sustituyente de menor prioridad alejado del observador: si 1→2→3 gira en el sentido de las agujas del reloj, es R; si gira al revés, es S.',
      'R y S son descriptores de la estructura, no de si el compuesto es dextro o levógiro (signo de la actividad óptica). En SMILES, @ y @@ codifican la configuración en el orden en que se escriben los vecinos.'
    ],
    ejemplo: {
      titulo: 'El ácido láctico natural',
      enunciado: 'El ácido láctico CH₃–CH(OH)–COOH tiene un carbono estereogénico. Asigna R o S al enantiómero dado por el SMILES C[C@H](O)C(=O)O.',
      datos: [{ etiqueta: 'SMILES', valor: 'C[C@H](O)C(=O)O' }],
      estructuras: [{ smiles: 'C[C@H](O)C(=O)O', descripcion: 'Un enantiómero del ácido láctico con el centro estereogénico marcado por la cuña' }],
      pasos: [
        { accion: 'Identificar los cuatro sustituyentes del carbono central: –OH, –COOH, –CH₃ y –H.', dato: 'El carbono central tiene cuatro grupos distintos.', porQue: 'Solo un centro con cuatro sustituyentes distintos puede ser R o S.', interpretar: 'Es un centro estereogénico.' },
        { accion: 'Ordenar por prioridad: O (OH) > C del carboxilo (O,O,O) > C del metilo (H,H,H) > H.', dato: 'Los números atómicos: O (8) > C (6) > H (1); el empate entre los dos carbonos se resuelve mirando sus sustituyentes.', porQue: 'El carboxilo tiene (O,O,O) frente a (H,H,H) del metilo: gana el carboxilo.', interpretar: 'Prioridad 1 = OH, 2 = COOH, 3 = CH₃, 4 = H.' },
        { accion: 'Orientar con el H hacia atrás y recorrer 1 → 2 → 3.', dato: 'La configuración que codifica el SMILES (@ en este orden de vecinos).', porQue: 'El sentido del giro define R (horario) o S (antihorario).', interpretar: 'El giro resulta antihorario: configuración S.' }
      ],
      resultado: { texto: '(S)-ácido láctico (ácido (S)-2-hidroxipropanoico)' },
      errorTipico: 'Asignar la prioridad por el tamaño del grupo en lugar de por el número atómico del primer átomo, o dejar el H de menor prioridad hacia el observador (esto invierte el descriptor).',
      revision: 'Si el H quedó hacia ti, invierte el resultado; confirma con otra herramienta que el descriptor coincide.'
    },
    comprobacion: {
      pregunta: 'Un compuesto tiene configuración (R). ¿Qué es su imagen especular?',
      opciones: [
        { id: 'a', texto: 'Su enantiómero, de configuración (S).' },
        { id: 'b', texto: 'El mismo compuesto, también (R).' },
        { id: 'c', texto: 'Un isómero constitucional.' }
      ],
      correcta: 'a',
      explicacion: 'Con un solo centro estereogénico, la imagen especular invierte el descriptor: (R) ↔ (S). Son enantiómeros: misma conectividad, no superponibles.'
    },
    porNivel: {
      universitario: 'Asigna R/S a moléculas con un solo centro y prioridades evidentes.',
      quimico: 'Resuelve empates de prioridad por sustituyentes de segunda esfera y distingue configuración, signo óptico y SMILES.'
    },
    prerrequisitos: ['isomeria'],
    observar: { texto: 'Abre en la Mesa el SMILES con estereoquímica: se conserva la configuración al añadirlo.', mesaSmiles: 'C[C@H](O)C(=O)O' },
    fuentes: [rengFuenteGoldBookCip, rengFuenteOpenStax('sección 20.2 «Alcohols and Ethers» (isomería y quiralidad en compuestos orgánicos, solo como contexto)')],
    recorrido: false
  },
  {
    tema: 'reacciones-organicas',
    objetivo: 'Predecir el producto principal de una reacción orgánica sencilla a partir del tipo de reacción y de las condiciones.',
    conceptos: [
      'Las reacciones orgánicas se agrupan por lo que ocurre en el enlace: adición (se abre un doble enlace y se suman átomos), sustitución (un átomo o grupo reemplaza a otro), eliminación (se pierde una molécula pequeña y aparece un doble enlace) y oxidación o reducción del grupo funcional.',
      'Las condiciones deciden el camino: el disolvente, la temperatura y la presencia de un catalizador o de peróxidos pueden cambiar el producto principal. Una reacción sin condiciones es una reacción incompleta.',
      'Cuando hay más de un producto posible, una regla (como la de Markovnikov) permite elegir el mayoritario: es una regla empírica, no una ley sin excepciones.'
    ],
    ejemplo: {
      titulo: 'Adición de HBr a propeno',
      enunciado: 'Escribe el producto principal de CH₃–CH=CH₂ + HBr (sin peróxidos).',
      datos: [
        { etiqueta: 'Reactivos', valor: 'Propeno + HBr' },
        { etiqueta: 'Condiciones', valor: 'Sin peróxidos (mecanismo iónico)' }
      ],
      estructuras: [
        { smiles: 'CC=C', descripcion: 'Propeno' },
        { smiles: 'CC(C)Br', descripcion: 'Producto principal: 2-bromopropano' }
      ],
      pasos: [
        { accion: 'Reconocer el tipo de reacción: un alqueno más HBr indica una adición electrófila.', dato: 'El doble enlace C=C del propeno.', porQue: 'El doble enlace es rico en electrones y reacciona con el H⁺ del HBr.', interpretar: 'Se abrirá el doble enlace y se añadirán H y Br.' },
        { accion: 'Elegir el carbono que recibe el hidrógeno: el más hidrogenado (CH₂ del extremo).', dato: 'Uno de los carbonos del doble enlace lleva 1 H y el otro 2 H.', porQue: 'La regla de Markovnikov: el H se une al carbono con más hidrógenos y el halógeno al más sustituido.', interpretar: 'El Br queda en el carbono central.' },
        { accion: 'Escribir el producto: CH₃–CHBr–CH₃, 2-bromopropano.', dato: 'El resultado de colocar H en el CH₂ y Br en el CH.', porQue: 'Es el producto mayoritario según la regla.', interpretar: 'El producto minoritario sería el 1-bromopropano.' }
      ],
      resultado: { texto: '2-bromopropano (CH₃CHBrCH₃)' },
      errorTipico: 'Aplicar Markovnikov a la adición con peróxidos: con peróxidos el HBr se adiciona por un mecanismo radicalario y el producto principal cambia.',
      revision: 'Comprueba que se conservan los átomos (C₃H₆ + HBr = C₃H₇Br) y que el producto tiene un solo Br.'
    },
    comprobacion: {
      pregunta: 'Si se cambian las condiciones (añadiendo peróxidos), ¿puede cambiar el producto principal de la adición de HBr?',
      opciones: [
        { id: 'a', texto: 'Sí: el mecanismo pasa a ser radicalario y la regla de Markovnikov deja de aplicarse.' },
        { id: 'b', texto: 'No: el producto solo depende de los reactivos.' },
        { id: 'c', texto: 'Solo cambia la velocidad, nunca el producto.' }
      ],
      correcta: 'a',
      explicacion: 'Las condiciones forman parte de la respuesta: con peróxidos el Br se adiciona al carbono menos sustituido (adición anti-Markovnikov).'
    },
    porNivel: {
      preuniversitario: 'Reconoce el tipo de reacción (adición, sustitución, eliminación) a partir de reactivos.',
      universitario: 'Predice el producto principal con la regla de Markovnikov y la oxidación de alcoholes.',
      quimico: 'Relaciona condiciones con mecanismo y justifica cuándo la regla empírica no se aplica.'
    },
    prerrequisitos: ['grupos', 'estructura'],
    observar: { texto: 'Compara en la Mesa el propeno con el 2-bromopropano.', mesaSmiles: 'CC(C)Br' },
    fuentes: [rengFuenteOpenStax('sección 20.1 «Hydrocarbons»')],
    recorrido: false
  }
]
