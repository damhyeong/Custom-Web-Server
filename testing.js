

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
            <div>
                plain text
                <strong on-click="onChangeNumber">App Component Layer</strong>
                <br/>
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

        e.target.innerText = this.state.number;

        // this.render();
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

