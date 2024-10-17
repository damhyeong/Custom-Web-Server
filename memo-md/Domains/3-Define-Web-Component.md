## 제목 : 커스텀 웹 컴포넌트 정의 및 선언 

---

커스텀 웹 컴포넌트를 브라우저에 등록하여 사용하는 방법은 2 가지 방식이 존재한다.

이 두 가지 방식을 보기 전에, 먼저 등록하는 법을 보자 :

```javascript
const customElements = window.customElements;

customElements.define("component-name", 등록할 커스텀 컴포넌트 클래스);
```

<br/>

여기에서, `define` 할 두 가지 방식이 있다.

### 1. 클래스 정식 선언 후 등록

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

// 브라우저의 기능 추출 
const customElements = window.customElements;

// InitComponent 커스텀 컴포넌트 클래스 태그 등록 
customElements.define("init-component", InitComponent);
```

<br/>

### 2. 컴포넌트 정의와 동시에 클래스 선언

```javascript
const customElements = window.customElements;

customElements.define("init-component", class extends HTMLElement {
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
})
```

익명 콜백 함수를 등록하듯이, 익명 클래스로 등록하는 방식이 있다.

<br/>

## 네이밍 규칙

사실 브라우저에서 커스텀 태그를 통해 커스텀 엘리먼트를 등록하기 위해 이름을 "무조건" 정해야 한다.

나는 `InitComponent` HTML 컴포넌트를 등록하기 위해서 `init-component` 라는 이름의 태그를 선택했다.

<br/>

1. 커스텀 컴포넌트의 이름은 `-` 를 포함한 이름이어야 한다.
2. 소문자여야 한다.
3. 예약된 HTML 태그 이름이 아니어야 한다.

<br/>

사실 이러한 이름 제약이 웹 컴포넌트의 사용성을 엄청나게 갉아먹었다고 생각한다.

예를 들어, `App` 클래스 컴포넌트를 `app` 으로 등록할 수가 없다.

`app-foo` 와 같이 `-` 를 포함한 이름이어야 한다는 것이다.

<br/>

이러한 네이밍 컨벤션은 브라우저에서 추후 단일 단어로 등록 될 수 있는 후보 태그들이 존재하기 때문이다.

예를 들어, 우리가 리액트로 자주 사용하는 `App` 컴포넌트를 만들기 위해,

커스텀 컴포넌트로 `customElements.define("app", App);` 하였는데,

브라우저에서 추후 업그레이드로 `<app/>` 태그를 만들어버리면 어떻게 할 것인가?

따라서 웹 컴포넌트를 사용하기 위해서는 

**2 개의 단어로 이루어지며, 중간에 - 가 붙어야 한다.**

