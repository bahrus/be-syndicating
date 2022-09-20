import { PropertyBag } from 'trans-render/lib/PropertyBag.js';
export class BeSyndicating {
    syndicate;
    #propertyBag;
    constructor() {
        this.#propertyBag = new PropertyBag();
        this.syndicate = this.#propertyBag.proxy;
    }
    #externalControllers;
    async listen(pp) {
        const { args, self, proxy } = pp;
        this.#disconnectExternalListeners();
        this.#externalControllers = [];
        const arr = Array.isArray(args) ? args : [args];
        const autoConstructed = {};
        let hasAuto = false;
        const explicit = [];
        for (const arg of arr) {
            if (typeof arg === 'string') {
                const obs = {
                    [pp.defaultObserveType]: arg,
                    "on": pp.defaultEventType,
                    "vft": pp.defaultProp,
                };
                autoConstructed[arg] = obs;
                hasAuto = true;
            }
            else {
                explicit.push(arg);
            }
        }
        if (hasAuto)
            explicit.push(autoConstructed);
        for (const pom of explicit) {
            await this.#doParams(pom, self, proxy);
        }
    }
    async #doParams(params, self, proxy) {
        const { hookUp } = await import('be-observant/hookUp.js');
        let lastKey = '';
        const props = new Set();
        const syndicate = this.#propertyBag.proxy;
        for (const propKey in params) {
            let parm = params[propKey];
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            const info = await hookUp(parm, [self, syndicate], key);
            props.add(key);
            this.#externalControllers.push(info.controller);
            if (!startsWithHat)
                lastKey = propKey;
        }
        proxy.props = props;
    }
    #disconnectExternalListeners() {
        if (this.#externalControllers !== undefined) {
            for (const ac of this.#externalControllers) {
                ac.abort();
            }
            this.#externalControllers = undefined;
        }
    }
    finale() {
        this.#disconnectExternalListeners();
        this.#propertyBag = undefined;
        this.syndicate = undefined;
    }
}
