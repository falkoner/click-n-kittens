var initialCats=[{name:"Cratty",image:"img/cat1.jpg",counter:0},{name:"Pitty",image:"img/cat2.jpg",counter:0},{name:"Gritty",image:"img/cat3.jpg",counter:0},{name:"Shmitty",image:"img/cat4.jpg",counter:0},{name:"Brunty",image:"img/cat5.jpg",counter:0},{name:"Tritty",image:"img/cat6.jpg",counter:0}],Cat=function(e){this.name=ko.observable(e.name),this.counter=ko.observable(e.counter),this.image=ko.observable(e.image),this.getCopy=function(){return new Cat({name:this.name(),image:this.image(),counter:this.counter()})}},ViewModel=function(){var e=this;e.catList=ko.observableArray([]),initialCats.forEach(function(t){e.catList.push(new Cat(t))}),e.currentCat=ko.observable(e.catList()[0]),e.incrementCount=function(){e.currentCat().counter(e.currentCat().counter()+1)},e.changeCat=function(t){e.currentCat(t),e.cancelAdminMode()},e.isAdminMode=ko.observable(!1),e.editedCat=ko.observable(),e.toggleAdminMode=function(){e.isAdminMode()?e.cancelAdminMode():(e.editedCat(e.currentCat().getCopy()),e.isAdminMode(!0))},e.cancelAdminMode=function(){e.isAdminMode(!1),e.editedCat("")},e.saveAdminMode=function(){e.currentCat(e.editedCat()),e.cancelAdminMode()}};ko.applyBindings(new ViewModel);