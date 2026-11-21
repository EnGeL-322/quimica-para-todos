import { describe, expect, it } from 'vitest'
import { rengAsEnum, rengAsInt, rengAsObject, rengAsString, rengAsStringArray } from '../src/shared/validate'
import { RENG_ID_RE, RENG_ACTION_RE, rengAssertChannelParts } from '../src/shared/ipc'

describe('validación IPC', () => {
  it('rechaza tipos y rangos inválidos con mensaje claro', () => {
    expect(() => rengAsObject(null)).toThrow(/objeto/)
    expect(() => rengAsObject([])).toThrow(/objeto/)
    expect(() => rengAsString(5, 'x')).toThrow(/texto/)
    expect(() => rengAsString('a'.repeat(11), 'x', { max: 10 })).toThrow(/máximo/)
    expect(() => rengAsInt(1.5, 'n', 0, 9)).toThrow(/entero/)
    expect(() => rengAsInt(10, 'n', 0, 9)).toThrow(/entre/)
    expect(() => rengAsEnum('z', 'e', ['a', 'b'] as const)).toThrow(/permitidos/)
    expect(() => rengAsStringArray(['a', 1], 'l')).toThrow()
    expect(rengAsStringArray(['a', 'b'], 'l')).toEqual(['a', 'b'])
  })

  it('los canales IPC solo admiten ids/acciones bien formados', () => {
    expect(RENG_ID_RE.test('escaner-red')).toBe(true)
    for (const rengBad of ['', 'A', '1abc', 'a b', 'a:b', '../x', 'x'.repeat(40)]) expect(RENG_ID_RE.test(rengBad)).toBe(false)
    expect(RENG_ACTION_RE.test('pickFiles')).toBe(true)
    expect(() => rengAssertChannelParts('core', 'rm -rf')).toThrow()
    expect(() => rengAssertChannelParts('c:ore', 'x1')).toThrow()
  })
})
