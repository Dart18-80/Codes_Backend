const jwt = require('../services/jwt');
const User = require('../database/models/User');
const authToken = require('../services/auth')
const EmailServices = require('../services/email');

let register = async(req, res) => {
    const Data = req.body;
    let usuario = false;
    await User.findAll({
            where: {
                Email: Data.email,
            }
        })
        .then((user) => {
            if (user.length != 0) {
                res.status(400).json({ errors: [{ message: "Email already exists." }] });
                usuario = true;
                return;
            }
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });

    if (usuario) {
        return;
    }

    await User.create({
            Name: Data.name,
            Lastname: Data.lastname,
            Phone: Data.phone,
            Email: Data.email,
        })
        .then((newUser) => {
            const emailResponse = EmailServices.sendRegister(Data);
            if (emailResponse === 500) {
                res.status(200).json({
                    message: "Succesfully registered without sending email",
                    userId: newUser
                });
            } else {
                res.status(200).json({
                    message: "Succesfully registered",
                    userId: newUser
                });
            }
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
}

let login = async(req, res) => {
    const Data = req.body;
    await User.findAll({
            where: {
                Email: Data.email,
            }
        })
        .then((user) => {
            if (user.length == 1) {
                if (user[0].dataValues.Deleted == true) {
                    res.status(401).json({ errors: [{ message: "User banned." }] });
                    return;
                } else {
                    res.status(200).json({
                        token_type: "Bearer",
                        expires_in: 31536000,
                        access_token: jwt.createAccessToken(user[0]),
                        refresh_token: jwt.createRefreshToken(user[0]),
                    });
                    return;
                }
            } else if (user.length == 0) {
                res.status(404).json({ errors: [{ message: "Unregistered user." }] });
                return;
            } else {
                res.status(400).json({ errors: [{ message: "There is more than one user with the same email." }] });
                return;
            }
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
}

let UserProfile = async(req, res) => {
    if (!req.headers.auth) {
        res.status(401).json({ errors: [{ message: "Unauthorized." }] });
        return;
    }

    const userData = authToken(req.headers.auth);

    if (userData.message == 'Invalid token.') {
        res.status(401).json({ errors: [{ message: "Unauthorized." }] });
        return;
    }

    await User.findAll({
            where: {
                Id_User: userData.id,
                Deleted: false,
            },
            attributes: {
                exclude: ['Deleted', 'Winner', 'createdAt', 'updatedAt']
            }
        })
        .then((user) => {
            if (user.length == 1) {
                res.status(200).json(user[0]);
                return;
            } else if (user.length == 0) {
                res.status(404).json({ errors: [{ message: "Unregistered user or your user is deleted." }] });
                return;
            } else {
                res.status(400).json({ errors: [{ message: "There is more than one user with the same email." }] });
                return;
            }
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });
}

let EditProfile = async(req, res) => {
    if (!req.headers.auth) {
        res.status(401).json({ errors: [{ message: "Unauthorized." }] });
        return;
    }
    const userData = authToken(req.headers.auth);

    if (userData.message == 'Invalid token.') {
        res.status(401).json({ errors: [{ message: "Unauthorized." }] });
        return;
    }

    const id = userData.id;
    const name = req.body.Name;
    const lastname = req.body.Lastname;
    const email = req.body.Email;
    const phone = req.body.Phone;

    await User.update({
            Name: name,
            Lastname: lastname,
            Email: email,
            Phone: phone
        }, {
            where: {
                Id_User: id,
            }
        })
        .then((user) => {
            res.status(200).json({ success: true });
            return;
        })
        .catch(err => {
            res.status(400).json(err);
            return;
        });

}

module.exports = {
    register,
    login,
    UserProfile,
    EditProfile
}