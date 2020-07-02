const express = require('express');
require('./db/mongoose'); // To ensure the file runs
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter); // to add router in the file
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})

