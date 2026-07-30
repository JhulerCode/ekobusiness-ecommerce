<template>
    <div ref="gridTop" class="py-12 max-w-7xl mx-auto px-6 scroll-mt-24">
        <div class="flex gap-10">
            <!-- Sidebar Filtros (desktop) -->
            <aside class="hidden lg:block w-56 flex-shrink-0">
                <div class="sticky top-28">
                    <!-- Filtro por Línea -->
                    <div class="mb-8">
                        <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
                            Línea
                        </h3>
                        <ul class="space-y-2.5">
                            <li>
                                <label class="checkbox">
                                    <input
                                        type="checkbox"
                                        :checked="filtroLineas.length === 0"
                                        @change="clearFiltroLineas"
                                    />
                                    <span>Todas</span>
                                </label>
                            </li>
                            <li v-for="l in lineas" :key="l.id">
                                <label class="checkbox">
                                    <input
                                        type="checkbox"
                                        :value="l.id"
                                        v-model="filtroLineas"
                                    />
                                    <span>{{ l.nombre }}</span>
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Filtro por Momento -->
                    <div class="mb-8">
                        <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
                            Momento
                        </h3>
                        <ul class="space-y-2.5">
                            <li>
                                <label class="checkbox">
                                    <input
                                        type="checkbox"
                                        :checked="selectedMoment === ''"
                                        @change="clearMomento"
                                    />
                                    <span>Todos</span>
                                </label>
                            </li>
                            <li v-for="momento in momentos" :key="momento.slug">
                                <label class="checkbox">
                                    <input
                                        type="checkbox"
                                        :checked="selectedMoment === momento.slug"
                                        @change="toggleMomento(momento.slug)"
                                    />
                                    <span>{{ momento.titulo }}</span>
                                </label>
                            </li>
                        </ul>
                    </div>

                    <!-- Filtro por Precio -->
                    <div class="mb-8">
                        <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-4">
                            Precio
                        </h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-2">
                                <input
                                    v-model.number="precioMin"
                                    type="number"
                                    min="0"
                                    placeholder="Mín"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <span class="text-gray-400">–</span>
                                <input
                                    v-model.number="precioMax"
                                    type="number"
                                    min="0"
                                    placeholder="Máx"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Limpiar filtros -->
                    <button
                        v-if="hasActiveFilters"
                        @click="clearAllFilters"
                        class="text-sm text-gray-500 underline hover:text-black transition cursor-pointer"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </aside>

            <!-- Contenido principal -->
            <div class="flex-1 min-w-0">
                <!-- Barra superior: ordenamiento + contador -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div class="flex items-center gap-3">
                        <label class="text-sm text-gray-500">Ordenar por:</label>
                        <select
                            v-model="orden"
                            class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                        >
                            <option value="nombre-asc">Nombre A–Z</option>
                            <option value="nombre-desc">Nombre Z–A</option>
                            <option value="precio-asc">Precio: menor a mayor</option>
                            <option value="precio-desc">Precio: mayor a menor</option>
                        </select>
                    </div>

                    <p class="text-sm text-gray-500">
                        {{ rangoInicio }}–{{ rangoFin }} de {{ productosFiltrados.length }} productos
                    </p>
                </div>

                <!-- Filtros móviles -->
                <div class="lg:hidden mb-6">
                    <button
                        @click="showMobileFilters = !showMobileFilters"
                        class="button button2 text-sm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <line x1="4" x2="4" y1="21" y2="14" />
                            <line x1="4" x2="4" y1="10" y2="3" />
                            <line x1="12" x2="12" y1="21" y2="12" />
                            <line x1="12" x2="12" y1="8" y2="3" />
                            <line x1="20" x2="20" y1="21" y2="16" />
                            <line x1="20" x2="20" y1="12" y2="3" />
                            <line x1="2" x2="6" y1="14" y2="14" />
                            <line x1="10" x2="14" y1="8" y2="8" />
                            <line x1="18" x2="22" y1="16" y2="16" />
                        </svg>
                        Filtros
                        <span
                            v-if="hasActiveFilters"
                            class="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            {{ activeFilterCount }}
                        </span>
                    </button>

                    <!-- Panel de filtros móvil -->
                    <transition name="slide">
                        <div
                            v-if="showMobileFilters"
                            class="mt-4 bg-stone-50 border border-gray-200 rounded-xl p-5 space-y-6"
                        >
                            <!-- Línea -->
                            <div>
                                <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
                                    Línea
                                </h3>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        @click="clearFiltroLineas"
                                        :class="[
                                            'px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer',
                                            filtroLineas.length === 0
                                                ? 'bg-black text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                                        ]"
                                    >
                                        Todas
                                    </button>
                                    <button
                                        v-for="l in lineas"
                                        :key="l.id"
                                        @click="toggleLinea(l.id)"
                                        :class="[
                                            'px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer',
                                            filtroLineas.includes(l.id)
                                                ? 'bg-black text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                                        ]"
                                    >
                                        {{ l.nombre }}
                                    </button>
                                </div>
                            </div>

                            <!-- Momento -->
                            <div>
                                <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
                                    Momento
                                </h3>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        @click="clearMomento"
                                        :class="[
                                            'px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer',
                                            selectedMoment === ''
                                                ? 'bg-black text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                                        ]"
                                    >
                                        Todos
                                    </button>
                                    <button
                                        v-for="momento in momentos"
                                        :key="momento.slug"
                                        @click="toggleMomento(momento.slug)"
                                        :class="[
                                            'px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer',
                                            selectedMoment === momento.slug
                                                ? 'bg-black text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                                        ]"
                                    >
                                        {{ momento.titulo }}
                                    </button>
                                </div>
                            </div>

                            <!-- Precio -->
                            <div>
                                <h3 class="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-3">
                                    Precio
                                </h3>
                                <div class="flex items-center gap-2">
                                    <input
                                        v-model.number="precioMin"
                                        type="number"
                                        min="0"
                                        placeholder="Mín"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <span class="text-gray-400">–</span>
                                    <input
                                        v-model.number="precioMax"
                                        type="number"
                                        min="0"
                                        placeholder="Máx"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            <button
                                v-if="hasActiveFilters"
                                @click="clearAllFilters"
                                class="text-sm text-gray-500 underline hover:text-black transition cursor-pointer"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </transition>
                </div>

                <!-- Grid de productos -->
                <div
                    v-if="productosPaginados.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <Producto
                        v-for="p in productosPaginados"
                        :key="p.id"
                        :producto="p"
                    />
                </div>

                <!-- Estado vacío -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center py-24 text-center"
                >
                    <Ghost class="w-12 h-12 text-gray-300 mb-4" />
                    <p class="text-gray-500 text-lg mb-2">No se encontraron productos</p>
                    <p class="text-gray-400 text-sm mb-6">
                        Intenta ajustar los filtros para ver más resultados.
                    </p>
                    <button
                        @click="clearAllFilters"
                        class="button button1 text-sm"
                    >
                        Limpiar filtros
                    </button>
                </div>

                <!-- Paginación -->
                <div
                    v-if="totalPaginas > 1"
                    class="flex items-center justify-center gap-2 mt-12"
                >
                    <button
                        @click="changePage(paginaActual - 1)"
                        :disabled="paginaActual === 1"
                        class="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        <ChevronLeft class="w-4 h-4" />
                    </button>

                    <template v-for="p in paginasVisibles" :key="p">
                        <button
                            v-if="p === '...'"
                            disabled
                            class="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
                        >
                            …
                        </button>
                        <button
                            v-else
                            @click="changePage(p)"
                            :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition cursor-pointer',
                                paginaActual === p
                                    ? 'bg-black text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                            ]"
                        >
                            {{ p }}
                        </button>
                    </template>

                    <button
                        @click="changePage(paginaActual + 1)"
                        :disabled="paginaActual === totalPaginas"
                        class="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        <ChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Producto from '@/components/Producto.vue';
import Ghost from '@/assets/icons/ghost.vue';
import ChevronLeft from '@/assets/icons/chevron-left.vue';
import ChevronRight from '@/assets/icons/chevron-right.vue';
import { momentos, momentosBySlug } from '@/data/momentos.js';

export default {
    components: {
        Producto,
        Ghost,
        ChevronLeft,
        ChevronRight,
    },
    props: {
        productos: {
            type: Array,
            required: true,
            default: () => [],
        },
        lineas: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            momentos,
            orden: 'nombre-asc',
            filtroLineas: [],
            selectedMoment: '',
            precioMin: null,
            precioMax: null,
            paginaActual: 1,
            porPagina: 15,
            showMobileFilters: false,
            isInitializing: true,
        };
    },
    computed: {
        productosFiltrados() {
            let resultado = [...this.productos];

            // Filtro por línea
            if (this.filtroLineas.length > 0) {
                resultado = resultado.filter((p) =>
                    this.filtroLineas.includes(p.linea)
                );
            }

            // Los momentos son tags de selección múltiple por producto. Mientras la
            // API no entregue tags, se conserva la colección de la línea como fallback.
            if (this.selectedMoment && this.hasMomentMetadata) {
                resultado = resultado.filter((p) =>
                    this.productMatchesMoment(p, this.selectedMoment)
                );
            }

            // Filtro por precio
            if (this.precioMin != null && this.precioMin !== '') {
                resultado = resultado.filter(
                    (p) => Number(p.precio) >= this.precioMin
                );
            }
            if (this.precioMax != null && this.precioMax !== '') {
                resultado = resultado.filter(
                    (p) => Number(p.precio) <= this.precioMax
                );
            }

            // Ordenamiento
            resultado.sort((a, b) => {
                switch (this.orden) {
                    case 'nombre-asc':
                        return a.nombre.localeCompare(b.nombre);
                    case 'nombre-desc':
                        return b.nombre.localeCompare(a.nombre);
                    case 'precio-asc':
                        return Number(a.precio) - Number(b.precio);
                    case 'precio-desc':
                        return Number(b.precio) - Number(a.precio);
                    default:
                        return 0;
                }
            });

            return resultado;
        },
        totalPaginas() {
            return Math.ceil(this.productosFiltrados.length / this.porPagina);
        },
        productosPaginados() {
            const inicio = (this.paginaActual - 1) * this.porPagina;
            return this.productosFiltrados.slice(inicio, inicio + this.porPagina);
        },
        rangoInicio() {
            if (this.productosFiltrados.length === 0) return 0;
            return (this.paginaActual - 1) * this.porPagina + 1;
        },
        rangoFin() {
            return Math.min(this.paginaActual * this.porPagina, this.productosFiltrados.length);
        },
        paginasVisibles() {
            const total = this.totalPaginas;
            const actual = this.paginaActual;
            const paginas = [];

            if (total <= 7) {
                for (let i = 1; i <= total; i++) paginas.push(i);
            } else {
                paginas.push(1);
                if (actual > 3) paginas.push('...');

                const inicio = Math.max(2, actual - 1);
                const fin = Math.min(total - 1, actual + 1);

                for (let i = inicio; i <= fin; i++) paginas.push(i);

                if (actual < total - 2) paginas.push('...');
                paginas.push(total);
            }

            return paginas;
        },
        hasActiveFilters() {
            return (
                this.filtroLineas.length > 0 ||
                this.selectedMoment !== '' ||
                (this.precioMin != null && this.precioMin !== '') ||
                (this.precioMax != null && this.precioMax !== '')
            );
        },
        activeFilterCount() {
            let count = 0;
            if (this.filtroLineas.length > 0) count += this.filtroLineas.length;
            if (this.selectedMoment) count++;
            if (this.precioMin != null && this.precioMin !== '') count++;
            if (this.precioMax != null && this.precioMax !== '') count++;
            return count;
        },
        hasMomentMetadata() {
            return this.productos.some((producto) => this.getProductMoments(producto).length > 0);
        },
    },
    watch: {
        filtroLineas() {
            this.handleFilterChange();
        },
        selectedMoment() {
            this.handleFilterChange();
        },
        precioMin() {
            this.handleFilterChange();
        },
        precioMax() {
            this.handleFilterChange();
        },
        orden() {
            this.paginaActual = 1;
            this.scrollToTop();
        },
    },
    mounted() {
        this.applyUrlFilters();
        this.isInitializing = false;
    },
    methods: {
        normalizeSlug(value = '') {
            return String(value)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },
        getLineaSlug(linea) {
            return this.normalizeSlug(linea.slug || linea.nombre);
        },
        lineMatchesSlug(linea, requestedSlug) {
            const currentSlug = this.getLineaSlug(linea);
            const requested = this.normalizeSlug(requestedSlug);

            return (
                currentSlug === requested ||
                currentSlug.startsWith(`${requested}-`) ||
                requested.startsWith(`${currentSlug}-`)
            );
        },
        applyUrlFilters() {
            const params = new URLSearchParams(window.location.search);
            const requestedLines = (params.get('linea') || '')
                .split(',')
                .map((slug) => this.normalizeSlug(slug))
                .filter(Boolean);

            if (requestedLines.length > 0) {
                this.filtroLineas = this.lineas
                    .filter((linea) => requestedLines.some((slug) => this.lineMatchesSlug(linea, slug)))
                    .map((linea) => linea.id);
            }

            const requestedMoment = this.normalizeSlug(params.get('momento') || '');
            this.selectedMoment = momentosBySlug[requestedMoment] ? requestedMoment : '';

            const min = Number(params.get('precio_min'));
            const max = Number(params.get('precio_max'));
            this.precioMin = Number.isFinite(min) && params.has('precio_min') ? min : null;
            this.precioMax = Number.isFinite(max) && params.has('precio_max') ? max : null;
        },
        updateUrl() {
            if (this.isInitializing) return;

            const url = new URL(window.location.href);
            const lineSlugs = this.filtroLineas
                .map((id) => this.lineas.find((linea) => linea.id === id))
                .filter(Boolean)
                .map((linea) => this.getLineaSlug(linea));

            if (lineSlugs.length > 0) url.searchParams.set('linea', lineSlugs.join(','));
            else url.searchParams.delete('linea');

            if (this.selectedMoment) url.searchParams.set('momento', this.selectedMoment);
            else url.searchParams.delete('momento');

            if (this.precioMin != null && this.precioMin !== '') {
                url.searchParams.set('precio_min', this.precioMin);
            } else {
                url.searchParams.delete('precio_min');
            }

            if (this.precioMax != null && this.precioMax !== '') {
                url.searchParams.set('precio_max', this.precioMax);
            } else {
                url.searchParams.delete('precio_max');
            }

            window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
        },
        handleFilterChange() {
            if (this.isInitializing) return;
            this.paginaActual = 1;
            this.updateUrl();
            this.scrollToTop();
        },
        getProductMoments(producto) {
            const sources = [
                producto.momentos,
                producto.momento,
                producto.tags,
                producto.tags1,
                producto.etiquetas,
                producto.etiquetas1,
            ];
            const values = [];

            const append = (value) => {
                if (value == null) return;
                if (Array.isArray(value)) {
                    value.forEach(append);
                    return;
                }
                if (typeof value === 'object') {
                    append(value.slug || value.codigo || value.nombre || value.name);
                    return;
                }

                String(value).split(/[,;|]/).forEach((item) => {
                    const slug = this.normalizeSlug(item);
                    if (slug) values.push(slug);
                });
            };

            sources.forEach(append);
            return [...new Set(values)];
        },
        productMatchesMoment(producto, moment) {
            const accepted = momentosBySlug[moment]?.aliases || [moment];

            return this.getProductMoments(producto).some((tag) => accepted.includes(tag));
        },
        scrollToTop() {
            this.$nextTick(() => {
                this.$refs.gridTop?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        },
        changePage(page) {
            this.paginaActual = page;
            this.scrollToTop();
        },
        clearFiltroLineas() {
            this.filtroLineas = [];
        },
        toggleLinea(id) {
            const idx = this.filtroLineas.indexOf(id);
            if (idx === -1) {
                this.filtroLineas.push(id);
            } else {
                this.filtroLineas.splice(idx, 1);
            }
        },
        toggleMomento(slug) {
            this.selectedMoment = this.selectedMoment === slug ? '' : slug;
        },
        clearMomento() {
            this.selectedMoment = '';
        },
        clearAllFilters() {
            this.filtroLineas = [];
            this.selectedMoment = '';
            this.precioMin = null;
            this.precioMax = null;
        },
    },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
