export const host = import.meta.env.PUBLIC_API_URL

export const urls = {
    account: `${host}/ecommerce/account`,
    arco: `${host}/ecommerce/arco`,
    auth: `${host}/ecommerce/auth`,
    categorias: `${host}/ecommerce/categorias`,
    insumos: `${host}/ecommerce/insumos`,
    izipay: `${host}/ecommerce/izipay`,
    libro_reclamos: `${host}/ecommerce/libro-reclamos`,
    lineas: `${host}/ecommerce/lineas`,
    newsletter: `${host}/ecommerce/newsletter`,
    productos: `${host}/ecommerce/productos`,
    sistema: `${host}/ecommerce/sistema`,
    socio_pedidos: `${host}/ecommerce/pedidos`,
    ubigeos: `${host}/ecommerce/ubigeos`,
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

    headers['x-empresa'] = '1'

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



export function formatLineas(datos) {
    return datos.map((a) => ({
        ...a,
        foto: a.fotos && a.fotos.length > 0 ? a.fotos[0].url : null,
        video: a.fotos && a.fotos.length > 0 ? a.fotos[1].url : null,
        slug: a.nombre.toLowerCase().replace(/\s+/g, "-"),
    }))
}

export function formatCategorias(datos) {
    return datos.map((a) => ({
        ...a,
        foto: a.fotos && a.fotos.length > 0 ? a.fotos[0].url : null,
        foto2: a.fotos && a.fotos.length > 0 ? a.fotos[1].url : null,
        slug: a.nombre.toLowerCase().replace(/\s+/g, "-"),
    }))
}

export function formatProductos(datos) {
    return datos.map((prod) => ({
        ...prod,
        precio: Number(prod.precio).toFixed(2),
        precio_anterior: prod.precio_anterior ? Number(prod.precio_anterior).toFixed(2) : null,
        foto: prod.fotos[0]?.url,
        slug: prod.id,
    }))
}