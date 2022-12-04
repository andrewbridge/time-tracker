import { css } from "../deps/goober.mjs";
import { nextTick } from "../deps/vue.mjs";

const styles = css`
    .input-group {
        width: 130px;
    }
`;

export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    data: () => ({ editableValue: '', editing: false }),
    computed: {
        value() {
            return this.object[this.key];
        }
    },
    template: `
        <button class="btn btn-icon btn-ghost-secondary text-left" @click="editing = true" v-if="!editing">
            {{modelValue}}
        </button>
        <form class="${styles}" @submit="submit" v-else>
            <div class="input-group mb-2">
                <input type="time" class="form-control" v-model="editableValue" />
                <button class="btn btn-icon" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                </button>
            </div>
        </form>`,
    methods: {
        submit() {
            this.$emit('update:modelValue', this.editableValue);
            // If this method directly removes the form calling it, the browser will complain that the form is no longer in the DOM
            setTimeout(() => {
                this.editing = false;
            }, 0);
        }
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                if (this.editing) return;
                this.editableValue = value;
            }
        }
    }
}
