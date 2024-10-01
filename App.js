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
        this.setAttribute("number", "1");

        console.dir(this.getAttributeNode("number"));

        this.number = parseInt(this.getAttribute("number"));

        const [state, setState] = useState(0);
        this.state = state;
        this.setState = setState;

        this.addEventListener("click", function (event) {
            console.log(this.number);

            console.dir(event);

            console.log(event.target);

            this.setState(this.state() - 1);

            console.log(this.state());

            this.number = this.number + 1;
        })


    }

    static observedAttributes = ["number"];


    // 연결 되고 난 후
    connectedCallback(){
        console.log("AppTest 초기 연결");
        console.dir(this);

        this.innerHTML =
            `
            <div style='color: red'>
                ${test()} <br/>
                <div>
                    this.number <br/>
                    ${this.number}
                </div>
                <div>
                    state <br/>
                    ${this.state}
                </div>
            </div>
            `

    }
    disconnectedCallback(){

    }

    adoptedCallback(){

    }

    // 속성의 변화 이후
    attributeChangedCallback(name, oldValue, newValue){
        console.log(`name : ${name}, oldValue : ${oldValue}, newValue : ${newValue}`);
        this.number = parseInt(newValue);

        this.innerHTML =
            `
            <div style='color: red'>
                ${test()} <br/>
                <div>
                    ${this.number}
                </div>
                <div>
                    state <br/>
                    ${this.state}
                </div>
            </div>
            `
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

