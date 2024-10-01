
class CustomEventTarget extends EventTarget {
    constructor(secretValue) {
        super();
        this._secret = secretValue;
    }

    setSecret = (newSecret) => {
        this._secret = newSecret
    }

    getSecret = () => {
        return this._secret;
    }

}

const useState = (value) => {
    const customEventTarget = new CustomEventTarget(value);


    return [customEventTarget.getSecret, customEventTarget.setSecret];
}

window.useState = useState;