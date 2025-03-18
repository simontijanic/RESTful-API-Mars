require('dotenv').config();

const express = require('express');
const apiRoutes = require('./routers/dataRoute');
const databaseController = require('./controllers/databaseController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

const connectServer = async () => {
    try {
        await databaseController.connect();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

connectServer();