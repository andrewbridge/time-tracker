import AddActivityModal from "../components/AddActivityModal.mjs";
import EditableText from "../components/EditableText.mjs";
import { addDays, addHours, format, formatDistance, formatDistanceToNow, isSameDay, parse, startOfToday, subDays } from "../deps/date-fns.mjs";
import { css } from "../deps/goober.mjs";
import { mapRefs } from "../deps/vue.mjs";
import { activeEntry, activityNames, addEntry, endActiveEntry, entries, entriesArray, pinnedActivities, recentActivities, startEntry, updateActivity, updateEntry } from "../services/data.mjs";
import { getPath, routeParams } from "../services/routes.mjs";

const styles = css`
    .list-group-item:hover, .list-group-item:focus, .list-group-item:focus-within {
        background: var(--tblr-active-bg);
    }

    .list-group-item {
        padding: 0;
    }

    .list-group-item button {
        padding: var(--tblr-list-group-item-padding-y) var(--tblr-list-group-item-padding-x);
        background: none;
        border: 0;
        text-align: left;
    }

    .icon-tabler-star {
        fill: transparent;
        transition: 0.125s fill ease-in-out, 0.125s opacity ease-in-out;
    }

    .favourite-button:hover .icon-tabler-star, .pinned-activities .icon-tabler-star {
        fill: currentColor !important;
    }

    .favourite-button:hover .icon-tabler-star {
        opacity: 0.75;
    }
`;

export default {
    name: 'TimeTrack',
    components: { EditableText, AddActivityModal },
    data: () => ({ routeParams, pinnedActivities, activeDurationIntervalUID: null, activeDuration: '', addActivityShown: false }),
    template: `
        <div class="${styles}">
            <div class="container-xl">
                <div class="page-header d-print-none">
                    <div class="row g-2 align-items-center">
                        <div class="col d-flex">
                            <h2 class="page-title">
                                {{title}}
                            </h2>
                            <div class="ms-auto">
                                <a class="btn btn-outline-secondary btn-icon" :href="previousPath">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 15h-8v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h8a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1z"></path></svg>
                                </a>
                                <a class="btn btn-outline-secondary mx-2" :href="todayPath">
                                    Today
                                </a>
                                <a class="btn btn-outline-secondary btn-icon" :href="nextPath">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-body">
                <div class="container-xl">
                    <div class="row">
                        <div class="col-12 col-md-3">
                            <div class="subheader mb-2">Pinned activities</div>
                            <template v-if="pinnedActivities.length > 0">
                                <div class="list-group list-group-transparent w-100 m-auto mb-3 pinned-activities">
                                    <div class="list-group-item list-group-item-action d-flex align-items-center" v-for="activity in pinnedActivities" :key="activity.id">
                                        <button class="flex-grow-1" @click="startEntry(activity.id)">{{activity.name}}</button>
                                        <button class="favourite-button" @click="toggleActivityPinned(activity)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </template>
                            <div class="subheader mb-2 d-flex align-items-center">
                                Recent activities
                                <button class="btn btn-outline-secondary btn-icon ms-auto" @click="addActivityShown = true">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            </div>
                            <div class="list-group list-group-transparent w-100 m-auto mb-3">
                                <div class="list-group-item list-group-item-action d-flex align-items-center" v-for="activity in recentActivities" :key="activity.id">
                                    <button class="flex-grow-1" @click="startEntry(activity.id)">{{activity.name}}</button>
                                    <button class="favourite-button" @click="toggleActivityPinned(activity)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" :fill="activity.pinned ? 'currentColor' : 'none'" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-9">
                            <div class="row row-cards">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="table-responsive">
                                            <table class="table table-vcenter card-table">
                                                <thead>
                                                    <tr>
                                                        <th>Job</th>
                                                        <th>Start</th>
                                                        <th>End</th>
                                                        <th>Duration</th>
                                                        <th class="w-1"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="entry in entries">
                                                        <td>{{getActivityName(entry.activity_id)}}</td>
                                                        <td class="text-muted">
                                                            <EditableText :modelValue="getTime(entry.started_at)" @update:modelValue="newTime => updateEntry(entry, 'started_at', newTime)" />
                                                        </td>
                                                        <td class="text-muted">
                                                            <EditableText v-if="entry.ended_at" :modelValue="getTime(entry.ended_at)" @update:modelValue="newTime => updateEntry(entry, 'ended_at', newTime)" />
                                                        </td>
                                                        <td class="text-muted">
                                                            {{entry.ended_at === false ? activeDuration : getDuration(entry)}}
                                                        </td>
                                                        <td>
                                                        <button class="btn btn-outline-secondary btn-icon" @click="endActiveEntry" v-if="entry.ended_at === false">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clock-stop" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 12a9 9 0 1 0 -9 9"></path><path d="M12 7v5l1 1"></path><path d="M16 16h6v6h-6z"></path></svg>
                                                        </button>
                                                    </td>
                                                    </tr>
                                                    <tr v-if="entries.length === 0">
                                                        <td colspan="5">No time added for {{title}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddActivityModal v-model:show="addActivityShown" />`,
        computed: {
            ...mapRefs({ activeEntry }),
            date() {
                const today = startOfToday();
                try {
                    return parse(this.routeParams.date, 'yyyy-MM-dd', today);
                } catch {
                    return today;
                }
            },
            title() {
                return format(this.date, 'EEEE do MMMM yyyy');
            },
            entries() {
                return entriesArray.value.filter((entry => isSameDay(entry.started_at, this.date)));
            },
            recentActivities() {
                return recentActivities.value.filter(({ pinned }) => !pinned)
            },
            previousPath() {
                return getPath('TimeTrack', { date: format(subDays(this.date, 1), 'yyyy-MM-dd') });
            },
            todayPath() {
                return getPath('TimeTrack', { date: format(Date.now(), 'yyyy-MM-dd') });
            },
            nextPath() {
                return getPath('TimeTrack', { date: format(addDays(this.date, 1), 'yyyy-MM-dd') });
            },
        },
        methods: {
            endActiveEntry,
            startEntry(activityId) {
                if (isSameDay(this.date, Date.now())) {
                    return startEntry(activityId);    
                }
                const start = this.date.getTime();
                return addEntry({ activity_id: activityId, started_at: start, ended_at: addHours(start, 1).getTime() });
            },
            updateEntry(entry, property, value) {
                entry[property] = parse(value, 'HH:mm', this.date).getTime();
                updateEntry(entry);
                if (entry.id === activeEntry.value.id) {
                    this.updateActiveDuration();
                }
            },
            toggleActivityPinned(activity) {
                activity.pinned = !activity.pinned;
                updateActivity(activity);
            },
            getActivityName(id) {
                return activityNames.value.get(id);
            },
            getDuration(entry) {
                if (entry.ended_at === false) return '';
                return formatDistance(entry.started_at, entry.ended_at);
            },
            getTime(timestamp) {
                return format(timestamp, 'HH:mm');
            },
            updateActiveDuration() {
                this.activeDuration = formatDistanceToNow(activeEntry.value.started_at);
            },
        },
        watch: {
            activeEntry: {
                immediate: true,
                handler(entry) {
                    if (this.activeDurationIntervalUID !== null) clearInterval(this.activeDurationIntervalUID);
                    this.activeDuration = '';
                    if (entry !== null) {
                        this.updateActiveDuration();
                        this.activeDurationIntervalUID = setInterval(this.updateActiveDuration.bind(this), 5000);
                    }
                }
            }
        },
        unmounted() {
            if (this.activeDurationIntervalUID !== null) clearInterval(this.activeDurationIntervalUID);
        }
}
