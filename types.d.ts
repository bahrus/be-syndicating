import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {PropObserveMap, IObserve} from 'be-observant/types';

export type ArgMap<Props = any, Actions = Props, TEvent = Event> = string | PropObserveMap<Props, Actions, TEvent>;

export interface EndUserProps<Props = any, Actions = Props, TEvent = Event>{
    args: ArgMap<Props, Actions, TEvent> | ArgMap<Props, Actions, TEvent>[];
    defaultObserveConfig?: IObserve,
    // defaultProp?: string,
    // defaultObserveType?: string,
    // defaultEventType?: string,
}

export interface VirtualProps<T=Element> extends EndUserProps, MinimalProxy<T>{
    props?: Set<string>;
}

export type Proxy = HTMLScriptElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy
}

export type PP = ProxyProps;

export interface Actions{
    listen(pp: PP): void;
    finale(): void;
    
}