import { getDatabase } from '../src/lib/mongodb'
import { ObjectId } from 'mongodb'

async function seedDatabase() {
  try {
    const db = await getDatabase()
    
    // Create collections
    const collections = [
      'organizations',
      'users', 
      'projects',
      'project_metrics',
      'maintenance_tickets',
      'decommission_plans',
      'ceo_tasks',
      'ceo_context',
      'communication_items',
      'predictive_models'
    ]

    for (const collectionName of collections) {
      await db.createCollection(collectionName)
      console.log(`✅ Created collection: ${collectionName}`)
    }

    // Insert sample organization
    const orgResult = await db.collection('organizations').insertOne({
      _id: new ObjectId(),
      name: 'Acme Corporation',
      domain: 'acme.com',
      clerkOrgId: 'org_2abc123def456',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log(`✅ Created sample organization: ${orgResult.insertedId}`)

    // Insert sample user
    const userResult = await db.collection('users').insertOne({
      _id: new ObjectId(),
      clerkUserId: 'user_2xyz789abc123',
      email: 'claire@acme.com',
      firstName: 'Claire',
      lastName: 'Chen',
      role: 'ADMIN',
      organizationId: orgResult.insertedId,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log(`✅ Created sample user: ${userResult.insertedId}`)

    // Insert sample project
    const projectResult = await db.collection('projects').insertOne({
      _id: new ObjectId(),
      name: 'Phoenix E-Commerce Platform',
      description: 'Next-generation e-commerce platform with AI recommendations',
      status: 'ACTIVE',
      startDate: new Date('2024-01-15'),
      budget: 500000,
      organizationId: orgResult.insertedId,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log(`✅ Created sample project: ${projectResult.insertedId}`)

    // Insert sample metrics
    const metrics = [
      {
        _id: new ObjectId(),
        projectId: projectResult.insertedId,
        metricType: 'UPTIME_PERCENTAGE',
        value: 99.8,
        unit: '%',
        timestamp: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projectResult.insertedId,
        metricType: 'ERROR_RATE',
        value: 0.2,
        unit: '%',
        timestamp: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projectResult.insertedId,
        metricType: 'CLOUD_SPEND',
        value: 12450,
        unit: 'USD',
        timestamp: new Date()
      }
    ]

    await db.collection('project_metrics').insertMany(metrics)
    console.log(`✅ Created ${metrics.length} sample metrics`)

    // Insert sample tickets
    const tickets = [
      {
        _id: new ObjectId(),
        projectId: projectResult.insertedId,
        title: 'Payment gateway timeout issue',
        description: 'Users experiencing timeouts during checkout',
        status: 'OPEN',
        priority: 'HIGH',
        component: 'Payment Module',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projectResult.insertedId,
        title: 'Database connection pool optimization',
        description: 'Optimize connection pool settings for better performance',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        component: 'Database',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await db.collection('maintenance_tickets').insertMany(tickets)
    console.log(`✅ Created ${tickets.length} sample tickets`)

    // Insert sample CEO user
    const ceoUserResult = await db.collection('users').insertOne({
      _id: new ObjectId(),
      clerkUserId: 'user_ceo_noble123',
      email: 'noble@nobletechinc.com',
      firstName: 'Noble',
      lastName: 'Tech',
      role: 'CEO',
      organizationId: null, // CEO doesn't belong to client org
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log(`✅ Created CEO user: ${ceoUserResult.insertedId}`)

    // Insert sample CEO tasks
    const ceoTasks = [
      {
        _id: new ObjectId(),
        title: 'Review Q4 strategic roadmap',
        description: 'Finalize strategic initiatives for Q4',
        status: 'PENDING',
        priority: 'CRITICAL',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        userId: ceoUserResult.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Client escalation: Phoenix project',
        description: 'Address budget concerns from Acme Corp',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        userId: ceoUserResult.insertedId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await db.collection('ceo_tasks').insertMany(ceoTasks)
    console.log(`✅ Created ${ceoTasks.length} sample CEO tasks`)

    // Insert CEO context
    await db.collection('ceo_context').insertOne({
      _id: new ObjectId(),
      userId: ceoUserResult.insertedId,
      location: 'HOME',
      focusMode: false,
      lastActive: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log(`✅ Created CEO context`)

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Sample data created:')
    console.log('- 1 Organization (Acme Corporation)')
    console.log('- 2 Users (Claire Chen - Admin, Noble - CEO)')
    console.log('- 1 Project (Phoenix E-Commerce Platform)')
    console.log('- 3 Project Metrics (Uptime, Error Rate, Cloud Spend)')
    console.log('- 2 Maintenance Tickets')
    console.log('- 2 CEO Tasks')
    console.log('- 1 CEO Context')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('\n✅ Seeding completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
