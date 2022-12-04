declare namespace Vue {
    export interface Ref<T = any> {
        value: T
    }
}

export interface Activity {
    id: number;
    name: string;
    pinned: boolean;
    used_at: number;
    created_at: number;
}

export interface Entry {
    id: number;
    activity_id: number;
    started_at: number;
    ended_at: number | false;
}