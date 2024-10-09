import {test} from "./test/test.mjs";

class AppTest extends HTMLElement {
    state = {
        number : 0
    }
    setState(name, value){
        this.state[name] = value;
        this.render();
    }

    constructor() {
        super();
        this.domParser = new DOMParser();

        this._internals = this.attachInternals();
        this.style.backgroundColor = "darkgray"
        if(!this.style.display){
            this.style.display = "block";
        }
        console.log(this.style);
        this.setAttribute("number", "1");

        console.log(this.getAttribute("props"));

        this.addEventListener("click", function (event) {
            console.log(this.state.number);
            console.dir(event);

            console.log(event.target);

            this.setState("number", this.state.number - 1);

            console.log(this.state);
        })

        this.props = this.getAttribute("props");
        console.log(this.props);
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
            </div>
            `
        console.log(this.querySelector("div").getAttributeNames());
    }
}


let customElements = window.customElements;

customElements.define("app-test", AppTest);

class App extends HTMLElement {
    constructor(){
        super();
        this._internals = this.attachInternals();
        if(!this.style.display){
            this.style.display = "block";
        }
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
        this.innerHTML = `
            <div>
                <strong>App Component Layer</strong>
                <br/>
                <app-test/> 
            </div>
        `
    }
}

customElements.define("init-component", App);
