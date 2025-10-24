import { getDatabase } from '../src/lib/mongodb'

async function testMongoDBConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...')
    
    const db = await getDatabase()
    
    // Test basic connection
    await db.admin().ping()
    console.log('✅ MongoDB connection successful!')
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log(`📁 Found ${collections.length} collections:`)
    collections.forEach(col => console.log(`  - ${col.name}`))
    
    // Test a simple query
    const orgCount = await db.collection('organizations').countDocuments()
    console.log(`🏢 Organizations in database: ${orgCount}`)
    
    const projectCount = await db.collection('projects').countDocuments()
    console.log(`📊 Projects in database: ${projectCount}`)
    
    const userCount = await db.collection('users').countDocuments()
    console.log(`👥 Users in database: ${userCount}`)
    
    console.log('\n🎉 MongoDB connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error)
    process.exit(1)
  }
}

testMongoDBConnection()
  .then(() => {
    console.log('\n✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
