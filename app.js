//Budget
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

       totals: {
           exp: 0,
           inc: 0
       }  
    }

    return{
        addItems: function(type, des, val){
            var newItem, ID, lastItem

            lastItem = data.allItems[type];

            //Create new Id
            if (lastItem.length == 0){
                ID = 0;
            }else{
                ID = lastItem[lastItem.length-1].id + 1;
            }

            //Create new Item
            if(type == "exp"){
                newItem = new Expense(ID, des, val); 
            }else{
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    }

})()


//UI
var UICntroller = (function(){

    //All the string name for class/id for DOM
    var DOMstr = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstr.inputType).value,
                description: document.querySelector(DOMstr.inputDescription).value,
                value: document.querySelector(DOMstr.inputValue).value
            }
        },

        addListItem: function(item, type){
            var html, newHtml, element;

            if (type == "inc"){
                element = DOMstr.incomeContainer; 
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else{
                element = DOMstr.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%',  item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', item.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 

        },

        clearFields: function(){
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstr.inputDescription + ", " + DOMstr.inputValue); 

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(cur){
                cur.value = "";
            })

            fieldsArray[0].focus();
        
        },

        getDOMstr: function(){
            return DOMstr;
        }

    }

})()


//Global control
var controller = (function(budget, ui){

    function setUpEventListeners(){
         
        var DOM = ui.getDOMstr();

        //Event listener
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem) ;
        document.addEventListener("keypress", function(event){
            if(event.keyCode == 13 && event.which == 13){
                ctrlAddItem();
            }
        });
    }

    function ctrlAddItem(){
        var input, newItem
        
        input = ui.getInput();

        newItem = budget.addItems(input.type, input.description, input.value);

        ui.addListItem(newItem, input.type);

        ui.clearFields();
    }

    return{
        init: function(){
             setUpEventListeners();
        }
    }

})(budgetController, UICntroller)

//Onle line of code outside of the controllers
controller.init();