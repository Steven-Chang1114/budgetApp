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
       },
       budget: 0,
       percentage: -1   
    }

    function calculateTotal(type){
        var sum = 0; 
        data.allItems[type].forEach(function(cur){
            sum += cur.value; 
        });

        data.totals[type] = sum;
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

        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0){
                data.percentage =  Math.round(data.totals.exp / data.totals.inc * 100); 
            }else{
                data.percentage = -1;
            }
         
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expenseContainer: ".expenses__list",
        totalValue: ".budget__value",
        incomeValue: ".budget__income--value",
        expenseValue: ".budget__expenses--value",
        expensePercentage: ".budget__expenses--percentage"
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstr.inputType).value,
                description: document.querySelector(DOMstr.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstr.inputValue).value)
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

        displayBudget: function(obj){

            document.querySelector(DOMstr.totalValue).textContent = obj.budget;
            document.querySelector(DOMstr.incomeValue).textContent = obj.totalInc;
            document.querySelector(DOMstr.expenseValue).textContent = obj.totalExp;

            if (obj.percentage > 0){
                document.querySelector(DOMstr.expensePercentage).textContent = obj.percentage + "%";
            }else{
                document.querySelector(DOMstr.expensePercentage).textContent = "---";
            }

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

    var updateBudget = function(){
        var allBudget

        budget.calculateBudget();
 
        allBudget = budget.getBudget();

        ui.displayBudget(allBudget);

    }

    function ctrlAddItem(){
        var input, newItem
        
        input = ui.getInput();

        if (input.description != "" && !isNaN(input.value) && input.value > 0){

            newItem = budget.addItems(input.type, input.description, input.value);

            ui.addListItem(newItem, input.type);

            ui.clearFields();
            
            updateBudget();

        }
    }

    return{
        init: function(){
            ui.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: "---"
            });
             setUpEventListeners();
        }
    }

})(budgetController, UICntroller)

//Onle line of code outside of the controllers
controller.init();