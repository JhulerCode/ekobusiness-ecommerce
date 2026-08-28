import signature from '@/assets/home/lineas/signature.webp'
import piramidal from '@/assets/home/lineas/piramidal.webp'
import luxury from '@/assets/home/lineas/luxury.webp'
import tradicional from '@/assets/home/lineas/tradicional.webp'
import signatureDiferencia from '@/assets/lines/signature/diferencia.webp'
import piramidalDiferencia from '@/assets/lines/premium/diferencia.webp'
import luxuryDiferencia from '@/assets/lines/luxury/diferencia.webp'
import tradicionalDiferencia from '@/assets/lines/tradicional/diferencia.webp'
import { getMomentosBySlugs } from '@/data/momentos'

const defaultMomentos = getMomentosBySlugs(['manana', 'oficina', 'despues-de-comer', 'noche'])

export const lineas: Array<Record<string, any>> = [
    {
        slug: 'signature',
        title: 'Signature Black',
        aliases: ['Signature Black'],
        seoTitle: 'Signature Black | Sunka Herbal Tea',
        eyebrow: 'Signature Black / Sunka x Mabroc',
        description:
            'Una colección elaborada en Sri Lanka con té negro de Ceylán cuidadosamente seleccionado. Filtrantes de doble cámara con 2 g y sobres laminados que preservan el aroma, la frescura y la intensidad en cada taza.',
        heroTitle: 'Té negro de Ceylán para una experiencia superior.',
        heroImage: signature,
        heroImageAlt: 'Coleccion Signature Black',
        heroImagePosition: 'object-left md:object-left lg:object-top',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=signature', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Signature Black?',
        momentosSubtitle: 'Elige tu momento y encuentra el blend ideal para tu ritual.',
        momentos: defaultMomentos,
        productosDestacadosIds: [
            'b123560d-bfce-4c8a-996f-9db13f682358',
            'a3471eb0-ffbc-488c-b256-911d78592241',
            '8977694d-de6e-47f2-81f8-71ae3e84b6bf',
        ],
        diferencia: {
            label: 'La diferencia esta en la taza',
            title: 'Mas aroma, mas cuerpo y mejor liberacion de sabor.',
            description:
                'Una colección elaborada en Sri Lanka con té negro de Ceylán cuidadosamente seleccionado. Filtrantes de doble cámara con 2 g y sobres laminados que preservan el aroma, la frescura y la intensidad en cada taza.',
            image: signatureDiferencia,
            imageAlt: 'Coleccion Signature Black con taza servida',
            metrics: [
                {
                    titulo: '2 g',
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
                    texto: 'calidad 9001',
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
        diferenciales: [
            {
                titulo: 'Single Origin Sri Lanka',
                descripcion: 'Hojas seleccionadas por su intensidad, aroma y consistencia.',
                icon: 'leaf',
            },
            {
                titulo: 'Doble cámara',
                descripcion: 'Permite una mejor circulación del agua durante la infusión.',
                icon: 'layers',
            },
            {
                titulo: 'Aroma protegido',
                descripcion: 'El empaque ayuda a conservar el perfil aromático del blend.',
                icon: 'box',
            },
        ],
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
        aliases: ['Piramidal Premium'],
        seoTitle: 'Piramidal Premium | Sunka Herbal Tea',
        eyebrow: 'Piramidal Premium / Infusiones en piramide',
        heroTitle:
            'Infusiones piramidales para transformar cada taza en una experiencia extraordinaria.',
        description:
            'Más espacio para que cada ingrediente libere plenamente sus aromas y sabores. Una infusión equilibrada, intensa y de calidad Premium.',
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
        diferencia: {
            label: 'La diferencia esta en el formato',
            title: 'La diferencia se ve antes de probarla.',
            description:
                'Frente a los filtrantes convencionales, Sunka Premium reúne 2.5 g de hojas, frutas y especias en cortes visibles dentro de una malla piramidal compostable. Su mayor espacio permite que los ingredientes se expandan y liberen mejor sus aromas y sabores, logrando una infusión más compleja, definida y memorable.',
            image: piramidalDiferencia,
            imageAlt: 'Detalle linea Piramidal Premium',
            metrics: [
                {
                    titulo: '10',
                    texto: 'sobres seleccionados',
                    icon: 'box',
                    iconClass: 'scale-[0.86]',
                },
                {
                    titulo: 'Blend',
                    texto: 'perfil balanceado',
                    icon: 'leaf',
                    iconClass: 'scale-[0.82]',
                },
                {
                    titulo: 'Sostenibilidad',
                    texto: 'malla compostable',
                    icon: 'shield',
                    iconClass: 'scale-[1.05]',
                },
                {
                    titulo: 'Ritual',
                    texto: 'listo para servir',
                    icon: 'drop',
                    iconClass: 'scale-[0.86]',
                },
            ],
        },
        diferenciales: [
            {
                titulo: '2.5 g por pirámide',
                descripcion:
                    'Mayor gramaje para lograr una infusión más intensa, aromática y con mayor cuerpo.',
                icon: 'leaf',
            },
            {
                titulo: 'Malla piramidal compostable',
                descripcion:
                    'Brinda el espacio ideal para que los ingredientes se expandan y liberen plenamente su sabor.',
                icon: 'layers',
            },
            {
                titulo: 'Ingredientes naturales',
                descripcion:
                    'Una cuidada selección de hojas, frutas, flores y especias para crear blends equilibrados y expresivos.',
                icon: 'box',
            },
        ],
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
        aliases: ['Luxury', 'Luxury Collection'],
        seoTitle: 'Luxury Collection | Sunka Herbal Tea',
        eyebrow: 'Luxury Collection / Ediciones especiales',
        heroTitle: 'Creaciones excepcionales para momentos que merecen ser recordados.',
        description:
            'Blends cuidadosamente seleccionados, con perfiles refinados y una presentación impecable. Una colección concebida para regalar, celebrar y disfrutar sin prisa.',
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
        diferencia: {
            label: 'La diferencia esta en el detalle',
            title: 'Más que un té, la máxima expresión de Sunka',
            description:
                'Más allá de un té premium convencional, Sunka Luxury reúne 3 g de ingredientes visibles en cada pirámide compostable, blends de mayor complejidad y una presentación creada para cautivar. Desde el primer encuentro hasta la última nota en taza, cada detalle transforma el té en una experiencia excepcional.',
            image: luxuryDiferencia,
            imageAlt: 'Detalle Luxury Collection',
            metrics: [
                {
                    titulo: '10',
                    texto: 'sobres seleccionados',
                    icon: 'box',
                    iconClass: 'scale-[0.86]',
                },
                {
                    titulo: 'Blend',
                    texto: 'perfil balanceado',
                    icon: 'leaf',
                    iconClass: 'scale-[0.82]',
                },
                {
                    titulo: 'Sostenibilidad',
                    texto: 'malla compostable',
                    icon: 'shield',
                    iconClass: 'scale-[1.05]',
                },
                {
                    titulo: 'Orgánico',
                    texto: 'Sello USDA',
                    icon: 'leaf',
                    iconClass: 'scale-[0.82]',
                },
            ],
        },
        diferenciales: [
            {
                titulo: '3 g de intensidad superior',
                descripcion: 'Mayor gramaje para una infusión profunda, aromática y envolvente.',
                icon: 'leaf',
            },
            {
                titulo: 'Malla piramidal compostable',
                descripcion:
                    'Permite que cada ingrediente se expanda y revele plenamente sus aromas y matices.',
                icon: 'layers',
            },
            {
                titulo: 'Ingredientes excepcionales',
                descripcion:
                    'Una selección de hojas, frutas, flores y especias para crear blends refinados y memorables.',
                icon: 'box',
            },
        ],
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
        aliases: ['Tradicional', 'Tradicionales'],
        seoTitle: 'Tradicionales | Sunka Herbal Tea',
        eyebrow: 'Tradicionales / Sabores de siempre',
        heroTitle: 'El sabor natural que siempre quieres tener en casa.',
        description:
            'Infusiones elaboradas con ingredientes naturales, sin colorantes ni saborizantes. Sabores deliciosos y prácticos filtrantes tradicionales para disfrutar una taza de bienestar todos los días.',
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
        diferencia: {
            label: 'La diferencia esta en lo esencial',
            title: 'Lo tradicional no tiene por qué ser básico.',
            description:
                'Frente a una categoría que suele ofrecer las mismas opciones, Sunka Tradicional combina hierbas, frutas y especias para crear sabores definidos y una mayor variedad de infusiones. Alternativas naturales pensadas para acompañarte en cada momento del día.',
            image: tradicionalDiferencia,
            imageAlt: 'Detalle linea Tradicionales',
            metrics: [
                {
                    titulo: '20',
                    texto: 'sobres seleccionados',
                    icon: 'box',
                    iconClass: 'scale-[0.86]',
                },
                {
                    titulo: 'Blend',
                    texto: 'perfil balanceado',
                    icon: 'leaf',
                    iconClass: 'scale-[0.82]',
                },
                {
                    titulo: 'Origen',
                    texto: 'Insumos naturales',
                    icon: 'shield',
                    iconClass: 'scale-[1.05]',
                },
                {
                    titulo: 'Ritual',
                    texto: 'listo para servir',
                    icon: 'drop',
                    iconClass: 'scale-[0.86]',
                },
            ],
        },
        diferenciales: [
            {
                titulo: 'Productos de calidad',
                descripcion:
                    'Infusiones elaboradas con cuidado para ofrecer un sabor agradable y consistente en cada taza.',
                icon: 'leaf',
            },
            {
                titulo: 'Insumos naturales',
                descripcion:
                    'Una selección de hierbas, hojas, flores y especias para disfrutar todos los días.',
                icon: 'layers',
            },
            {
                titulo: 'Sin colorantes ni saborizantes',
                descripcion:
                    'El sabor y el aroma provienen naturalmente de los ingredientes de cada infusión.',
                icon: 'box',
            },
        ],
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
    {
        slug: 'sunka-cup',
        title: 'Sunka Cup',
        aliases: ['Sunka Cup'],
        seoTitle: 'Sunka Cup | Sunka Herbal Tea',
        eyebrow: 'Sunka Cup / Infusiones en taza',
        description:
            'Ingredientes naturales dosificados bajo un filtro vegetal integrado, dentro de un práctico vaso de 280 ml. Agrega agua caliente, mueve suavemente y disfruta una infusión Sunka donde estés.',
        heroTitle: 'Tu infusión ya viene en el vaso.',
        heroImage: signature,
        heroImageAlt: 'Linea Sunka Cup',
        heroImagePosition: 'object-center',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=sunka-cup', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Sunka Cup?',
        momentosSubtitle: 'Encuentra una infusion para cada pausa del dia.',
        momentos: defaultMomentos,
        productosDestacadosIds: [
            'ea26fe7f-084d-4d82-b323-ecf100933f2b',
            '30c9b2ae-d287-4bb4-ae97-740b82bb40e6',
            '3fda3a49-5caf-4434-8912-74accb530008',
        ],
        diferencia: {
            label: 'La diferencia esta en cada vaso',
            title: 'La innovación esta dentro del vaso.',
            description:
                'Sunka Cup integra 2 g de ingredientes naturales y un filtro de fibra vegetal dentro de un práctico vaso de 280 ml. Solo agrega agua caliente a 85 °C, mueve suavemente y espera de 2 a 3 minutos para disfrutar una infusión con todo su aroma y sabor, sin accesorios adicionales.',
            image: signatureDiferencia,
            imageAlt: 'Detalle linea Sunka Cup',
            metrics: [
                {
                    titulo: '2 g',
                    texto: 'de ingredientes naturales',
                    icon: 'leaf',
                    iconClass: 'scale-[0.82]',
                },
                {
                    titulo: 'Vegetal',
                    texto: 'filtro integrado en el vaso',
                    icon: 'shield',
                    iconClass: 'scale-[1.05]',
                },
                {
                    titulo: '2–3 min',
                    texto: 'para disfrutar tu infusión',
                    icon: 'drop',
                    iconClass: 'scale-[0.86]',
                },
                {
                    titulo: 'ISO',
                    texto: 'calidad 9001',
                    icon: 'shield',
                    iconClass: 'scale-[1.05]',
                },
            ],
        },
        diferenciales: [
            {
                titulo: 'Filtro vegetal integrado',
                descripcion:
                    'Retiene los ingredientes dentro del vaso mientras permite que sus aromas y sabores se liberen durante la infusión.',
                icon: 'layers',
            },
            {
                titulo: 'Porción lista para preparar',
                descripcion:
                    'Cada vaso contiene 2 g de ingredientes naturales cuidadosamente dosificados para lograr una taza práctica y consistente.',
                icon: 'leaf',
            },
            {
                titulo: 'Todo en un solo vaso',
                descripcion:
                    'El formato de 280 ml reúne recipiente, filtro e infusión para que solo necesites agregar agua caliente y disfrutar.',
                icon: 'box',
            },
        ],
        idealPara: {
            label: 'Una linea para ti',
            title: 'Sunka Cup es para ti si...',
            description:
                'Una forma práctica de disfrutar ingredientes naturales y una infusión bien preparada, incluso cuando tienes poco tiempo o estás fuera de casa.',
            points: [
                {
                    title: 'Estás siempre en movimiento',
                    text: 'Quieres llevar una infusión práctica a la oficina, la universidad o cualquier lugar de tu rutina.',
                    icon: 'mountain',
                },
                {
                    title: 'Buscas preparar sin complicaciones',
                    text: 'Prefieres agregar agua caliente y disfrutar directamente en el vaso, sin usar taza, colador ni accesorios.',
                    icon: 'drop',
                },
                {
                    title: 'Tienes poco tiempo',
                    text: 'Necesitas una pausa lista en pocos minutos sin renunciar al aroma y al sabor de una buena infusión.',
                    icon: 'ritual',
                },
                {
                    title: 'Eliges ingredientes naturales',
                    text: 'Valoras una porción dosificada con ingredientes naturales y un filtro de fibra vegetal integrado.',
                    icon: 'leaf',
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

const normalizeLineaName = (name: string = '') =>
    name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()

export const lineasByName = Object.fromEntries(
    lineas.flatMap((linea) =>
        [...new Set([linea.title, ...(linea.aliases ?? [])])].map((name) => [
            normalizeLineaName(name),
            linea,
        ]),
    ),
)

const coleccionesOrder = ['signature', 'piramidal', 'luxury', 'tradicional', 'sunka-cup']
const coleccionesPosition: Record<string, string> = {
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

export const getLineaBySlug = (slug: string) => lineasBySlug[slug]
export const getLineaByName = (name: string) => lineasByName[normalizeLineaName(name)]
