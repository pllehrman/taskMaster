const mongoose = require('mongoose');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Task = require('./models/Task');


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to MongoDB');
        deleteOldUsersAndData();
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

const deleteOldUsersAndData = async () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Find users who joined at least two days ago
    const usersToDelete = await User.find({ date_joined: { $lt: twoDaysAgo }, fake: false}, 'demo_id');

    // Extract demo_ids from users
    const demoIds = usersToDelete.map(user => user.demo_id);

    // Delete users
    await User.deleteMany({ demo_id: { $in: demoIds } });

    // Delete organizations and tasks associated with these demo_ids
    await Organization.deleteMany({ demo_id: { $in: demoIds } });
    await Task.deleteMany({ demo_id: { $in: demoIds } });

    console.log(`Deleted ${usersToDelete.length} users and their associated organizations and tasks`);
};

deleteOldUsersAndData().catch(console.error);
