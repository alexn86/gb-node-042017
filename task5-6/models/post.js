const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Укажите заголовок статьи']
    },
    date: {
        type: String,
        required: [true, 'Укажите дату публикации']
    },
    text: {
        type: String,
        required: [true, 'Укажите содержимое статьи']
    }
});

const Model = mongoose.model('post', PostSchema);

const Post = {
    list: () => {
        return Model.find();
    },

    valid: (post) => {
        return new Promise((resolve, reject) => {
            if (post.title && post.date && post.text) {
                resolve(post);
            } else {
                reject(new Error('Не все поля заполнены!'))
            }
        });
    },

    get: (id) => {
        return Model.findOne({ _id: id });
    },

    add: (post) => {
        const item = new Model(post);

        return item.save();
    },

    edit: (post) => {
        return Model.update({ _id: post._id }, post);
    },

    delete: (id) => {
        return Model.deleteOne({ _id: id });
    }
};

module.exports = Post;