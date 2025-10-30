export const host = import.meta.env.PUBLIC_API_URL

export const urls = {
    categorias: `${host}/store/categorias`,
    productos: `${host}/store/productos`,
    newsletter: `${host}/store/newsletter`,
    arco: `${host}/store/arco`,
    libro_reclamos: `${host}/store/libro-reclamos`,
    ubigeos: `${host}/store/ubigeos`,
    auth: `${host}/store/auth`,
    account: `${host}/store/account`,
    izipay: `${host}/store/izipay`,
    socio_pedidos: `${host}/store/socio-pedidos`,
}

function jmsg(type, msg) {
    console.log(type, msg)
}

function setHeaders(item, user_token) {
    const headers = {}

    if (user_token) {
        headers['Authorization'] = `Bearer ${user_token}`
    }

    if (item != null && !item.is_form_data) {
        headers['Content-Type'] = 'application/json'
    }

    return headers
}

function setFormData(item) {
    const formData = new FormData()

    const { archivo, archivos, ...resto } = item

    // Soporte para campos personalizados con archivos
    for (const [key, value] of Object.entries(resto)) {
        if (value instanceof File) {
            formData.append(key, value)
            delete resto[key]
        } else if (Array.isArray(value) && value.every(v => v instanceof File)) {
            value.forEach(v => formData.append(key, v))
            delete resto[key]
        }
    }

    if (archivo) formData.append('archivo', archivo)
    if (archivos && Array.isArray(archivos)) archivos.forEach(f => formData.append('archivos', f))

    formData.append('datos', JSON.stringify(resto))
    return formData
}

export async function get(endpoint, params = {}, user_token) {
    const link = new URL(endpoint.includes('http') ? endpoint : urls[endpoint])

    if (params && params.qry) {
        link.searchParams.set("qry", JSON.stringify(params.qry))
    }

    let response

    try {
        response = await fetch(link, {
            method: 'GET',
            headers: setHeaders(null, user_token),
        })
    } catch (error) {
        jmsg('error', error)
        return { code: -2 }
    }

    const res = await response.json()

    if (response.status == 401) {
        localStorage.removeItem('token')
        jmsg('error', res.msg)
        return { code: 401, msg: res.msg }
    }

    if (res.code == -1) jmsg('error', 'Algo salió mal')

    if (res.code > 0) jmsg('error', res.msg)

    return res
}

export async function post(endpoint, item, ms) {
    const link = endpoint.includes('http') ? endpoint : urls[endpoint]
    let response

    try {
        response = await fetch(link, {
            method: 'POST',
            headers: setHeaders(item, item.user_token),
            body: item.is_form_data ? setFormData(item) : JSON.stringify(item),
        })
    } catch (error) {
        jmsg('error', error)
        return { code: -2 }
    }

    const res = await response.json()

    if (response.status == 401) {
        localStorage.removeItem('token')
        jmsg('error', res.msg)
        return { code: 401, msg: res.msg }
    }

    if (res.code == -1) jmsg('error', 'Algo salió mal')

    if (res.code > 0) jmsg('error', res.msg)

    if (res.code == 0) {
        if (ms != false) {
            jmsg('success', ms == undefined ? 'Creado con éxito' : ms)
        }
    }

    return res
}

export async function patch(endpoint, item, ms) {
    const link = endpoint.includes('http') ? endpoint : urls[endpoint]
    let response

    try {
        response = await fetch(`${link}/${item.id}`, {
            method: 'PATCH',
            headers: setHeaders(item, item.user_token),
            body: item.formData ? setFormData(item) : JSON.stringify(item),
        })
    } catch (error) {
        jmsg('error', error)
        return { code: -2 }
    }

    const res = await response.json()

    if (response.status == 401) {
        localStorage.removeItem('token')
        jmsg('error', res.msg)
        return { code: 401, msg: res.msg }
    }

    if (res.code == -1) jmsg('error', 'Algo salió mal')

    if (res.code > 0) jmsg('error', res.msg)

    if (res.code == 0) {
        if (ms != false) {
            jmsg('success', ms == undefined ? 'Actualizado con éxito' : ms)
        }
    }

    return res
}

export async function delet(endpoint, item, ms) {
    const link = endpoint.includes('http') ? endpoint : urls[endpoint]
    let response

    try {
        response = await fetch(`${link}/${item.id}`, {
            method: 'DELETE',
            headers: setHeaders(item, item.user_token),
            body: JSON.stringify(item),
        })
    } catch (error) {
        jmsg('error', error)
        return { code: -2 }
    }

    const res = await response.json()

    if (response.status == 401) {
        localStorage.removeItem('token')
        jmsg('error', res.msg)
        return { code: 401, msg: res.msg }
    }

    if (res.code == -1) jmsg('error', 'Algo salió mal')

    if (res.code > 0) jmsg('error', res.msg)

    if (res.code == 0) {
        if (ms != false) {
            jmsg('success', ms == undefined ? 'Eliminado con éxito' : ms)
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
        cols: ['produccion_tipo', 'categoria', 'nombre', 'unidad', 'has_fv', 'precio', 'igv_afectacion', 'fotos'],
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