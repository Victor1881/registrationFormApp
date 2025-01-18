export const validateUserData = (data) => {
    let error = null

    if ('email' in data) {

        if (data.email == null) {
            error = 'Email is required'
        } else {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            const normalizedEmail = data.email.toLowerCase().trim()

            if (normalizedEmail === '') {
                error = 'Email is required'
            }
            else if (!emailPattern.test(normalizedEmail)) {
                error = 'Please enter a valid email address'
            }
            else if (normalizedEmail.length > 255) {
                error = 'Email address is too long (maximum 255 characters)'
            }

            if (!error) {
                data.email = normalizedEmail
            }
        }
    }

    if (!error){
        if (data.first_name.length < 3) {
            error = 'First name must be at least 3 characters long'
        } else if (data.first_name.length > 50) {
            error = 'First name must be less than 50 characters'
        }
    }

    if (!error) {
        if (data.last_name.length < 3) {
            error = 'Last name must be at least 3 characters long'
        } else if (data.last_name.length > 50) {
            error = 'Last name must be less than 50 characters'
        }
    }

    if (data.password && !error) {
        if (data.password.length < 5) {
            error = 'Password must be at least 5 characters long'
        }
        else if (!/[A-Z]/.test(data.password)) {
            error = 'Password must contain at least one uppercase letter'
        }
        else if (data.password.length > 30) {
            error = 'Password is too long (maximum 30 characters)'
        }
        else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password)) {
            error = 'Password must contain at least one special character'
        }
    }

    return error
}
