import { ACTIVITIES } from "./constant.mjs";

export default {
    [ACTIVITIES]: [
        { name: 'Downtime', pinned: true, used_at: 0, created_at: Date.now() },
        { name: 'Meeting', pinned: true, used_at: 0, created_at: Date.now() },
        { name: 'Lunch', pinned: true, used_at: 0, created_at: Date.now() },
    ],
}
