'use strict'

const fs = require('fs')

const fileNames = ['./layers/events.json', './layers/meetings.json', './layers/persons.json', './layers/strike.json']
const files = fileNames.map(f => fs.readFileSync(f, 'utf8')).map(f => JSON.parse(f))

const patterns = {
  './layers/events.json': "data-layer='events' data-feature='",
  './layers/meetings.json': "data-layer='meetings' data-feature='",
  './layers/persons.json': "data-layer='persons' data-feature='",
  './layers/strike.json': "data-layer='strike' data-feature='"
}

let id = 1000
for (let i = 0; i < 4; i++) {
  const file = files[i]
  const fileName = fileNames[i]
  for (const feature of file.features) {
    if (feature.id < 1000) {
      const oldId = feature.id
      feature.id = id++
      if (feature.properties.hasOwnProperty('id')) {
        delete feature.properties['id']
      }
      for (const iFile of files) {
        for (const iFeature of iFile.features) {
          if (!Array.isArray(iFeature.properties.description)) {
            iFeature.properties.description = [iFeature.properties.description]
          }
          const d = iFeature.properties.description
          for (let j = 0; j < d.length; j++) {
            console.log(patterns[fileName] + oldId + "'", patterns[fileName] + feature.id + "'")
            d[j] = d[j].replace(patterns[fileName] + oldId + "'", patterns[fileName] + feature.id + "'")
          }
        }
      }
    }
  }
}

for (let i = 0; i < 4; i++) {
  fs.writeFileSync(fileNames[i], JSON.stringify(files[i], null, 2), 'utf8')
}
