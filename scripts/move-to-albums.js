const fs = require('fs').promises
const path = require('path')

async function moveFilesToAlbums() {
  try {
    // Read feed.json
    const feedPath = path.join(__dirname, '..', 'data', 'feed.json')
    const raw = await fs.readFile(feedPath, 'utf8')
    const feed = JSON.parse(raw)
    
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')
    
    for (const item of feed) {
      if (item.albumId && item.src) {
        const srcPath = path.join(__dirname, '..', 'public', item.src)
        const albumDir = path.join(uploadsDir, item.albumId)
        const destPath = path.join(albumDir, path.basename(item.src))
        
        try {
          // Create album directory
          await fs.mkdir(albumDir, { recursive: true })
          
          // Check if source file exists
          await fs.access(srcPath)
          
          // Move file
          await fs.rename(srcPath, destPath)
          console.log(`Moved: ${item.src} -> /uploads/${item.albumId}/${path.basename(item.src)}`)
          
          // Update src in feed.json
          item.src = `/uploads/${item.albumId}/${path.basename(item.src)}`
        } catch (error) {
          console.log(`Skipped: ${item.src} (${error.message})`)
        }
      }
    }
    
    // Save updated feed.json
    await fs.writeFile(feedPath, JSON.stringify(feed, null, 2))
    console.log('Updated feed.json with new paths')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

moveFilesToAlbums()
