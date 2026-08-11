const BLEND_KEY = "sunka_blend";

function emptyBlend() {
    return {
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
        etiqueta: null,
        preparadoPara: null,
    };
}

export const Blend = {
    get() {
        const data = localStorage.getItem(BLEND_KEY);
        if (!data) return emptyBlend();

        try {
            const parsed = JSON.parse(data);
            return {
                ...emptyBlend(),
                ...parsed,
                complementos: Array.isArray(parsed.complementos)
                    ? parsed.complementos
                    : [],
                frutas: Array.isArray(parsed.frutas)
                    ? parsed.frutas
                    : [],
                especias: Array.isArray(parsed.especias)
                    ? parsed.especias
                    : [],
            };
        } catch {
            return emptyBlend();
        }
    },

    save(blend) {
        localStorage.setItem(BLEND_KEY, JSON.stringify(blend));
    },

    updatePrices(hierbasBase, complementos, frutas, especias) {
        const blend = this.get();

        if (blend.hierbaBase1) {
            const i = hierbasBase.find(a => a.id == blend.hierbaBase)
            blend.hierbaBase1 = i ? { ...blend.hierbaBase1, ...i, precio: i.precio } : blend.hierbaBase1
        }

        for (const a of blend.complementos) {
            const i = complementos.find(b => b.id == a.id)
            Object.assign(a, i || {}, { precio: i ? i.precio : null })
        }

        for (const a of blend.frutas) {
            const i = frutas.find(b => b.id == a.id)
            Object.assign(a, i || {}, { precio: i ? i.precio : null })
        }

        for (const a of blend.especias) {
            const i = especias.find(b => b.id == a.id)
            Object.assign(a, i || {}, { precio: i ? i.precio : null })
        }

        this.save(blend)

        return blend
    },

    clear() {
        localStorage.removeItem(BLEND_KEY);
    },
};
