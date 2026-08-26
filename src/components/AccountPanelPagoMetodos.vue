<template>
    <div class="mb-8 flex flex-col gap-5 border-b border-sunka-sand pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
                Métodos guardados
            </p>
            <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                {{ headText }}
            </h2>
            <p class="mt-1 text-sm text-sunka-stone">Administra las tarjetas asociadas a tu cuenta.</p>
        </div>

        <JdButton
            text="Actualizar"
            tipo="2"
            :loading="loading"
            @click="getCustomerWallet"
            class="!h-10 !rounded-none !border-sunka-sand !px-5 !py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sunka-forest"
        />
    </div>

    <div v-if="user.wallet && user.wallet.length > 0" class="grid gap-4 xl:grid-cols-2">
        <div
            v-for="(a, i) in user.wallet"
            :key="i"
            class="flex min-h-32 items-start justify-between gap-5 border border-sunka-sand bg-sunka-white p-5 transition-colors hover:bg-sunka-cream/50 sm:p-6"
        >
            <div class="flex min-w-0 items-center gap-4">
                <div class="grid h-12 w-16 shrink-0 place-items-center border border-sunka-sand bg-sunka-cream">
                <img
                    :src="getCardBrandIcon(a.tokenDetails.effectiveBrand)"
                    class="max-h-8 w-10 object-contain"
                    :alt="a.tokenDetails.effectiveBrand || 'Tarjeta'"
                />
                </div>

                <div>
                    <p class="font-heading text-base font-semibold tracking-wide text-sunka-forest">{{ a.tokenDetails.pan }}</p>

                    <p class="mt-1 text-xs uppercase tracking-[0.1em] text-sunka-stone">
                        <!-- {{ tarjeta_tipos.find((t) => t.id == a.doc_tipo).nombre }} | Expira el -->
                        Expira el {{ a.tokenDetails.expiryMonth }}/{{ a.tokenDetails.expiryYear }}
                    </p>
                </div>
            </div>

            <div class="flex shrink-0 flex-col gap-2">
                <button
                    @click="openQuestion(a.paymentMethodToken)"
                    title="Eliminar"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center border border-sunka-sand text-sunka-stone transition-colors hover:border-[var(--sunka-danger)] hover:text-[var(--sunka-danger)]"
                >
                    <Trash />
                </button>
            </div>
        </div>
    </div>

    <div v-else class="border border-dashed border-sunka-sand bg-sunka-cream/45 px-5 py-12 text-center">
        <p class="font-heading text-lg font-semibold text-sunka-forest">No tienes medios de pago guardados</p>
        <p class="mt-1 text-sm text-sunka-stone">Las tarjetas que decidas guardar aparecerán aquí.</p>
    </div>

    <transition name="fade">
        <div v-if="showQuestion" class="fixed inset-0 z-[110] flex items-center justify-center bg-sunka-ink/70 p-4 backdrop-blur-sm" @click.self="closeQuestion">
            <div class="w-full max-w-md border border-sunka-sand bg-sunka-white shadow-2xl">
                <main class="px-7 py-8">
                    <p class="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--sunka-danger)]">Confirmar acción</p>
                    <p class="mt-2 font-heading text-xl font-semibold text-sunka-forest">¿Deseas eliminar esta tarjeta?</p>
                    <p class="mt-2 text-sm text-sunka-stone">Dejará de estar disponible para próximas compras.</p>
                </main>

                <footer class="flex justify-end gap-2 border-t border-sunka-sand bg-sunka-cream/50 px-7 py-4">
                    <JdButton text="Cancelar" tipo="2" @click="closeQuestion" class="!rounded-none !border-sunka-sand" />
                    <JdButton text="Eliminar" :loading="loadingDelete" @click="eliminar" class="!rounded-none !border-[var(--sunka-danger)] !bg-[var(--sunka-danger)] text-sunka-white" />
                </footer>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JdButton from "../components/JdButton.vue";
import Trash from "../assets/icons/trash.vue";

import visaUrl from "../assets/icons/visa.svg?url";
import mastercardUrl from "../assets/icons/mastercard.svg?url";
import dinersUrl from "../assets/icons/diners-club.svg?url";
import amexUrl from "../assets/icons/american-express.svg?url";

import { urls, get, delet } from "../lib/api";

export default defineComponent({
    components: {
        JdButton,
        Trash,
    },
    props: {
        headText: { type: String, default: "" },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            loading: false,

            showQuestion: false,
            loadingDelete: false,

            // tarjeta_tipos: [
            //     {
            //         id: "credito",
            //         nombre: "CRÉDITO",
            //     },
            //     {
            //         id: "debito",
            //         nombre: "DÉBITO",
            //     },
            // ],
        };
    },
    mounted() {
        this.getCustomerWallet();
    },
    methods: {
        async getCustomerWallet() {
            this.loading = true;
            const res = await get(
                `${urls.account}/customer-wallet/${this.user.id}`,
                null
            );
            this.loading = false;

            if (res.ok) {
                this.user.wallet = res.data.tokens;
            }
        },
        getCardBrandIcon(brand) {
            if (!brand) return genericUrl;
            const b = brand.toUpperCase().trim();
            const map = {
                VISA: visaUrl,
                MASTERCARD: mastercardUrl,
                "DINERS CLUB": dinersUrl,
                DINERS: dinersUrl,
                "AMERICAN EXPRESS": amexUrl,
                AMEX: amexUrl,
            };
            return map[b] || genericUrl;
        },

        openQuestion(id) {
            this.showQuestion = true;
            document.body.style.overflow = "hidden"; // evita scroll en fondo
            this.toDelete = id;
        },
        closeQuestion() {
            this.showQuestion = false;
            document.body.style.overflow = "";
        },
        async eliminar() {
            const send = {
                id: this.toDelete,
            };

            this.loadingDelete = true;
            const res = await delet(`${urls.izipay}/tarjeta`, send);
            this.loadingDelete = false;

            if (res.ok) {
                const i = this.user.wallet.findIndex((a) => a.id == this.toDelete);
                this.user.wallet.splice(i, 1);
                this.closeQuestion();
            }
        },
    },
})
</script>
