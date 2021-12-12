const fs = require('fs');

const htmlTemplate = (logo, token, delay = 20) => {
  let res = fs.readFileSync(__dirname + '/confirmation_mail_template_fr.html', 'utf8');
  res = res.replace('@logo@', 'data:image/png;base64,', logo);
  res = res.replace('@token@', token);
  res = res.replace('@delay@', delay);
  return res;
};

module.exports = {
  name: "confirmation_mail_plugin",
  template: htmlTemplate
};