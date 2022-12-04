import { openDB } from "../../deps/idb.mjs";
import { DB_NAME, DB_VERSION } from "./constant.mjs";
import initialData from "./initialData.js";
import migrations from "./migrations/index.mjs";

const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      migrations
        .slice(oldVersion, newVersion)
        .forEach(migration => migration(db, transaction));
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    },
    terminated() {
      // …
    },
});
export default db;

export const seed = async (overwrite = true) => {
  return Promise.all(Object.entries(initialData).map(async ([tableName, data]) => {
    const tx = db.transaction(tableName, 'readwrite');
    if (await tx.store.count() > 0) {
      if (overwrite) {
        await tx.store.clear();
      } else {
        return tx.done;
      }
    }
    return Promise.all(data.map(item => tx.store.add(item)).concat(tx.done));
  }));
}

seed(false);
