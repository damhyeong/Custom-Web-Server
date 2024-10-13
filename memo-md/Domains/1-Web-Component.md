## 제목 : Web Component 사용법 

---

Web Component 라는 기술은 스마트폰의 보급과 함께,

웹사이트에서 동적인 요소들을 효과적으로 관리하기 위해 제작되었는데,

안타깝게도 사용 난이도와 번거로움, 최적화에 있어 현대의 모든 웹 서버 프레임워크를 이기지 못한다.

하지만, 나의 커스텀 리액트를 제작하기 위해서 기초가 될 뼈대로는 충분하다.

<br/>

### Web Component 란

브라우저에는 일반적으로 `div`, `p`, `h1`, `img` 와 같은 기본 태그들이 들어갈 수 있다.

하지만, 개발자가 자신만의 커스텀 태그를 만들어 이를 컴포넌트화 시키고 싶을 경우 사용하는 라이브러리이다.

단, 기억해야 할 것은 커스텀 컴포넌트를 Node 환경에 등록하는 것이 아니라, 브라우저에 등록한다는 것이다.

<br/>

예를 들어, `<init-component>` 라는 초기화 컴포넌트를 직접 선언한다면,

```javascript
const customElements = window.customElements;

customElements.define("init-component", 개발자가 만든 커스텀 컴포넌트 클래스);
```

여기서 커스텀 컴포넌트 이름의 제약이 몇 개 있다.

1. 이름은 소문자로 이루어져야 한다.
2. 이름 내부에 `-` (하이픈) 이 들어가야 한다.
3. 브라우저에서 인식하는 예약 태그 이름과 동일해서는 안된다.

<br/>

따라서, `"app"` 으로 선언하고 `<app></app>` 태그를 사용하면, 에러와 함께 렌더링되지 않는다.

즉, 커스텀 엘리먼트가 되기 위한 제약 조건에 걸려 아예 등록이 되지 않는 것이다.

브라우저의 `elements` 콘솔에 `<init-component></init-component>` 가 나타나기 위해서,

개발자는 위에서 제시한 코드를 전역 선언으로 브라우저에 입력해 주어야 하며,

브라우저에 빌트인 되어 있는 관리 객체에 입력해야 한다.

<br/>

즉, 위의 코드는 브라우저 내에서 실행되어야 한다는 의미이다.

<br/>

### Web Component 클래스 만들기

웹 컴포넌트를 만들기 위해서는 `HTMLElement` 를 기본적으로 상속 받아야 한다.

물론, 브라우저에 존재하는 다른 태그를 덧씌워 자신만의 컴포넌트로 만들고자 한다면,

`HTMLParagraphElement`, `HTMLDivElement` 등등 여러 컴포넌트를 상속 받을 수 있다.

<br/>

```javascript
class InitComponent extends HTMLElement {
    constructor(){
        super();
        // 이 컴포넌트에 내장될 기능이나 변수를 여기에 작성한다. 
    }
    
    // 생명주기 내장 메서드 4개 - 곧 보여줌.
}
```

커스텀 컴포넌트를 사용하기 위해서 다음과 같은 기본 형태를 지녀야 한다.

<br/>

### Web Component 생명주기 메서드들 (중요)

웹 컴포넌트를 브라우저에 등록하고 나면, 브라우저는 해당 컴포넌트의 생명 주기를 관리하게 된다.

우리가 리액트를 사용 할 때, `useEffect` 를 사용하던 것 처럼,

커스텀 컴포넌트를 위한 생명주기 메서드 4 개가 주어진다.

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
        // 커스텀 컴포넌트의 attribute 가 변경되면 실행됨.
        // <init-component props="1"> 에서 props 속성을 의미.
        // this.setAttribute("test", "a") 에서 test 속성을 의미
    }

    // 이 커스텀 컴포넌트의 "number" 속성 변화를 감지한다는 선언.
    static observedAttributes = ["number"];
}
```

이 생명 주기들의 자세한 설명은 다음 포스트에서 설명하겠다.


