module.exports = {
    'db': {
        'host': 'ds055885.mlab.com',
        'port': '55885',
        'name': 'geekbrains',
        'user': 'dbuser',
        'password': '123456',
        // 'url': `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
        'url': 'mongodb://dbuser:123456@ds055885.mlab.com:55885/geekbrains'
    },
    'http': {
        'host': 'localhost',
        'port': 8888
    },
    'secret': 'secret'
};