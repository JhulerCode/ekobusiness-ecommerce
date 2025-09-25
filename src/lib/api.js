const host = "http://localhost:4000"

async function apiGet(endpoint, params = {}) {
    const url = new URL(`${host}/store/${endpoint}`)

    if (params.qry) {
        url.searchParams.set("qry", JSON.stringify(params.qry))
    }

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`Error al obtener ${endpoint}: ${res.status}`)
    }

    return res.json()
}

export async function getCategoriasDestacadas() {
    const qry = {
        fltr: { tipo: { op: "Es", val: 2 } },
        cols: ["nombre", "imagen"],
    }

    const response = await apiGet("categorias", { qry })

    return response.data.map((cat) => ({
        id: cat.id,
        nombre: cat.nombre,
        descripcion: 'Prueba la excelencia y dsifruta con sunka',
        slug: cat.nombre.toLowerCase().replace(/\s+/g, "-"),
        // imagen: `${host}/uploads/${cat.imagen}`,
        imagen: 'https://sunka.pe/wp-content/uploads/2022/04/MGC15SL-3.jpg',
    }))
}

export async function getProductosDestacados() {
    const qry = {
        fltr: {
            tipo: { op: "Es", val: 2 },
            nombre: { op: "Contiene", val: 'jengibre' },
        },
        cols: ['nombre', 'precio', 'fotos'],
    }

    const response = await apiGet("productos", { qry })

    return response.data.map((prod) => ({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio.toFixed(2),
        precio_antes: (10).toFixed(2),
        imagen: `${host}/uploads/${prod.fotos == null ? '' : prod.fotos[0].id}`,
    }))
}