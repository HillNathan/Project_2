const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");

module.exports = app => {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // Load example page and pass in an example by id
  app.get("/user", isAuthenticated, (req, res) => {
    let data = {};
    data.user = {};
    data.user.firstName = req.user.firstName;
    data.user.lastName = req.user.lastName;
    data.user.username = req.user.username;

    db.list
      .findAll({
        where: {
          userId: req.user.id
        },
        include: [db.item]
      })
      .then(userList => {
        data.userList = userList;
        db.item.findAll({}).then(items => {
          data.items = items;
          // just rendering the page at the moment, will udate to include data once the pug file is complete.
          res.render("user");
          // res.render("user", data);
          // res.json(data);
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect("/");
      });
  });

  app.get("/usertest", (req, res) => {
    res.render("user");
  });

  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  // Load example page and pass in an example by id
  app.get("/list", isAuthenticated, (req, res) => {
    res.send("list");
  });

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => {
    res.send("404");
  });
};
