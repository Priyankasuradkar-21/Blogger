// test/test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');  

const expect = chai.expect;
let authToken;
chai.use(chaiHttp);

describe('User Registration API', () => {
    it('should register a new user', async () => {
        chai
          .request(app)
          .post('/user/create')
          .send({email: 'test1@gmail.com', username: 'test', mobileNumber: '8329224821', password: 'Test@#123'})
          .end(async (err, res) => {
            if (err) 
              return done('ERROR ::: ', err);
            
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').equal('User registered successfully');
            await done()
        });
    });

    it('user already exists', async() => {
        chai
            .request(app)
            .post('/user/create')
            .send({email: 'test1@gmail.com', username: 'test', mobileNumber: '8329224821', password: 'Test@#123'})
            .end(async (err, res) => {
                if(err)
                    return done(err)
            
                expect(res).to.have.status(403)
                expect(res.body).to.have.property('message').equal('Account already exists');
                await done();
            })
    })

    it('invalid email address', () => {
        chai
            .request(app)
            .post('/user/create')
            .send({email: 'test', username: 'test', mobileNumber: '8329224821', password: 'Test@#123'})
            .end(async (err, res) => {
                if(err)
                    return done(err);

                expect(res).to.have.status(403)
                expect(res.body).to.have.property('message').equal('Invalid Email Address');
                await done();
            })
    })

    it('should check required values', async() => {
        chai
            .request(app)
            .post('/user/create')
            .send({email : 'test1@gmail.com'})
            .end(async(err, res) => {
                if(err)
                    return done(err)
                
                expect(res).to.have.status(200)
                expect(req.body).to.have.property('message').equal('Please provide required fields')
                await done();
            })  

    })
});

describe('User Login API', () => {
    it('should login user successfully', async() => {
        chai    
            .request(app)
            .post('/user/login')
            .send({email : 'test1@gmail.com', password : 'Test@123'})
            .end(async(err, res) => {
                if(err)
                    return done(err)
                
                authToken  = res.body.token;
                expect(res).to.have.status(200)
                // expect(res.body).to.have.property('success').equal(true);
                await done();
            })
    })

    it('login user wrong password', async() => {
        chai
            .request(app)
            .post('/user/login')
            .send({email : 'test1@gmail.com', password : 'Test'})
            .end(async(err, res) => {
                if(err)
                    return done(err)

                expect(res).to.have.status(403)
                expect(res.body).to.have.property('message').equal('Incorrect Password')
                await done();
            })
    })

    it('incorrect email address', async() => {
        chai
            .request(app)
            .post('/user/login')
            .send({email : 'test2@gmail.com', password : 'Test@123'})
            .end(async(err, res) => {
                if(err)
                    return done(err)

                expect(res).to.have.status(404)
                expect(res.body).to.have.property('message').equal('Email not found')
                await done();
            })
    })
        
})

describe('Update User API', async () => {
    it('update user successfully', () => {
        chai
            .request(app)
            .patch('/user/udpate')
            .set('Authorization', `Bearer ${authToken}`)
            .send({username : 'Testing'})
            .end(async(err, res) => {
                if(err)
                    return done(err)

                expect(res).to.have(200);
                expect(res.body).to.have.property('message').equal('Updated successfully')
                await done();
            })
    })
})

describe('Delete User API', async () => {
    it('should delete user', async() => {
        chai
            .request(app)
            .delete('/user/delete')
            .set('Authorization', `Bearer ${authToken}`)
            .end(async(err, res) => {
                if(err)
                    return done(err)

                expect(res).to.have(200);
                expect(res.body).to.have.property('message').equal('User Deleted Successfully')
                await done();
            })
    })
})
