const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-large-width') != null 
    && rootStyles.getPropertyValue('--book-cover-large-width')!== '') {
    ready()
}else{
    document.getElementById('main-css')
    .addEventListener('load', ready)
}

window.addEventListener("load", function () {
    
    window.setTimeout(runAfterLoad, 2000);
}, false);
function ready() {

        const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-large-width'))
        const coverAspectRatio =  parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
        const coverHeight = coverWidth / coverAspectRatio
        FilePond.registerPlugin(
            FilePondPluginImagePreview,
            FilePondPluginImageResize,
            FilePondPluginFileEncode    
        )


        console.log('coverAspectRatio', coverAspectRatio, 'coverWidth', coverWidth, 'coverHeight', coverHeight )
        FilePond.parse(document.body)
        FilePond.setOptions({
            stylePanelAspectRatio: 1 / coverAspectRatio,
            imageResizeTargetWidth: coverWidth,
            imageResizeTargetHeight: coverHeight
        })


}


function runAfterLoad(){
    const filePondDiv = document.getElementsByClassName('filepond--root')
    console.log('before', filePondDiv)
    filePondDiv.style = "color:red; width: 250; height: 375;"
    console.log('after', filePondDiv)
}

