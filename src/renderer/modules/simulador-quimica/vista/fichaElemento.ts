export const rengFichaVisible = ({ sobre: rengSobre, foco: rengFoco }: { sobre: string | null; foco: string | null }): string | null => rengSobre ?? rengFoco ?? null
