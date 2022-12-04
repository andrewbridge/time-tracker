import { ACTIVITIES, ENTRIES } from "../constant.mjs";

export default (db) => {
    db.createObjectStore(ENTRIES, {
        keyPath: 'id',
        autoIncrement: true,
    });
};