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

  this.getCopy = function() {
    return new Cat({"name": this.name(), "image": this.image(), "counter": this.counter()});
  }
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

  self.editedCat = ko.observable();

  self.toggleAdminMode = function() {
    if (self.isAdminMode()) {
      self.cancelAdminMode();
    } else {
      self.editedCat(self.currentCat().getCopy());

      self.isAdminMode(true);
    }
  }

  self.cancelAdminMode = function () {
    self.isAdminMode(false);

    self.editedCat("");
  }

  self.saveAdminMode = function () {

    self.currentCat(self.editedCat());

    self.cancelAdminMode();
  }

};

ko.applyBindings(new ViewModel());
