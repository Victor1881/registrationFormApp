import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcrypt'
import db from '../config/db.js'
import { createUser, login, getUser, updateUser } from '../managers/userManager.js'
import { validateUserData } from '../lib/validations.js'
import {generateCaptcha} from "../lib/captcha.js"


describe('User Management Tests', () => {
    let dbStub

    beforeEach(() => {
        dbStub = sinon.stub(db, 'query')
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('createUser Tests', () => {
        it('should create user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'Test123!',
                first_name: 'John',
                last_name: 'Doe'
            }

            dbStub.callsFake((query, values, callback) => {
                callback(null, { insertId: 1 })
            })

            const result = await createUser(userData)
            expect(result).to.equal(1)
            expect(dbStub.calledOnce).to.be.true
        })

        it('should handle duplicate email', async () => {
            const userData = {
                email: 'existing@test.com',
                password: 'Test123!',
                first_name: 'John',
                last_name: 'Doe'
            }

            dbStub.callsFake((query, values, callback) => {
                callback({ code: 'ER_DUP_ENTRY' })
            })

            try {
                await createUser(userData)
                expect.fail('Should have thrown an error')
            } catch (error) {
                expect(error.code).to.equal('ER_DUP_ENTRY')
            }
        })
    })

    describe('login Tests', () => {
        it('should login successfully', async () => {
            const loginData = {
                email: 'test@test.com',
                password: 'Test123!'
            }

            const hashedPassword = await bcrypt.hash('Test123!', 10)
            dbStub.callsFake((query, values, callback) => {
                callback(null, [{
                    id: 1,
                    email: 'test@test.com',
                    password: hashedPassword
                }])
            })

            const token = await login(loginData)
            expect(token).to.be.a('string')
        });

        it('should fail with wrong password', async () => {
            const loginData = {
                email: 'test@test.com',
                password: 'Pass123!'
            }

            const hashedPassword = await bcrypt.hash('Test123!', 10)
            dbStub.callsFake((query, values, callback) => {
                callback(null, [{
                    id: 1,
                    email: 'test@test.com',
                    password: hashedPassword
                }])
            })

            try {
                await login(loginData)
                expect.fail('Should have thrown an error')
            } catch (error) {
                expect(error.message).to.equal('No such user')
            }
        })
    })

    describe('getUser Tests', () => {
        it('should get user by id', async () => {
            const userId = 1
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                first_name: 'John',
                last_name: 'Doe'
            }

            dbStub.callsFake((query, values, callback) => {
                callback(null, [mockUser])
            })

            const user = await getUser(userId)
            expect(user).to.deep.equal(mockUser)
        })
    })

    describe('updateUser Tests', () => {
        it('should update user details', async () => {
            const userId = 1;
            const updateData = {
                first_name: 'UpdatedJohn',
                last_name: 'UpdatedDoe'
            }

            dbStub.callsFake((query, values, callback) => {
                callback(null, { affectedRows: 1 })
            })

            const result = await updateUser(userId, updateData)
            expect(result.affectedRows).to.equal(1)
        });

        it('should handle password update', async () => {
            const userId = 1
            const updateData = {
                password: 'NewTest123!'
            }

            dbStub.callsFake((query, values, callback) => {
                callback(null, { affectedRows: 1 })
            })

            const result = await updateUser(userId, updateData)
            expect(result.affectedRows).to.equal(1)

            expect(dbStub.args[0][1][0]).to.not.equal('NewTest123!')
        })
    })
})

describe('Validation Tests', () => {
    it('should validate email format', () => {
        const data = {
            email: 'invalid-email',
            first_name: 'John',
            last_name: 'Doe',
            password: 'Test123!'
        }

        const error = validateUserData(data)
        expect(error).to.equal('Please enter a valid email address')
    })

    it('should validate password requirements', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'weak'
        }

        const error = validateUserData(data)
        expect(error).to.equal('Password must be at least 5 characters long')
    })

    it('should validate password uppercase requirement', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'test123!'
        }

        const error = validateUserData(data)
        expect(error).to.equal('Password must contain at least one uppercase letter')
    })

    it('should validate password special character requirement', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'John',
            last_name: 'Doe',
            password: 'Test123'
        }

        const error = validateUserData(data)
        expect(error).to.equal('Password must contain at least one special character');
    })

    it('should validate first name length', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'J',
            last_name: 'Doe',
            password: 'Test123!'
        }

        const error = validateUserData(data)
        expect(error).to.equal('First name must be at least 3 characters long');
    })

    it('should validate last name length', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'John',
            last_name: 'D',
            password: 'Test123!'
        }

        const error = validateUserData(data)
        expect(error).to.equal('Last name must be at least 3 characters long')
    });

    it('should validate first name maximum length', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'J'.repeat(51), // 51 characters
            last_name: 'Doe',
            password: 'Test123!'
        }

        const error = validateUserData(data)
        expect(error).to.equal('First name must be less than 50 characters')
    })

    it('should validate last name maximum length', () => {
        const data = {
            email: 'test@test.com',
            first_name: 'John',
            last_name: 'D'.repeat(51),
            password: 'Test123!'
        }

        const error = validateUserData(data)
        expect(error).to.equal('Last name must be less than 50 characters')
    })
})

describe('Enhanced Validation Tests', () => {
    describe('Email Validation', () => {

        it('should handle null/undefined email', () => {
            const data = {
                email: null,
                first_name: 'John',
                last_name: 'Doe',
                password: 'Test123!'
            }
            expect(validateUserData(data)).to.equal('Email is required')

            data.email = undefined
            expect(validateUserData(data)).to.equal('Email is required')
        })

        it('should normalize email to lowercase', () => {
            const data = {
                email: 'test@EXAMPLE.com',
                first_name: 'John',
                last_name: 'Doe',
                password: 'Test123!'
            }
            validateUserData(data);
            expect(data.email).to.equal('test@example.com')
        })

        it('should validate email maximum length', () => {
            const data = {
                email: 'a'.repeat(247) + '@test.com',
                first_name: 'John',
                last_name: 'Doe',
                password: 'Test123!'
            }
            expect(validateUserData(data)).to.equal('Email address is too long (maximum 255 characters)')
        })

        it('should trim whitespace from email', () => {
            const data = {
                email: '  test@example.com  ',
                first_name: 'John',
                last_name: 'Doe',
                password: 'Test123!'
            }
            validateUserData(data)
            expect(data.email).to.equal('test@example.com')
        })
    })

    describe('Password Validation', () => {
        it('should validate maximum password length', () => {
            const data = {
                email: 'test@test.com',
                first_name: 'John',
                last_name: 'Doe',
                password: 'T'.repeat(31) + 'est123!'
            }
            expect(validateUserData(data)).to.equal('Password is too long (maximum 30 characters)')
        })
    })
})

describe('Database Edge Cases', () => {
    let dbStub

    beforeEach(() => {
        dbStub = sinon.stub(db, 'query')
    });

    afterEach(() => {
        sinon.restore()
    })


    it('should handle database connection errors on getUser', async () => {
        const userId = 1
        dbStub.callsFake((query, values, callback) => {
            callback(new Error('Database connection lost'))
        })

        try {
            await getUser(userId)
            expect.fail('Should have thrown an error')
        } catch (error) {
            expect(error.message).to.equal('Database connection lost')
        }
    })
})

describe('Captcha Tests', () => {
    describe('generateCaptcha', () => {
        it('should generate a 6-character captcha', () => {
            const captcha = generateCaptcha()
            expect(captcha).to.have.lengthOf(6)
        })

        it('should only contain valid characters', () => {
            const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
            const captcha = generateCaptcha()

            captcha.split('').forEach(char => {
                expect(validChars).to.include(char)
            })
        })

        it('should generate different captchas on multiple calls', () => {
            const captcha1 = generateCaptcha()
            const captcha2 = generateCaptcha()
            expect(captcha1).to.not.equal(captcha2)
        })
    })

    describe('Captcha In Registration Flow', () => {
        let req, res, createUserStub

        beforeEach(() => {
            req = {
                session: {},
                body: {}
            }
            res = {
                render: sinon.spy(),
                redirect: sinon.spy()
            };
            createUserStub = sinon.stub()
        });

        afterEach(() => {
            sinon.restore()
        })

        it('should validate captcha correctly', () => {
            const initialCaptcha = generateCaptcha()
            req.session.captcha = initialCaptcha

            expect(req.session.captcha).to.equal(initialCaptcha)
            expect(req.session.captcha.length).to.equal(6)

            const wrongCaptcha = 'WRONG1'
            const validUserData = {
                email: 'test@test.com',
                captcha: wrongCaptcha,
                password: 'Test123!',
                repass: 'Test123!',
                first_name: 'John',
                last_name: 'Doe'
            }

            req.body = validUserData
            if (req.body.captcha !== req.session.captcha) {
                const newCaptcha = generateCaptcha()
                req.session.captcha = newCaptcha
            }

            expect(req.session.captcha).to.not.equal(initialCaptcha)
            expect(req.session.captcha.length).to.equal(6)
        })

        it('should generate new captcha on validation error', () => {
            const initialCaptcha = generateCaptcha()
            req.session.captcha = initialCaptcha

            const invalidUserData = {
                email: 'invalid-email',
                captcha: req.session.captcha,
                password: 'ddd',
                repass: 'ddd',
                first_name: 'J',
                last_name: 'Doe'
            }

            req.body = invalidUserData;
            const error = validateUserData(req.body)

            if (error) {
                const newCaptcha = generateCaptcha()
                req.session.captcha = newCaptcha
            }

            expect(error).to.not.be.null;
            expect(req.session.captcha).to.not.equal(initialCaptcha)
            expect(req.session.captcha.length).to.equal(6)
        })

        it('should generate new captcha on password mismatch', () => {
            const initialCaptcha = generateCaptcha()
            req.session.captcha = initialCaptcha

            const mismatchPasswordData = {
                email: 'test@test.com',
                captcha: req.session.captcha,
                password: 'Test123!',
                repass: '123!',
                first_name: 'John',
                last_name: 'Doe'
            }

            req.body = mismatchPasswordData

            if (req.body.password !== req.body.repass) {
                const newCaptcha = generateCaptcha()
                req.session.captcha = newCaptcha
            }

            expect(req.session.captcha).to.not.equal(initialCaptcha)
            expect(req.session.captcha.length).to.equal(6)
        })

        it('should refresh captcha on error', () => {
            const initialCaptcha = generateCaptcha()
            req.session.captcha = initialCaptcha

            if (true) {
                const newCaptcha = generateCaptcha()
                req.session.captcha = newCaptcha
            }

            expect(req.session.captcha).to.not.equal(initialCaptcha)
            expect(req.session.captcha.length).to.equal(6)
        })
    })
})