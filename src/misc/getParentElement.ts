export default function getParentElement(element: HTMLElement): HTMLElement {
    if(!element.parentElement){
        throw new Error('Unable to find parent element');
    }

    return element.parentElement
}