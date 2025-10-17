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

export async function getCategorias(filtros_extra) {
    const qry = {
        fltr: { tipo: { op: "Es", val: 2 } },
        cols: ['id', 'nombre', 'imagen', 'descripcion'],
    }

    if (filtros_extra) {
        qry.fltr = { ...qry.fltr, ...filtros_extra }
    }

    const response = await apiGet("categorias", { qry })

    return response.data.map((cat) => ({
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        foto: `${host}/uploads/${cat.imagen}`,
        foto2: 'https://sunka.pe/wp-content/uploads/2022/04/MGC15SL-4.jpg',
        slug: cat.nombre.toLowerCase().replace(/\s+/g, "-"),
    }))
}

export async function getProductos(fltr, incl, cols) {
    const qry = {
        fltr: {
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
    console.log(qry)
    const response = await apiGet("productos", { qry })
    // console.log(response.data)
    return response.data.map((prod) => ({
        ...prod,
        // id: prod.id,
        // nombre: prod.nombre,
        // produccion_tipo: prod.produccion_tipo,
        // categoria: prod.categoria,
        // categoria1: prod.categoria1,
        precio: Number(prod.precio).toFixed(2),
        precio_antes: (10).toFixed(2),
        foto: `${host}/uploads/${prod.fotos == null ? '' : prod.fotos[0].id}`,
        fotos: prod.fotos
            ? prod.fotos.map((f) => ({
                ...f,
                url: `${host}/uploads/${f.id}`,
            }))
            : [],
        slug: prod.id,

        // descripcion: prod.descripcion,
        // contenido_neto: prod.contenido_neto,
        // ingredientes: prod.ingredientes,
        // beneficios: prod.beneficios,
        // dimenciones: prod.dimenciones,
        // envase_tipo: prod.envase_tipo,
    }))
}