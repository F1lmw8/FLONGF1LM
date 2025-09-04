const fs = require('fs').promises
const path = require('path')
const { v2: cloudinary } = require('cloudinary')

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dsmbionbb',
  api_key: '463836362474921',
  api_secret: '93hwqzfR3LLABxf0Cu6iTpXwK0Y'
})

async function uploadToCloudinary() {
  try {
    // Read feed.json
    const feedPath = path.join(__dirname, '..', 'data', 'feed.json')
    const raw = await fs.readFile(feedPath, 'utf8')
    const feed = JSON.parse(raw)
    
    console.log(`Found ${feed.length} images to upload...`)
    
    for (let i = 0; i < feed.length; i++) {
      const item = feed[i]
      
      // Skip if already on Cloudinary
      if (item.src && item.src.includes('cloudinary.com')) {
        console.log(`Skipping ${item.src} (already on Cloudinary)`)
        continue
      }
      
      // Skip if local file doesn't exist
      if (!item.src || !item.src.startsWith('/uploads/')) {
        console.log(`Skipping ${item.src} (not a local file)`)
        continue
      }
      
      const localPath = path.join(__dirname, '..', 'public', item.src)
      
      try {
        // Check if file exists
        await fs.access(localPath)
        
        // Upload to Cloudinary
        const folder = item.albumId ? `portfolio/${item.albumId}` : 'portfolio'
        const publicId = path.basename(item.src).replace(/\.[^/.]+$/, "")
        
        console.log(`Uploading ${item.src} to Cloudinary...`)
        
        const result = await cloudinary.uploader.upload(localPath, {
          folder,
          public_id: publicId,
          resource_type: 'auto'
        })
        
        // Update feed.json with Cloudinary URL
        item.src = result.secure_url
        item.cloudinaryId = result.public_id
        
        console.log(`✅ Uploaded: ${result.secure_url}`)
        
      } catch (error) {
        console.log(`❌ Failed to upload ${item.src}: ${error.message}`)
      }
    }
    
    // Save updated feed.json
    await fs.writeFile(feedPath, JSON.stringify(feed, null, 2))
    console.log('✅ Updated feed.json with Cloudinary URLs')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

uploadToCloudinary()
