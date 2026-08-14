<template>
    <section class="tienda-catalog bg-sunka-white">
        <div class="mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
            <div
                ref="gridTop"
                class="flex scroll-mt-24 flex-col gap-5 border-y border-sunka-ink/10 py-5 xl:flex-row xl:items-center xl:justify-between"
            >
                <div class="flex flex-wrap items-center gap-2.5">
                    <span class="mr-2 text-xs font-medium text-sunka-ink/65">Filtrar por:</span>
                    <span class="mr-2 text-xs text-sunka-ink/55">{{ productosFiltrados.length }} productos</span>

                    <label class="catalog-select">
                        <span class="sr-only">Momento</span>
                        <select
                            v-model="selectedMoment"
                            aria-label="Filtrar por momento"
                            @focus="openDropdown = 'moment'"
                            @blur="openDropdown = ''"
                        >
                            <option value="">Momento</option>
                            <option v-for="momento in momentos" :key="momento.slug" :value="momento.slug">
                                {{ momento.titulo }}
                            </option>
                        </select>
                        <ChevronUp v-if="openDropdown === 'moment'" class="catalog-select-icon" aria-hidden="true" />
                        <ChevronDown v-else class="catalog-select-icon" aria-hidden="true" />
                    </label>

                    <label class="catalog-select">
                        <span class="sr-only">Línea</span>
                        <select
                            :value="filtroLineas[0] || ''"
                            aria-label="Filtrar por línea"
                            @focus="openDropdown = 'line'"
                            @blur="openDropdown = ''"
                            @change="setLinea($event.target.value)"
                        >
                            <option value="">Línea</option>
                            <option v-for="linea in lineas" :key="linea.id" :value="linea.id">
                                {{ linea.nombre }}
                            </option>
                        </select>
                        <ChevronUp v-if="openDropdown === 'line'" class="catalog-select-icon" aria-hidden="true" />
                        <ChevronDown v-else class="catalog-select-icon" aria-hidden="true" />
                    </label>

                    <label class="catalog-select">
                        <span class="sr-only">Precio</span>
                        <select
                            v-model="priceRange"
                            aria-label="Filtrar por precio"
                            @focus="openDropdown = 'price'"
                            @blur="openDropdown = ''"
                            @change="setPriceRange"
                        >
                            <option value="">Precio</option>
                            <option value="0-10">Hasta S/ 10</option>
                            <option value="10-20">S/ 10 – S/ 20</option>
                            <option value="20+">Más de S/ 20</option>
                        </select>
                        <ChevronUp v-if="openDropdown === 'price'" class="catalog-select-icon" aria-hidden="true" />
                        <ChevronDown v-else class="catalog-select-icon" aria-hidden="true" />
                    </label>
                </div>

                <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2 text-xs text-sunka-ink/65">
                        <span>Ordenar por:</span>
                        <span class="catalog-select catalog-order">
                            <select
                                v-model="orden"
                                aria-label="Ordenar productos"
                                @focus="openDropdown = 'order'"
                                @blur="openDropdown = ''"
                            >
                                <option value="nombre-asc">Recomendados</option>
                                <option value="nombre-desc">Nombre Z–A</option>
                                <option value="precio-asc">Precio menor</option>
                                <option value="precio-desc">Precio mayor</option>
                            </select>
                            <ChevronUp v-if="openDropdown === 'order'" class="catalog-select-icon" aria-hidden="true" />
                            <ChevronDown v-else class="catalog-select-icon" aria-hidden="true" />
                        </span>
                    </label>
                    <div class="hidden items-center gap-1 sm:flex" aria-hidden="true">
                        <span class="catalog-view-button catalog-view-button-active">▦</span>
                        <span class="catalog-view-button">☷</span>
                    </div>
                </div>
            </div>

            <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-4">
                <button v-if="selectedMoment" class="catalog-chip" @click="selectedMoment = ''">
                    {{ selectedMomentLabel }} <span aria-hidden="true">×</span>
                </button>
                <button v-if="filtroLineas.length" class="catalog-chip" @click="setLinea('')">
                    {{ selectedLineaLabel }} <span aria-hidden="true">×</span>
                </button>
                <button v-if="priceRange" class="catalog-chip" @click="clearPrice">
                    {{ priceRangeLabel }} <span aria-hidden="true">×</span>
                </button>
                <button class="ml-1 text-xs text-sunka-olive underline underline-offset-4" @click="clearAllFilters">
                    Limpiar filtros
                </button>
            </div>

            <div v-if="productosPaginados.length" class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <TiendaProductCard v-for="producto in productosPaginados" :key="producto.id" :producto="producto" />
            </div>

            <div v-else class="flex flex-col items-center justify-center py-24 text-center">
                <p class="font-heading text-2xl text-sunka-ink">No encontramos esa mezcla.</p>
                <p class="mt-2 text-sm text-sunka-ink/60">Prueba con otro filtro para continuar explorando.</p>
                <button class="mt-6 catalog-clear-button" @click="clearAllFilters">Limpiar filtros</button>
            </div>

            <div v-if="totalPaginas > 1" class="mt-10 flex items-center justify-center gap-2">
                <button
                    class="catalog-page-button"
                    :disabled="paginaActual === 1"
                    aria-label="Página anterior"
                    @click="changePage(paginaActual - 1)"
                >
                    <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                    v-for="pagina in paginasVisibles"
                    :key="pagina"
                    class="catalog-page-button"
                    :class="{ 'catalog-page-button-active': paginaActual === pagina }"
                    :disabled="pagina === '...'"
                    @click="changePage(pagina)"
                >
                    <span v-if="pagina === '...'">…</span>
                    <template v-else>{{ pagina }}</template>
                </button>
                <button
                    class="catalog-page-button"
                    :disabled="paginaActual === totalPaginas"
                    aria-label="Página siguiente"
                    @click="changePage(paginaActual + 1)"
                >
                    <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import TiendaProductCard from '@/components/tienda/TiendaProductCard.vue'
import { momentosBySlug } from '@/data/momentos.js'
import ChevronDown from '@/assets/icons/chevron-down.vue'
import ChevronLeft from '@/assets/icons/chevron-left.vue'
import ChevronRight from '@/assets/icons/chevron-right.vue'
import ChevronUp from '@/assets/icons/chevron-up.vue'

export default {
    name: 'TiendaCatalog',
    components: { TiendaProductCard, ChevronDown, ChevronLeft, ChevronRight, ChevronUp },
    props: {
        productos: { type: Array, required: true },
        lineas: { type: Array, required: true },
        momentos: { type: Array, default: () => [] },
    },
    data() {
        return {
            orden: 'nombre-asc',
            filtroLineas: [],
            selectedMoment: '',
            priceRange: '',
            precioMin: null,
            precioMax: null,
            paginaActual: 1,
            porPagina: 16,
            isInitializing: true,
            openDropdown: '',
        }
    },
    computed: {
        productosFiltrados() {
            let resultado = [...this.productos]
            if (this.filtroLineas.length) {
                resultado = resultado.filter((producto) => this.filtroLineas.includes(producto.linea))
            }
            if (this.selectedMoment && this.hasMomentMetadata) {
                resultado = resultado.filter((producto) => this.productMatchesMoment(producto, this.selectedMoment))
            }
            if (this.precioMin != null) resultado = resultado.filter((producto) => Number(producto.precio) >= this.precioMin)
            if (this.precioMax != null) resultado = resultado.filter((producto) => Number(producto.precio) <= this.precioMax)

            return resultado.sort((a, b) => {
                if (this.orden === 'precio-asc') return Number(a.precio) - Number(b.precio)
                if (this.orden === 'precio-desc') return Number(b.precio) - Number(a.precio)
                if (this.orden === 'nombre-desc') return b.nombre.localeCompare(a.nombre)
                return a.nombre.localeCompare(b.nombre)
            })
        },
        productosPaginados() {
            const inicio = (this.paginaActual - 1) * this.porPagina
            return this.productosFiltrados.slice(inicio, inicio + this.porPagina)
        },
        totalPaginas() {
            return Math.ceil(this.productosFiltrados.length / this.porPagina)
        },
        paginasVisibles() {
            const total = this.totalPaginas
            const actual = this.paginaActual
            if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

            const paginas = [1]
            if (actual > 3) paginas.push('...')
            for (let pagina = Math.max(2, actual - 1); pagina <= Math.min(total - 1, actual + 1); pagina++) {
                paginas.push(pagina)
            }
            if (actual < total - 2) paginas.push('...')
            paginas.push(total)
            return paginas
        },
        hasMomentMetadata() {
            return this.productos.some((producto) => this.getProductMoments(producto).length)
        },
        hasActiveFilters() {
            return Boolean(this.selectedMoment || this.filtroLineas.length || this.priceRange)
        },
        selectedMomentLabel() {
            return this.momentos.find((momento) => momento.slug === this.selectedMoment)?.titulo || this.selectedMoment
        },
        selectedLineaLabel() {
            return this.lineas.find((linea) => linea.id === this.filtroLineas[0])?.nombre || 'Línea'
        },
        priceRangeLabel() {
            return { '0-10': 'Hasta S/ 10', '10-20': 'S/ 10 – S/ 20', '20+': 'Más de S/ 20' }[this.priceRange]
        },
    },
    watch: {
        selectedMoment: 'handleFilterChange',
        filtroLineas: 'handleFilterChange',
        orden() {
            this.paginaActual = 1
        },
    },
    mounted() {
        this.applyUrlFilters()
        this.isInitializing = false
    },
    methods: {
        normalizeSlug(value = '') {
            return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
        },
        getProductMoments(producto) {
            const values = []
            const append = (value) => {
                if (value == null) return
                if (Array.isArray(value)) return value.forEach(append)
                if (typeof value === 'object') return append(value.slug || value.nombre || value.name)
                String(value).split(/[,;|]/).forEach((item) => {
                    const slug = this.normalizeSlug(item)
                    if (slug) values.push(slug)
                })
            }
            ;[producto.momentos, producto.momento, producto.tags, producto.etiquetas].forEach(append)
            return [...new Set(values)]
        },
        productMatchesMoment(producto, moment) {
            const aliases = momentosBySlug[moment]?.aliases || [moment]
            return this.getProductMoments(producto).some((tag) => aliases.includes(tag))
        },
        setLinea(value) {
            this.filtroLineas = value ? [value] : []
        },
        setPriceRange() {
            this.precioMin = null
            this.precioMax = null
            if (this.priceRange === '0-10') this.precioMax = 10
            if (this.priceRange === '10-20') {
                this.precioMin = 10
                this.precioMax = 20
            }
            if (this.priceRange === '20+') this.precioMin = 20
            this.handleFilterChange()
        },
        clearPrice() {
            this.priceRange = ''
            this.precioMin = null
            this.precioMax = null
        },
        clearAllFilters() {
            this.filtroLineas = []
            this.selectedMoment = ''
            this.clearPrice()
        },
        handleFilterChange() {
            if (this.isInitializing) return
            this.paginaActual = 1
            this.$nextTick(() => this.$refs.gridTop?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        },
        changePage(page) {
            if (typeof page !== 'number' || page < 1 || page > this.totalPaginas) return
            this.paginaActual = page
            this.$nextTick(() => this.$refs.gridTop?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        },
        applyUrlFilters() {
            const params = new URLSearchParams(window.location.search)
            const requestedLine = params.get('linea')
            const line = this.lineas.find((item) => this.normalizeSlug(item.slug || item.nombre) === this.normalizeSlug(requestedLine || ''))
            if (line) this.filtroLineas = [line.id]
            const requestedMoment = this.normalizeSlug(params.get('momento') || '')
            if (momentosBySlug[requestedMoment]) this.selectedMoment = requestedMoment
        },
    },
}
</script>

<style scoped>
.catalog-kicker {
    color: var(--sunka-olive);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
}

.catalog-select,
.catalog-order {
    position: relative;
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(35, 29, 24, 0.16);
    background: var(--sunka-white);
    color: var(--sunka-ink);
}

.catalog-select {
    position: relative;
    border-radius: 4px;
}

.catalog-select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    width: 14px;
    height: 14px;
    pointer-events: none;
    color: var(--sunka-stone);
    transform: translateY(-50%);
}

.catalog-select select {
    min-width: 100px;
    appearance: none;
    cursor: pointer;
    background: transparent;
    padding: 9px 30px 9px 11px;
    font-size: 11px;
    outline: none;
}

.catalog-order {
    border-radius: 4px;
}

.catalog-view-button {
    display: inline-flex;
    height: 34px;
    width: 34px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(35, 29, 24, 0.12);
    color: var(--sunka-stone);
    font-size: 16px;
}

.catalog-view-button-active {
    background: var(--sunka-cream);
    color: var(--sunka-olive);
}

.catalog-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    background: var(--sunka-cream);
    padding: 7px 11px;
    color: var(--sunka-ink);
    font-size: 11px;
}

.catalog-clear-button {
    border: 1px solid rgba(95, 100, 65, 0.55);
    background: transparent;
    color: var(--sunka-ink);
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    transition: background 200ms ease, color 200ms ease;
}

.catalog-clear-button {
    padding: 10px 18px;
}

.catalog-clear-button:hover {
    background: var(--sunka-olive);
    color: var(--sunka-white);
}

.catalog-page-button {
    display: inline-flex;
    height: 36px;
    min-width: 36px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(35, 29, 24, 0.15);
    border-radius: 999px;
    background: transparent;
    color: var(--sunka-ink);
    cursor: pointer;
    font-size: 12px;
    transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
}

.catalog-page-button:hover:not(:disabled),
.catalog-page-button-active {
    border-color: var(--sunka-olive);
    background: var(--sunka-olive);
    color: var(--sunka-white);
}

.catalog-page-button:disabled {
    cursor: not-allowed;
    opacity: 0.3;
}
</style>
