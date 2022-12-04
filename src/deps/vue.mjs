export { createApp, ref, reactive, h, watchEffect, watch, computed, nextTick } from 'https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.prod.js'

/** 
 * @template T
 * @type {(refs: { [key: string]: import('../app').Vue.Ref<T>}) => { [key: string]: () => T }} */
export const mapRefs = (refs) => {
    const mappedRefs = {};
    for ( const refName in refs) {
        mappedRefs[refName] = () => refs[refName].value;
    }
    return mappedRefs;
}