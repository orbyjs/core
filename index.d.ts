import {VDom} from "./src/vdom";

interface Options{
    delay:Number;
}

declare module "@orby/core"{
    export function h(tag:string,props?:object,...children):VDom;
    export function render(next:VDom,parent:HTMLElement,child:?HTMLElement,context:?object,isSvg:?boolean):HTMLElement;
    export function useState(initialState:any):[any,Function,Function];
    export function useEffect(handler:Function):void;
    export let option:Option;
}