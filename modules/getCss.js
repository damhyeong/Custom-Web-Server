
function getCss(url, baseUrl){
    const linkElement = document.createElement("link");

    if(baseUrl){
        url = new URL(url, baseUrl).href;
    }

    linkElement.rel = "stylesheet";
    linkElement.href = url;

    document.head.appendChild(linkElement);
}

const getCss2 = (url) => {
    const linkElement = document.createElement("link");

    linkElement.rel = "stylesheet";
    linkElement.href = url;


    document.head.appendChild(linkElement);
}

window.getCss = getCss;