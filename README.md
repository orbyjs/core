<img src="assets/logo.png" width="280px"/> 

Orby is a small and minimalist library to create modern interfaces based on JSX, Virtual-Dom and Functions.

## Índice

1. [Motivation](#motivation)
2. [JSX](#jsx)
    1. [JSX Assignment of events](#jsx-assignment-of-events)
3. [Component](#component)
    1. [Properties of the component](#properties-of-the-component)
    2. [Control of component status](#control-of-component-status)
    3. [Control of the context of the component](#control-of-the-context-of-the-component)
4. [Lifecycle](#lifecycle)
    1. [create](#create)
    2. [created](#created)
    3. [remove](#remove)
    4. [removed](#removed)
    5. [update](#update)
    6. [updated](#updated)
5. [Special properties](#special-properties)
    1. [scoped](#scoped)
    2. [state](#state)
    3. [context](#context)
6. [Examples](#examples)

## Motivation

Simplify the creation and maintenance of components, limiting its scope only functions, avoiding the use of classes, with the aim of simplifying the learning curve centered only on the use of functions and Jsx.

Another motivation is the use of shadow-dom, as part of the process of detecting changes. Example of this is the creation of a component with style scope thanks to the use of **shadow-dom**, please see the following example and note the definition of the property [scoped](#scoped).

```jsx
function Button(props){
    return <button scoped>
        <style>{`
            :host{
                padding : .5rem 1rem;
                border:none;
                background:black;
                color:white
            }
        `}</style>   
        {props.children}
    </button>
}
```

The `<Button/>` component will be isolated in the Dom tree, this will define a closed scope of css styles.

## JSX

[JSX](https://reactjs.org/docs/introducing-jsx.html) is defined as an extension of the JavaScript syntax, this allows to maintain a readable union between HTML and JS, and then be used for example in the manipulation of nodes, assignment of events, mutation of attributes and more.

When working with Orby, please consider the following differences with other libraries, such as React, in:

1. **Event allocation** sin prefijo `on`.
2. **Null support fragments**, Orby's components are more attached to the definition of a tree always maintaining a root node, this is how it is expressed in the [Lifecycle](#lifecycle).
3. **Null support a key**, I understand that in some cases the keys can increase the performance, but in the generating context they are scarcely used and misinterpreted.

> Orby has its own api, the association and comparison with other libraries in homologar api depends on a utilitarian analysis in the user experience.

### JSX Assignment of events

To assign events for example to a button, it does not require prefixes `on` the name of the event, the DIFF process when detecting a function as property of the node, will define the property as an event.

The following example shows how Orby adds an event to a `<button/>`

```jsx
<button click={handler}/>
```

This is very advantageous when working with Custom Events, since Orby does not manipulate the names.

```jsx
<web-component myCustomEvent={handler}/>
```

## Component

I hope that working with Orby is simple, I have tried to make the api efficient before the DIFF process.

### Properties of the component

Like any functional component, the first argument of the component will always be its properties.

```jsx
export function	Button(props){
    return <button click={props.click}>{props.children}</button>
}
```

The design pattern of purely functional components does not change if you were only limited to the use of Props.

### Control of component status

What Orby proposes, is the use of functional components, to facilitate the manipulation of the state there is a second argument, this second argument has 2 methods:

1. **set**, updates the state of the component and renders the new state.
2. **get**, obtains the current state of the component

The following example shows how to generate a content toggle, by manipulating the state.

```jsx
export function	Button(props,state){
    return <button click={()=>{
        state.set( !state.get() )
    }}>{state.get() ? props.children : undefined}</button>
}
```

the state may be the one you determine, Orby does not oblige it to always be the object.

Another important point of state management, is the definition of the initial state in the component, the initial state can be defined as a property of the same component by using the property `state={<initialState>}`, see the following example :

```jsx
<Button state={true}/>
```

### Control of the context of the component

The context allows you to share a defined object at a higher level, it will be very useful if you look for interaction between 2 components.

```jsx
export function	Button(props,state,context){
    return <button>{context.message}</button>
}
```

Another important point is that context management can be defined by using the `context` property external to the component.

```jsx
import {h,render} from "@orby/core";
import App from "./app";

render(
    <App context={{message:"hi! Orby"}}/>,
    document.querySelector("#app")
);
```

## Lifecycle

The life cycle does not exist in itself over the component, it manifests itself over the created nodes, this is similar to how it operates in [Hyperapp](https://github.com/jorgebucaran/hyperapp).

```jsx
export function Button(){
    return <button create={handlerWithCreate}>Hi! Orby</button>
}
```

The DIFF process will invoke the `create` properties only when the `<button/>`node is created in the dom tree. You can add the life cycle properties to the nodes you deem convenient.

### create

The `create` property is invoked when the node is added in the dom tree.

```jsx
export function Button(){
    return <button create={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### created

The `created` property is invoked after the node was added to the dom tree and propagated the changes to its children.

```jsx
export function Button(){
    return <button created={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### remove

The `remove` property is invoked when removing the node from the dom tree.

```jsx
export function Button(){
    return <button remove={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### removed

The `removed` property is invoked after removing the node from the dom tree and propagating the changes to its children.

```jsx
export function Button(){
    return <button removed={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### update

The `update` property is invoked before propagating from the node of the dom tree. **return`false` to avoid such propagation**

```jsx
export function Button(){
    return <button update={(target:HTMLElement, prevProps:Object, nextProps:Object)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### updated

The `updated` property is invoked after propagating from the node of the dom tree.

```jsx
export function Button(){
    return <button updated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### Special properties

### scoped

the `scoped` property allows to enable the use of `shadow-dom` on the node, when defining scoped as true, the DIFF process will understand that the nodes will be mounted in the `shadowRoot` of the node.

```jsx
export function Button(props){
    return <button scoped>
        <style>{`:host{background:crimson}`}</style>	
        {props.children}
    </button>
}
```

### state

The `state` property allows defining the initial state of a component externally to the same component.

```jsx
<Button state={10}/>
```

When using the `<Button />` component, the `state.get ()` function, the return will be assigned as `state={10}` property.

### context

The `context` property allows you to add new properties to the context.

```jsx
<ParentComponent context={{title:"Hi! Orby"}}>
    <ChildComponent></ChildComponent>
</ParentComponent>
```

The example component `ChildComponent` can make use of the context defined in a superior way. Note that it is not necessary to enter the component to create contexts.

## Examples

| Ejemplo    | Detalle                                               | Code | Demo |
| ---------- | ----------------------------------------------------- | ---- | ---- |
| Counter    | Ejemplo básico de un contador con Orby                | [Link](https://codesandbox.io/s/6j3loqv0k3) | [Link](https://6j3loqv0k3.codesandbox.io/)    |
| Todo       | Enseña como crear un Todolist usando Orby             |      |      |
| Orby y Css | Permite crear componentes estilizados de forma simple |      |      |

