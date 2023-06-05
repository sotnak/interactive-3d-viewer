

const styleDefaults = (style: React.CSSProperties)=>{
    const n_style: React.CSSProperties = {...style}

    if( n_style.height || (n_style.top && n_style.bottom) ){
    } else {
        n_style.height = "40vh"
    }

    if( n_style.width || (n_style.left && n_style.right) ){
    } else {
        n_style.width = "40vw"
    }

    if( !n_style.position ){
        n_style.position = "relative"
    }

    return n_style
}