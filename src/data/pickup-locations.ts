export const DELIVERY_TIME_RANGE = '8:00 a. m. a 4:00 p. m.'

export const PICKUP_LOCATIONS = [
    // {
    //     id: 'oficina-ekobusiness',
    //     nombre: 'Oficina EkoBusiness',
    //     direccion: 'Av. Mariscal La Mar 638, Miraflores',
    // },
    {
        id: 'planta-sunka',
        nombre: 'Planta Sunka',
        direccion: 'Cal. 7 Mza. D Lote 10 Urb. Los Productores, Santa Anita',
    },
    {
        id: 'almacen-sunka',
        nombre: 'Almacén Sunka',
        direccion: 'Jr. Vizcardo y Guzmán 235, La Victoria',
    },
].map((location) => ({ ...location, descripcion: location.direccion }))

export function getPickupLocation(id: unknown) {
    return PICKUP_LOCATIONS.find((location) => location.id === String(id || '')) || null
}
