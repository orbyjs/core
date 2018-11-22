import {VDom} from "./src/vdom";
declare module "@orby/core"{
    export function h(tag:String,props?:Object,...children):VDom;
    export function render(next:VDom,parent:HTMLElement,child:?HTMLElement,context:?Object,isSvg:Boolean):HTMLElement;
    export function isVDom(any):Boolean;
}