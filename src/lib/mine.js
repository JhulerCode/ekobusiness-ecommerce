function genId() {
    return `${Date.now()}${Math.floor(Math.random() * 900) + 100}`
}

export {
    genId,
}