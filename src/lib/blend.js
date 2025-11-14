const BLEND_KEY = "sunka_blend";

export const Blend = {
    get() {
        const data = localStorage.getItem(BLEND_KEY);
        return data ? JSON.parse(data) : {};
    },

    save(blend) {
        localStorage.setItem(BLEND_KEY, JSON.stringify(blend));
        window.dispatchEvent(new CustomEvent("blend-updated", { detail: blend }));
    },

    update(section, key, value) {
        const blend = this.get();

        if (!blend[section]) blend[section] = {};
        blend[section][key] = value;

        this.save(blend);
    },

    setEmpaque(value) {
        const blend = this.get();
        blend.empaque = value;
        this.save(blend);
    },

    setFormato(value) {
        const blend = this.get();
        blend.formato = value;
        this.save(blend);
    },

    clear() {
        localStorage.removeItem(BLEND_KEY);
        window.dispatchEvent(new CustomEvent("blend-updated", { detail: null }));
    },
};
