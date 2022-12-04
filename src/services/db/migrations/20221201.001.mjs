import { ACTIVITIES, ENTRIES } from "../constant.mjs";

export default (db) => {
    const store = db.createObjectStore(ACTIVITIES, {
        keyPath: 'id',
        autoIncrement: true,
    });
    store.createIndex('used_at', 'used_at');
    /* db.createObjectStore(ENTRIES, {
        keyPath: 'id',
        autoIncrement: true,
    }); */
};