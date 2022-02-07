# MovieProjectMongoDB

Instructions to run:

1. install express:
	npm install express --save

2. install pug:
	npm i -g pug-cli

3. install express session
	npm install express-session

4. install mongodb (use default directory and settings):
	npm install mongodb --save

5. npm install csv-parser
	npm install csv

6. initialize database:
	node database-initializer.js
	2 users are created:
		username: user1, password: 123 (contributing type)
		username: user2, password: 123 (regular type)
	
7. start mongod daemon:
	mongod --dbpath=/data

8. start mongo:
	mongo

9. run server:
	node .\project-server.js

10. for browser side:
	http://localhost:3000/

11. To log into the page:
	username: user1, password: 123

12. Name of project report: FinalProjectReport.pdf
	Located in folder: FinalProject.zip
