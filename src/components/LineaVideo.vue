<template>
    <div class="w-full h-full brightness-60" @mouseenter="onHover" @mouseleave="onLeave">
        <video
            ref="videoEl"
            class="inset-0 w-full h-full object-cover"
            :poster="poster"
            :muted="true"
            :loop="true"
            preload="none"
            playsinline
        ></video>

        <!-- indicador opcional de estado (debug) -->
        <!-- <div class="text-xs text-white">loaded: {{ loaded }} loading: {{ loading }}</div> -->
    </div>
</template>

<script>
export default {
    name: "LineaVideo",
    props: {
        videoUrl: { type: String, required: true },
        poster: { type: String, required: true },
    },
    data() {
        return {
            loaded: false, // ya descargado y asignado blob
            loading: false, // en proceso de descarga
            blobUrl: null, // URL creada con createObjectURL
            isPlaying: false,
        };
    },
    methods: {
        async onHover() {
            const video = this.$refs.videoEl;
            if (!video) return;

            // Si no está descargado, descargar solo una vez
            if (!this.loaded && !this.loading) {
                this.loading = true;
                try {
                    const res = await fetch(this.videoUrl, { method: "GET" });
                    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                    const blob = await res.blob();
                    this.blobUrl = URL.createObjectURL(blob);
                    // Asignar la blob url directamente al elemento video (no usar <source>)
                    video.src = this.blobUrl;
                    // marcar como cargado
                    this.loaded = true;
                } catch (err) {
                    console.error("Error descargando video:", err);
                    // opcional: fallback: asignar la url remota para que el navegador intente
                    video.src = this.videoUrl;
                } finally {
                    this.loading = false;
                }
            } else if (this.loaded && this.blobUrl) {
                // ya está descargado y asignado
                if (!video.src) video.src = this.blobUrl;
            } else if (!this.loaded && this.loading) {
                // si está en proceso de descarga, esperar hasta que termine
                // poll hasta que loaded true o timeout (simple)
                await this.waitForLoaded(5000);
            }

            // reproducir (siempre que el src esté listo)
            try {
                await video.play();
                this.isPlaying = true;
            } catch (err) {
                // reproducción puede fallar por políticas de autoplay en navegadores
                console.warn("No se pudo reproducir el video:", err);
            }
        },

        onLeave() {
            const video = this.$refs.videoEl;
            if (!video) return;
            video.pause();
            try {
                video.currentTime = 0;
            } catch (e) {
                /* algunos navegadores pueden lanzar si no está listo; ignorar */
            }
            video.load();
            this.isPlaying = false;
        },

        // helper para esperar hasta que loaded sea true (timeout ms)
        waitForLoaded(timeout = 3000) {
            return new Promise((resolve) => {
                const start = Date.now();
                const check = () => {
                    if (this.loaded) return resolve(true);
                    if (Date.now() - start > timeout) return resolve(false);
                    setTimeout(check, 100);
                };
                check();
            });
        },
    },

    beforeUnmount() {
        // liberar blobUrl cuando el componente se destruya (evita fugas de memoria)
        if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
            this.blobUrl = null;
        }
    },
};
</script>

<style scoped>
video {
    transition: opacity 0.3s ease;
}
</style>
