<img src="assets/logo.png" width="280px"/> 

Orby is a small and minimalist library to create modern interfaces based on JSX, Virtual-Dom and Functions.

<img src="assets/counter.png" width="100%"/> 

## Índice

1. [Motivation](#motivation)
2. [JSX](#jsx)
3. [Component](#component)
    1. [Properties of the component](#properties-of-the-component)
    2. [Control of component status](#control-of-component-status)
    3. [Control of the context of the component](#control-of-the-context-of-the-component)
4. [Lifecycle](#lifecycle)
    1. [oncreate](#oncreate)
    2. [oncreated](#oncreated)
    3. [onremove](#onremove)
    4. [onremoved](#onremoved)
    5. [onupdate](#onupdate)
    6. [onupdated](#onupdated)
5. [Special properties](#special-properties)
    1. [key](#key)
    2. [scoped](#scoped)
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

**Without fragment support**, Orby's components are more attached to the definition of a tree always maintaining a root node, this is how it is expressed in the [Lifecycle](#lifecycle).


## Component

The functional Orbison components and you can manipulate the state of the nodes either through the [Lifecycle](#lifecycle) associated with the virtual-dom or through the use of [hooks](#hooks).

### Properties of the component

Like any functional component, the first argument of the component will always be its properties.

```jsx
export function	Button(props){
    return <button onclick={props.click}>{props.children}</button>
}
```

The design pattern of purely functional components does not change if you were only limited to the use of Props.

### Control of the context of the component

The context allows you to share a defined object at a higher level, it will be very useful if you look for interaction between 2 components.

```jsx
export function	Button(props,context){
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
    return <button oncreate={handlerWithCreate}>Hi! Orby</button>
}
```

The DIFF process will invoke the `oncreate` properties only when the `<button/>`node is created in the dom tree. You can add the life cycle properties to the nodes you deem convenient.

### oncreate

The `oncreate` property is invoked when the node is added in the dom tree.

```jsx
export function Button(){
    return <button oncreate={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### oncreated

The `oncreated` property is invoked after the node was added to the dom tree and propagated the changes to its children.

```jsx
export function Button(){
    return <button oncreated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onremove

The `onremove` property is invoked when removing the node from the dom tree.

```jsx
export function Button(){
    return <button onremove={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onremoved

The `onremoved` property is invoked after removing the node from the dom tree and propagating the changes to its children.

```jsx
export function Button(){
    return <button onremoved={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onupdate

The `onupdate` property is invoked before propagating from the node of the dom tree. **return`false` to avoid such propagation**

```jsx
export function Button(){
    return <button onupdate={(target:HTMLElement, prevProps:Object, nextProps:Object)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### onupdated

The `onupdated` property is invoked after propagating from the node of the dom tree.

```jsx
export function Button(){
    return <button onupdated={(target:HTMLElement)=>{
    	/**algorithm**/
	}}>Hi! Orby</button>
}
```

### Special properties

### key

It allows to define the identifier on the virtual-dom, to link it to a previous state, regardless of its order. The use of keys allows for example:

1. Maintain an associative state of virtual-dom and a node indifferent to its order.
2. Reduce the amount of manipulations associated with sun.

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

### context

The `context` property allows you to add new properties to the context.

```jsx
<ParentComponent context={{title:"Hi! Orby"}}>
    <ChildComponent></ChildComponent>
</ParentComponent>
```

The example component `ChildComponent` can make use of the context defined in a superior way. Note that it is not necessary to enter the component to create contexts.

## Examples



