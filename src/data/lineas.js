import signature from '@/assets/home/lineas/signature.webp'
import piramidal from '@/assets/home/lineas/piramidal.webp'
import luxury from '@/assets/home/lineas/luxury.webp'
import tradicional from '@/assets/home/lineas/tradicional.webp'
import granel from '@/assets/home/lineas/granel.webp'

const productImageClasses = [
    'md:aspect-[4/5] lg:aspect-[5/6]',
    'md:aspect-[4/6] lg:aspect-[5/7]',
    'md:aspect-[4/5] lg:aspect-[5/6]',
]

const signatureProducts = [
    ['Vainilla Chai', 'Calido, especiado y cremoso', '/producto/vainilla-chai'],
    ['Raspberry', 'Frutal, intenso y elegante', '/producto/raspberry'],
    ['Acai Berry', 'Profundo, frutal y contemporaneo', '/producto/acai-berry'],
]

const buildProducts = (items, image, imageAlt) =>
    items.map(([nombre, perfil, href], index) => ({
        nombre,
        perfil,
        href,
        image,
        imageAlt,
        imageClass: productImageClasses[index] || productImageClasses[0],
    }))

const defaultMomentos = [
    { slug: 'manana', titulo: 'Para empezar el dia', icon: 'sun' },
    { slug: 'oficina', titulo: 'Para la oficina', icon: 'briefcase' },
    { slug: 'despues-de-comer', titulo: 'Despues de comer', icon: 'leaf' },
    { slug: 'noche', titulo: 'Para una pausa de noche', icon: 'moon' },
]

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
        productosDestacados: buildProducts(
            signatureProducts,
            signature,
            'Coleccion Signature Black',
        ),
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Un ritual simple, preciso y elegante.',
            description:
                'Prepara Signature Black con calma y deja que el formato doble camara libere todo su aroma en cada taza.',
            image: signature,
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
            image: signature,
            imageAlt: 'Coleccion Signature Black con taza servida',
            metrics: [
                { titulo: '1.5 g', texto: 'mayor gramaje por filtrante', icon: 'drop', iconClass: 'scale-[0.86]' },
                { titulo: '20', texto: 'sobres doble camara', icon: 'box', iconClass: 'scale-[0.86]' },
                { titulo: 'ISO', texto: 'calidad consistente', icon: 'shield', iconClass: 'scale-[1.05]' },
                { titulo: 'RA', texto: 'Rainforest Alliance', icon: 'leaf', iconClass: 'scale-[0.82]' },
            ],
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Signature Black es para ti si...',
            description:
                'Una coleccion creada para quienes buscan una taza con mas presencia y un ritual cotidiano con caracter.',
            points: [
                'Prefieres sabores con cuerpo, intensidad y aromas especiados o frutales.',
                'Buscas una infusion que acompane el inicio del dia, la oficina o una sobremesa pausada.',
                'Valoras el origen del te negro, una presentacion premium y una preparacion consistente.',
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
        productosDestacados: buildProducts(
            [
                ['Piramidal Relax', 'Suave, herbal y envolvente', '/producto/piramidal-relax'],
                ['Piramidal Digestivo', 'Fresco, limpio y balanceado', '/producto/piramidal-digestivo'],
                ['Piramidal Frutos Rojos', 'Frutal, brillante y aromatico', '/producto/piramidal-frutos-rojos'],
            ],
            piramidal,
            'Productos Piramidal Premium',
        ),
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Deja que la piramide despliegue todo su perfil.',
            description:
                'Usa agua caliente y una taza amplia para que cada ingrediente tenga espacio de infusion.',
            image: piramidal,
            imageAlt: 'Preparacion de infusion piramidal',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en el formato',
            title: 'Mas espacio para una infusion limpia y aromaticamente completa.',
            description:
                'El sobre piramidal ayuda a que los ingredientes se expandan con naturalidad y entreguen una taza mas definida.',
            image: piramidal,
            imageAlt: 'Detalle linea Piramidal Premium',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Piramidal Premium es para ti si...',
            description:
                'Una propuesta para disfrutar ingredientes expresivos y una taza que privilegia aroma, espacio y claridad.',
            points: [
                'Te gusta reconocer hojas, flores y frutos dentro de cada mezcla.',
                'Buscas aromas definidos y una infusion que se despliegue con amplitud.',
                'Disfrutas convertir una pausa breve en un ritual mas sensorial.',
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
        productosDestacados: buildProducts(
            [
                ['Luxury Selection', 'Elegante, aromatico y fino', '/producto/luxury-selection'],
                ['Luxury Cacao', 'Profundo, calido y sedoso', '/producto/luxury-cacao'],
                ['Luxury Floral', 'Delicado, fresco y luminoso', '/producto/luxury-floral'],
            ],
            luxury,
            'Productos Luxury Collection',
        ),
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Prepara cada taza como un pequeno regalo.',
            description:
                'Cuida el tiempo de infusion y deja que los aromas se abran antes del primer sorbo.',
            image: luxury,
            imageAlt: 'Preparacion Luxury Collection',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en el detalle',
            title: 'Perfiles especiales, presentacion cuidada y una experiencia mas memorable.',
            description:
                'Luxury Collection esta pensada para elevar el momento: desde el empaque hasta la expresion final en taza.',
            image: luxury,
            imageAlt: 'Detalle Luxury Collection',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Luxury Collection es para ti si...',
            description:
                'Una seleccion pensada para hacer memorable una ocasion, tanto al regalarla como al servirla.',
            points: [
                'Buscas perfiles elegantes para sobremesas y celebraciones especiales.',
                'Quieres regalar una experiencia cuidada desde el empaque hasta la taza.',
                'Valoras los detalles, la presentacion y los sabores que invitan a beber despacio.',
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
        productosDestacados: buildProducts(
            [
                ['Manzanilla', 'Suave, floral y reconfortante', '/producto/manzanilla'],
                ['Anis', 'Calido, dulce y digestivo', '/producto/anis'],
                ['Hierba Luisa', 'Citrica, fresca y ligera', '/producto/hierba-luisa'],
            ],
            tradicional,
            'Productos Tradicionales',
        ),
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Una taza sencilla, calida y de todos los dias.',
            description:
                'Prepara tu infusion tradicional con calma y ajusta el tiempo segun el sabor que busques.',
            image: tradicional,
            imageAlt: 'Preparacion linea Tradicionales',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en lo esencial',
            title: 'Sabores familiares con una taza clara, amable y constante.',
            description:
                'La linea tradicional mantiene perfiles cercanos y faciles de integrar en cualquier rutina.',
            image: tradicional,
            imageAlt: 'Detalle linea Tradicionales',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Tradicionales es para ti si...',
            description:
                'Sabores cercanos y faciles de incorporar en una rutina que encuentra bienestar en lo esencial.',
            points: [
                'Prefieres infusiones conocidas, suaves y faciles de disfrutar todos los dias.',
                'Buscas una taza sencilla para despues de comer, descansar o hacer una pausa.',
                'Valoras la constancia y los sabores familiares por encima de la complejidad.',
            ],
        },
    },
    {
        slug: 'granel',
        title: 'Granel',
        seoTitle: 'Granel | Sunka Herbal Tea',
        eyebrow: 'Granel / Elige a tu medida',
        heroTitle: 'Elige cantidad, mezcla y ritmo a tu manera.',
        description:
            'Una linea flexible para quienes disfrutan preparar sus infusiones con mayor libertad.',
        heroImage: granel,
        heroImageAlt: 'Linea Granel',
        heroImagePosition: 'object-center',
        heroCtas: [
            { label: 'Comprar coleccion', href: '/tienda?linea=granel', variant: 'primary' },
            { label: 'Descubre tu momento', href: '#momentos', variant: 'secondary' },
            { label: 'Ver destacados', href: '#productos', variant: 'ghost' },
        ],
        momentosTitle: 'En que momento vas a vivir Granel?',
        momentosSubtitle: 'Arma tu ritual con la cantidad y el perfil que mejor encajen contigo.',
        momentos: defaultMomentos,
        productosDestacados: buildProducts(
            [
                ['Granel Serenidad', 'Herbal, suave y aromatico', '/producto/granel-serenidad'],
                ['Granel Energia', 'Vivo, fresco y persistente', '/producto/granel-energia'],
                ['Granel Digestivo', 'Ligero, limpio y balanceado', '/producto/granel-digestivo'],
            ],
            granel,
            'Productos Granel',
        ),
        preparacion: {
            label: 'Modo de preparacion',
            title: 'Mide, infusiona y ajusta cada taza a tu gusto.',
            description:
                'El formato granel te permite jugar con intensidad, cantidad y combinaciones segun el momento.',
            image: granel,
            imageAlt: 'Preparacion linea Granel',
            icon: 'lotus',
            steps: defaultPreparacionSteps,
        },
        diferencia: {
            label: 'La diferencia esta en la libertad',
            title: 'Mas control sobre cantidad, intensidad y forma de preparar.',
            description:
                'Granel esta pensado para quienes quieren personalizar cada taza sin perder la calidad del blend.',
            image: granel,
            imageAlt: 'Detalle linea Granel',
            metrics: defaultMetrics,
        },
        idealPara: {
            label: 'Una linea para ti',
            title: 'Granel es para ti si...',
            description:
                'Una linea flexible para quienes quieren intervenir en la preparacion y encontrar su propia medida.',
            points: [
                'Disfrutas ajustar cantidad, intensidad y tiempo de infusion a tu gusto.',
                'Quieres experimentar con mezclas y preparar cada taza de una manera distinta.',
                'Prefieres tener mayor control sobre tu ritual sin renunciar a un blend cuidado.',
            ],
        },
    },
]

export const lineasBySlug = Object.fromEntries(lineas.map((linea) => [linea.slug, linea]))

export const getLineaBySlug = (slug) => lineasBySlug[slug]
