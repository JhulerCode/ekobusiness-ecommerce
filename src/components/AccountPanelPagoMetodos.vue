<template>
    <div class="flex justify-between mb-4">
        <h2 class="text-xl font-semibold">
            {{ headText }}
        </h2>

        <JdButton text="Recargar" tipo="2" :loading="loading" @click="getCustomerWallet" />
    </div>

    <div v-if="user.wallet && user.wallet.length > 0" class="space-y-4">
        <div
            v-for="(a, i) in user.wallet"
            :key="i"
            class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-200"
        >
            <div class="flex items-center gap-3">
                <img
                    :src="getCardBrandIcon(a.tokenDetails.effectiveBrand)"
                    class="w-8 h-8"
                    alt="card brand"
                />

                <div>
                    <p class="font-medium text-gray-800">{{ a.tokenDetails.pan }}</p>

                    <p class="text-sm text-gray-600">
                        <!-- {{ doc_tipos.find((t) => t.id == a.doc_tipo).nombre }} | Expira el -->
                        Expira el {{ a.tokenDetails.expiryMonth }}/{{ a.tokenDetails.expiryYear }}
                    </p>
                </div>
            </div>

            <div class="flex flex-col space-y-2">
                <button
                    @click="openQuestion(i)"
                    title="Eliminar"
                    class="text-sm text-red-500 cursor-pointer"
                >
                    <Trash />
                </button>
            </div>
        </div>
    </div>

    <div v-else class="text-gray-600 text-center">
        <p>No tienes medios de pago registrados.</p>
    </div>

    <transition name="fade">
        <div v-if="showQuestion" class="modal">
            <div class="center">
                <main>
                    <p>¿Está seguro de eliminar?</p>
                </main>

                <footer>
                    <JdButton text="NO" tipo="2" @click="closeQuestion" />
                    <JdButton
                        text="SI"
                        :loading="loadingDelete"
                        @click="eliminar"
                    />
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
import JdButton from "../components/JdButton.vue";
import Trash from "../assets/icons/trash.vue";

import visaUrl from "../assets/icons/visa.svg?url";
import mastercardUrl from "../assets/icons/mastercard.svg?url";
import dinersUrl from "../assets/icons/diners-club.svg?url";
import amexUrl from "../assets/icons/american-express.svg?url";

import { urls, get, patch } from "../lib/api.js";

export default {
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

            // doc_tipos: [
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
    methods: {
        async getCustomerWallet() {
            this.loading = true;
            const res = await get(
                `${urls.account}/customer-wallet/${this.user.id}`,
                null,
                localStorage.getItem("token")
            );
            this.loading = false;

            if (res.code == 0) {
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

        openQuestion(i) {
            this.showQuestion = true;
            document.body.style.overflow = 'hidden'; // evita scroll en fondo
            this.toDelete = i;
        },
        closeQuestion() {
            this.showQuestion = false;
            document.body.style.overflow = '';
        },
        async eliminar() {
            console.log("Eliminar metodo de pago - pendiente de implementar");
            // const direcciones = JSON.parse(
            //     JSON.stringify(this.user.direcciones)
            // );
            // direcciones.splice(this.toDelete, 1);

            // const send = this.shapeDatos(direcciones);

            // this.loadingDelete = true;
            // const res = await patch('account', send);
            // this.loadingDelete = false;

            // if (res.code == 0) {
            //     this.user.direcciones = res.data.direcciones;
            //     this.closeQuestion();
            // }
        },
    },
};
</script>
