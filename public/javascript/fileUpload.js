const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-large-width') != null 
    && rootStyles.getPropertyValue('--book-cover-large-width')!== '') {
    ready()
}else{
    document.getElementById('main-css')
    .addEventListener('load', ready)
}

function ready() {

        const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-large-width'))
        const coverAspectRatio =  parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
        const coverHeight = coverWidth / coverAspectRatio
        FilePond.registerPlugin(
            FilePondPluginImagePreview,
            FilePondPluginImageResize,
            FilePondPluginFileEncode    
        )



        FilePond.parse(document.body)
        FilePond.setOptions({
            stylePanelAspectRatio: 1 / coverAspectRatio,
            imageResizeTargetWidth: coverWidth,
            imageResizeTargetHeight: coverHeight
        })
}

