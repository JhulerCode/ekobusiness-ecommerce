const BLEND_KEY = "sunka_blend";

export const Blend = {
    get() {
        const data = localStorage.getItem(BLEND_KEY);

        return data ? JSON.parse(data) : {
            complementos: [],
            frutas: [],
            especias: [],
        }
    },

    save(blend) {
        localStorage.setItem(BLEND_KEY, JSON.stringify(blend));
    },

    updatePrices(hierbasBase, complementos, frutas, especias) {
        const blend = this.get();

        if (blend.hierbaBase1) {
            const i = hierbasBase.find(a => a.id == blend.hierbaBase)
            blend.hierbaBase1.precio = i ? i.precio : null
        }

        for (const a of blend.complementos) {
            const i = complementos.find(b => b.id == a.id)
            a.precio = i ? i.precio : null
        }

        for (const a of blend.frutas) {
            const i = frutas.find(b => b.id == a.id)
            a.precio = i ? i.precio : null
        }

        for (const a of blend.especias) {
            const i = especias.find(b => b.id == a.id)
            a.precio = i ? i.precio : null
        }

        this.save(blend)

        return blend
    },

    clear() {
        localStorage.removeItem(BLEND_KEY);
    },
};
