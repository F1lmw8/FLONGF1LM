import { Pool } from 'pg'

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Initialize database tables
export async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id VARCHAR(255) PRIMARY KEY,
        src TEXT NOT NULL,
        w INTEGER NOT NULL,
        h INTEGER NOT NULL,
        alt TEXT,
        date DATE,
        tags TEXT[],
        watermark BOOLEAN DEFAULT true,
        overlay BOOLEAN DEFAULT true,
        camera TEXT,
        lens TEXT,
        f_number INTEGER,
        iso TEXT,
        album_id TEXT,
        album_title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id)
    `)
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(date)
    `)
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Get all photos
export async function getAllPhotos() {
  try {
    const result = await pool.query(`
      SELECT 
        id, src, w, h, alt, date, tags, watermark, overlay,
        camera, lens, f_number as "fNumber", iso,
        album_id as "albumId", album_title as "albumTitle"
      FROM photos 
      ORDER BY created_at DESC
    `)
    return result.rows
  } catch (error) {
    console.error('Error getting photos:', error)
    return []
  }
}

// Add new photo
export async function addPhoto(photo: any) {
  try {
    const result = await pool.query(`
      INSERT INTO photos (
        id, src, w, h, alt, date, tags, watermark, overlay,
        camera, lens, f_number, iso, album_id, album_title
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      photo.id, photo.src, photo.w, photo.h, photo.alt, photo.date,
      photo.tags, photo.watermark, photo.overlay, photo.camera,
      photo.lens, photo.fNumber, photo.iso, photo.albumId, photo.albumTitle
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error adding photo:', error)
    throw error
  }
}

// Delete photo
export async function deletePhoto(id: string) {
  try {
    const result = await pool.query('DELETE FROM photos WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting photo:', error)
    throw error
  }
}

// Update photo
export async function updatePhoto(id: string, updates: any) {
  try {
    const setClause = Object.keys(updates)
      .map((key, index) => {
        const dbKey = key === 'fNumber' ? 'f_number' : 
                     key === 'albumId' ? 'album_id' : 
                     key === 'albumTitle' ? 'album_title' : key
        return `${dbKey} = $${index + 2}`
      })
      .join(', ')
    
    const values = [id, ...Object.values(updates)]
    
    const result = await pool.query(`
      UPDATE photos 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `, values)
    
    return result.rows[0]
  } catch (error) {
    console.error('Error updating photo:', error)
    throw error
  }
}

export default pool
