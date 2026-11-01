// Independent deployment: no staging routes, data imports or test page.
import {readyRoutes} from './ready-routes.mjs';
export {ReadyCounter} from './ready-counter.mjs';
export default {fetch:readyRoutes};
