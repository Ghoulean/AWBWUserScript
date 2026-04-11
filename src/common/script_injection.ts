export function injectScriptNode(
    document: Document,
    f: { toString: () => string; },
) {
    var scriptNode = document.createElement ('script');
    scriptNode.type = "text/javascript";
    scriptNode.textContent  = `(${f.toString()})()`

    var targ = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
    targ.appendChild(scriptNode);
}
