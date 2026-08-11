<template>
    <div class="blend-builder">
        <nav class="blend-steps" aria-label="Progreso de creación del blend">
            <template v-for="(step, index) in steps" :key="step.id">
                <button
                    type="button"
                    class="blend-step"
                    :class="{ 'is-active': pasoActual === step.id, 'is-done': isStepDone(step.id) }"
                    :disabled="!canVisitStep(step.id)"
                    @click="goToStep(step.id)"
                >
                    <span class="blend-step__number">{{
                        isStepDone(step.id) ? '✓' : step.number
                    }}</span>
                    <span class="blend-step__title">{{ step.title }}</span>
                </button>
                <span
                    v-if="index < steps.length - 1"
                    class="blend-step__line"
                    aria-hidden="true"
                ></span>
            </template>
        </nav>

        <div class="blend-layout">
            <section class="blend-config-card">
                <header class="blend-config-head">
                    <div>
                        <h1>Construye tu mezcla</h1>
                        <p>Elige una base y completa el perfil con los complementos que quieras.</p>
                    </div>
                </header>

                <div v-if="pasoActual === 1" class="blend-panel blend-format-panel">
                    <div class="blend-panel-heading">
                        <div>
                            <!-- <span class="blend-panel-kicker">Paso 01</span> -->
                            <h2>Elige tu formato</h2>
                            <p>Define cuánto quieres preparar para tu ritual.</p>
                        </div>
                    </div>

                    <div class="blend-choice-grid blend-choice-grid--formats">
                        <button
                            v-for="formato in formatos"
                            :key="formato.id"
                            type="button"
                            class="blend-choice-card blend-format-choice"
                            :class="{ 'is-selected': blend.formato === formato.id }"
                            @click="setFormato(formato)"
                        >
                            <span class="blend-choice-card__check">{{
                                blend.formato === formato.id ? '✓' : ''
                            }}</span>
                            <strong>{{ formato.nombre }}</strong>
                            <small>{{ formato.descripcion }}</small>
                        </button>
                    </div>

                    <div class="blend-panel-heading blend-panel-heading--packaging">
                        <div>
                            <!-- <span class="blend-panel-kicker">Paso 01 · continuación</span> -->
                            <h2>Elige tu empaque</h2>
                            <p>Todos protegen el aroma; elige el que va contigo.</p>
                        </div>
                    </div>

                    <div class="blend-choice-grid blend-choice-grid--packaging">
                        <button
                            v-for="empaque in empaques"
                            :key="empaque.id"
                            type="button"
                            class="blend-choice-card blend-package-choice"
                            :class="{ 'is-selected': blend.empaque === empaque.id }"
                            @click="setEmpaque(empaque)"
                        >
                            <span class="blend-package-choice__icon">▱</span>
                            <span>
                                <strong>{{ empaque.nombre }}</strong>
                                <small>{{ empaque.descripcion }}</small>
                            </span>
                            <b>+ S/ {{ money(empaque.precio) }}</b>
                        </button>
                    </div>
                </div>

                <div v-else-if="pasoActual === 2" class="blend-panel blend-ingredients-panel">
                    <div
                        class="blend-tabs"
                        role="tablist"
                        aria-label="Configuración de ingredientes"
                    >
                        <button
                            type="button"
                            :class="{ 'is-active': ingredienteTab === 1 }"
                            @click="ingredienteTab = 1"
                        >
                            1. Elige la base
                        </button>
                        <button
                            type="button"
                            :class="{ 'is-active': ingredienteTab === 2 }"
                            @click="ingredienteTab = 2"
                        >
                            2. Añade complementos
                        </button>
                        <button
                            type="button"
                            :class="{ 'is-active': ingredienteTab === 3 }"
                            @click="ingredienteTab = 3"
                        >
                            3. Ajusta
                        </button>
                    </div>

                    <div v-if="ingredienteTab === 1" class="blend-tab-panel">
                        <!-- <div class="blend-section-title">
                            <div>
                                <h2>Tu base principal</h2>
                                <p>Selecciona una · ocupa 40% o 60% de la mezcla</p>
                            </div>
                            <span class="blend-section-hint">{{ blend.basePorcentaje }}% de la mezcla</span>
                        </div> -->
                        <div class="blend-base-ratio">
                            <div>
                                <strong>¿Cuánto quieres que ocupe tu base?</strong>
                                <span>El resto se distribuirá entre tus complementos.</span>
                            </div>
                            <div
                                class="blend-ratio-toggle"
                                role="group"
                                aria-label="Porcentaje de hierba base"
                            >
                                <button
                                    type="button"
                                    :class="{ 'is-selected': blend.basePorcentaje === 60 }"
                                    @click="setBaseRatio(60)"
                                >
                                    Base · 60%
                                </button>
                                <button
                                    type="button"
                                    :class="{ 'is-selected': blend.basePorcentaje === 40 }"
                                    @click="setBaseRatio(40)"
                                >
                                    Base · 40%
                                </button>
                            </div>
                        </div>
                        <div class="blend-base-grid">
                            <button
                                v-for="item in hierbasBase"
                                :key="item.id"
                                type="button"
                                class="blend-ingredient-card"
                                :class="{ 'is-selected': blend.hierbaBase === item.id }"
                                @click="setHierbaBase(item)"
                            >
                                <span
                                    class="blend-ingredient-card__icon"
                                    :class="`is-${item.color || 'sage'}`"
                                    >{{ item.icono || '✦' }}</span
                                >
                                <span class="blend-ingredient-card__check">{{
                                    blend.hierbaBase === item.id ? '✓' : ''
                                }}</span>
                                <strong>{{ item.nombre }}</strong>
                                <small>{{ item.descripcion }}</small>
                            </button>
                        </div>
                    </div>

                    <div v-else-if="ingredienteTab === 2" class="blend-tab-panel">
                        <div class="blend-section-title">
                            <div>
                                <h2>Añade tus complementos</h2>
                            </div>
                            <span class="blend-section-hint"
                                >{{ selectedNotes.length }} elegidas · mínimo 10 g c/u</span
                            >
                        </div>

                        <div class="blend-note-group">
                            <h3>Hierbas complemento</h3>
                            <div class="blend-note-grid">
                                <button
                                    v-for="item in complementos"
                                    :key="item.id"
                                    type="button"
                                    class="blend-note-card"
                                    :class="{
                                        'is-selected': isSelected('complementos', item.id),
                                        'is-disabled':
                                            !isSelected('complementos', item.id) &&
                                            (!blend.hierbaBase1 || availableComplementGrams < 10),
                                    }"
                                    :disabled="
                                        !isSelected('complementos', item.id) &&
                                        (!blend.hierbaBase1 || availableComplementGrams < 10)
                                    "
                                    @click="toggleNote('complementos', item)"
                                >
                                    <span
                                        class="blend-note-card__icon"
                                        :class="`is-${item.color || 'sage'}`"
                                        >{{ item.icono || '✦' }}</span
                                    >
                                    <span
                                        ><strong>{{ item.nombre }}</strong
                                        ><small>{{ item.descripcion }}</small></span
                                    >
                                    <i>{{ isSelected('complementos', item.id) ? '✓' : '+' }}</i>
                                </button>
                            </div>
                        </div>
                        <div class="blend-note-group">
                            <h3>Frutas deshidratadas</h3>
                            <div class="blend-note-grid">
                                <button
                                    v-for="item in frutas"
                                    :key="item.id"
                                    type="button"
                                    class="blend-note-card"
                                    :class="{
                                        'is-selected': isSelected('frutas', item.id),
                                        'is-disabled':
                                            !isSelected('frutas', item.id) &&
                                            (!blend.hierbaBase1 || availableComplementGrams < 10),
                                    }"
                                    :disabled="
                                        !isSelected('frutas', item.id) &&
                                        (!blend.hierbaBase1 || availableComplementGrams < 10)
                                    "
                                    @click="toggleNote('frutas', item)"
                                >
                                    <span
                                        class="blend-note-card__icon"
                                        :class="`is-${item.color || 'rose'}`"
                                        >{{ item.icono || '✦' }}</span
                                    >
                                    <span
                                        ><strong>{{ item.nombre }}</strong
                                        ><small>{{ item.descripcion }}</small></span
                                    >
                                    <i>{{ isSelected('frutas', item.id) ? '✓' : '+' }}</i>
                                </button>
                            </div>
                        </div>
                        <div class="blend-note-group">
                            <h3>Especias</h3>
                            <div class="blend-note-grid">
                                <button
                                    v-for="item in especias"
                                    :key="item.id"
                                    type="button"
                                    class="blend-note-card"
                                    :class="{
                                        'is-selected': isSelected('especias', item.id),
                                        'is-disabled':
                                            !isSelected('especias', item.id) &&
                                            (!blend.hierbaBase1 || availableComplementGrams < 10),
                                    }"
                                    :disabled="
                                        !isSelected('especias', item.id) &&
                                        (!blend.hierbaBase1 || availableComplementGrams < 10)
                                    "
                                    @click="toggleNote('especias', item)"
                                >
                                    <span
                                        class="blend-note-card__icon"
                                        :class="`is-${item.color || 'clay'}`"
                                        >{{ item.icono || '✦' }}</span
                                    >
                                    <span
                                        ><strong>{{ item.nombre }}</strong
                                        ><small>{{ item.descripcion }}</small></span
                                    >
                                    <i>{{ isSelected('especias', item.id) ? '✓' : '+' }}</i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="blend-tab-panel">
                        <div class="blend-section-title">
                            <div>
                                <h2>Ajusta tu fórmula</h2>
                                <p>Distribuye los gramos según el carácter que buscas.</p>
                            </div>
                            <span class="blend-section-hint"
                                >{{ totalGramos }} de {{ pesoMaximo }} g</span
                            >
                        </div>
                        <div class="blend-adjust-list">
                            <div v-if="blend.hierbaBase1" class="blend-adjust-row">
                                <div>
                                    <strong>{{ blend.hierbaBase1.nombre }}</strong
                                    ><small
                                        >Base principal ·
                                        {{ percentage(blend.hierbaBase1.cantidad) }}%</small
                                    >
                                </div>
                                <div class="blend-stepper-control">
                                    <button
                                        type="button"
                                        :disabled="!canDecrease('base')"
                                        @click="changeAmount('base', -1)"
                                    >
                                        −</button
                                    ><b>{{ blend.hierbaBase1.cantidad }}g</b
                                    ><button
                                        type="button"
                                        :disabled="!canIncrease('base')"
                                        @click="changeAmount('base', 1)"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div
                                v-for="item in selectedNotes"
                                :key="item.id"
                                class="blend-adjust-row"
                            >
                                <div>
                                    <strong>{{ item.nombre }}</strong
                                    ><small
                                        >{{ item.descripcion || 'Complemento aromático' }} ·
                                        {{ percentage(item.cantidad) }}%</small
                                    >
                                </div>
                                <div class="blend-stepper-control">
                                    <button
                                        type="button"
                                        :disabled="!canDecrease('note', item)"
                                        @click="changeAmount('note', -1, item)"
                                    >
                                        −</button
                                    ><b>{{ item.cantidad }}g</b
                                    ><button
                                        type="button"
                                        :disabled="!canIncrease('note', item)"
                                        @click="changeAmount('note', 1, item)"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <p v-if="!blend.hierbaBase1" class="blend-empty-state">
                                Selecciona primero una hierba base.
                            </p>
                        </div>
                        <button
                            type="button"
                            class="blend-complete-action"
                            @click="completeFormula"
                        >
                            Completar fórmula automáticamente
                        </button>
                    </div>
                    <div class="blend-panel-actions">
                        <button
                            type="button"
                            class="blend-secondary-action"
                            @click="goToStep(1)"
                        >
                            ← Volver
                        </button>
                    </div>
                </div>

                <div v-else-if="pasoActual === 3" class="blend-panel blend-label-panel">
                    <div class="blend-panel-heading">
                        <div>
                            <h2>Personaliza tu etiqueta</h2>
                            <p>Personaliza el nombre del blend y para quién fue preparado.</p>
                        </div>
                        <span class="blend-panel-count">Opcional</span>
                    </div>
                    <label class="blend-field"
                        ><span>Nombre del blend</span
                        ><input
                            v-model.trim="blend.etiqueta"
                            maxlength="32"
                            placeholder="Ej. Atardecer cítrico"
                    /></label>
                    <label class="blend-field"
                        ><span>Preparado para</span
                        ><input
                            v-model.trim="blend.preparadoPara"
                            maxlength="32"
                            placeholder="Ej. Sebastián"
                    /></label>
                    <p class="blend-label-note">
                        Tu etiqueta se imprimirá en el empaque seleccionado. Puedes continuar sin
                        personalizarla.
                    </p>
                    <div class="blend-panel-actions">
                        <button type="button" class="blend-secondary-action" @click="goToStep(2)">
                            ← Volver
                        </button>
                    </div>
                </div>
            </section>

            <aside class="blend-summary-card">
                <div class="blend-summary-head">
                    <h2>Resumen de tu blend</h2>
                </div>
                <div class="blend-product-preview">
                    <div class="blend-pack-preview" :class="empaquePreviewClass">
                        <img :src="logoSunka.src || logoSunka" alt="SUNKA Herbal Tea" />
                        <b>{{ blend.etiqueta || 'Blend Personal' }}</b>
                        <div class="blend-pack-detail">
                            <span>PREPARADO PARA</span>
                            <strong>{{ blend.preparadoPara || 'Tu nombre' }}</strong>
                        </div>
                        <div class="blend-pack-detail">
                            <span>INGREDIENTES</span>
                            <strong>{{ ingredientSummary }}</strong>
                        </div>
                        <small>CONTENIDO NETO {{ formatSummary }}</small>
                        <!-- <small>{{ formatSummary }} · {{ empaqueSummary }}</small> -->
                    </div>
                </div>
                <div class="blend-summary-meta">
                    <div>
                        <small>FORMATO</small>
                        <strong>{{ formatSummary }}</strong>
                        <!-- <span>{{ cupCount }} tazas aprox.</span> -->
                    </div>
                    <div>
                        <small>EMPAQUE</small>
                        <strong>{{ empaqueSummary }}</strong>
                        <!-- <span>{{ empaqueDescription }}</span> -->
                    </div>
                </div>

                <div class="blend-summary-section">
                    <div class="blend-summary-title">
                        <h3>Tu fórmula</h3>
                        <span
                            >{{ totalGramos }} de {{ pesoMaximo }} g ·
                            {{ isIngredientsComplete ? 'Completa' : 'Pendiente' }}</span
                        >
                    </div>
                    <div class="blend-summary-bar">
                        <span
                            v-for="row in formulaRows"
                            :key="row.id"
                            :style="{
                                width: `${Math.max((row.cantidad / pesoMaximo) * 100, row.cantidad ? 1 : 0)}%`,
                            }"
                            :class="`is-${row.color}`"
                        ></span>
                    </div>
                    <ul class="blend-summary-list">
                        <li v-for="row in formulaRows" :key="row.id">
                            <span
                                ><i :class="`is-${row.color}`"></i>{{ row.nombre }}
                                <small>{{ percentage(row.cantidad) }}%</small></span
                            ><b>{{ row.cantidad }} g</b>
                        </li>
                        <li v-if="!formulaRows.length" class="blend-summary-muted">
                            Todavía no hay ingredientes elegidos.
                        </li>
                    </ul>
                </div>

                <!-- <div class="blend-summary-section blend-label-summary">
                    <div class="blend-summary-title">
                        <h3>Etiqueta personalizada</h3>
                        <span>{{ blend.etiqueta ? 'Lista' : 'Paso 3 · Pendiente' }}</span>
                    </div>
                    <p>
                        {{
                            blend.etiqueta
                                ? `“${blend.etiqueta}”`
                                : 'Nombre e ingredientes visibles en la bolsa'
                        }}
                    </p>
                </div> -->

                <div class="blend-price-lines">
                    <div>
                        <span>Hierba base + complementos</span
                        ><b>S/ {{ money(ingredientesPrice) }}</b>
                    </div>
                    <div>
                        <span>{{ empaqueSummary }} + etiqueta personalizada</span
                        ><b>S/ {{ money(empaquePrice) }}</b>
                    </div>
                    <div class="blend-price-total">
                        <span>Total</span><b>S/ {{ money(costoTotal) }}</b>
                    </div>
                </div>
                <div class="blend-mobile-summary">
                    <small>Blend {{ formatSummary }} · {{ empaqueSummary }}</small>
                    <strong>S/ {{ money(costoTotal) }}</strong>
                </div>
                <button
                    type="button"
                    class="blend-summary-action"
                    :disabled="pasoActual >= 2 && !isIngredientsComplete"
                    @click="summaryAction"
                >
                    <span class="blend-summary-action-full">{{ summaryActionText }}</span>
                    <span class="blend-summary-action-mobile">{{ summaryActionMobileText }}</span>
                    <span>→</span>
                </button>
            </aside>
        </div>

        <transition name="fade">
            <div v-if="showToast" class="blend-toast" role="status">
                Producto agregado al carrito
            </div>
        </transition>
    </div>
</template>

<script>
import { Blend } from '../lib/blend.js'
import { Cart } from '../lib/cart.js'
import logoSunka from '../assets/logo-sunka-black.webp'

export default {
    name: 'BlendForm',
    props: {
        empaques: { type: Array, default: () => [] },
        formatos: { type: Array, default: () => [] },
        hierbasBase: { type: Array, default: () => [] },
        complementos: { type: Array, default: () => [] },
        frutas: { type: Array, default: () => [] },
        especias: { type: Array, default: () => [] },
    },
    data() {
        return {
            blend: {
                pasoActual: 1,
                ingredienteTab: 1,
                basePorcentaje: 60,
                formato: null,
                formato1: null,
                empaque: null,
                empaque1: null,
                hierbaBase: null,
                hierbaBase1: null,
                complementos: [],
                frutas: [],
                especias: [],
                etiqueta: '',
                preparadoPara: '',
            },
            errors: {},
            logoSunka,
            showToast: false,
            timeOutCloseToast: null,
            steps: [
                { id: 1, number: '01', title: 'Formato' },
                { id: 2, number: '02', title: 'Ingredientes' },
                { id: 3, number: '03', title: 'Personaliza' },
            ],
        }
    },
    computed: {
        pasoActual() {
            return Number(this.blend.pasoActual || 1)
        },
        ingredienteTab: {
            get() {
                return Number(this.blend.ingredienteTab || 1)
            },
            set(value) {
                this.blend.ingredienteTab = value
                this.persist()
            },
        },
        formatoSeleccionado() {
            return (
                this.blend.formato1 ||
                this.formatos.find((item) => item.id === this.blend.formato) ||
                null
            )
        },
        empaqueSeleccionado() {
            return (
                this.blend.empaque1 ||
                this.empaques.find((item) => item.id === this.blend.empaque) ||
                null
            )
        },
        pesoMaximo() {
            return Number(this.formatoSeleccionado?.contenido_neto || 100)
        },
        formatSummary() {
            return this.formatoSeleccionado?.nombre || 'Elige formato'
        },
        empaqueSummary() {
            return this.empaqueSeleccionado?.nombre || 'Elige empaque'
        },
        empaqueDescription() {
            return this.empaqueSeleccionado?.descripcion || 'personalizable'
        },
        empaquePreviewClass() {
            const id = this.empaqueSeleccionado?.id || 'bolsa'
            return `is-${id}`
        },
        cupCount() {
            return Math.max(1, Math.round(this.pesoMaximo / 2.5))
        },
        formatReady() {
            return Boolean(this.formatoSeleccionado && this.empaqueSeleccionado)
        },
        baseGramos() {
            return Number(this.blend.hierbaBase1?.cantidad || 0)
        },
        baseMinGramos() {
            return Math.ceil(this.pesoMaximo * (Number(this.blend.basePorcentaje || 60) / 100))
        },
        selectedNotes() {
            return [
                ...(this.blend.complementos || []),
                ...(this.blend.frutas || []),
                ...(this.blend.especias || []),
            ]
        },
        notesGramos() {
            return this.selectedNotes.reduce((sum, item) => sum + Number(item.cantidad || 0), 0)
        },
        totalGramos() {
            return this.baseGramos + this.notesGramos
        },
        availableGrams() {
            return Math.max(0, this.pesoMaximo - this.totalGramos)
        },
        availableComplementGrams() {
            if (!this.blend.hierbaBase1) return 0
            return Math.max(0, this.pesoMaximo - this.baseGramos - this.selectedNotes.length * 10)
        },
        isIngredientsComplete() {
            return Boolean(
                this.blend.hierbaBase1 &&
                this.totalGramos === this.pesoMaximo &&
                this.baseGramos >= this.pesoMaximo * 0.4 &&
                this.selectedNotes.every((item) => Number(item.cantidad || 0) >= 10),
            )
        },
        empaquePrice() {
            return Number(this.empaqueSeleccionado?.precio || 0)
        },
        ingredientesPrice() {
            const items = [this.blend.hierbaBase1, ...this.selectedNotes].filter(Boolean)
            return items.reduce(
                (total, item) =>
                    total + (Number(item.precio || 0) * Number(item.cantidad || 0)) / 1000,
                0,
            )
        },
        costoTotal() {
            return this.ingredientesPrice + this.empaquePrice
        },
        profileText() {
            const profiles = [
                this.blend.hierbaBase1?.perfil,
                ...this.selectedNotes.map((item) => item.perfil),
            ].filter(Boolean)
            return profiles.length
                ? profiles.slice(0, 3).join(' · ')
                : 'Elige una base y tus complementos'
        },
        ingredientSummary() {
            const ingredients = [
                this.blend.hierbaBase1?.nombre,
                ...this.selectedNotes.map((item) => item.nombre),
            ].filter(Boolean)
            return ingredients.length ? ingredients.join(' · ') : 'Elige tus ingredientes'
        },
        formulaRows() {
            const rows = []
            if (this.blend.hierbaBase1)
                rows.push({
                    id: this.blend.hierbaBase1.id,
                    nombre: this.blend.hierbaBase1.nombre,
                    cantidad: this.baseGramos,
                    color: 'forest',
                })
            this.selectedNotes.forEach((item, index) =>
                rows.push({
                    id: item.id,
                    nombre: item.nombre,
                    cantidad: Number(item.cantidad || 0),
                    color: ['sage', 'gold', 'clay', 'rose'][index % 4],
                }),
            )
            return rows
        },
        summaryActionText() {
            if (this.pasoActual === 1) return 'Continuar: elegir ingredientes'
            if (this.pasoActual === 2) return 'Continuar: personalizar etiqueta'
            if (this.pasoActual === 3) return 'Añadir al carrito'
            return 'Añadir al carrito'
        },
        summaryActionMobileText() {
            return this.pasoActual === 3 ? 'Añadir al carrito' : 'Continuar'
        },
    },
    mounted() {
        this.load()
        this.onBlendUpdated = (event) => {
            this.blend = { ...this.blend, ...(event.detail || {}) }
        }
        window.addEventListener('blend-updated', this.onBlendUpdated)
    },
    beforeUnmount() {
        window.removeEventListener('blend-updated', this.onBlendUpdated)
        clearTimeout(this.timeOutCloseToast)
    },
    methods: {
        money(value) {
            return Number(value || 0).toFixed(2)
        },
        percentage(value) {
            return this.pesoMaximo ? Math.round((Number(value || 0) / this.pesoMaximo) * 100) : 0
        },
        persist() {
            Blend.save(this.blend)
        },
        load() {
            const saved = Blend.updatePrices(
                this.hierbasBase,
                this.complementos,
                this.frutas,
                this.especias,
            )
            const defaultFormat =
                this.formatos.find((item) => item.contenido_neto === 100) ||
                this.formatos[0] ||
                null
            const defaultPackage =
                this.empaques.find((item) => item.id === 'bolsa') || this.empaques[0] || null
            this.blend = {
                ...this.blend,
                ...saved,
                formato: saved.formato || saved.formato1?.id || defaultFormat?.id || null,
                formato1: null,
                empaque: saved.empaque || saved.empaque1?.id || defaultPackage?.id || null,
                empaque1: null,
                pasoActual: Math.min(3, saved.pasoActual || 2),
                ingredienteTab: saved.ingredienteTab || 1,
                basePorcentaje: Number(
                    saved.basePorcentaje || (saved.modoAyuda === 'libre' ? 40 : 60),
                ),
                etiqueta: saved.etiqueta || '',
                preparadoPara: saved.preparadoPara || '',
            }
            this.blend.formato1 =
                this.formatos.find((item) => item.id === this.blend.formato) || defaultFormat
            this.blend.empaque1 =
                this.empaques.find((item) => item.id === this.blend.empaque) || defaultPackage
            this.blend.complementos = this.rehydrateItems(
                this.blend.complementos,
                this.complementos,
            )
            this.blend.frutas = this.rehydrateItems(this.blend.frutas, this.frutas)
            this.blend.especias = this.rehydrateItems(this.blend.especias, this.especias)
            if (this.blend.hierbaBase) {
                const base = this.hierbasBase.find((item) => item.id === this.blend.hierbaBase)
                this.blend.hierbaBase1 = base
                    ? { ...base, ...(this.blend.hierbaBase1 || {}) }
                    : null
            }
            this.persist()
        },
        rehydrateItems(selected, source) {
            return (selected || []).map((item) => {
                const current = source.find((sourceItem) => sourceItem.id === item.id)
                return current ? { ...current, ...item } : item
            })
        },
        isStepDone(id) {
            return id === 1
                ? this.formatReady && this.pasoActual > 1
                : id === 2
                  ? this.isIngredientsComplete && this.pasoActual > 2
                  : id === 3
                    ? this.isIngredientsComplete && this.pasoActual >= 3
                    : false
        },
        canVisitStep(id) {
            return (
                id === 1 ||
                (id === 2 && this.formatReady) ||
                (id === 3 && this.isIngredientsComplete)
            )
        },
        goToStep(id) {
            if (!this.canVisitStep(id)) return
            this.errors.general = ''
            this.blend.pasoActual = id
            this.persist()
        },
        nextStep() {
            this.errors.general = ''
            if (this.pasoActual === 1 && !this.formatReady) {
                this.errors.general = 'Elige un formato y un empaque para continuar.'
                return
            }
            if (this.pasoActual === 2 && !this.isIngredientsComplete) {
                this.errors.general = 'Completa el peso de tu fórmula antes de continuar.'
                return
            }
            this.blend.pasoActual = Math.min(3, this.pasoActual + 1)
            this.persist()
        },
        summaryAction() {
            if (this.pasoActual === 3) {
                this.finalizarBlend()
                return
            }
            this.nextStep()
        },
        setFormato(formato) {
            this.blend.formato = formato.id
            this.blend.formato1 = formato
            if (this.blend.hierbaBase1) this.recalculateQuantities()
            this.persist()
        },
        setEmpaque(empaque) {
            this.blend.empaque = empaque.id
            this.blend.empaque1 = empaque
            this.persist()
        },
        setHierbaBase(item) {
            this.blend.hierbaBase = item.id
            this.blend.hierbaBase1 = {
                ...item,
                cantidad: this.blend.hierbaBase1?.cantidad || Math.round(this.pesoMaximo * 0.6),
            }
            this.recalculateQuantities()
            this.persist()
        },
        setBaseRatio(percent) {
            this.blend.basePorcentaje = percent === 40 ? 40 : 60
            this.recalculateQuantities()
            this.persist()
        },
        isSelected(group, id) {
            return (this.blend[group] || []).some((item) => item.id === id)
        },
        toggleNote(group, item) {
            const selected = this.blend[group] || []
            const index = selected.findIndex((current) => current.id === item.id)
            if (index !== -1) selected.splice(index, 1)
            else {
                if (!this.blend.hierbaBase1) {
                    this.errors.general = 'Selecciona primero una hierba base.'
                    return
                }
                if (this.availableComplementGrams < 10) {
                    this.errors.general = 'Ya no queda espacio para otro complemento de 10 g.'
                    return
                }
                selected.push({ ...item, cantidad: 10 })
            }
            this.recalculateQuantities()
            this.persist()
        },
        recalculateQuantities() {
            if (!this.blend.hierbaBase1) return
            const basePercent = Number(this.blend.basePorcentaje || 60) === 40 ? 0.4 : 0.6
            this.blend.hierbaBase1.cantidad = Math.round(this.pesoMaximo * basePercent)
            const maxComplementos = Math.floor(
                (this.pesoMaximo - this.blend.hierbaBase1.cantidad) / 10,
            )
            while (this.selectedNotes.length > maxComplementos) {
                const group = ['especias', 'frutas', 'complementos'].find(
                    (key) => this.blend[key]?.length,
                )
                if (!group) break
                this.blend[group].pop()
            }
            const notes = this.selectedNotes
            if (!notes.length) return
            const remaining = this.pesoMaximo - this.blend.hierbaBase1.cantidad
            if (remaining < notes.length * 10) return
            if (notes.length === 1) {
                notes[0].cantidad = remaining
                return
            }
            if (notes.length === 2) {
                const first = Math.max(10, Math.min(remaining - 10, Math.round(remaining * 0.625)))
                notes[0].cantidad = first
                notes[1].cantidad = remaining - first
                return
            }
            const baseShare = Math.floor(remaining / notes.length)
            let remainder = remaining - baseShare * notes.length
            notes.forEach((item) => {
                item.cantidad = baseShare + (remainder > 0 ? 1 : 0)
                remainder -= remainder > 0 ? 1 : 0
            })
        },
        canIncrease(type, item) {
            if (this.totalGramos >= this.pesoMaximo) return false
            if (type === 'base') return Boolean(this.blend.hierbaBase1)
            return Boolean(item)
        },
        canDecrease(type, item) {
            if (type === 'base') {
                return Boolean(
                    this.blend.hierbaBase1 &&
                    Number(this.blend.hierbaBase1.cantidad || 0) > this.baseMinGramos,
                )
            }
            return Boolean(item && Number(item.cantidad || 0) > 10)
        },
        changeAmount(type, delta, item) {
            if (type === 'base' && this.blend.hierbaBase1) {
                const min = this.baseMinGramos
                const max = Math.max(min, this.pesoMaximo - this.notesGramos)
                const next = Math.max(
                    min,
                    Math.min(max, Number(this.blend.hierbaBase1.cantidad) + delta),
                )
                this.blend.hierbaBase1.cantidad = next
            } else if (item) {
                const otherNotesGramos = this.notesGramos - Number(item.cantidad || 0)
                const max = Math.max(10, this.pesoMaximo - this.baseGramos - otherNotesGramos)
                const next = Math.max(10, Math.min(max, Number(item.cantidad) + delta))
                item.cantidad = next
            }
            this.persist()
        },
        completeFormula() {
            if (!this.blend.hierbaBase1) {
                this.errors.general = 'Selecciona una hierba base primero.'
                return
            }
            if (!this.selectedNotes.length) {
                this.errors.general = 'Añade al menos un complemento para completar la fórmula.'
                return
            }
            this.recalculateQuantities()
            this.persist()
        },
        finalizarBlend() {
            if (!this.isIngredientsComplete) {
                this.errors.general = 'La fórmula todavía no está completa.'
                this.blend.pasoActual = 2
                return
            }
            const producto = {
                ...this.formatoSeleccionado,
                nombre: this.blend.etiqueta || 'Blend Personal',
                cantidad: 1,
                precio: this.costoTotal.toFixed(2),
                unidad: 'unidad',
                blend_datos: {
                    ...this.blend,
                    totalGramos: this.totalGramos,
                    totalPrecio: this.costoTotal,
                },
            }
            Cart.add(producto)
            clearTimeout(this.timeOutCloseToast)
            this.showToast = true
            this.timeOutCloseToast = setTimeout(() => {
                this.showToast = false
            }, 2500)
            Blend.clear()
        },
    },
}
</script>

<style>
.blend-builder {
    color: var(--sunka-ink);
}
.blend-steps {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    padding: 13px 28px;
    border: 1px solid rgba(35, 29, 24, 0.16);
    border-radius: 15px;
    background: var(--sunka-white);
}
.blend-step {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 10px;
    border: 0;
    background: transparent;
    color: var(--sunka-stone);
    font: inherit;
    text-align: left;
    cursor: pointer;
}
.blend-step:disabled {
    cursor: default;
}
.blend-step__number {
    display: grid;
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(35, 29, 24, 0.2);
    border-radius: 50%;
    font-size: 11px;
}
.blend-step__title {
    font-size: 13px;
    white-space: nowrap;
}
.blend-step__line {
    height: 1px;
    flex: 1;
    margin: 0 18px;
    background: rgba(35, 29, 24, 0.14);
}
.blend-step.is-active {
    color: var(--sunka-forest);
    font-weight: 700;
}
.blend-step.is-active .blend-step__number {
    border-color: var(--sunka-brass);
    color: var(--sunka-white);
    background: var(--sunka-brass);
    box-shadow: 0 0 0 5px rgba(184, 138, 61, 0.12);
}
.blend-step.is-done .blend-step__number {
    border-color: var(--sunka-forest);
    color: var(--sunka-white);
    background: var(--sunka-forest);
}
.blend-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 370px;
    align-items: start;
    gap: 26px;
}
.blend-config-card {
    overflow: hidden;
    border: 1px solid rgba(35, 29, 24, 0.15);
    border-radius: 17px;
    background: var(--sunka-white);
}
.blend-config-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 30px 20px;
    border-bottom: 1px solid var(--sunka-sand);
}
.blend-eyebrow,
.blend-panel-kicker {
    margin: 0 0 6px;
    color: var(--sunka-brass);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.17em;
    text-transform: uppercase;
}
.blend-config-head h1 {
    margin: 0;
    font-family: Jost, Helvetica, Arial, sans-serif;
    font-size: 28px;
    line-height: 1.12;
    font-weight: 700;
}
.blend-config-head p:not(.blend-eyebrow) {
    margin: 5px 0 0;
    color: var(--sunka-stone);
    font-size: 13px;
}
.blend-format-pill {
    display: flex;
    min-width: 174px;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 14px;
    border: 1px solid rgba(35, 29, 24, 0.18);
    border-radius: 8px;
    background: var(--sunka-white);
    color: var(--sunka-forest);
    text-align: left;
    cursor: pointer;
}
.blend-format-pill strong {
    font-size: 12px;
}
.blend-format-pill span {
    color: var(--sunka-stone);
    font-size: 11px;
}
.blend-panel {
    padding: 24px 30px 30px;
}
.blend-panel-heading,
.blend-section-title {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
}
.blend-panel-heading h2,
.blend-section-title h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
}
.blend-label-panel .blend-panel-heading h2 {
    color: var(--sunka-brass);
}
.blend-format-panel .blend-panel-heading h2 {
    color: var(--sunka-brass);
}
.blend-panel-heading p,
.blend-section-title p {
    margin: 4px 0 0;
    color: var(--sunka-stone);
    font-size: 12px;
}
.blend-panel-count,
.blend-section-hint {
    color: var(--sunka-stone);
    font-size: 11px;
}
.blend-panel-count.is-ready {
    color: var(--sunka-forest);
    font-weight: 600;
}
.blend-choice-grid {
    display: grid;
    gap: 12px;
    margin-top: 16px;
}
.blend-choice-grid--formats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}
.blend-choice-grid--packaging {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}
.blend-choice-card {
    position: relative;
    display: flex;
    min-height: 94px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    padding: 15px;
    border: 1px solid var(--sunka-sand);
    border-radius: 10px;
    background: var(--sunka-white);
    color: var(--sunka-ink);
    text-align: left;
    cursor: pointer;
    transition: 0.18s ease;
}
.blend-choice-card:hover {
    transform: translateY(-1px);
    border-color: var(--sunka-brass);
}
.blend-choice-card.is-selected {
    border-color: var(--sunka-forest);
    box-shadow:
        inset 0 0 0 1px var(--sunka-forest),
        0 5px 14px rgba(13, 35, 23, 0.08);
    background: #f5f8f3;
}
.blend-choice-card strong {
    font-size: 13px;
}
.blend-choice-card small {
    color: var(--sunka-stone);
    font-size: 11px;
}
.blend-choice-card__check {
    position: absolute;
    top: 10px;
    right: 11px;
    display: grid;
    width: 21px;
    height: 21px;
    place-items: center;
    border: 1px solid var(--sunka-sand);
    border-radius: 50%;
    color: var(--sunka-white);
    font-size: 11px;
}
.blend-choice-card.is-selected .blend-choice-card__check {
    border-color: var(--sunka-brass);
    background: var(--sunka-brass);
}
.blend-panel-heading--packaging {
    margin-top: 31px;
    padding-top: 22px;
    border-top: 1px solid var(--sunka-sand);
}
.blend-package-choice {
    display: grid;
    grid-template-columns: 30px 1fr auto;
    min-height: 75px;
    align-items: center;
    gap: 10px;
}
.blend-package-choice > span:not(.blend-package-choice__icon) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
}
.blend-package-choice__icon {
    display: grid;
    width: 27px;
    height: 31px;
    place-items: center;
    border: 1px solid var(--sunka-brass);
    color: var(--sunka-brass);
    font-size: 17px;
}
.blend-package-choice b {
    color: var(--sunka-forest);
    font-size: 11px;
    white-space: nowrap;
}
.blend-primary-action,
.blend-secondary-action,
.blend-summary-action,
.blend-complete-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 48px;
    border: 1px solid var(--sunka-forest);
    border-radius: 0;
    padding: 0 18px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.18s ease;
}
.blend-primary-action {
    width: 100%;
    margin-top: 26px;
    background: var(--sunka-forest);
    color: var(--sunka-white);
}
.blend-primary-action:hover:not(:disabled) {
    background: var(--sunka-brass);
    border-color: var(--sunka-brass);
}
.blend-primary-action:disabled,
.blend-summary-action:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}
.blend-secondary-action {
    border-color: var(--sunka-sand);
    background: var(--sunka-white);
    color: var(--sunka-forest);
}
.blend-secondary-action:hover {
    border-color: var(--sunka-brass);
}
.blend-base-ratio {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    border-radius: 10px;
    background: rgba(230, 218, 200, 0.46);
}
.blend-base-ratio > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.blend-base-ratio strong {
    font-size: 12px;
}
.blend-base-ratio span {
    color: var(--sunka-stone);
    font-size: 10px;
}
.blend-ratio-toggle {
    display: flex;
    flex: 0 0 auto;
    padding: 3px;
    border-radius: 999px;
    background: rgba(216, 208, 194, 0.72);
}
.blend-ratio-toggle button {
    border: 0;
    border-radius: 999px;
    padding: 8px 13px;
    background: transparent;
    color: var(--sunka-stone);
    font-size: 10px;
    cursor: pointer;
    white-space: nowrap;
}
.blend-ratio-toggle button.is-selected {
    background: var(--sunka-white);
    color: var(--sunka-forest);
    box-shadow: 0 2px 7px rgba(35, 29, 24, 0.12);
    font-weight: 700;
}
.blend-tabs {
    display: flex;
    gap: 24px;
    border-bottom: 1px solid var(--sunka-sand);
}
.blend-tabs button {
    position: relative;
    border: 0;
    padding: 0 0 12px;
    background: transparent;
    color: var(--sunka-stone);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
}
.blend-tabs button.is-active {
    color: var(--sunka-forest);
}
.blend-tabs button.is-active::after {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: var(--sunka-brass);
    content: '';
}
.blend-tab-panel {
    padding-top: 22px;
}
.blend-section-title--formula {
    align-items: center;
}
.blend-section-title--formula {
    margin-top: 24px;
}
.blend-section-title--formula h2 {
    font-size: 14px;
}
.blend-formula-total {
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(221, 232, 222, 0.7);
    color: var(--sunka-forest);
    font-size: 10px;
}
.blend-base-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
}
.blend-ingredient-card {
    position: relative;
    display: flex;
    min-height: 125px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 5px;
    padding: 13px;
    border: 1px solid var(--sunka-sand);
    border-radius: 11px;
    background: var(--sunka-white);
    color: var(--sunka-ink);
    text-align: left;
    cursor: pointer;
    transition: 0.18s ease;
}
.blend-ingredient-card:hover {
    transform: translateY(-1px);
    border-color: var(--sunka-brass);
}
.blend-ingredient-card.is-selected {
    border-color: var(--sunka-forest);
    box-shadow:
        inset 0 0 0 1px var(--sunka-forest),
        0 9px 18px rgba(13, 35, 23, 0.09);
    background: #f5f8f3;
}
.blend-ingredient-card__icon,
.blend-note-card__icon {
    display: grid;
    place-items: center;
    border-radius: 50%;
    font-weight: 700;
}
.blend-ingredient-card__icon {
    width: 42px;
    height: 42px;
    margin-bottom: auto;
    font-size: 23px;
}
.blend-ingredient-card__icon.is-sage,
.blend-note-card__icon.is-sage {
    background: #bdcfb1;
    color: #294832;
}
.blend-ingredient-card__icon.is-gold,
.blend-note-card__icon.is-gold {
    background: #ecd596;
    color: #7c5b21;
}
.blend-ingredient-card__icon.is-rose,
.blend-note-card__icon.is-rose {
    background: #dda2ad;
    color: #703d4a;
}
.blend-ingredient-card__icon.is-clay,
.blend-note-card__icon.is-clay {
    background: #d8b39c;
    color: #68412f;
}
.blend-ingredient-card__icon.is-lilac,
.blend-note-card__icon.is-lilac {
    background: #c4b9d7;
    color: #53436d;
}
.blend-ingredient-card__check {
    position: absolute;
    top: 13px;
    right: 13px;
    display: grid;
    width: 21px;
    height: 21px;
    place-items: center;
    border: 1px solid var(--sunka-sand);
    border-radius: 50%;
    color: var(--sunka-white);
    font-size: 10px;
}
.blend-ingredient-card.is-selected .blend-ingredient-card__check {
    border-color: var(--sunka-brass);
    background: var(--sunka-brass);
}
.blend-ingredient-card strong {
    font-size: 12px;
}
.blend-ingredient-card small {
    color: var(--sunka-stone);
    font-size: 10px;
    line-height: 1.25;
}
.blend-note-group + .blend-note-group {
    margin-top: 20px;
}
.blend-section-title + .blend-note-group {
    margin-top: 28px;
}
.blend-note-group h3 {
    margin: 0 0 9px;
    color: var(--sunka-stone);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
.blend-note-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
}
.blend-note-card {
    display: grid;
    grid-template-columns: 31px 1fr 20px;
    align-items: center;
    gap: 9px;
    min-height: 61px;
    border: 1px solid var(--sunka-sand);
    border-radius: 9px;
    padding: 9px 11px;
    background: var(--sunka-white);
    color: var(--sunka-ink);
    text-align: left;
    cursor: pointer;
}
.blend-note-card:hover:not(:disabled) {
    border-color: var(--sunka-brass);
}
.blend-note-card.is-selected {
    border-color: var(--sunka-forest);
    box-shadow: inset 0 0 0 1px var(--sunka-forest);
    background: #f5f8f3;
}
.blend-note-card.is-disabled {
    opacity: 0.42;
    cursor: not-allowed;
}
.blend-note-card__icon {
    width: 29px;
    height: 29px;
    font-size: 15px;
}
.blend-note-card strong,
.blend-note-card small {
    display: block;
}
.blend-note-card strong {
    font-size: 11px;
}
.blend-note-card small {
    margin-top: 2px;
    color: var(--sunka-stone);
    font-size: 9px;
}
.blend-note-card i {
    display: grid;
    width: 20px;
    height: 20px;
    place-items: center;
    border: 1px solid var(--sunka-sand);
    border-radius: 50%;
    color: var(--sunka-stone);
    font-size: 13px;
    font-style: normal;
}
.blend-note-card.is-selected i {
    border-color: var(--sunka-brass);
    color: var(--sunka-brass);
}
.blend-formula-block {
    margin-top: 25px;
    padding-top: 18px;
    border-top: 1px solid var(--sunka-sand);
}
.blend-formula-bar,
.blend-summary-bar {
    display: flex;
    overflow: hidden;
    height: 10px;
    margin-top: 14px;
    border-radius: 99px;
    background: #e6e1d8;
}
.blend-formula-bar span,
.blend-summary-bar span {
    min-width: 0;
    transition: width 0.2s ease;
}
.blend-formula-bar .is-forest,
.blend-summary-bar .is-forest {
    background: var(--sunka-forest);
}
.blend-formula-bar .is-sage,
.blend-summary-bar .is-sage {
    background: #849d85;
}
.blend-formula-bar .is-gold,
.blend-summary-bar .is-gold {
    background: #d4ad60;
}
.blend-formula-bar .is-clay,
.blend-summary-bar .is-clay {
    background: #b87d3d;
}
.blend-formula-bar .is-rose,
.blend-summary-bar .is-rose {
    background: #c9858e;
}
.blend-formula-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 7px;
    color: var(--sunka-stone);
    font-size: 10px;
}
.blend-selected-notes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 15px;
}
.blend-selected-note,
.blend-adjust-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--sunka-sand);
    border-radius: 10px;
}
.blend-selected-note strong,
.blend-selected-note small,
.blend-adjust-row strong,
.blend-adjust-row small {
    display: block;
}
.blend-selected-note strong,
.blend-adjust-row strong {
    font-size: 11px;
}
.blend-selected-note small,
.blend-adjust-row small {
    margin-top: 3px;
    color: var(--sunka-stone);
    font-size: 9px;
}
.blend-stepper-control {
    display: inline-grid;
    grid-template-columns: 24px auto 24px;
    align-items: center;
    gap: 7px;
    flex: 0 0 auto;
}
.blend-stepper-control button {
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border: 1px solid var(--sunka-sand);
    border-radius: 50%;
    background: var(--sunka-white);
    color: var(--sunka-forest);
    cursor: pointer;
}
.blend-stepper-control button:hover {
    border-color: var(--sunka-brass);
}
.blend-stepper-control button:disabled {
    cursor: not-allowed;
    opacity: 0.35;
}
.blend-stepper-control b {
    min-width: 30px;
    text-align: center;
    font-size: 11px;
}
.blend-empty-state {
    margin: 14px 0 0;
    padding: 13px;
    border: 1px dashed var(--sunka-sand);
    color: var(--sunka-stone);
    font-size: 11px;
    text-align: center;
}
.blend-validation {
    min-height: 18px;
    margin: 18px 0 -10px;
    color: var(--sunka-stone);
    font-size: 11px;
}
.blend-validation.is-error {
    color: #9f513e;
}
.blend-complete-action {
    margin-top: 19px;
    border-color: var(--sunka-sand);
    background: var(--sunka-white);
    color: var(--sunka-forest);
    font-size: 10px;
}
.blend-adjust-list {
    display: grid;
    gap: 9px;
    margin-top: 17px;
}
.blend-label-panel {
    min-height: 310px;
}
.blend-field {
    display: grid;
    gap: 7px;
    margin-top: 29px;
    color: var(--sunka-forest);
    font-size: 11px;
    font-weight: 700;
}
.blend-field input {
    min-height: 48px;
    border: 1px solid var(--sunka-sand);
    border-radius: 0;
    padding: 0 13px;
    color: var(--sunka-ink);
    font: inherit;
    font-weight: 400;
    outline: none;
}
.blend-field input:focus {
    border-color: var(--sunka-brass);
    box-shadow: 0 0 0 3px rgba(184, 138, 61, 0.12);
}
.blend-label-note {
    margin-top: 11px;
    color: var(--sunka-stone);
    font-size: 11px;
}
.blend-panel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 36px;
}
.blend-panel-actions .blend-primary-action {
    width: auto;
    margin-top: 0;
}
.blend-summary-card {
    position: sticky;
    top: 24px;
    overflow: hidden;
    padding: 20px 24px 18px;
    border-radius: 16px;
    background-color: var(--sunka-forest);
    color: var(--sunka-white);
    box-shadow: 0 18px 38px rgba(13, 35, 23, 0.18);
}
.blend-summary-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}
.blend-summary-head h2 {
    margin: 0;
    font-size: 15px;
}
.blend-summary-head > span {
    padding: 6px 9px;
    border: 1px solid rgba(212, 173, 96, 0.45);
    border-radius: 999px;
    color: #ead59d;
    font-size: 8px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
}
.blend-summary-head i {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-right: 4px;
    border-radius: 50%;
    background: #d4ad60;
    vertical-align: middle;
}
.blend-product-preview {
    display: flex;
    min-height: 292px;
    align-items: center;
    justify-content: center;
    margin-top: 17px;
    padding: 13px;
    border-radius: 10px;
    background: radial-gradient(circle at center, #ffffff 0%, #fffdf8 38%, #e8dfd0 100%);
    color: var(--sunka-ink);
}
.blend-pack-preview {
    display: flex;
    width: 70%;
    min-height: 258px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid rgba(71, 60, 42, 0.18);
    background: linear-gradient(145deg, #f9f3e9, #d9cab2);
    box-shadow: 0 4px 9px rgba(35, 29, 24, 0.12);
    text-align: center;
}
.blend-pack-preview.is-bolsa {
    width: 72%;
    border-radius: 8px 8px 12px 12px;
    background: linear-gradient(155deg, #fbf5e9 0%, #e2d4bd 100%);
}
.blend-pack-preview.is-bolsa::before {
    width: 72%;
    height: 7px;
    margin-bottom: 9px;
    border: 1px solid rgba(71, 60, 42, 0.28);
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    content: '';
}
.blend-pack-preview.is-lata {
    width: 53%;
    border-radius: 22px;
    background: linear-gradient(90deg, #d1c0a4 0%, #faf2e3 16%, #e3d2b6 84%, #bba98d 100%);
}
.blend-pack-preview.is-caja {
    width: 64%;
    border-radius: 3px;
    background: linear-gradient(145deg, #fbf4e8 0%, #dfcfb4 100%);
}
.blend-pack-preview img {
    display: block;
    width: min(100%, 108px);
    height: auto;
    object-fit: contain;
}
.blend-pack-preview b {
    max-width: 92%;
    margin-top: 12px;
    font-family: Georgia, serif;
    font-size: 17px;
    line-height: 1.1;
    font-weight: 400;
}
.blend-pack-detail {
    display: flex;
    width: min(88%, 170px);
    flex-direction: column;
    gap: 3px;
    margin-top: 6px;
    padding: 8px 10px;
    border: 1px solid rgba(71, 60, 42, 0.08);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.82);
    text-align: left;
}
.blend-pack-detail span {
    color: rgba(35, 29, 24, 0.48);
    font-size: 6px;
    letter-spacing: 0.12em;
}
.blend-pack-detail strong {
    color: var(--sunka-ink);
    font-size: 9px;
    line-height: 1.25;
}
.blend-pack-preview em {
    max-width: 92%;
    margin-top: 3px;
    font-size: 10px;
    line-height: 1.35;
    font-style: normal;
}
.blend-pack-preview small {
    margin-top: 6px;
    color: rgba(35, 29, 24, 0.62);
    font-size: 8px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}
.blend-summary-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 11px;
}
.blend-summary-meta > div {
    display: grid;
    gap: 3px;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 9px;
}
.blend-summary-meta small {
    color: rgba(255, 253, 248, 0.58);
    font-size: 7px;
    letter-spacing: 0.1em;
}
.blend-summary-meta strong {
    font-size: 11px;
}
.blend-summary-meta span {
    color: rgba(255, 253, 248, 0.7);
    font-size: 8px;
}
.blend-summary-section {
    margin-top: 17px;
}
.blend-summary-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
}
.blend-summary-title h3 {
    margin: 0;
    font-size: 11px;
}
.blend-summary-title span {
    color: rgba(255, 253, 248, 0.56);
    font-size: 8px;
}
.blend-summary-bar {
    height: 7px;
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.15);
}
.blend-summary-bar .is-forest {
    background: #b6c7a9;
}
.blend-summary-list {
    display: grid;
    gap: 7px;
    margin: 11px 0 0;
    padding: 0;
    list-style: none;
}
.blend-summary-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: rgba(255, 253, 248, 0.82);
    font-size: 9px;
}
.blend-summary-list li span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
.blend-summary-list li i {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
}
.blend-summary-list li i.is-forest {
    background: #d4ad60;
}
.blend-summary-list li i.is-sage {
    background: #849d85;
}
.blend-summary-list li i.is-gold {
    background: #d4ad60;
}
.blend-summary-list li i.is-clay {
    background: #b87d3d;
}
.blend-summary-list li i.is-rose {
    background: #c9858e;
}
.blend-summary-list small {
    color: rgba(255, 253, 248, 0.55);
    font-size: 8px;
}
.blend-summary-muted {
    color: rgba(255, 253, 248, 0.48) !important;
}
.blend-label-summary {
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.13);
}
.blend-label-summary p {
    margin: 7px 0 0;
    color: rgba(255, 253, 248, 0.62);
    font-size: 9px;
}
.blend-price-lines {
    display: grid;
    gap: 7px;
    margin-top: 15px;
    padding-top: 13px;
    border-top: 1px solid rgba(255, 255, 255, 0.13);
}
.blend-price-lines > div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: rgba(255, 253, 248, 0.68);
    font-size: 9px;
}
.blend-price-lines b {
    color: var(--sunka-white);
    font-size: 10px;
}
.blend-price-lines .blend-price-total {
    align-items: center;
    margin-top: 2px;
    color: var(--sunka-white);
    font-size: 12px;
}
.blend-price-lines .blend-price-total b {
    font-size: 22px;
}
.blend-summary-action {
    width: 100%;
    margin-top: 17px;
    border-color: var(--sunka-brass);
    border-radius: 8px;
    background: var(--sunka-brass);
    color: var(--sunka-white);
}
.blend-mobile-summary,
.blend-summary-action-mobile {
    display: none;
}
.blend-summary-action:hover:not(:disabled) {
    background: #c69a50;
}
.blend-summary-footnote {
    margin: 10px 0 0;
    color: rgba(255, 253, 248, 0.43);
    font-size: 8px;
    text-align: center;
}
.blend-toast {
    position: fixed;
    right: 24px;
    top: 48px;
    z-index: 40;
    padding: 12px 17px;
    border-radius: 5px;
    background: var(--sunka-ink);
    color: var(--sunka-white);
    font-size: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 980px) {
    .blend-layout {
        grid-template-columns: 1fr;
    }
    .blend-summary-card {
        position: relative;
        top: auto;
    }
}
@media (max-width: 720px) {
    .blend-steps {
        padding: 12px 14px;
    }
    .blend-step {
        justify-content: center;
    }
    .blend-step__title {
        display: none;
    }
    .blend-step__line {
        margin: 0 8px;
    }
    .blend-config-head {
        padding: 21px 20px 17px;
    }
    .blend-config-head h1 {
        font-size: 24px;
    }
    .blend-format-pill {
        min-width: 126px;
    }
    .blend-panel {
        padding: 20px;
    }
    .blend-choice-grid--formats,
    .blend-choice-grid--packaging {
        grid-template-columns: 1fr;
    }
    .blend-base-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .blend-base-ratio {
        align-items: stretch;
        flex-direction: column;
    }
    .blend-ratio-toggle {
        justify-content: stretch;
    }
    .blend-ratio-toggle button {
        flex: 1;
    }
    .blend-tabs {
        gap: 15px;
        overflow-x: auto;
    }
    .blend-tabs button {
        white-space: nowrap;
    }
    .blend-selected-notes,
    .blend-note-grid {
        grid-template-columns: 1fr;
    }
    .blend-formula-meta {
        flex-wrap: wrap;
        gap: 5px 15px;
    }
    .blend-builder {
        padding-bottom: 104px;
    }
    .blend-summary-card {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 30;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
        border: 1px solid var(--sunka-sand);
        border-bottom: 0;
        border-radius: 14px 14px 0 0;
        background: var(--sunka-white);
        color: var(--sunka-ink);
        box-shadow: 0 -8px 24px rgba(13, 35, 23, 0.14);
    }
    .blend-summary-head,
    .blend-product-preview,
    .blend-summary-meta,
    .blend-summary-section,
    .blend-price-lines,
    .blend-summary-footnote {
        display: none;
    }
    .blend-mobile-summary {
        display: grid;
        min-width: 0;
        gap: 2px;
    }
    .blend-mobile-summary small {
        overflow: hidden;
        color: var(--sunka-stone);
        font-size: 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .blend-mobile-summary strong {
        color: var(--sunka-forest);
        font-size: 19px;
    }
    .blend-summary-action {
        width: auto;
        min-width: 132px;
        min-height: 44px;
        margin-top: 0;
        padding: 0 16px;
        white-space: nowrap;
    }
    .blend-summary-action-full {
        display: none;
    }
    .blend-summary-action-mobile {
        display: inline;
    }
}
@media (max-width: 460px) {
    .blend-config-head {
        align-items: flex-start;
        flex-direction: column;
    }
    .blend-format-pill {
        width: 100%;
    }
    .blend-summary-card {
        padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
    }
    .blend-product-preview {
        padding: 10px;
    }
    .blend-pack-preview {
        min-height: 230px;
    }
    .blend-panel-actions {
        align-items: stretch;
        flex-direction: column-reverse;
    }
    .blend-panel-actions .blend-primary-action,
    .blend-panel-actions .blend-secondary-action {
        width: 100%;
    }
}
</style>
