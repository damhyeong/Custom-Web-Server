## 제목 : Web Component 생명주기

---

웹 컴포넌트의 기본 상태와 생명주기 메서드는 다음과 같다 : 

```javascript
class InitComponent extends HTMLElement {
    constructor(){
        super();
        
        // 내장 변수 및 메서드 선언 
    }
    
    connectedCallback(){
        // 브라우저 DOM 에 "실제로" 연결되면 호출, 실행됨.
    }
    
    disconnectedCallback(){
        // 브라우저 DOM 에서 연결이 끊어지면 호출, 실행됨.
    }
    
    adoptedCallback(){
        // 새로운 document 로 이동되었을 때 마다 호출됨.
        // 부모 트리가 바뀌면 실행되지 않을까? - 애매함.
    }
    
    attributeChangedCallback(name, oldValue, newValue){
        // 커스텀 컴포넌트에서 감지하기로 선언된 attribute 가 변경되면 실행됨.
        // <init-component number="1"> 에서 number 속성을 의미.
        // this.setAttribute("number", "2") 에서 number 속성을 의미
    }

    // 이 커스텀 컴포넌트의 "number" 속성 변화를 감지한다는 선언.
    static observedAttributes = ["number"];
    // static get observedAttributes() { return ["number"] } 과 동일.
}
```

웹 컴포넌트의 생명 주기에 관련된 메서드는 총 4개이지만,

이를 자세하게 다루고자 한다면, 사실상 `constructor` 생성자까지 5 개라고 볼 수 있다.

<br/>

### 1. constructor 생성자

사용자가 커스텀 컴포넌트를 사용하는 의미는 간단하다.

코드의 재사용성을 증가시키며, 컴포넌트 스스로 데이터를 보관하고 이에 따라 반응할 수 있다는데에 의미가 있다.

생성자에서는 해당 커스텀 컴포넌트가 가지고 있어야 할 정보를 등록한다.

기본적으로 HTMLElement 클래스를 상속받고 있으므로, `super()` 을 먼저 선언한다.

<br/>

생성자 부분에서는 위에서 제시한 `InitComponent` 가 `<init-component></init-component>` 로서

연결되기 전에 실행된다.

<br/>

### 2. connectedCallback()

해당 커스텀 컴포넌트가 실제로 "브라우저의 DOM" 에 연결되어 렌더링 될 때 실행된다.

여기서 컴포넌트의 렌더링을 실행해도 되지만, `attributeCallback` 메서드 또한,

변경 값을 인지하여 또다시 렌더링한다는 의미에서, 

클래스에 따로 `render()` 메서드를 만들어 렌더링하는 것이 좋다.

**Example** : 

```javascript
class InitComponent extends HTMLElement {
    constructor(){
        super();
        // ...
        this.setAttribute("number", "1");
    }    
    
    static observedAttributes = ["number"];
    
    connectedCallback(){
        console.log("Init Component가 브라우저에 연결됨.")
        this.render();
    }
    disconnectedCallback(){
        console.log("Init Component가 브라우저에서 떨어짐.");
    }
    adoptedCallback(){
        console.log("Init Component가 새로운 document에 연결됨.");
        this.render();
    }
    attributeChangedCallback(name, oldvalue, newValue){
        console.log(`변경된 속성 이름 : ${name}, 이전 속성 값 : ${oldValue}, 새로운 속성 값 : ${newValue}`);
        
        this.setAttribute(name, newValue);
        render();
    }
    
    // 커스텀 컴포넌트 내부에 들어가는 HTML
    render(){
        this.innerHTML = `
            <div>
                <p> Inside Text </p>
            </div>
        `
    }
}
```

<br/>

### 3. disconnectedCallback()

커스텀 엘리먼트가 브라우저의 DOM 과 떨어졌을 때 실행되는 콜백 함수이다.

만약에 이 컴포넌트에 대한 이벤트를 전역 객체인 `window` 에 부착했다면,

이를 없애주는 과정이 필요할 것이다.

<br/>

즉, 전체적으로 보았을 때 컴포넌트 뒷정리를 하는 메서드라고 보면 된다.

<br/>

### 4. adoptedCallback()

이는 브라우저 페이지 렌더링이 될 최상층 객체인 `document` 에서,

또 다른 `document` 로 연결이 바뀌었을 시 실행된다.

만약 같은 `document` 라면 실행되지 않는다고 한다.

즉, 부모 요소가 바뀌어도 실행되지 않으며,

철저히 다른 페이지로 이동되었을 때 실행되는 메서드이다.

사실 이 메서드의 사용처는 딱히 생각나지는 않는다.

<br/>

### 5. attributeChangedCallback(name, oldValue, newValue)

이 메서드는 커스텀 엘리먼트 스스로에게 주어진 속성을 직접 선정하여 감지하고,

해당 감지 속성이 변경되었을 때 실행된다.

즉, 렌더링 후 해당 커스텀 컴포넌트에서 감지하기로 한 속성이 있을 것이다.

`static observedAttributes = ["number"]`

<br/>

그리고, 컴포넌트의 속성은 이러한 방식으로 변경될 수 있다.

`<init-component number="4"/>` 외부에서 재 렌더링 시 선언

`this.setAttribute("number", "5")` 를 내부에서 실행

<br/>

이걸 어디다 쓰냐 하면 사실 리액트의 props 와 같이 사용할 수 있다.

```javascript
class InitComponent extends HTMLElement {
    constructor(){
        super();
        // ...
        this.setAttribute("number", "1");
    }    
    
    static observedAttributes = ["number"];
    
    connectedCallback(){
        console.log("Init Component가 브라우저에 연결됨.")
        this.render();
    }
    disconnectedCallback(){
        console.log("Init Component가 브라우저에서 떨어짐.");
    }
    adoptedCallback(){
        console.log("Init Component가 새로운 document에 연결됨.");
        this.render();
    }
    attributeChangedCallback(name, oldvalue, newValue){
        console.log(`변경된 속성 이름 : ${name}, 이전 속성 값 : ${oldValue}, 새로운 속성 값 : ${newValue}`);
        
        this.setAttribute(name, newValue);
        render();
    }
    
    // 커스텀 컴포넌트 내부에 들어가는 HTML
    render(){
        this.innerHTML = `
            <div>
                <p> Current Number is ${this.getAttribute("number")} </p>
            </div>
        `
    }
}
```

위의 커스텀 컴포넌트는 자신이 감지하기로 한 `number` 속성이 변할 때 마다,

새로운 HTML 내용으로 갈아끼울 것이다.

<br/>

**예상 시나리오**

1. 외부 혹은 내부에서 `"number"` 속성 값을 변화시킨다.
2. `attributeChangedCallback(name, oldValue, newValue)` 메서드가 실행된다.
    * `name` : 감지 속성들 중, 바뀐 속성의 이름
    * `oldValue` : 변경된 속성의 원래 값
    * `newValue` : 변경될 속성의 새로운 값
3. 위 메서드에서 `render()` 함수가 실행되고, 새로운 내용으로 바뀐다.

<br/>

**단점** :

* 속성 값으로 **오로지 문자열** 만 등록이 가능하다.

<br/>



