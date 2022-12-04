import { activeRoute, activeHash } from "../services/routes.mjs"

export default {
    data: () => ({ TimeTrack: '/' }),
    computed: {
        activeRoute() {
            return activeRoute.value;
        },
        activeHash() {
            return '#' + activeHash.value;
        }
    },
    template: `
    <header class="navbar navbar-expand-md navbar-light d-print-none">
        <div class="container-xl">
            <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                Time Tracker
            </h1>
        </div>
    </header>
    <div class="navbar-expand-md">
        <div class="collapse navbar-collapse" id="navbar-menu">
          <div class="navbar navbar-light">
            <div class="container-xl">
              <ul class="navbar-nav">
                <li class="nav-item" :class="{ active: activeHash === TimeTrack }">
                  <a class="nav-link" :href="TimeTrack">
                    <span class="nav-link-title">
                      Track
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>`,
}