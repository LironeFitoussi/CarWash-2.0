import Section from '../models/Section';

const connectDB = require('../connect/db');

async function cleanSectionData() {
  try {
    console.log('Cleaning section data...');
    
    // Remove section_id field from all existing documents
    const result = await Section.updateMany({}, { $unset: { section_id: '' } });
    console.log('Removed section_id field from', result.modifiedCount, 'documents');
    
    // Count total sections
    const totalSections = await Section.countDocuments();
    console.log('Total sections in database:', totalSections);
    
    console.log('Section data cleanup completed!');
    return { success: true };
    
  } catch (error) {
    console.error('Section data cleanup failed:', error);
    return { success: false, error };
  }
}

// Run if this file is executed directly
if (require.main === module) {
  connectDB()
    .then(async () => {
      console.log('Connected to MongoDB for data cleanup');
      const result = await cleanSectionData();
      
      if (result.success) {
        console.log('Data cleanup completed successfully');
        process.exit(0);
      } else {
        console.error('Data cleanup failed');
        process.exit(1);
      }
    })
    .catch((error: any) => {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    });
} 