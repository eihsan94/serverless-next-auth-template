const res = (statusCode: number, body: Object ) => ({
    statusCode, 
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':  'Content-Type, Authorization, Content-Length, X-Requested-With, Accept',
    },
    body: JSON.stringify(body)
})
export default res