export const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let captcha = ''
    for(let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return captcha
}