import {test} from "./test/test.mjs";

class AppTest extends HTMLElement {
    state = {
        number : 0
    }
    setState(name, value){
        this.state[name] = value;
        this.render();
    }

    constructor(props = {}) {
        super();
        this.domParser = new DOMParser();
        this._props = props;

        this._internals = this.attachInternals();
        this.style.backgroundColor = "darkgray"
        if(!this.style.display){
            this.style.display = "block";
        }
        this.setAttribute("number", "1");

        console.log(this.getAttribute("props"));

        this.addEventListener("click", function (event) {
            console.log(this.state.number);
            console.dir(event);

            console.log(event.target);

            this.setState("number", this.state.number - 1);

            console.log(this.state);
        })

    }

    static observedAttributes = ["number"];


    // 연결 되고 난 후
    connectedCallback(){
        console.log("AppTest 초기 연결");

        this.render();
    }
    disconnectedCallback(){

    }

    adoptedCallback(){

    }

    // 속성의 변화 이후
    attributeChangedCallback(name, oldValue, newValue){
        console.log(`name : ${name}, oldValue : ${oldValue}, newValue : ${newValue}`);

        this.render();
    }

    render(){
        this.innerHTML =
            `
            <div style='color: red'>
                <div>
                    ${this.number}
                </div>
                <div>
                    state <br/>
                    ${this.state.number}
                </div>
                <div>
                    props A is : ${this._props.a}
                </div>
                <div>
                    props B is : ${this._props.b}
                </div>
            </div>
            `

    }


    set props(value) {
        this._props = value;
    }

    get props(){
        return this._props;
    }
}


let customElements = window.customElements;

customElements.define("app-test", AppTest);

class InitComponent extends HTMLElement {
    constructor(props = {}){
        super();
        this._internals = this.attachInternals();
        if(!this.style.display){
            this.style.display = "block";
        }

        this._props = props;
    }

    connectedCallback(){
        this.render();
    }

    attributeChangedCallback(name, newValue, oldValue){
        this.render();
    }
    disconnectedCallback(){

    }
    adoptedCallback(){

    }

    render(){
        /*
        this.innerHTML = `
            <div>
                <strong>App Component Layer</strong>
                <br/>
                <app-test>
                    <p>Paragraph</p>
                </app-test> 
                <form>
                    <input type="text" value="insert"/>
                </form>
            </div>
        `
        */

        this.willHTML = `
            <div>
                plain text
                <strong>App Component Layer</strong>
                <br/>
                <app-test>
                    <p>Paragraph</p>
                </app-test> 
                <form>
                    <input type="text" value="insert"/>
                </form>
            </div> 
        `

        const appTestNode = new AppTest({a : 1, b : 2});

        appTestNode.setAttribute("attr", "fixedAttr");

        appTestNode.setAttribute("on-click", "onChangeNumber");

        const attrs = appTestNode.getAttributeNames();

        attrs.forEach((value) => {
            const attrValue = appTestNode.getAttribute(value);
            console.log(attrValue);
        })

        const parser = new DOMParser();

        const tree = parser.parseFromString(this.willHTML, "text/html").body;

        console.log(tree.childNodes);
        console.log(tree);

        const nodes = tree.childNodes;
        nodes.forEach((nd) => {
            this.appendChild(nd);
        })

        this.appendChild(appTestNode);
    }

    set props(value) {
        this._props = value;
    }

    get props(){
        return this._props;
    }
}

customElements.define("init-component", InitComponent);
