require('../src/db/mongoose');
const Task = require('../src/models/task');

// remove a task
/*Task.findByIdAndDelete('5efb9e923b51311173dddfbc').then((task) => {
    console.log(task)
    return Task.countDocuments({ // show tasks that are incompleted
        completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})*/

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({
        completed: false
    })
    return count;
}

deleteTaskAndCount('5efb9d993b51311173dddfbb').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})