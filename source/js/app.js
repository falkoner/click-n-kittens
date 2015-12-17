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
  }
};

ko.applyBindings(new ViewModel());




  // window.onload = function() {

    // cats data structure
    var model = {
      current: 0,
      data: [
        {"name": "Cratty", "image": "img/cat1.jpg", "counter": 0},
        {"name": "Pitty", "image": "img/cat2.jpg", "counter": 0},
        {"name": "Gritty", "image": "img/cat3.jpg", "counter": 0},
        {"name": "Shmitty", "image": "img/cat4.jpg", "counter": 0},
        {"name": "Brunty", "image": "img/cat5.jpg", "counter": 0},
        {"name": "Tritty", "image": "img/cat6.jpg", "counter": 0}
      ]
    };

    var view = {
      init: function() {

        this.catListPointer = document.getElementById('catlist');
        this.adminAreaPointer = document.getElementById('cat-edit');

        this.renderCatList();
        this.initializeAdminMode();

      },

      renderCatList: function() {
        var cats = octopus.getAllCats();

        for (var i = cats.length - 1; i >= 0; i--) {
          var catListElement = document.createElement('li');

          catListElement.innerHTML = '<h3>' + cats[i].name + '</h3>';
          catListElement.addEventListener('click', view.renderCat(i));

          this.catListPointer.appendChild(catListElement);
        }
      },

      renderCat: function(cat_id) {
          return function() {
            octopus.setCurrentCat(cat_id);
            var cat = octopus.getCurrentCat();

            var nameHtml = '<h2>' + cat.name +'</h2>';
            var clicksHtml = '<h3> Times clicked: <span id="counter">' + cat.counter + '</span></h3>';
            var imageHtml = '<img id="image" src="' + cat.image + '" alt="Cat picture">';

            document.getElementById('cat').innerHTML = nameHtml + clicksHtml + imageHtml;

            var imageLocator = document.getElementById('image');
            var clicksValue = document.getElementById('counter');
            var handler = function() {
              octopus.incrementCount(cat);
              clicksValue.innerHTML = cat.counter;
            };

            imageLocator.addEventListener('click', handler, false);
          };
      },

      renderAdminView: function() {
        var cat = octopus.getCurrentCat();

        var nameInput =   '<span>Cat Name: </span><input id="nameInput" type="text" value="'+ cat.name +'"><br/>';
        var clicksInput = '<span>Clicks Counter: </span><input id="clicksInput" type="text" value="'+ cat.counter +'"><br/>';
        var imageInput =  '<span>Image URL: </span><input id="imageInput" type="text" value="'+ cat.image +'"><br/>';
        var cancelButton = '<button id="cancelButton">Cancel</button>';
        var saveButton = '<button id="saveButton">Save</button>';

        view.adminAreaPointer.innerHTML = nameInput + clicksInput + imageInput + cancelButton +  saveButton;

        var cancelPointer = document.getElementById('cancelButton');
        var savePointer = document.getElementById('saveButton');

        cancelPointer.addEventListener('click', function() {
          view.hideAdminView();
        });

        savePointer.addEventListener('click', function() {
          octopus.updateCatData(document.getElementById('nameInput').value,
            document.getElementById('clicksInput').value,
            document.getElementById('imageInput').value
          )
          octopus.refreshCurrentCat();
          view.hideAdminView();
        });

      },

      hideAdminView: function() {
        view.adminAreaPointer.innerHTML = '';
      },

      initializeAdminMode: function() {
        var adminButton = document.getElementById('admin');

        adminButton.addEventListener('click', this.renderAdminView);
      }


    };

    var octopus = {
      init: function() {
        view.init();
      },

      getAllCats: function() {
        return model.data;
      },

      getCurrentCat: function(){
        return model.data[model.current];
      },

      refreshCurrentCat: function () {
        view.renderCat(model.current)();
      },

      setCurrentCat: function(cat_id){
        model.current = cat_id;
      },

      incrementCount: function(cat) {
        cat.counter++;
      },

      updateCatData: function(name, clicks, image) {
        var cat = octopus.getCurrentCat();

        cat.name = name;
        cat.counter = clicks;
        cat.image = image;
      }
    };

    // octopus.init();

  // };
