<template>
    <article class="order-lookup">
        <div class="order-lookup__mark" aria-hidden="true">#</div>

        <header>
            <p>Encuentra tu compra</p>
            <h2>Consulta tu pedido</h2>
            <span>
                Ingresa el número que recibiste en el correo de confirmación para ver su estado y
                todos los detalles.
            </span>
        </header>

        <form class="order-lookup__form" @submit.prevent="consultarPedido">
            <JdInput
                label="Número de pedido"
                :nec="true"
                v-model="codigo"
                placeholder="Ejemplo: 1762018452516211"
                :error="error"
                maxlength="30"
            />

            <p class="order-lookup__hint">Está formado por los dígitos indicados en tu pedido.</p>

            <button type="submit" class="order-lookup__button" :disabled="loading">
                <LoadingSpin
                    v-if="loading"
                    :rellenar="false"
                    :shadowBack="false"
                    scale="0.55"
                />
                <span>{{ loading ? 'Buscando pedido' : 'Consultar pedido' }}</span>
                <span v-if="!loading" aria-hidden="true">→</span>
            </button>
        </form>

        <footer>
            <p>
                ¿Necesitas ayuda? Escríbenos a
                <a :href="`mailto:${empresa.email_ventas}`">
                    {{ empresa.email_ventas }}
                </a>
            </p>
        </footer>
    </article>
</template>

<script>
import JdInput from './JdInput.vue'
import LoadingSpin from './LoadingSpin.vue'
import { get } from '../lib/api.js'

export default {
    components: {
        JdInput,
        LoadingSpin,
    },
    props: {
        empresa: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            codigo: '',
            error: '',
            loading: false,
        }
    },
    methods: {
        async consultarPedido() {
            this.error = ''
            if (!this.codigo.trim()) {
                this.error = 'Por favor, ingresa un número de pedido.'
                return
            }

            const qry = {
                fltr: { codigo: { op: 'Es', val: this.codigo.trim() } },
                cols: ['codigo'],
            }

            this.loading = true
            const res = await get('socio_pedidos', { qry })
            this.loading = false

            if (res.code < 0) {
                this.error = 'Algo salió mal.'
            }
            if (res.code > 0) {
                this.error = res.msg
            } else if (res.code == 0) {
                if (res.data.length > 0) {
                    window.location.href = `/pedidos/${res.data[0].id}`
                } else {
                    this.error = 'El pedido no existe.'
                }
            }
        },
    },
}
</script>

<style scoped>
.order-lookup {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 38px 38px 32px;
    border: 1px solid var(--sunka-sand);
    border-radius: 18px;
    background: var(--sunka-white);
    color: var(--sunka-ink);
    box-shadow: 0 28px 65px rgba(5, 16, 10, 0.24);
}

.order-lookup::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    background: var(--sunka-brass);
    content: '';
}

.order-lookup::after {
    position: absolute;
    top: -85px;
    right: -80px;
    width: 190px;
    height: 190px;
    border-radius: 50%;
    background: rgba(184, 138, 61, 0.06);
    content: '';
}

.order-lookup__mark {
    position: relative;
    z-index: 1;
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    margin-bottom: 23px;
    border-radius: 50%;
    background: var(--sunka-forest);
    color: var(--sunka-brass-light);
    font-family: var(--font-heading);
    font-size: 19px;
    font-weight: 600;
    box-shadow: 0 0 0 7px rgba(16, 32, 22, 0.06);
}

.order-lookup header {
    position: relative;
    z-index: 1;
}

.order-lookup header p {
    margin: 0;
    color: var(--sunka-brass);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}

.order-lookup h2 {
    margin: 8px 0 0;
    color: var(--sunka-forest);
    font-family: var(--font-heading);
    font-size: 30px;
    font-weight: 650;
    line-height: 1.12;
}

.order-lookup header > span {
    display: block;
    margin-top: 13px;
    color: var(--sunka-stone);
    font-size: 12px;
    line-height: 1.65;
}

.order-lookup__form {
    position: relative;
    z-index: 1;
    margin-top: 26px;
}

.order-lookup__hint {
    margin: 8px 0 0;
    color: var(--sunka-stone);
    font-size: 9px;
}

.order-lookup__button {
    display: inline-flex;
    width: 100%;
    min-height: 49px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 19px;
    border: 1px solid var(--sunka-brass);
    border-radius: 8px;
    background: var(--sunka-brass);
    color: var(--sunka-white);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.18s ease;
}

.order-lookup__button:hover:not(:disabled) {
    background: #c69a50;
}

.order-lookup__button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}

.order-lookup footer {
    position: relative;
    z-index: 1;
    margin-top: 27px;
    padding-top: 20px;
    border-top: 1px solid var(--sunka-sand);
    color: var(--sunka-stone);
    font-size: 10px;
    line-height: 1.6;
    text-align: center;
}

.order-lookup footer p {
    margin: 0;
}

.order-lookup footer a {
    color: var(--sunka-brass);
    font-weight: 650;
}

.order-lookup footer a:hover {
    text-decoration: underline;
}

@media (max-width: 640px) {
    .order-lookup {
        padding: 34px 22px 28px;
    }

    .order-lookup h2 {
        font-size: 26px;
    }
}
</style>
