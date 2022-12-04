import { css } from "../deps/goober.mjs";
import Header from "./Header.mjs";
import Auth from "./Auth.mjs";
import { activeRoute } from "../services/routes.mjs";

const styles = {
    wrapper: css`
    min-height: 100vh;
    `
}
export default {
    components: { Header, Auth },
    template: `<div class="page">
        <Header />
        <main class="page-wrapper">
            <template v-if="hasAuth">
                <component :is="activeRoute" />
            </template>
            <Auth v-else />
        </main>
    </div>`,
    computed: {
        hasAuth() {
            return true;
        },
        activeRoute() {
            return activeRoute.value;
        }
    },
}