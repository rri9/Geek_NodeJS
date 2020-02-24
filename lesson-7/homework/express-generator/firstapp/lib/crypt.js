const bcrypt = require('bcryptjs');
const saltRounds = 12;

const crypt = {
  isPwdGood: (candidate, pwd) => bcrypt.compareSync(candidate, pwd),
  makePwdCrypted: (pwd) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(pwd, salt);
  },
};

module.exports = crypt;
