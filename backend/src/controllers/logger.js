/**Este archivo nos mostrará la hora exacta de cada solicitud. */

const logger = {
    info: (msg) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`),
    warn: (msg) => console.warn(`[${new Date().toISOString()}] WARN: ${msg}`),
    error: (msg) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`),
    debug: (msg) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[${new Date().toISOString()}] DEBUG: ${msg}`);
        }
    },
        
}