const validateRegisterInputs = (username, email, password) => {
    const errors = {};
    if (username.trim() === "") {
        errors.username = "Kullanıcı adı boş olamaz";
    }
    if (password.trim() === "") {
        errors.password = "Şifre boş olamaz";
    }
    if (email.trim() === "") {
        errors.email = "E-mail boş olamaz";
    } else {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            errors.email = "E-mail adresi geçerli bir e-mail adresi olmalıdır";
        }
    }
    // * returns errors
    return {
        errors,
        isValid: Object.keys(errors).length < 1,
    };
};

const validateLoginInputs = (email, password) => {
    const errors = {};
    if (password.trim() === "") {
        errors.password = "Şifre boş olamaz";
    }
    if (email.trim() === "") {
        errors.email = "E-mail boş olamaz";
    } else {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            errors.email = "E-mail adresi geçerli bir e-mail adresi olmalıdır";
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length < 1,
    };
};
module.exports = {
    validateRegisterInputs,
    validateLoginInputs,
};
