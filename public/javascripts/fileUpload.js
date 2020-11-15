const rootStyles = window.getComputedStyle(document.documentElement);
if(rootStyles.getPropertyValue('book-cover-width-large') != null && rootStyles.getPropertyValue('book-cover-width-large') != ''){
    ready();
    console.log('First');
} else{
    document.getElementById('main-css').addEventListener('load', ready());
    console.log('Second');
};

//register all the plugins we have imported in the layout
//documentations https://pqina.nl/filepond/docs/patterns/plugins/image-resize/
function ready(){
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'));
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'));
    const coverHeight = coverWidth / coverAspectRatio;

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )
    //setting the options of the field
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })
        
    FilePond.parse(document.body);

    console.log('hi')
}
