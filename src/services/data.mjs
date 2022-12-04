import { subWeeks } from "../deps/date-fns.mjs";
import { computed, reactive, ref } from "../deps/vue.mjs";
import { ACTIVITIES, ENTRIES } from "./db/constant.mjs";
import db from "./db/index.mjs";

/** 
 * @template T
 * @typedef {import("../app").Vue.Ref<T>} Ref<T>
 * */
/**
 * @typedef {import("../app").Activity} Activity 
 * @typedef {import("../app").Entry} Entry
 */

/** @type {Map<number, Activity>} */
export const activities = reactive(new Map());

export const getActivities = async () => {
    let cursor = await db.transaction(ACTIVITIES).store.openCursor();

    while (cursor) {
        /** @type Activity */
        const activity = cursor.value;
        activities.set(activity.id, activity);
        cursor = await cursor.continue();
    }
}
getActivities();

/** @type {Ref<Map<Activity['id'], Activity['name']>>} */
export const activityNames = computed(() => new Map(Array.from(activities.entries()).map(([id, { name }]) => [id, name])));

/** @type {Ref<Activity>} */
export const pinnedActivities = computed(() => Array.from(activities.values())
    .filter(activity => activity.pinned));

const recentThreshold = subWeeks(Date.now(), 1).getTime();
/** @type {Ref<Activity>} */
export const recentActivities = computed(() => Array.from(activities.values())
    .filter(activity => activity.used_at > recentThreshold || activity.created_at > recentThreshold));

/** @type {(activity: Activity) => Promise<void>} */
export const addActivity = async (activity) => {
    const id = await db.add(ACTIVITIES, activity);
    activity.id = id;
    activities.set(id, activity);
}

/** @type {(activity: Activity) => Promise<void>} */
export const updateActivity = async (activity) => {
    await db.put(ACTIVITIES, { ...activity });
    activities.set(activity.id, activity);
}

/** @type {Map<number, Entry>} */
export const entries = reactive(new Map());

export const getEntries = async () => {
    let cursor = await db.transaction(ENTRIES).store.openCursor();

    while (cursor) {
        /** @type Entry */
        const activity = cursor.value;
        entries.set(activity.id, activity);
        cursor = await cursor.continue();
    }
}
getEntries();

/** @type {Ref<Entry[]>} */
export const entriesArray = computed(() => Array.from(entries.values()));

/** @type {Ref<Entry | null>} */
export const activeEntry = computed(() => entriesArray.value.findLast((entry) => entry.ended_at === false) || null);

/** @type {(entry: Entry) => Promise<void>} */
export const addEntry = async (entry) => {
    const id = await db.add(ENTRIES, entry);
    entry.id = id;
    entries.set(id, entry);
}

/** @type {(entry: Entry) => Promise<void>} */
export const updateEntry = async (entry) => {
    await db.put(ENTRIES, { ...entry });
    entries.set(entry.id, entry);
}

/** @type {(activityId: Activity['id'], time: number) => Promise<void>} */
export const startEntry = async (activityId) => {
    if (activeEntry.value?.activity_id === activityId) return;
    endActiveEntry();
    const entry = { activity_id: activityId, started_at: Date.now(), ended_at: false };
    await addEntry(entry);
    const activity = activities.get(activityId);
    activity.used_at = Date.now();
    await db.put(ACTIVITIES, { ...activity });
}

/** @type {() => Promise<void>} */
export const endActiveEntry = async () => {
    if (activeEntry.value === null) return;
    const dbEntry = { ...activeEntry.value };
    activeEntry.value.ended_at = Date.now();
    dbEntry.ended_at = Date.now();
    await db.put(ENTRIES, dbEntry);
}
