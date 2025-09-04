const fs = require('fs').promises
const path = require('path')
const { v2: cloudinary } = require('cloudinary')

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dsmbionbb',
  api_key: '463836362474921',
  api_secret: '93hwqzfR3LLABxf0Cu6iTpXwK0Y'
})

async function renameToPhotolio() {
  try {
    // Read feed.json
    const feedPath = path.join(__dirname, '..', 'data', 'feed.json')
    const raw = await fs.readFile(feedPath, 'utf8')
    const feed = JSON.parse(raw)
    
    console.log(`Found ${feed.length} images to rename from 'portfolio' to 'photolio'...`)
    
    for (let i = 0; i < feed.length; i++) {
      const item = feed[i]
      
      // Skip if not on Cloudinary
      if (!item.src || !item.src.includes('cloudinary.com')) {
        continue
      }
      
      try {
        // Extract current public_id
        const urlParts = item.src.split('/')
        const currentPublicId = urlParts.slice(-2).join('/').replace(/\.[^/.]+$/, "")
        
        // Create new public_id (replace 'portfolio' with 'photolio')
        const newPublicId = currentPublicId.replace('portfolio/', 'photolio/')
        
        console.log(`Renaming: ${currentPublicId} -> ${newPublicId}`)
        
        // Rename in Cloudinary
        const result = await cloudinary.uploader.rename(currentPublicId, newPublicId)
        
        // Update feed.json with new URL
        item.src = result.secure_url
        item.cloudinaryId = result.public_id
        
        console.log(`✅ Renamed: ${result.secure_url}`)
        
      } catch (error) {
        console.log(`❌ Failed to rename ${item.src}: ${error.message}`)
      }
    }
    
    // Save updated feed.json
    await fs.writeFile(feedPath, JSON.stringify(feed, null, 2))
    console.log('✅ Updated feed.json with new URLs (photolio folder)')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

renameToPhotolio()
