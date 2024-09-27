import {test} from "./test/test.mjs";

class AppTest extends HTMLElement {
    constructor() {
        super();
        this._internals = this.attachInternals();
        this.style.backgroundColor = "darkgray"
        if(!this.style.display){
            this.style.display = "block";
        }
        console.log(this.style);
    }
    connectedCallback(){
        this.innerHTML = `<div style='color: red'>${test()}</div>`
    }
}

let customElements = window.customElements;

console.log(AppTest.name);

console.log(test());

/*
customElements.define("AppTest", AppTest);
*/

customElements.define("app-test", AppTest);

export function App () {

    return (
        `
        <div>
            <strong>asdf</strong>
            <br/>
            yes
            <app-test style='font-size: 2rem'/>
        </div>
        `
    )
}

