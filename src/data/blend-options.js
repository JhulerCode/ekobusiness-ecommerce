// Opciones locales del constructor. El configurador no depende de la API para
// poder renderizarse y mantener una experiencia consistente en el ecommerce.
export const formatosBlend = [
    {
        id: 'blend-50',
        nombre: '50 g',
        contenido_neto: 50,
        unidad: 'g',
        descripcion: 'aprox. 20 tazas',
    },
    {
        id: 'blend-75',
        nombre: '75 g',
        contenido_neto: 75,
        unidad: 'g',
        descripcion: 'aprox. 30 tazas',
    },
    {
        id: 'blend-100',
        nombre: '100 g',
        contenido_neto: 100,
        unidad: 'g',
        descripcion: 'aprox. 40 tazas',
    },
];

export const empaquesBlend = [
    { id: 'bolsa', nombre: 'Bolsa', precio: 5, descripcion: 'personalizable' },
    { id: 'lata', nombre: 'Lata', precio: 9, descripcion: 'reutilizable' },
    { id: 'caja', nombre: 'Caja', precio: 6.5, descripcion: 'regalo consciente' },
];

export const hierbasBaseBlend = [
    {
        id: 'hierba-luisa',
        nombre: 'Hierba Luisa',
        descripcion: 'Fresca · cítrica · ligera',
        perfil: 'Cítrica y refrescante',
        precio: 42,
        icono: '◒',
        color: 'sage',
    },
    {
        id: 'manzanilla',
        nombre: 'Manzanilla',
        descripcion: 'Floral · suave · dulce',
        perfil: 'Floral y reconfortante',
        precio: 48,
        icono: '✽',
        color: 'gold',
    },
    {
        id: 'te-verde',
        nombre: 'Té Verde',
        descripcion: 'Vegetal · limpio · con cuerpo',
        perfil: 'Vegetal y elegante',
        precio: 55,
        icono: '◐',
        color: 'sage',
    },
    {
        id: 'jamaica',
        nombre: 'Jamaica',
        descripcion: 'Ácida · frutal · intensa',
        perfil: 'Frutal y vibrante',
        precio: 39,
        icono: '♢',
        color: 'rose',
    },
    {
        id: 'ceylan',
        nombre: 'Ceylán',
        descripcion: 'Malteado · cálido · con cuerpo',
        perfil: 'Intenso y especiado',
        precio: 58,
        icono: '◉',
        color: 'clay',
    },
    {
        id: 'muna',
        nombre: 'Muña',
        descripcion: 'Mentolada · fresca · andina',
        perfil: 'Herbal y refrescante',
        precio: 47,
        icono: '◔',
        color: 'sage',
    },
    {
        id: 'te-negro',
        nombre: 'Té Negro',
        descripcion: 'Robusto · aromático · profundo',
        perfil: 'Cuerpo y carácter',
        precio: 57,
        icono: '◐',
        color: 'clay',
    },
    {
        id: 'toronjil',
        nombre: 'Toronjil',
        descripcion: 'Cítrico · suave · calmante',
        perfil: 'Cítrico y sereno',
        precio: 45,
        icono: '✦',
        color: 'sage',
    },
];

export const complementosBlend = [
    { id: 'menta', nombre: 'Menta', descripcion: 'Complemento herbal y fresco', perfil: 'Refrescante', precio: 44, icono: '◔', color: 'sage' },
    { id: 'cedron', nombre: 'Cedrón', descripcion: 'Cítrico · limpio · aromático', perfil: 'Aromático', precio: 46, icono: '◒', color: 'sage' },
    { id: 'lavanda', nombre: 'Lavanda', descripcion: 'Floral · envolvente · serena', perfil: 'Floral', precio: 74, icono: '✦', color: 'lilac' },
    { id: 'romero', nombre: 'Romero', descripcion: 'Resinoso · herbal · intenso', perfil: 'Herbal y profundo', precio: 49, icono: '✧', color: 'sage' },
    { id: 'tomillo', nombre: 'Tomillo', descripcion: 'Terroso · aromático · cálido', perfil: 'Aromático y cálido', precio: 51, icono: '✣', color: 'clay' },
    { id: 'boldo', nombre: 'Boldo', descripcion: 'Herbal · amargo · persistente', perfil: 'Herbal intenso', precio: 45, icono: '◒', color: 'sage' },
    { id: 'culen', nombre: 'Culén', descripcion: 'Herbal · fresco · ligeramente dulce', perfil: 'Herbal y suave', precio: 48, icono: '◒', color: 'sage' },
    { id: 'paico', nombre: 'Paico', descripcion: 'Aromático · intenso · andino', perfil: 'Herbal y profundo', precio: 46, icono: '✧', color: 'clay' },
];

export const frutasBlend = [
    { id: 'manzana', nombre: 'Manzana', descripcion: 'Dulce · suave · familiar', perfil: 'Dulce', precio: 52, icono: '●', color: 'rose' },
    { id: 'naranja', nombre: 'Naranja', descripcion: 'Cítrica · luminosa · fresca', perfil: 'Cítrica', precio: 49, icono: '●', color: 'gold' },
    { id: 'maracuya', nombre: 'Maracuyá', descripcion: 'Ácida · tropical · intensa', perfil: 'Tropical', precio: 68, icono: '✺', color: 'gold' },
    { id: 'pina', nombre: 'Piña', descripcion: 'Tropical · dulce · luminosa', perfil: 'Tropical', precio: 65, icono: '✺', color: 'gold' },
];

export const especiasBlend = [
    { id: 'jengibre', nombre: 'Jengibre', descripcion: 'Complemento cálido y especiado', perfil: 'Cálido', precio: 58, icono: '✧', color: 'clay' },
    { id: 'canela', nombre: 'Canela', descripcion: 'Dulce · cálida · profunda', perfil: 'Especiado', precio: 45, icono: '⌁', color: 'clay' },
    { id: 'cardamomo', nombre: 'Cardamomo', descripcion: 'Fresco · floral · complejo', perfil: 'Complejo', precio: 92, icono: '✦', color: 'sage' },
    { id: 'anís', nombre: 'Anís', descripcion: 'Dulce · intenso · herbal', perfil: 'Herbal', precio: 51, icono: '✣', color: 'lilac' },
    { id: 'clavo', nombre: 'Clavo', descripcion: 'Intenso · cálido · aromático', perfil: 'Especiado', precio: 64, icono: '✦', color: 'clay' },
    { id: 'curcuma', nombre: 'Cúrcuma', descripcion: 'Terrosa · cálida · brillante', perfil: 'Terroso', precio: 53, icono: '✺', color: 'gold' },
    { id: 'pimienta', nombre: 'Pimienta', descripcion: 'Picante · profunda · vibrante', perfil: 'Intenso', precio: 61, icono: '•', color: 'rose' },
];

export const ingredientesBlend = [
    ...hierbasBaseBlend.map((item) => ({ ...item, mp_tipo: '1' })),
    ...complementosBlend.map((item) => ({ ...item, mp_tipo: '2' })),
    ...frutasBlend.map((item) => ({ ...item, mp_tipo: '3' })),
    ...especiasBlend.map((item) => ({ ...item, mp_tipo: '4' })),
];
