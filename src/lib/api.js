export const host = import.meta.env.PUBLIC_API_URL

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

export async function getCategorias(filtros_extra) {
    const qry = {
        fltr: {
            activo: { op: "Es", val: true },
            tipo: { op: "Es", val: 2 },
        },
        cols: ['id', 'nombre', 'fotos', 'descripcion'],
    }

    if (filtros_extra) {
        qry.fltr = { ...qry.fltr, ...filtros_extra }
    }

    const response = await apiGet("categorias", { qry })

    return response.data.map((cat) => ({
        ...cat,
        foto: cat.fotos[0].url,
        foto2: cat.fotos[1].url,
        slug: cat.nombre.toLowerCase().replace(/\s+/g, "-"),
    }))
}

export async function getProductos(fltr, incl, cols) {
    const qry = {
        fltr: {
            activo: { op: "Es", val: true },
            tipo: { op: "Es", val: 2 },
            marca: { op: "Es", val: "SUNKA" },
            is_combo: { op: "Es", val: false },
        },
        cols: ['nombre', 'produccion_tipo', 'categoria', 'precio', 'fotos'],
        incl: []
    }

    if (fltr) {
        qry.fltr = { ...qry.fltr, ...fltr }
    }

    if (incl) {
        qry.incl = incl
    }

    if (cols) {
        qry.cols.push(...cols)
    }
    // console.log(qry)
    const response = await apiGet("productos", { qry })
    // console.log(response.data)
    return response.data.map((prod) => ({
        ...prod,
        precio: Number(prod.precio).toFixed(2),
        precio_antes: (10).toFixed(2),
        foto: prod.fotos[0].url,
        slug: prod.id,
    }))
}