import { css } from "../deps/goober.mjs";
import Header from "./Header.mjs";
import { activeRoute } from "../services/routes.mjs";

const styles = {
    wrapper: css`
    min-height: 100vh;
    `
}
export default {
    components: { Header },
    template: `<div class="page">
        <Header />
        <main class="page-wrapper">
            <component :is="activeRoute" />
        </main>
    </div>`,
    computed: {
        activeRoute() {
            return activeRoute.value;
        }
    },
}