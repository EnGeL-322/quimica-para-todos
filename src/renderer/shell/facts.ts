export const RENG_DATOS: Array<{ texto: string; area: string }> = [
  { texto: 'La luz del Sol tarda unos 8 minutos y 20 segundos en llegar a la Tierra.', area: 'Física' },
  { texto: 'El ADN de dos personas cualesquiera es idéntico en más del 99,9 %.', area: 'Biología' },
  { texto: 'El agua es la única sustancia común que se encuentra de forma natural como sólido, líquido y gas en la Tierra.', area: 'Química' },
  { texto: 'Un día en Venus dura más que su año: rota sobre sí misma más despacio de lo que orbita al Sol.', area: 'Astronomía' },
  { texto: 'El 99,9 % de la masa de un átomo está concentrada en un núcleo miles de veces más pequeño que el átomo entero.', area: 'Física' },
  { texto: 'Una sola gota de agua contiene del orden de mil trillones (10²¹) de moléculas.', area: 'Química' },
  { texto: 'La velocidad de la luz en el vacío es exactamente 299 792 458 m/s: así se define el metro.', area: 'Física' },
  { texto: 'El cuerpo humano contiene unos 37 billones de células.', area: 'Biología' },
  { texto: 'Los neutrinos atraviesan tu cuerpo por billones cada segundo sin interactuar casi nunca.', area: 'Física' },
  { texto: 'Se cree que gran parte del oro del universo se forjó en fusiones de estrellas de neutrones.', area: 'Astronomía' },
  { texto: 'Ada Lovelace escribió en 1843 lo que se considera el primer algoritmo destinado a una máquina.', area: 'Computación' },
  { texto: 'En la Tierra caen en promedio unos 40 rayos por segundo.', area: 'Geociencias' },
  { texto: 'El Ande peruano alberga una de las mayores diversidades de variedades de papa del mundo: más de 3 000.', area: 'Biología' },
  { texto: 'La Tierra no es una esfera perfecta: su diámetro ecuatorial supera al polar en unos 43 km.', area: 'Geociencias' }
]

export function rengDatoDelDia(rengD = new Date()): { texto: string; area: string } {
  const rengDia = Math.floor(rengD.getTime() / 86_400_000)
  return RENG_DATOS[rengDia % RENG_DATOS.length] as { texto: string; area: string }
}
