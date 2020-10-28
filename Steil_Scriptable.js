// Steil Boulderhalle Widget 

let param = args.widgetParameter
if (param != null && param.length > 0) 
  {
    storeId = param
  }

const widget = new ListWidget()

const storeCapacity = await currOccupancy()
await createWidget()


// used for debugging 
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// build widget content
async function createWidget() {

    widget.addSpacer(4)
    const logoImg = await getImage('steiles-logo.png')

    widget.setPadding(10, 10, 10, 10)
    const titleFontSize = 12
    const detailFontSize = 36

    const logoStack = widget.addStack()
    logoStack.addSpacer(65)
    const logoImageStack = logoStack.addStack()
    logoStack.layoutHorizontally()
    logoImageStack.backgroundColor = new Color("#ffffff", 1.0)
    logoImageStack.cornerRadius = 10
    const wimg = logoImageStack.addImage(logoImg)
    wimg.imageSize = new Size(60, 60)
    wimg.rightAlignImage()
    widget.addSpacer()
    
    let row = widget.addStack()
    row.layoutHorizontally()
    row.addSpacer(2)
    
    let column = row.addStack()
    column.layoutVertically()
    

    const paperText = column.addText("STEIL BOULDERHALLE")
    paperText.font = Font.mediumRoundedSystemFont(11)

    const packageCount = column.addText(storeCapacity.toString())
    packageCount.font = Font.mediumRoundedSystemFont(22)
    if (storeCapacity < 30) {
        packageCount.textColor = new Color("#E50000")
    } else {
        packageCount.textColor = new Color("#00CD66")
    }
    widget.addSpacer(4)

    const row2 = widget.addStack()
    row2.layoutVertically()

    const street = row2.addText("Hardeckstraße 8")
    street.font = Font.regularSystemFont(11)
    
    const city = row2.addText("76185 Karlsruhe")
    city.font = Font.regularSystemFont(11)
    
}


// get the current occupancy 
async function currOccupancy() {
  
    const url = "https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6IlN0ZWlsS0EifQ.JVC0NiFQ2dxbiO32Vb_7S8OMlobsNC3kfAUDGadfPYU"
      
    let elementName = ""
    let currentValue = ""
    let items = []
    let currentItem = null
    const xmlParser = new XMLParser(url)
    
    xmlParser.didStartElement = name => {
    currentValue = ""
      if (name == "data-value") {
        currentItem = {}
      }
      if (name == "data-value") {
         items.push(currentItem)
         currentItem = {}
       } 
    }
    
    xmlParser.didEndElement = name => {
      const hasItem = currentItem != null
      if (hasItem && name == "data-value") {
        currentItem["data-value"] = currentValue
      }       
    }
    xmlParser.foundCharacters = str => {
      currentValue += str
    }
    
    return currentValue
}


// get png from local or download them once
async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
//             case 'steil-logo.png':
//                 imageUrl = "http://felsundeis.com/wp-content/uploads/2020/03/Boulderhalle-Steil-Logo-720x340.jpg"
//                 break
         // get image from different source
            case 'steiles-logo.png':
                imageUrl = "https://boulderhalle-steil.com/wp-content/uploads/fbrfg/apple-touch-icon.png"             
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}

// helper function / download image from url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}


// end of script copy until here ;)
