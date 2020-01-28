function unlinkSrcFromImage() {
    var elements = document.getElementsByTagName("img");
    Array.prototype.forEach.call(elements, function (el) {
        // el.savedSrc = el.src;
        el.src = '';
    });
    window.CollectGarbage();
}

function removeImagesLinks() {
    var container = document.getElementById("container");

    var elements = document.getElementsByTagName("img");
    Array.prototype.forEach.call(elements, function (el) {
        container.removeChild(el);
    });
    window.CollectGarbage();
}

function hideVisibility() {
    
    document.body.style.visibility = 'hidden';
    window.CollectGarbage();
}

function activate_shared(searchParams) {
    document.getElementById('activation_type').innerHTML = "ShareTarget:  ";
    const title = searchParams.get("title");
    const text = searchParams.get("text");
    const url = searchParams.get("url");
    document.getElementById("shared_from").innerHTML += "Title: " + title + "<br>";
    text ? document.getElementById("shared_from").innerHTML += "Text: " + text + "<br>": text;
    url ? document.getElementById("shared_from").innerHTML += "Url: " + url + "<br>" : url;
    document.getElementsByClassName('shared')[0].style.visibility = 'visible';
}

function activate_filehandler(searchParams) {
    let file_activation = document.getElementById('activation_type');
    file_activation.innerHTML = "FileHandler:  ";
    // Read file
    let file = searchParams.get("file");
    if (!file) {
        return;
    }

    if (!window.chooseFileSystemEntries){
        return;
    }

    async function getNewFileHandle() {
        const opts = {
            type: 'openFile', // save-file, open-directory
            accepts: [
                {
                    description: 'MY File',
                    extensions: ['txt2'], // file handler in the manifest.
                    // mimeTypes: ['text/plain'],
                },
                {
                    description: 'Txt3 file',
                    extensions: ['txt3'], // file handler in the manifest.
                    // mimeTypes: ['text/plain'],
                },
                {
                    description: 'You file',
                    extensions: ['txt4'], // file handler in the manifest.
                    // mimeTypes: ['text/plain'],
                },
                
            ],
        };
        const handle = await window.chooseFileSystemEntries(opts);
        const file = await handle.getFile();
        const contents = await file.text();
        return contents;
    }

    let file_open_btn = document.createElement('button');
    file_open_btn.innerHTML = "Open File";
    
    let file_name = document.createElement('div');
    file_name.innerHTML = "choose file: " + file;
    file_activation.appendChild(file_name);
    file_activation.appendChild(file_open_btn);

    file_open_btn.addEventListener('click', () => {
        getNewFileHandle().then((contents) => {
            var element = document.getElementById('file_handler');
            element.innerHTML = contents;
            document.getElementsByClassName('filetype')[0].style.visibility = 'visible';
        })
    });
}

function activate_navigate() {
    document.getElementById('activation_type').innerHTML = "Navigation"
}

document.addEventListener('DOMContentLoaded', ()=> {
    if ('serviceWorker' in navigator) { 
        navigator.serviceWorker.register('service-worker.js')
        .then ((reg) => { 
            console.log('service worker is registered successfully, scope is https://sunggook.github.io/hello-pwa/'); 
        }).catch((e) => { 
            console.log('service worker registration failed'); 
        }); 
    }

    // document.getElementsByClassName('shared')[0].style.visibility = 'hidden';
    // document.getElementsByClassName('filetype')[0].style.visibility = 'hidden';

    if (location.search.length) {
        var searchParams = new URLSearchParams(location.search);
        activation_type = searchParams.get("activation");
        if (activation_type == "sharedtarget") {
            activate_shared(searchParams);
        } else {
            activate_navigate();
        }
    } else {
        if ('launchQueue' in window) {
          if (!window.chooseFileSystemEntries){
              return;
          }

          async function getContents(handle) {
            const file = await handle.getFile();
            const contents = await file.text();
            return contents;
          }

          async function writeTestContents(handle) {
            // Create a writer (request permission if necessary).
            const writer = await handle.createWriter();
            // Make sure we start with an empty file
            // await writer.truncate(0);
            // Write the full length of the contents
            await writer.write(0, "WRITTEN DYNAMICALLY WRITTEN DYNAMICALLY WRITTEN DYNAMICALLY");
            // Close the file and write the contents to disk
            await writer.close();
          }
 
          launchQueue.setConsumer(launchParams => {
            if (!launchParams.files.length) {
              activate_navigate();
              return;
            }
        
            let file_activation = document.getElementById('activation_type');
            file_activation.innerHTML = "FileHandler:  ";

            const fileHandle = launchParams.files[0];
            getContents(fileHandle).then((contents) => {
                var element = document.getElementById('file_handler');
                element.innerHTML = contents;
                document.getElementsByClassName('filetype')[0].style.visibility = 'visible';

                writeTestContents(fileHandle);
            });

            // Handle the file:
            // https://github.com/WICG/native-file-system/blob/master/EXPLAINER.md#example-code
          });
        } else {
          activate_navigate();
        }
    }
})

// var global_images = [
//     "images/48d2dd553a5439471a4fb69646eec530ef67b3e8.png",
//     "images/3c57d1db08b92f11a11bc0d4efc86cc8f4cbdbb4.png",
//     "images/4d42396538e42737cd645596762291f2f32f8d83.png",
//     "images/4e4890e3a88cd8321c3c00ab4b75a9e28c0e606f.png",
//     "images/7399df245b73a9501e894e7ee4f6a5dd525340ba.png",
//     "images/96a3b7e63f3f285355ae0403cd41afadbf593633.png",
//     "images/98c37ebe646f725b4d27876f237113ef9acfc940.png",
//     "images/9e1cb03b8302945c8215ef701e185ea47c29d642.png",
//     "images/9ffc233c7a730414475ece1ad8edbea4bc35a5df.png",
//     "images/ac59d84710a164cd31611a4b15ff0b439a980ff5.png",
//     "images/c526266504939bae7c907a3e0d1d2222f207e273.png",
//     "images/e2320cc098a376354c995e41c4785ca9ecc007d4.png",
//     "images/e573740b08597927ae2b9c85bcdcbcac346a2324.png",
//     "images/c953f9b7762b3f88147bcb1d30b6fca0d78a9f0d.png",
// ]

