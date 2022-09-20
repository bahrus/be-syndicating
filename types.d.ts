import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {PropObserveMap} from 'be-observant/types';

export type ArgMap<Props = any, Actions = Props, TEvent = Event> = string | PropObserveMap<Props, Actions, TEvent>;

export interface EndUserProps<Props = any, Actions = Props, TEvent = Event>{
    args: ArgMap<Props, Actions, TEvent> | ArgMap<Props, Actions, TEvent>[];
    defaultProp?: string,
    defaultObserveType?: string,
    defaultEventType?: string,
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
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