function computeTableScalingRatio() {
    let w = window.innerWidth < 1280 ? 1280 : (window.innerWidth > 1920 ? 1920 : window.innerWidth);
    let scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    return (w - scrollWidth - 48) / 1855;
}

export {computeTableScalingRatio}
