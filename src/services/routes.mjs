import { format } from "../deps/date-fns.mjs";
import Route from "../deps/route-parser.mjs";
import { ref } from "../deps/vue.mjs";
import TimeTrack from "../pages/TimeTrack.mjs";

const defaultRoute = '/track/' + format(Date.now(), 'yyyy-MM-dd');
export const routes = {
    '/track/:date': TimeTrack
}

const compiledRoutes = Object.entries(routes).map(([spec, component]) => ({ route: new Route(spec), spec, component }));

export const getPath = (componentName, params = {}) => {
    const routeConfiguration = compiledRoutes.find(({ component: routeComponent }) => componentName === routeComponent.name);
    if (!routeConfiguration) return '#' + defaultRoute;
    return '#' + routeConfiguration.route.reverse(params);
}

export const activeHash = ref(null);
export const activeRoute = ref(null);
export const routeParams = ref({});

const redirectToDefault = () => window.location.hash = '#' + defaultRoute;

const selectRoute = () => {
    const currentPath = window.location.hash.slice(1);
    if (currentPath === '') return redirectToDefault();
    let params;
    const matchedRoute = compiledRoutes.find(({ route }) => params = route.match(currentPath));
    if (!matchedRoute) return redirectToDefault();
    activeHash.value = matchedRoute.spec;
    activeRoute.value = matchedRoute.component;
    routeParams.value = params;
};

selectRoute();

window.addEventListener('hashchange', selectRoute);