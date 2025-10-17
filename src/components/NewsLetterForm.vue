<template>
    <form
        @submit.prevent="submit"
        class="flex flex-col sm:flex-row gap-4 justify-center"
    >
        <input
            v-model="email"
            type="email"
            placeholder="Tu correo electrónico"
            class="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <button
            :disabled="loading"
            class="px-6 py-3 rounded-lg border border-neutral-900 bg-neutral-900 text-white font-medium shadow-sm hover:bg-white hover:text-neutral-900 transition"
        >
            <span v-if="loading">Enviando…</span>
            <span v-else>Suscribirme</span>
        </button>
    </form>
</template>

<script>
import { host } from '../lib/api.js';

export default {
    data() {
        return { email: '', loading: false };
    },
    methods: {
        validEmail(e) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        },
        async submit() {
            if (!this.validEmail(this.email)) {
                return alert('Ingresa un correo válido.');
            }

            this.loading = true;

            try {
                const res = await fetch(`${host}/newsletter`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email }),
                });

                const json = await res.json();

                if (res.ok) {
                    localStorage.setItem('newsletter_subscribed', '1');
                    alert('Gracias — revisa tu correo para confirmar.');
                    this.email = '';
                } else {
                    alert(json?.message || 'Error al suscribirse');
                }
            } catch (err) {
                console.error(err);
                alert('Error de red');
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
