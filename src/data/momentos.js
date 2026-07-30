export const momentos = [
    {
        slug: 'manana',
        titulo: 'Para empezar el dia',
        icon: 'sun',
        aliases: ['manana', 'empezar-el-dia', 'para-empezar-el-dia'],
    },
    {
        slug: 'oficina',
        titulo: 'Para la oficina',
        icon: 'briefcase',
        aliases: ['oficina', 'para-la-oficina'],
    },
    {
        slug: 'despues-de-comer',
        titulo: 'Despues de comer',
        icon: 'leaf',
        aliases: ['despues-de-comer', 'sobremesa', 'digestivo'],
    },
    {
        slug: 'relajarte',
        titulo: 'Para relajarte',
        icon: 'lotus',
        aliases: ['relajarte', 'relax', 'para-relajarte'],
    },
    {
        slug: 'noche',
        titulo: 'Para dormir',
        icon: 'moon',
        aliases: ['noche', 'dormir', 'para-dormir', 'pausa-de-noche', 'para-una-pausa-de-noche'],
    },
    {
        slug: 'compartir',
        titulo: 'Para compartir',
        icon: 'users',
        aliases: ['compartir', 'para-compartir'],
    },
    {
        slug: 'regalar',
        titulo: 'Para regalar',
        icon: 'gift',
        aliases: ['regalar', 'regalo', 'para-regalar'],
    },
]

export const momentosBySlug = Object.fromEntries(
    momentos.map((momento) => [momento.slug, momento]),
)

export const getMomentoBySlug = (slug) => momentosBySlug[slug]

export const getMomentosBySlugs = (slugs) =>
    slugs.map(getMomentoBySlug).filter(Boolean)
