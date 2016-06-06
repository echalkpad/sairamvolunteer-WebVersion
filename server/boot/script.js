module.exports = function (app) {
  var cloudantDB = app.dataSources.cloudant;
  
    console.log("Entered the scripts js file ------");
  cloudantDB.automigrate('Customer', function (err) {
    if (err) throw (err);
    var Customer = app.models.Customer;
    Customer.find({ where: { username: 'Admin2' }, limit: 1 }, function (err, users) {

      if (users) {

		console.log("users Admin2 is not found. Hence creating Admin2 user");
        Customer.create([
          { username: 'Admin2', email: 'admin2@admin2.com', password: 'abcdef' }
        ], function (err, users) {
          if (err) return debug(err);

          var Role = app.models.Role;
          var RoleMapping = app.models.RoleMapping;

          Role.destroyAll();
          RoleMapping.destroyAll();
          console.log("about to create role - admin");

          //create the admin role
          Role.create({
            name: 'admin'
          }, function (err, role) {
            if (err) return debug(err);

            //make admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id
            }, function (err, principal) {
              if (err) throw (err);
            });
          });
        })
      }
      else {
			console.log("admin2 user found and not creating a new one");
      }

    });
  });
};