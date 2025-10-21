export const host = import.meta.env.PUBLIC_API_URL

const urls = {
    categorias: `${host}/store/categorias`,
    productos: `${host}/store/productos`,
    newsletter: `${host}/store/newsletter`,
    arco: `${host}/store/arco`,
}

function jmsg(type, msg) {
    console.log(type, msg)
}

async function get(endpoint, params = {}) {
    const url = new URL(urls[endpoint])

    if (params.qry) {
        url.searchParams.set("qry", JSON.stringify(params.qry))
    }

    let response
    try {
        response = await fetch(url, {
            method: 'GET',
        })
    } catch (error) {
        jmsg('error', error)
        return { code: -2 }
    }

    const data = await response.json()

    if (data.code == -1) jmsg('error', 'Algo salió mal')

    if (data.code > 0) jmsg('error', data.msg)

    return data

    // const res = await fetch(url)
    // if (!res.ok) {
    //     throw new Error(`Error al obtener ${endpoint}: ${res.status}`)
    // }

    // return res.json()
}

export async function post(endpoint, item, ms) {
    let query

    try {
        query = await fetch(urls[endpoint], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        })
    } catch (error) {
        jmsg('error', error)
        return { code: -2 }
    }

    const res = await query.json()

    if (res.code == -1) jmsg('error', 'Algo salió mal')

    if (res.code > 0) jmsg('error', res.msg)

    if (res.code == 0) {
        if (ms != false) {
            jmsg('success', ms == undefined ? 'Creado con éxito' : ms)
        }
    }

    return res
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

    const res = await get("categorias", { qry })

    if (res.code != 0) return []

    return res.data.map((cat) => ({
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
    const res = await get("productos", { qry })
    // console.log(data)
    if (res.code != 0) return []

    return res.data.map((prod) => ({
        ...prod,
        precio: Number(prod.precio).toFixed(2),
        precio_antes: (10).toFixed(2),
        foto: prod.fotos[0].url,
        slug: prod.id,
    }))
}