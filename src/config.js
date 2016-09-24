development = false

if (development) {
	config = {
		apiUrl: 'http://localhost:8082',
		socketUrl: 'http://localhost:5000'
	}
} else {
	config = {
		apiUrl: 'https://desolate-savannah-81272.herokuapp.com',
		socketUrl: 'https://immense-lowlands-90076.herokuapp.com'
	}
}

module.exports = { config: config }