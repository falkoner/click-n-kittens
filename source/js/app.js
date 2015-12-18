var initialCats = [
        {"name": "Cratty", "image": "img/cat1.jpg", "counter": 0},
        {"name": "Pitty", "image": "img/cat2.jpg", "counter": 0},
        {"name": "Gritty", "image": "img/cat3.jpg", "counter": 0},
        {"name": "Shmitty", "image": "img/cat4.jpg", "counter": 0},
        {"name": "Brunty", "image": "img/cat5.jpg", "counter": 0},
        {"name": "Tritty", "image": "img/cat6.jpg", "counter": 0}
]

var Cat = function(data) {
  this.name = ko.observable(data.name);
  this.counter = ko.observable(data.counter);
  this.image = ko.observable(data.image);
}


var ViewModel = function() {
  var self = this;

  self.catList = ko.observableArray([]);

  initialCats.forEach( function(catItem){
    self.catList.push(new Cat(catItem));
  });

  self.currentCat = ko.observable(self.catList()[0]);

  self.incrementCount = function() {
      self.currentCat().counter(self.currentCat().counter() + 1);
  };

  self.changeCat = function (newCat) {
    self.currentCat(newCat);
    self.cancelAdminMode();
  };

  self.isAdminMode = ko.observable(false);

  self.editedCatName = ko.observable();
  self.editedCatImage = ko.observable();
  self.editedCatCounter = ko.observable();

  self.toggleAdminMode = function() {
    if (self.isAdminMode()) {
      self.cancelAdminMode();
    } else {
      self.editedCatName(self.currentCat().name());
      self.editedCatImage(self.currentCat().image());
      self.editedCatCounter(self.currentCat().counter());

      self.isAdminMode(true);
    }
  }

  self.cancelAdminMode = function () {
    self.isAdminMode(false);

    self.editedCatName("");
    self.editedCatImage("");
    self.editedCatCounter("");
  }

  self.saveAdminMode = function () {
    self.currentCat().name(self.editedCatName());
    self.currentCat().image(self.editedCatImage());
    self.currentCat().counter(self.editedCatCounter());

    self.cancelAdminMode();
  }

};

ko.applyBindings(new ViewModel());
