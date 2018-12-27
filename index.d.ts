import {VDom} from "./src/vdom";

interface Options{
    delay:Number;
}

/**
interface HandlerDefault{
    (target:HTMLElement|SVGElement)
}
interface HandlerUpdate{
    (target:HTMLElement|SVGElement,prev:object,next:object):boolean|undefined
}
    
interface Props{
    oncreate:?HandlerDefault,
    oncreated:?HandlerDefault,
    onupdate:?HandlerUpdate,
    onupdated:?HandlerDefault,
    onremove:?HandlerDefault,
    onremoved:?HandlerDefault,
    context:?object,
    scoped:?boolean,
}
*/

declare module "@orby/core"{
    export function h(tag:string,props?:object,...children):VDom;
    export function render(next:VDom,parent:HTMLElement,child:?HTMLElement,context:?object,isSvg:?boolean):HTMLElement;
    export function useState(initialState:any):[any,Function,Function];
    export function useEffect(handler:Function,list:any[]):void;
    export let option:Option;
}