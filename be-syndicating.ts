import {PropertyBag} from 'trans-render/lib/PropertyBag.js';
import {Actions, PP, Proxy} from './types';
import {IObserve, PropObserveMap} from 'be-observant/types';

export class BeSyndicating implements Actions{
    syndicate!: EventTarget;
    #propertyBag!: PropertyBag; 
    constructor(){
        this.#propertyBag  = new PropertyBag();
        this.syndicate = this.#propertyBag!.proxy; 
    }

    #externalControllers: AbortController[] | undefined;
    async listen(pp: PP){
        const {args, self, proxy } = pp;
        this.#disconnectExternalListeners();
        this.#externalControllers = [];
        const arr = Array.isArray(args) ? args : [args];
        const autoConstructed: PropObserveMap = {};
        let hasAuto = false;
        const explicit : PropObserveMap[] = [];
        for(const arg of arr){
            
            if(typeof arg === 'string'){

                const obs: IObserve = {
                    [pp.defaultObserveType!]: arg,
                    "on": pp.defaultEventType,
                    "vft": pp.defaultProp,
                };
                autoConstructed[arg] = obs;
                hasAuto = true;
            }else{
                explicit.push(arg);
            }
        }
        if(hasAuto) explicit.push(autoConstructed);
        for(const pom of explicit){
            await this.#doParams(pom, self, proxy);
        }
        
    }

    async #doParams(params: PropObserveMap, self: Element, proxy: Proxy){
        const {hookUp} = await import('be-observant/hookUp.js');
        let lastKey = '';
        const props = new Set<string>();
        const syndicate = this.#propertyBag!.proxy!;
        for(const propKey in params){
            let parm = params[propKey] as string | IObserve;
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            const info = await hookUp(parm, [self, syndicate], key);
            props.add(key);
            this.#externalControllers!.push(info.controller!);
            if(!startsWithHat) lastKey = propKey;
        }
        proxy.props = props;  
    }

    #disconnectExternalListeners(){
        if(this.#externalControllers !== undefined){
            for(const ac of this.#externalControllers){
                ac.abort();
            }
            this.#externalControllers = undefined;
        }
    }

    finale(): void {
        this.#disconnectExternalListeners();
        this.#propertyBag = undefined as any as PropertyBag;
        this.syndicate = undefined as any as EventTarget;
    }
}