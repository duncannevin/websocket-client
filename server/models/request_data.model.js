module.exports = {
  userId: String,
  connectionName: {
    type: String,
    unique: true
  },
  cookies: [{
    key: String,
    value: String
  }],
  headers: [{
    key: String,
    value: String
  }],
  bodies: [{
    name: String,
    lang: String,
    content: String
  }]
}

/*
requestData: {
  cookies: [],
    headers: [],
    bodies: []
},
*/
