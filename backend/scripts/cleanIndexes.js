const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cleanIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to clean indexes...');
        
        const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String }));
        
        // Drop the 'name_1' index specifically
        try {
            await User.collection.dropIndex('name_1');
            console.log('Successfully dropped stale index: name_1');
        } catch (err) {
            if (err.codeName === 'IndexNotFound') {
                console.log('Index name_1 not found, nothing to drop.');
            } else {
                console.error('Error dropping index:', err.message);
            }
        }

        console.log('Index cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error.message);
        process.exit(1);
    }
};

cleanIndexes();
