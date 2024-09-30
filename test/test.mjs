import {test2} from "./test2.js"

getCss("./test.css", import.meta.url);

export function test(){
    return `${test2()}`;
}

