const mongoose = require('mongoose')
const storySchema = new mongoose.Schema({
    storyId: mongoose.SchemaTypes.ObjectId,
    chapter: String,
    content: String,
})
module.exports = mongoose.model('StoryContent', storySchema)
