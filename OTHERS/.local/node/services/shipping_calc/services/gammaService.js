var axios = require('axios');

var gammaService = {
    gammaData : function(input){
      console.log('Input JSON',input);
      //Call the Get Order from OCC
      var payload = input.inputData;
      axios.post('https://ebsasprd01.doskocilmfg.com:4443/webservices/rest/PETMATE/insert_gamma_json_data/',payload, {
          auth: {
            username: "sysadmin",
            password: "erpprodapps08"
          }
        })
      .then((response) => {
          return input.cb(null,response.data);
      })
      .catch(error => {
        return input.cb(null,error.message);
        })
    }

    
}

module.exports = gammaService;