import { Vtag } from "./src/vtag";
import { Component } from "./src/component";

interface Options{
    document:?object,
    delay:Number
}

interface Reducer{
    (state:any,action:object):any
}

interface Action{
    type : any,
}

interface Dispatch{
    (action:Action):void
}

interface ProviderProps{
    value:?any,
    children:Array
}

interface Context{
    Provider(props:ProviderProps,context:object):Vtag,
    Consumer(handler:Function):Vtag|any
}

declare module "@orby/core"{
    export function h(tag:string,props?:object,...children):Vtag;
    export function render(next:Vtag,parent:HTMLElement,child:?HTMLElement,context:?object,isSvg:?boolean):HTMLElement;
    export function useState(initialState:any):[any,Function,Function];
    export function useEffect(handler:Function,list:any[]):void;
    export function useContext(Context?:object):any;
    export function useReducer(state:any,reducer:Reducer,actionInit:?Action):[any,Dispatch];
    export function useRef(current:?any):object;
    export function useMemo(handler:Function):any;
    export function createContext(value:?any):Context;
    export function getCurrentComponent():Component;
    export let option:Option;
}