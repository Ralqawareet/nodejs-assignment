// hapi plugin for auto documentation of api for development environment only
// documentation endpoint will be available at localhost:8000/docs

const hapiSwaggered = {
    plugin: require('hapi-swaggered'),
    options: {
        schemes: ['http', 'ws'],
        info: {
            title: 'NodeJS Assignment',
            description: '',
            version: '1.0'
        }
    }
};
const hapiSwaggeredUi = {
    plugin: require('hapi-swaggered-ui'),
    options: {
        title: 'NodeJS Assignment',
        path: '/docs',
    }, authorization: {
        field: 'apiKey',
        scope: 'query', // header works as well
        // valuePrefix: 'bearer '// prefix incase
        defaultValue: 'demoKey',
        placeholder: 'Enter your apiKey here'
    }, swaggerOptions: {
        validatorUrl: null
    }
}
module.exports = {
    hapiSwaggered,
    hapiSwaggeredUi
}