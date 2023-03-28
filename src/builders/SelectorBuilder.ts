import RenderOrderSelector from "../selectors/RenderOrderSelector";
import ModelSelector from "../selectors/ModelSelector";
import OpacitySelector from "../selectors/OpacitySelector";

export enum SelectorOption{
    renderOrder,
    opacity
}

export function build(option: SelectorOption): ModelSelector{
    switch (option){
        case SelectorOption.renderOrder:
            return new RenderOrderSelector();
        case SelectorOption.opacity:
            return new OpacitySelector();
    }
}