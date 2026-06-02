import { collection, getDocs, writeBatch, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { properties, filterConfig, locations, priceRanges } from '../data/properties';

/**
 * Seeds the Firestore database with initial property data and filter configuration
 * if the database is found to be empty. This ensures immediate out-of-the-box working.
 */
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed properties if empty
    const propertiesColRef = collection(db, 'properties');
    const propertiesSnapshot = await getDocs(propertiesColRef);
    
    if (propertiesSnapshot.empty) {
      console.log('Firestore Seeder: Seeding properties collection...');
      const batch = writeBatch(db);
      
      properties.forEach((prop) => {
        // Use the original ID as the document ID for reference consistency
        const docRef = doc(propertiesColRef, String(prop.id));
        batch.set(docRef, prop);
      });
      
      await batch.commit();
      console.log('Firestore Seeder: Properties seeded successfully.');
    } else {
      console.log('Firestore Seeder: Properties collection is already seeded.');
    }

    // 2. Seed filter configurations, locations, and price ranges if empty
    const configDocRef = doc(db, 'config', 'filters');
    const configDocSnap = await getDoc(configDocRef);
    
    if (!configDocSnap.exists()) {
      console.log('Firestore Seeder: Seeding filter/category configurations...');
      await setDoc(configDocRef, {
        filterConfig,
        locations,
        priceRanges
      });
      console.log('Firestore Seeder: Filter configuration seeded successfully.');
    } else {
      console.log('Firestore Seeder: Filter configuration already exists.');
    }
  } catch (error) {
    console.error('Firestore Seeder: Error checking/seeding database:', error);
  }
}
