const fs = require('fs');

const htmlTemplate = (logo, token, delay = 20) => {
  let res = fs.readFileSync(template_path);
  res = res.replace('@logo@', logo);
  res = res.replace('@token@', token);
  res = res.replace('@delay@', delay);
  return res;
};

module.exports = {
  name: "confirmation_mail_plugin",
  template: htmlTemplate
};