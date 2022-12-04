import Modal from "../components/Modal.mjs";
import { addActivity } from "../services/data.mjs";

export default {
    components: { Modal },
    props: ['show', 'title'],
    emits: ['update:show'],
    data: () => ({ activityName: '', loading: false }),
    template: `       
        <Modal title="Add activity" :show="show" @update:show="$emit('update:show', false)">
            <div class="modal-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label class="form-label">Activity name</label>
                            <input type="text" class="form-control" v-model="activityName" :disabled="loading" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-link link-secondary" @click="$emit('update:show', false)" :disabled="loading">Cancel</button>
                <button class="btn btn-primary ms-auto" :disabled="loading" @click="addActivity">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create new report
                </button>
          </div>
        </Modal>`,
        methods: {
            async addActivity() {
                this.loading = true;
                await addActivity({ name: this.activityName, pinned: false, used_at: 0, created_at: Date.now() });
                this.loading = false;
                this.$emit('update:show', false);
            }
        }
}
