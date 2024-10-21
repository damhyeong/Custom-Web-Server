import {test} from "./test/test.mjs";

class AppTest extends HTMLElement {
    state = {
        number : 0
    }
    setState(name, value){
        this.state[name] = value;
        // this.render();
    }

    constructor(props = {}) {
        super();
        this.domParser = new DOMParser();
        this.tree = null;
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

    // 브라우저의 DOM 에서 떼어지면
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
    state = {
        number : 1
    }
    constructor(props = {}){
        super();

        this.tree = null;
        this.child = null;

        this._internals = this.attachInternals();
        if(!this.style.display){
            this.style.display = "block";
        }

        this.style.margin = "2rem";

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

    async render(){
        this.willHTML = `
            <div on-click="onChangeNumber">
                plain text
                <strong on-click="onChangeNumber">App Component Layer</strong>
                <br/>
                <app-test>
                    <p>This is Child Node</p>
                </app-test>
                <form>
                    <input type="text" value="insert"/>
                </form> <br/>
                <strong>${this.state.number}</strong>
            </div>
        `

        this.tree = await this.makeTreeNode(this.willHTML);

        console.log("처리 후 ");

        while(this.firstChild){
            this.removeChild(this.firstChild);
        }

        // 처리 완료 후 부착
        this.tree.childNodes.forEach((node) => {
            this.appendChild(node);
        })
    }

    onChangeNumber = (e) => {
        this.state.number++;
        this.render();
    }

    set props(value) {
        this._props = value;
    }
    get props(){
        return this._props;
    }

    set child(childNodes){
        this._child = childNodes;
    }
    get child(){
        return this._child;
    }

    async makeTreeNode (textHtml) {
        const parser = new DOMParser();
        const tree = parser.parseFromString(textHtml, "text/html").body;

        await this.appendNodes(tree, tree.childNodes);

        return tree;
    }

    async appendNodes(parentNode, childNodes){

        // 하위 노드 리스트가 있을 경우
        if(childNodes){
            // 모든 하위 노드 리스트의 타입, 그리고 속성, 이벤트 등록을 여기서 해야 한다.
            for (const childNode of childNodes) {


                // 자식 노드가 커스텀 엘리먼트일 경우,
                if(customElements.get(childNode.localName)){

                    // 커스텀 엘리먼트 산하의 DOM TREE 가 존재 할 경우
                    const customChildNodes = childNode.childNodes;
                    const customElementConstructor = customElements.get(childNode.localName);
                    const newCustomElement = new customElementConstructor();

                    newCustomElement.child = customChildNodes;

                    this.processingAttrNode(newCustomElement, childNode);

                    parentNode.replaceChild(newCustomElement, childNode);
                    continue;
                } else {
                    this.processingAttrNode(childNode);
                }
                await this.appendNodes(childNode, childNode.childNodes);
            }
        }
    }

    processingAttrNode(targetNode, copyNode = null){
        let attrNames;
        let attrText = [];

        if(targetNode.nodeName === "#text")
            return;

        // 만약 복사되어야 하는 커스텀 targetNode 일 경우, copyNode 로 부터 속성을 이어받고 처리하며,
        // 단순한 태그 노드일 경우, 스스로 속성을 처리한다.

        if(copyNode){
            attrNames = copyNode.getAttributeNames();
            attrNames.forEach((attrName) => {
                attrText.push(copyNode.getAttribute(attrName));
            })
        } else {
            attrNames = targetNode.getAttributeNames();
            attrNames.forEach((attrName) => {
                attrText.push(targetNode.getAttribute(attrName));
            })
        }
        console.log(attrText);

        attrNames.forEach((attrName, index) => {
            // on-xxxx
            if(attrName.startsWith("on-")){
                const eventAttr = attrName.substring(3, attrName.length);

                targetNode.addEventListener(eventAttr, this[attrText[index]]);

            }

            // props
            // if(Attr.name)
        })
    }
}

customElements.define("init-component", InitComponent);

