import signature from '@/assets/home/lineas/signature.webp'
import piramidal from '@/assets/home/lineas/piramidal.webp'
import luxury from '@/assets/home/lineas/luxury.webp'
import tradicional from '@/assets/home/lineas/tradicional.webp'
import granel from '@/assets/home/lineas/granel.webp'
import signatureDiferencia from '@/assets/lines/signature/diferencia.webp'
import piramidalDiferencia from '@/assets/lines/premium/diferencia.webp'
import luxuryDiferencia from '@/assets/lines/luxury/diferencia.webp'
import tradicionalDiferencia from '@/assets/lines/tradicional/diferencia.webp'
import preparacion from '@/assets/lines/luxury/preparacion.webp'
import { getMomentosBySlugs } from '@/data/momentos.js'

const defaultMomentos = getMomentosBySlugs(['manana', 'oficina', 'despues-de-comer', 'noche'])

const defaultPreparacionSteps = [
    {
        titulo: 'Agua caliente',
        texto: 'Usa una taza amplia para permitir una mejor expresion de aromas.',
        icon: 'drop',
    },
    {
        titulo: 'Infusiona 3 a 5 minutos',
        texto: 'Ajusta el tiempo segun la intensidad que quieras en tu taza.',
        icon: 'ritual',
    },
    {
        titulo: 'Completa tu momento',
        texto: 'Disfrutalo en una pausa lenta, en sobremesa o durante tu rutina diaria.',
        icon: 'moon',
    },
]

const defaultMetrics = [
    { titulo: '20', texto: 'sobres seleccionados', icon: 'box', iconClass: 'scale-[0.86]' },
    { titulo: 'Blend', texto: 'perfil balanceado', icon: 'leaf', iconClass: 'scale-[0.82]' },
    { titulo: 'ISO', texto: 'calidad consistente', icon: 'shield', iconClass: 'scale-[1.05]' },
    { titulo: 'Ritual', texto: 'listo para servir', icon: 'drop', iconClass: 'scale-[0.86]' },
]

export const lineas = [
    {
        slug: 'signature',
        title: 'Signature Black',
        seoTitle: 'Signature Black | Sunka Herbal Tea',
        eyebrow: 'Signature Black / Sunka x Mabroc',
        description:
            'Una coleccion de tes negros de Sri Lanka en formato doble camara, con mayor gramaje, mas aroma y una experiencia de taza mas intensa.',
        heroTitle: 'Te negro de origen para elevar tu ritual diario.',
        heroImage: signature,
        heroImageAlt: 'Coleccion Signature Black',
        heroImagePosition: 'object-left md:object-left lg:object-top',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=signature', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Armar pack', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Signature Black?',
        momentosSubtitle: 'Elige tu momento y encuentra el blend ideal para tu ritual.',
        momentos: defaultMomentos,
        productosDestacadosIds: [
            'b123560d-bfce-4c8a-996f-9db13f682358',
            'a3471eb0-ffbc-488c-b256-911d78592241',
            '8977694d-de6e-47f2-81f8-71ae3e84b6bf',
        ],
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Un ritual simple, preciso y elegante.',
            description:
                'Prepara Signature Black con calma y deja que el formato doble camara libere todo su aroma en cada taza.',
            image: preparacion,
            imageAlt: 'Ritual de preparacion Signature Black',
            icon: 'lotus',
            steps: [
                {
                    titulo: 'Agua caliente',
                    texto: 'Usa una taza amplia para permitir una mejor expresion del te negro.',
                    icon: 'drop',
                },
                {
                    titulo: 'Infusiona 3 a 5 minutos',
                    texto: 'Mas tiempo para una taza intensa, menos tiempo para un perfil mas suave.',
                    icon: 'ritual',
                },
                {
                    titulo: 'Completa tu momento',
                    texto: 'Ideal para oficina, sobremesa, tarde o una pausa lenta al final del dia.',
                    icon: 'moon',
                },
            ],
        },
        diferencia: {
            label: 'La diferencia esta en la taza',
            title: 'Mas aroma, mas cuerpo y mejor liberacion de sabor.',
            description:
                'El formato doble camara permite una infusion mas uniforme. El diferencial tecnico se comunica con lenguaje claro, premium y facil de leer.',
            image: signatureDiferencia,
            imageAlt: 'Coleccion Signature Black con taza servida',
            metrics: [
                {
                    titulo: '1.5 g',
                    texto: 'mayor gramaje por filtrante',
                    icon: 'drop',
                    iconClass: 'scale-[0.86]',
                },
                {
                    titulo: '20',
                    texto: 'sobres doble camara',
                    icon: 'box',
                    iconClass: 'scale-[0.86]',
                },
                {
                    titulo: 'ISO',
                    texto: 'calidad consistente',
                    icon: 'shield',
                    iconClass: 'scale-[1.05]',
                },
                {
                    titulo: 'RA',
                    texto: 'Rainforest Alliance',
                    icon: 'leaf',
                    iconClass: 'scale-[0.82]',
                },
            ],
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Signature Black es para ti si...',
            description:
                'Una coleccion creada para quienes buscan una taza con mas presencia y un ritual cotidiano con caracter.',
            points: [
                {
                    title: 'Buscas intensidad',
                    text: 'Prefieres una taza con cuerpo y presencia, ideal para empezar el dia o acompanar una pausa con caracter.',
                    icon: 'leaf',
                },
                {
                    title: 'Disfrutas aromas complejos',
                    text: 'Te atraen perfiles especiados, frutales y con una mayor profundidad en sabor.',
                    icon: 'botanical',
                },
                {
                    title: 'Valoras el ritual',
                    text: 'No buscas solo una bebida, sino un momento personal de pausa y disfrute.',
                    icon: 'ritual',
                },
                {
                    title: 'Te gusta lo premium',
                    text: 'Aprecias una presentacion cuidada, blends seleccionados y una experiencia mas sofisticada.',
                    icon: 'gift',
                },
            ],
        },
    },
    {
        slug: 'piramidal',
        title: 'Piramidal Premium',
        seoTitle: 'Piramidal Premium | Sunka Herbal Tea',
        eyebrow: 'Piramidal Premium / Infusiones en piramide',
        heroTitle: 'Infusiones amplias para un ritual mas expresivo.',
        description:
            'Una linea pensada para liberar hojas, flores y frutos con mas espacio, aroma y presencia en taza.',
        heroImage: piramidal,
        heroImageAlt: 'Linea Piramidal Premium',
        heroImagePosition: 'object-bottom md:object-center lg:object-bottom',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=piramidal', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Piramidal Premium?',
        momentosSubtitle: 'Encuentra una infusion para cada pausa del dia.',
        momentos: defaultMomentos,
        productosDestacadosIds: [
            '64d85e33-243c-4036-8030-bf9b3e141682',
            'f5d90ebb-38b1-4c10-844e-28b805927ad1',
            'e9dc6380-3c61-4e2b-a17d-7bb74b2e2d67',
        ],
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Deja que la piramide despliegue todo su perfil.',
            description:
                'Usa agua caliente y una taza amplia para que cada ingrediente tenga espacio de infusion.',
            image: preparacion,
            imageAlt: 'Preparacion de infusion piramidal',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en el formato',
            title: 'Mas espacio para una infusion limpia y aromaticamente completa.',
            description:
                'El sobre piramidal ayuda a que los ingredientes se expandan con naturalidad y entreguen una taza mas definida.',
            image: piramidalDiferencia,
            imageAlt: 'Detalle linea Piramidal Premium',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Piramidal Premium es para ti si...',
            description:
                'Una propuesta para disfrutar ingredientes expresivos y una taza que privilegia aroma, espacio y claridad.',
            points: [
                {
                    title: 'Quieres ver los ingredientes',
                    text: 'Disfrutas reconocer hojas, flores y frutos dentro de cada mezcla.',
                    icon: 'botanical',
                },
                {
                    title: 'Buscas mas aroma',
                    text: 'Prefieres una infusion amplia, limpia y con perfiles claramente definidos.',
                    icon: 'leaf',
                },
                {
                    title: 'Disfrutas la preparacion',
                    text: 'Te gusta observar como los ingredientes se despliegan dentro de la piramide.',
                    icon: 'ritual',
                },
                {
                    title: 'Exploras nuevos perfiles',
                    text: 'Quieres convertir una pausa cotidiana en una experiencia mas sensorial.',
                    icon: 'lotus',
                },
            ],
        },
    },
    {
        slug: 'luxury',
        title: 'Luxury Collection',
        seoTitle: 'Luxury Collection | Sunka Herbal Tea',
        eyebrow: 'Luxury Collection / Ediciones especiales',
        heroTitle: 'Una seleccion especial para regalar o disfrutar lento.',
        description:
            'Ediciones cuidadas para momentos especiales, con perfiles elegantes y una presentacion memorable.',
        heroImage: luxury,
        heroImageAlt: 'Linea Luxury Collection',
        heroImagePosition: 'object-top md:object-center lg:object-top',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=luxury', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Luxury Collection?',
        momentosSubtitle: 'Para regalos, sobremesas y rituales que merecen un gesto especial.',
        momentos: defaultMomentos,
        productosDestacadosIds: [
            'b9eb31f9-4159-4267-a52d-77444e392562',
            '8b40851b-e6c6-4607-936d-81be73a8f845',
            '623f2b51-f181-4085-9ee3-f9036198f774',
        ],
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Prepara cada taza como un pequeno regalo.',
            description:
                'Cuida el tiempo de infusion y deja que los aromas se abran antes del primer sorbo.',
            image: preparacion,
            imageAlt: 'Preparacion Luxury Collection',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en el detalle',
            title: 'Perfiles especiales, presentacion cuidada y una experiencia mas memorable.',
            description:
                'Luxury Collection esta pensada para elevar el momento: desde el empaque hasta la expresion final en taza.',
            image: luxuryDiferencia,
            imageAlt: 'Detalle Luxury Collection',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Luxury Collection es para ti si...',
            description:
                'Una seleccion pensada para hacer memorable una ocasion, tanto al regalarla como al servirla.',
            points: [
                {
                    title: 'Celebras lo especial',
                    text: 'Buscas perfiles elegantes para sobremesas, encuentros y ocasiones memorables.',
                    icon: 'lotus',
                },
                {
                    title: 'Disfrutas regalar',
                    text: 'Quieres compartir una experiencia cuidada desde el empaque hasta la taza.',
                    icon: 'gift',
                },
                {
                    title: 'Valoras los detalles',
                    text: 'Aprecias una presentacion refinada y una seleccion hecha con intencion.',
                    icon: 'personal',
                },
                {
                    title: 'Prefieres beber despacio',
                    text: 'Te atraen sabores especiales que invitan a detenerte y disfrutar el momento.',
                    icon: 'ritual',
                },
            ],
        },
    },
    {
        slug: 'tradicional',
        title: 'Tradicionales',
        seoTitle: 'Tradicionales | Sunka Herbal Tea',
        eyebrow: 'Tradicionales / Sabores de siempre',
        heroTitle: 'Sabores conocidos para volver a lo simple.',
        description:
            'Infusiones clasicas, honestas y cercanas para acompanar la rutina con bienestar cotidiano.',
        heroImage: tradicional,
        heroImageAlt: 'Linea Tradicionales',
        heroImagePosition: 'object-center',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=tradicional', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Tradicionales?',
        momentosSubtitle: 'Elige el sabor de siempre para la pausa que necesitas hoy.',
        momentos: defaultMomentos,
        productosDestacadosIds: [
            '615ad62c-a2a6-46bc-b4f4-89ce251c1442',
            'a3d94dff-f781-4389-9475-45979324b919',
            '079abd48-0241-4fac-9a90-8c6be2fa5a23',
        ],
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Una taza sencilla, calida y de todos los dias.',
            description:
                'Prepara tu infusion tradicional con calma y ajusta el tiempo segun el sabor que busques.',
            image: preparacion,
            imageAlt: 'Preparacion linea Tradicionales',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en lo esencial',
            title: 'Sabores familiares con una taza clara, amable y constante.',
            description:
                'La linea tradicional mantiene perfiles cercanos y faciles de integrar en cualquier rutina.',
            image: tradicionalDiferencia,
            imageAlt: 'Detalle linea Tradicionales',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Tradicionales es para ti si...',
            description:
                'Sabores cercanos y faciles de incorporar en una rutina que encuentra bienestar en lo esencial.',
            points: [
                {
                    title: 'Eliges sabores familiares',
                    text: 'Prefieres infusiones conocidas, suaves y faciles de disfrutar todos los dias.',
                    icon: 'leaf',
                },
                {
                    title: 'Buscas bienestar cotidiano',
                    text: 'Quieres una taza cercana para despues de comer, descansar o hacer una pausa.',
                    icon: 'lotus',
                },
                {
                    title: 'Valoras lo sencillo',
                    text: 'Disfrutas perfiles honestos y constantes sin necesidad de mayor complejidad.',
                    icon: 'drop',
                },
                {
                    title: 'Tienes un ritual diario',
                    text: 'Te gusta contar con una infusion confiable que encaje naturalmente en tu rutina.',
                    icon: 'ritual',
                },
            ],
        },
    },
    // {
    //     slug: 'granel',
    //     title: 'Granel',
    //     seoTitle: 'Granel | Sunka Herbal Tea',
    //     eyebrow: 'Granel / Elige a tu medida',
    //     heroTitle: 'Elige cantidad, mezcla y ritmo a tu manera.',
    //     description:
    //         'Una linea flexible para quienes disfrutan preparar sus infusiones con mayor libertad.',
    //     heroImage: granel,
    //     heroImageAlt: 'Linea Granel',
    //     heroImagePosition: 'object-center',
    //     heroCtas: [
    //         { label: 'Comprar coleccion', href: '/tienda?linea=granel', variant: 'primary' },
    //         { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
    //         { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
    //     ],
    //     momentosTitle: 'En que momento vas a vivir Granel?',
    //     momentosSubtitle: 'Arma tu ritual con la cantidad y el perfil que mejor encajen contigo.',
    //     momentos: defaultMomentos,
    //     productosDestacadosIds: [],
    //     preparacion: {
    //         label: 'Modo de preparacion',
    //         title: 'Mide, infusiona y ajusta cada taza a tu gusto.',
    //         description:
    //             'El formato granel te permite jugar con intensidad, cantidad y combinaciones segun el momento.',
    //         image: preparacion,
    //         imageAlt: 'Preparacion linea Granel',
    //         icon: 'lotus',
    //         steps: defaultPreparacionSteps,
    //     },
    //     diferencia: {
    //         label: 'La diferencia esta en la libertad',
    //         title: 'Mas control sobre cantidad, intensidad y forma de preparar.',
    //         description:
    //             'Granel esta pensado para quienes quieren personalizar cada taza sin perder la calidad del blend.',
    //         image: granel,
    //         imageAlt: 'Detalle linea Granel',
    //         metrics: defaultMetrics,
    //     },
    //     idealPara: {
    //         label: 'Una linea para ti',
    //         title: 'Granel es para ti si...',
    //         description:
    //             'Una linea flexible para quienes quieren intervenir en la preparacion y encontrar su propia medida.',
    //         points: [
    //             {
    //                 title: 'Quieres mayor control',
    //                 text: 'Disfrutas ajustar cantidad, intensidad y tiempo de infusion a tu gusto.',
    //                 icon: 'personal',
    //             },
    //             {
    //                 title: 'Te gusta experimentar',
    //                 text: 'Quieres probar mezclas y preparar cada taza de una manera diferente.',
    //                 icon: 'botanical',
    //             },
    //             {
    //                 title: 'Disfrutas lo artesanal',
    //                 text: 'Valoras medir, servir y participar activamente en cada paso del ritual.',
    //                 icon: 'ritual',
    //             },
    //             {
    //                 title: 'Eliges a tu medida',
    //                 text: 'Prefieres decidir cuanto comprar y adaptar cada preparacion a tu propio ritmo.',
    //                 icon: 'mountain',
    //             },
    //         ],
    //     },
    // },
]

export const lineasBySlug = Object.fromEntries(lineas.map((linea) => [linea.slug, linea]))

const coleccionesOrder = ['tradicional', 'signature', 'piramidal', 'luxury']
const coleccionesPosition = {
    signature: 'object-left',
    piramidal: 'object-bottom',
    luxury: 'object-top',
    tradicional: 'object-center',
}

export const colecciones = coleccionesOrder.map((slug) => {
    const linea = lineasBySlug[slug]

    return {
        nombre: linea.title,
        etiqueta: linea.eyebrow.split(' / ')[1],
        descripcion: linea.description,
        detalle: linea.eyebrow.split(' / ')[1],
        href: `/lineas/${linea.slug}`,
        imagen: linea.heroImage.src,
        posicion: coleccionesPosition[slug],
    }
})

export const getLineaBySlug = (slug) => lineasBySlug[slug]
